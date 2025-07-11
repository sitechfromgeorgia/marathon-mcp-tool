/**
 * 🗄️ SQLite Adapter v1.0.0
 * SQLite მონაცემთა ბაზის ადაპტერი
 * 
 * Features / ფუნქციები:
 * - Persistent memory storage / მუდმივი მეხსიერების შენახვა
 * - Session management / სესიების მართვა
 * - Symbol command history / სიმბოლური ბრძანებების ისტორია
 * - Marathon mode tracking / მარათონ რეჟიმის ტრექინგი
 * - Knowledge graph storage / ცოდნის გრაფის შენახვა
 */

import sqlite3 from 'sqlite3';
import { join } from 'path';
import { homedir } from 'os';
import { promises as fs } from 'fs';

export class SQLiteAdapter {
  private dbPath: string;
  private db: sqlite3.Database | null = null;
  private initialized: boolean = false;

  constructor() {
    this.dbPath = join(homedir(), '.marathon-mcp', 'marathon.db');
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Ensure directory exists
      const dbDir = join(homedir(), '.marathon-mcp');
      await fs.mkdir(dbDir, { recursive: true });
      
      // Open database connection
      this.db = new sqlite3.Database(this.dbPath);
      
      // Create tables
      await this.createTables();
      
      this.initialized = true;
      console.log('✅ SQLite database initialized / SQLite ბაზა ინიციალიზებულია');
    } catch (error) {
      console.error('❌ SQLite initialization error:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const tables = `
      -- Memory table for persistent storage
      CREATE TABLE IF NOT EXISTS memory (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Sessions table for tracking user sessions
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        mode TEXT DEFAULT 'normal',
        context TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        end_reason TEXT
      );

      -- Symbol commands history
      CREATE TABLE IF NOT EXISTS symbol_commands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        symbol TEXT NOT NULL,
        context TEXT,
        result TEXT,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );

      -- Marathon mode sessions
      CREATE TABLE IF NOT EXISTS marathon_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        project_name TEXT,
        auto_save_interval INTEGER DEFAULT 120,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        status TEXT DEFAULT 'active',
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );

      -- Checkpoints for emergency saves
      CREATE TABLE IF NOT EXISTS checkpoints (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        context TEXT,
        type TEXT DEFAULT 'manual',
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );

