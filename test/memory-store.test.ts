import { MemoryStore } from '../src/modules/memory-knowledge/memory-store';
import { DatabaseManager } from '../src/modules/memory-knowledge/database/database-manager';
import { MarathonLogger } from '../src/utils/logger';
import * as fs from 'fs';

describe('MemoryStore', () => {
  let memoryStore: MemoryStore;
  let dbManager: DatabaseManager;
  const dbPath = './test-memory.db';

  beforeAll(async () => {
    const logger = new MarathonLogger();
    dbManager = new DatabaseManager({ dbPath }, logger);
    await dbManager.initialize();
    memoryStore = new MemoryStore(dbManager, logger);
  });

  afterAll(async () => {
    await dbManager.close();
    fs.unlinkSync(dbPath);
  });

  it('should save and search for a memory entry', async () => {
    const key = 'test-key';
    const value = 'test-value';
    await memoryStore.save(key, value);
    const results = await memoryStore.search('test-value');
    expect(results.length).toBe(1);
    expect(results[0].key).toBe(key);
    expect(results[0].value).toBe(value);
  });
});