/**
 * 🏃‍♂️ Marathon MCP Tool - Database Manager
 * 🇬🇪 მონაცემთა ბაზის მენეჯერი
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { MarathonLogger } from '../../../utils/logger.js';

export interface DatabaseConfig {
  dbPath: string;
  enableWAL?: boolean;
  enableForeignKeys?: boolean;
  busyTimeout?: number;
}

export class DatabaseManager {
  private db: sqlite3.Database | null = null;
  private logger: MarathonLogger;
  private dbPath: string;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig, logger: MarathonLogger) {
    this.config = {
      enableWAL: true,
      enableForeignKeys: true,
      busyTimeout: 30000,
      ...config
    };
    this.dbPath = config.dbPath;
    this.logger = logger;
  }

  async initialize(): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Create database connection
      this.db = new sqlite3.Database(this.dbPath);

      // Configure database
      await this.runAsync('PRAGMA journal_mode = WAL');
      await this.runAsync('PRAGMA foreign_keys = ON');
      await this.runAsync(`PRAGMA busy_timeout = ${this.config.busyTimeout}`);

      // Initialize schema
      await this.initializeSchema();
      
      this.logger.info('Database initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async initializeSchema(): Promise<void> {
    const schemaPath = path.join(path.dirname(this.dbPath), 'schema.sql');
    
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      const statements = schema.split(';').filter(s => s.trim());
      
      for (const statement of statements) {
        await this.runAsync(statement);
      }
    } else {
      // Default schema if file not found
      await this.createDefaultSchema();
    }
  }

  private async createDefaultSchema(): Promise<void> {
    // Memory entries table
    await this.runAsync(`
      CREATE TABLE IF NOT EXISTS memory_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        tags TEXT,
        category TEXT,
        encrypted INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        access_count INTEGER DEFAULT 0,
        ttl_expires_at TIMESTAMP
      )
    `);

    // Entities table
    await this.runAsync(`
      CREATE TABLE IF NOT EXISTS entities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        entity_type TEXT NOT NULL,
        properties TEXT,
        description TEXT,
        confidence REAL DEFAULT 1.0,
        source TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Relations table
    await this.runAsync(`
      CREATE TABLE IF NOT EXISTS relations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_entity_id INTEGER NOT NULL,
        to_entity_id INTEGER NOT NULL,
        relation_type TEXT NOT NULL,
        properties TEXT,
        confidence REAL DEFAULT 1.0,
        bidirectional INTEGER DEFAULT 0,
        weight REAL DEFAULT 1.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_entity_id) REFERENCES entities(id) ON DELETE CASCADE,
        FOREIGN KEY (to_entity_id) REFERENCES entities(id) ON DELETE CASCADE
      )
    `);

    // Observations table
    await this.runAsync(`
      CREATE TABLE IF NOT EXISTS observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_id INTEGER NOT NULL,
        observation TEXT NOT NULL,
        observation_type TEXT DEFAULT 'general',
        confidence REAL DEFAULT 1.0,
        source TEXT,
        context TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
      )
    `);

    // Create indices
    await this.createIndices();
  }

  private async createIndices(): Promise<void> {
    // Memory indices
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_memory_key ON memory_entries(key)');
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_memory_category ON memory_entries(category)');
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_memory_tags ON memory_entries(tags)');
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_memory_ttl ON memory_entries(ttl_expires_at)');

    // Entity indices
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_entity_name ON entities(name)');
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_entity_type ON entities(entity_type)');

    // Relation indices
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_relation_from ON relations(from_entity_id)');
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_relation_to ON relations(to_entity_id)');
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_relation_type ON relations(relation_type)');

    // Observation indices
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_observation_entity ON observations(entity_id)');
    await this.runAsync('CREATE INDEX IF NOT EXISTS idx_observation_type ON observations(observation_type)');
  }

  // Promisified database methods
  async runAsync(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  async getAsync(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async allAsync(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      this.db.close((err) => {
        if (err) reject(err);
        else {
          this.db = null;
          resolve();
        }
      });
    });
  }
}