      -- Knowledge graph entities
      CREATE TABLE IF NOT EXISTS knowledge_entities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        properties TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Knowledge graph relations
      CREATE TABLE IF NOT EXISTS knowledge_relations (
        id TEXT PRIMARY KEY,
        from_entity TEXT NOT NULL,
        to_entity TEXT NOT NULL,
        relation_type TEXT NOT NULL,
        properties TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_entity) REFERENCES knowledge_entities(id),
        FOREIGN KEY (to_entity) REFERENCES knowledge_entities(id)
      );

      -- Analytics events
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_name TEXT NOT NULL,
        session_id TEXT,
        properties TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_memory_key ON memory(key);
      CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(created_at);
      CREATE INDEX IF NOT EXISTS idx_symbol_commands_session ON symbol_commands(session_id);
      CREATE INDEX IF NOT EXISTS idx_marathon_sessions_status ON marathon_sessions(status);
      CREATE INDEX IF NOT EXISTS idx_checkpoints_session ON checkpoints(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
    `;

    return new Promise((resolve, reject) => {
      this.db!.exec(tables, (err) => {
        if (err) {
          console.error('❌ Table creation error:', err);
          reject(err);
        } else {
          console.log('✅ Database tables created / ბაზის ცხრილები შექმნილია');
          resolve();
        }
      });
    });
  }

  // Memory operations
  public async saveMemory(key: string, value: any, tags: string[] = []): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const stmt = this.db!.prepare(`
        INSERT OR REPLACE INTO memory (id, key, value, tags, updated_at) 
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      
      stmt.run([
        `memory_${Date.now()}`,
        key,
        JSON.stringify(value),
        JSON.stringify(tags)
      ], (err) => {
        if (err) reject(err);
        else resolve();
        stmt.finalize();
      });
    });
  }

  public async loadMemory(key: string): Promise<any> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      this.db!.get(
        'SELECT value FROM memory WHERE key = ?',
        [key],
        (err, row: any) => {
          if (err) reject(err);
          else resolve(row ? JSON.parse(row.value) : null);
        }
      );
    });
  }

  public async listMemories(tags: string[] = [], limit: number = 20): Promise<any[]> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      let query = 'SELECT key, tags, created_at FROM memory';
      let params: any[] = [];
      
      if (tags.length > 0) {
        const tagConditions = tags.map(() => 'tags LIKE ?').join(' OR ');
        query += ` WHERE (${tagConditions})`;
        params = tags.map(tag => `%"${tag}"%`);
      }
      
      query += ' ORDER BY updated_at DESC LIMIT ?';
      params.push(limit);
      
      this.db!.all(query, params, (err, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  // Session operations
  public async createSession(sessionId: string, mode: string = 'normal'): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const stmt = this.db!.prepare(`
        INSERT OR REPLACE INTO sessions (id, mode) VALUES (?, ?)
      `);
      
      stmt.run([sessionId, mode], (err) => {
        if (err) reject(err);
        else resolve();
        stmt.finalize();
      });
    });
  }

  public async endSession(sessionId: string, reason: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const stmt = this.db!.prepare(`
        UPDATE sessions SET ended_at = CURRENT_TIMESTAMP, end_reason = ? WHERE id = ?
      `);
      
      stmt.run([reason, sessionId], (err) => {
        if (err) reject(err);
        else resolve();
        stmt.finalize();
      });
    });
  }

  public async setSessionMode(sessionId: string, mode: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const stmt = this.db!.prepare(`
        UPDATE sessions SET mode = ? WHERE id = ?
      `);
      
      stmt.run([mode, sessionId], (err) => {
        if (err) reject(err);
        else resolve();
        stmt.finalize();
      });
    });
  }

  // Symbol command operations
  public async saveSymbolCommand(symbol: string, context: string | undefined, result: any, timestamp: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const stmt = this.db!.prepare(`
        INSERT INTO symbol_commands (session_id, symbol, context, result, executed_at) 
        VALUES ('current', ?, ?, ?, ?)
      `);
      
      stmt.run([
        symbol,
        context || null,
        JSON.stringify(result),
        timestamp
      ], (err) => {
        if (err) reject(err);
        else resolve();
        stmt.finalize();
      });
    });
  }

  public async getSymbolHistory(limit: number = 10): Promise<any[]> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      this.db!.all(
        'SELECT * FROM symbol_commands ORDER BY executed_at DESC LIMIT ?',
        [limit],
        (err, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  // Marathon mode operations
  public async saveMarathonSession(sessionId: string, context?: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const stmt = this.db!.prepare(`
        INSERT INTO marathon_sessions (session_id, project_name, status) 
        VALUES (?, ?, 'active')
      `);
      
      stmt.run([sessionId, context || 'Marathon Project'], (err) => {
        if (err) reject(err);
        else resolve();
        stmt.finalize();
      });
    });
  }

  public async endMarathonSession(sessionId: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const stmt = this.db!.prepare(`
        UPDATE marathon_sessions 
        SET ended_at = CURRENT_TIMESTAMP, status = 'completed' 
        WHERE session_id = ? AND status = 'active'
      `);
      
      stmt.run([sessionId], (err) => {
        if (err) reject(err);
        else resolve();
        stmt.finalize();
      });
    });
  }

  // Checkpoint operations
  public async saveCheckpoint(checkpoint: any): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const stmt = this.db!.prepare(`
        INSERT INTO checkpoints (id, session_id, context, type, data) 
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        `checkpoint_${Date.now()}`,
        checkpoint.session_id,
        checkpoint.context,
        checkpoint.type || 'manual',
        JSON.stringify(checkpoint)
      ], (err) => {
        if (err) reject(err);
        else resolve();
        stmt.finalize();
      });
    });
  }

  public async getLastContext(sessionId: string): Promise<any> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      this.db!.get(
        'SELECT * FROM checkpoints WHERE session_id = ? ORDER BY created_at DESC LIMIT 1',
        [sessionId],
        (err, row: any) => {
          if (err) reject(err);
          else resolve(row ? JSON.parse(row.data) : null);
        }
      );
    });
  }

  // Analytics operations
  public async trackEvent(eventName: string, sessionId: string, properties: any = {}): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const stmt = this.db!.prepare(`
        INSERT INTO analytics_events (event_name, session_id, properties) 
        VALUES (?, ?, ?)
      `);
      
      stmt.run([
        eventName,
        sessionId,
        JSON.stringify(properties)
      ], (err) => {
        if (err) reject(err);
        else resolve();
        stmt.finalize();
      });
    });
  }

  public async getEventStats(): Promise<any> {
    if (!this.initialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      this.db!.all(
        'SELECT event_name, COUNT(*) as count FROM analytics_events GROUP BY event_name ORDER BY count DESC',
        [],
        (err, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  // Status and health checks
  public async getStatus(detailed: boolean = false): Promise<any> {
    if (!this.initialized) await this.initialize();
    
    const status = {
      status: 'active',
      database_path: this.dbPath,
      initialized: this.initialized,
      georgian_message: '✅ SQLite ბაზა აქტიურია და მუშაობს',
      english_message: '✅ SQLite database is active and working'
    };

    if (detailed) {
      // Get detailed statistics
      const stats = await this.getDetailedStats();
      return { ...status, ...stats };
    }

    return status;
  }

  private async getDetailedStats(): Promise<any> {
    return new Promise((resolve, reject) => {
      const queries = [
        'SELECT COUNT(*) as memory_count FROM memory',
        'SELECT COUNT(*) as sessions_count FROM sessions',
        'SELECT COUNT(*) as commands_count FROM symbol_commands',
        'SELECT COUNT(*) as marathon_count FROM marathon_sessions',
        'SELECT COUNT(*) as checkpoints_count FROM checkpoints'
      ];

      Promise.all(
        queries.map(query => 
          new Promise((res, rej) => {
            this.db!.get(query, [], (err, row: any) => {
              if (err) rej(err);
              else res(row);
            });
          })
        )
      ).then((results: any[]) => {
        resolve({
          detailed_stats: {
            memory_entries: results[0]?.memory_count || 0,
            total_sessions: results[1]?.sessions_count || 0,
            symbol_commands_executed: results[2]?.commands_count || 0,
            marathon_sessions: results[3]?.marathon_count || 0,
            checkpoints_saved: results[4]?.checkpoints_count || 0
          }
        });
      }).catch(reject);
    });
  }

  public async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
      console.log('🔒 SQLite connection closed / SQLite კავშირი დაიხურა');
    }
  }
}