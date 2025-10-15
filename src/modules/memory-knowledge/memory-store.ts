/**
 * 🏃‍♂️ Marathon MCP Tool - Memory Store
 * 🇬🇪 მეხსიერების საცავი
 */

import { DatabaseManager } from './database/database-manager.js';
import { MarathonLogger } from '../../utils/logger.js';

export interface MemoryEntry {
  id?: number;
  key: string;
  value: string;
  tags?: string;
  category?: string;
  encrypted?: boolean;
  created_at?: string;
  updated_at?: string;
  accessed_at?: string;
  access_count?: number;
  ttl_expires_at?: string;
}

export interface MemorySearchOptions {
  category?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'updated_at' | 'accessed_at' | 'access_count';
  sortOrder?: 'ASC' | 'DESC';
}

export class MemoryStore {
  private db: DatabaseManager;
  private logger: MarathonLogger;

  constructor(db: DatabaseManager, logger: MarathonLogger) {
    this.db = db;
    this.logger = logger;
  }

  async save(
    key: string, 
    value: string, 
    options: {
      tags?: string[];
      category?: string;
      ttl?: number;
    } = {}
  ): Promise<MemoryEntry> {
    try {
      const now = new Date().toISOString();
      const ttlExpires = options.ttl ? 
        new Date(Date.now() + options.ttl * 1000).toISOString() : 
        null;

      const entry: MemoryEntry = {
        key,
        value,
        tags: options.tags ? options.tags.join(',') : null,
        category: options.category || null,
        encrypted: false,
        created_at: now,
        updated_at: now,
        accessed_at: now,
        access_count: 0,
        ttl_expires_at: ttlExpires
      };

      const result = await this.db.run(
        `INSERT OR REPLACE INTO memories 
         (key, value, tags, category, encrypted, created_at, updated_at, accessed_at, access_count, ttl_expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [entry.key, entry.value, entry.tags, entry.category, entry.encrypted, 
         entry.created_at, entry.updated_at, entry.accessed_at, entry.access_count, entry.ttl_expires_at]
      );

      entry.id = result.lastID;
      return entry;
    } catch (error) {
      this.logger.error('Failed to save memory:', error);
      throw error;
    }
  }

  async load(key: string): Promise<MemoryEntry | null> {
    try {
      const entry = await this.db.get<MemoryEntry>(
        'SELECT * FROM memories WHERE key = ? AND deleted_at IS NULL',
        [key]
      );

      if (!entry) return null;

      // Check TTL
      if (entry.ttl_expires_at && new Date(entry.ttl_expires_at) < new Date()) {
        await this.delete(key);
        return null;
      }

      // Update access info
      await this.db.run(
        'UPDATE memories SET accessed_at = ?, access_count = access_count + 1 WHERE id = ?',
        [new Date().toISOString(), entry.id]
      );

      return entry;
    } catch (error) {
      this.logger.error('Failed to load memory:', error);
      throw error;
    }
  }

  async list(options: MemorySearchOptions): Promise<{ items: MemoryEntry[], total: number }> {
    try {
      let whereClause = 'WHERE deleted_at IS NULL';
      const params: any[] = [];

      if (options.category) {
        whereClause += ' AND category = ?';
        params.push(options.category);
      }

      if (options.tags && options.tags.length > 0) {
        const tagConditions = options.tags.map(() => 'tags LIKE ?').join(' OR ');
        whereClause += ` AND (${tagConditions})`;
        options.tags.forEach(tag => params.push(`%${tag}%`));
      }

      const countResult = await this.db.get<{count: number}>(
        `SELECT COUNT(*) as count FROM memories ${whereClause}`,
        params
      );

      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'DESC';
      const limit = options.limit || 50;
      const offset = options.offset || 0;

      const items = await this.db.all<MemoryEntry>(
        `SELECT * FROM memories ${whereClause}
         ORDER BY ${sortBy} ${sortOrder}
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return {
        items,
        total: countResult?.count || 0
      };
    } catch (error) {
      this.logger.error('Failed to list memories:', error);
      throw error;
    }
  }

  async search(query: string, options: { category?: string; limit?: number } = {}): Promise<MemoryEntry[]> {
    try {
      const { category, limit = 20 } = options;

      let sql = `
        SELECT * FROM memories
        WHERE (ttl_expires_at IS NULL OR ttl_expires_at > CURRENT_TIMESTAMP)
        AND (key LIKE ? OR value LIKE ?)
      `;
      const params = [`%${query}%`, `%${query}%`];

      if (category) {
        sql += ' AND category = ?';
        params.push(category);
      }

      sql += ' ORDER BY access_count DESC, updated_at DESC LIMIT ?';
      params.push(limit.toString());

      const entries = await this.db.all<MemoryEntry>(sql, params);
      
      return entries;
    } catch (error) {
      this.logger.error('Failed to search memory entries:', error);
      throw error;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await this.db.run('DELETE FROM memories WHERE key = ?', [key]);
      return true;
    } catch (error) {
      this.logger.error('Failed to delete memory entry:', error);
      return false;
    }
  }

  async getStats(): Promise<any> {
    try {
      const [totalResult, categoriesResult, mostAccessedResult] = await Promise.all([
        this.db.get<{total: number}>('SELECT COUNT(*) as total FROM memories WHERE (ttl_expires_at IS NULL OR ttl_expires_at > CURRENT_TIMESTAMP)'),
        this.db.all<{category: string, count: number}>('SELECT category, COUNT(*) as count FROM memories WHERE (ttl_expires_at IS NULL OR ttl_expires_at > CURRENT_TIMESTAMP) GROUP BY category'),
        this.db.all<{key: string, access_count: number}>('SELECT key, access_count FROM memories WHERE (ttl_expires_at IS NULL OR ttl_expires_at > CURRENT_TIMESTAMP) ORDER BY access_count DESC LIMIT 10')
      ]);

      const categories = categoriesResult.reduce((acc, row) => {
        acc[row.category] = row.count;
        return acc;
      }, {} as {[key: string]: number});

      return {
        total: totalResult?.total || 0,
        categories,
        mostAccessed: mostAccessedResult
      };
    } catch (error) {
      this.logger.error('Failed to get memory stats:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      // Remove expired entries
      await this.db.run('DELETE FROM memories WHERE ttl_expires_at IS NOT NULL AND ttl_expires_at <= CURRENT_TIMESTAMP');
      this.logger.info('Memory cleanup completed');
    } catch (error) {
      this.logger.error('Failed to cleanup memory entries:', error);
    }
  }
}