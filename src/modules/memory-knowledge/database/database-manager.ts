/**
 * 🏃‍♂️ Marathon MCP Tool - Database Manager
 * 🇬🇪 მონაცემთა ბაზის მენეჯერი
 */

import sqlite3 from 'sqlite3';
import { MarathonLogger } from '../../../utils/logger.js';

export class DatabaseManager {
  private db: sqlite3.Database;
  private logger: MarathonLogger;

  constructor(options: { dbPath: string }, logger: MarathonLogger) {
    this.logger = logger;
    this.db = new sqlite3.Database(options.dbPath, (err) => {
      if (err) {
        this.logger.error('Could not connect to database', err);
      } else {
        this.logger.info('Connected to database');
      }
    });
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`
          CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT NOT NULL,
            tags TEXT,
            category TEXT,
            encrypted BOOLEAN DEFAULT FALSE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            accessed_at TEXT,
            access_count INTEGER DEFAULT 0,
            ttl_expires_at TEXT,
            deleted_at TEXT
          )
        `, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  async run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  async get<T>(sql: string, params: any[] = []): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T | null);
      });
    });
  }

  async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}