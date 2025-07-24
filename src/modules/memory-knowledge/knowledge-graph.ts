/**
 * 🏃‍♂️ Marathon MCP Tool - Knowledge Graph Engine
 * 🇬🇪 ცოდნის გრაფის ძრავა
 */

import { DatabaseManager } from './database/database-manager.js';
import { MarathonLogger } from '../../utils/logger.js';

export interface Entity {
  id?: number;
  name: string;
  entity_type: string;
  properties?: Record<string, any>;
  description?: string;
  confidence?: number;
  source?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Relation {
  id?: number;
  from_entity_id: number;
  to_entity_id: number;
  relation_type: string;
  properties?: Record<string, any>;
  confidence?: number;
  bidirectional?: boolean;
  weight?: number;
  created_at?: string;
}

export interface Observation {
  id?: number;
  entity_id: number;
  observation: string;
  observation_type?: string;
  confidence?: number;
  source?: string;
  context?: string;
  timestamp?: string;
}

export interface GraphSearchOptions {
  entityTypes?: string[];
  relationTypes?: string[];
  minConfidence?: number;
  limit?: number;
  offset?: number;
}

export class KnowledgeGraphEngine {
  private db: DatabaseManager;
  private logger: MarathonLogger;

  constructor(db: DatabaseManager, logger: MarathonLogger) {
    this.db = db;
    this.logger = logger;
  }

  // ============ ENTITY OPERATIONS ============

  async createEntity(entityData: Omit<Entity, 'id' | 'created_at' | 'updated_at'>): Promise<Entity> {
    try {
      const { name, entity_type, properties = {}, description, confidence = 1.0, source } = entityData;
      
      // Check if entity exists
      const existing = await this.getEntityByName(name);
      if (existing) {
        throw new Error(`Entity with name "${name}" already exists`);
      }

      await this.db.runAsync(`
        INSERT INTO entities (name, entity_type, properties, description, confidence, source)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [name, entity_type, JSON.stringify(properties), description, confidence, source]);

      return (await this.getEntityByName(name))!;
    } catch (error) {
      this.logger.error('Failed to create entity:', error);
      throw error;
    }
  }

  async getEntityByName(name: string): Promise<Entity | null> {
    try {
      const entity = await this.db.getAsync(
        'SELECT * FROM entities WHERE name = ?',
        [name]
      );

      if (!entity) {
        return null;
      }

      return {
        ...entity,
        properties: JSON.parse(entity.properties || '{}')
      };
    } catch (error) {
      this.logger.error('Failed to get entity by name:', error);
      throw error;
    }
  }

  async searchEntities(query: string, options: GraphSearchOptions = {}): Promise<Entity[]> {
    try {
      const { entityTypes, minConfidence, limit = 50, offset = 0 } = options;

      let sql = 'SELECT * FROM entities WHERE (name LIKE ? OR description LIKE ?)';
      const params = [`%${query}%`, `%${query}%`];

      if (entityTypes && entityTypes.length > 0) {
        const typeConditions = entityTypes.map(() => 'entity_type = ?').join(' OR ');
        sql += ` AND (${typeConditions})`;
        entityTypes.forEach(type => params.push(type));
      }

      if (minConfidence !== undefined) {
        sql += ' AND confidence >= ?';
        params.push(minConfidence.toString());
      }

      sql += ' ORDER BY confidence DESC, updated_at DESC LIMIT ? OFFSET ?';
      params.push(limit.toString(), offset.toString());

      const entities = await this.db.allAsync(sql, params);
      
      return entities.map(entity => ({
        ...entity,
        properties: JSON.parse(entity.properties || '{}')
      }));
    } catch (error) {
      this.logger.error('Failed to search entities:', error);
      throw error;
    }
  }

  async deleteEntity(entityId: number): Promise<boolean> {
    try {
      await this.db.runAsync('DELETE FROM entities WHERE id = ?', [entityId]);
      return true;
    } catch (error) {
      this.logger.error('Failed to delete entity:', error);
      return false;
    }
  }

  // ============ RELATION OPERATIONS ============

  async createRelation(relationData: Omit<Relation, 'id' | 'created_at'>): Promise<Relation> {
    try {
      const { 
        from_entity_id, 
        to_entity_id, 
        relation_type, 
        properties = {}, 
        confidence = 1.0, 
        bidirectional = false, 
        weight = 1.0 
      } = relationData;

      await this.db.runAsync(`
        INSERT INTO relations (from_entity_id, to_entity_id, relation_type, properties, confidence, bidirectional, weight)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [from_entity_id, to_entity_id, relation_type, JSON.stringify(properties), confidence, bidirectional ? 1 : 0, weight]);

      // If bidirectional, create reverse relation
      if (bidirectional) {
        await this.db.runAsync(`
          INSERT INTO relations (from_entity_id, to_entity_id, relation_type, properties, confidence, bidirectional, weight)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [to_entity_id, from_entity_id, relation_type, JSON.stringify(properties), confidence, 1, weight]);
      }

      return await this.db.getAsync(
        'SELECT * FROM relations WHERE from_entity_id = ? AND to_entity_id = ? AND relation_type = ? ORDER BY id DESC LIMIT 1',
        [from_entity_id, to_entity_id, relation_type]
      );
    } catch (error) {
      this.logger.error('Failed to create relation:', error);
      throw error;
    }
  }

  async getEntityRelations(entityId: number, options: GraphSearchOptions = {}): Promise<{
    incoming: Relation[],
    outgoing: Relation[]
  }> {
    try {
      const { relationTypes, minConfidence, limit = 50 } = options;

      let baseSql = 'WHERE confidence >= ?';
      const baseParams = [minConfidence || 0];

      if (relationTypes && relationTypes.length > 0) {
        const typeConditions = relationTypes.map(() => 'relation_type = ?').join(' OR ');
        baseSql += ` AND (${typeConditions})`;
        relationTypes.forEach(type => baseParams.push(type));
      }

      baseSql += ' ORDER BY weight DESC, confidence DESC LIMIT ?';

      const [incoming, outgoing] = await Promise.all([
        this.db.allAsync(
          `SELECT * FROM relations ${baseSql.replace('WHERE', 'WHERE to_entity_id = ? AND')}`,
          [entityId, ...baseParams, limit]
        ),
        this.db.allAsync(
          `SELECT * FROM relations ${baseSql.replace('WHERE', 'WHERE from_entity_id = ? AND')}`,
          [entityId, ...baseParams, limit]
        )
      ]);

      return {
        incoming: incoming.map(rel => ({
          ...rel,
          properties: JSON.parse(rel.properties || '{}')
        })),
        outgoing: outgoing.map(rel => ({
          ...rel,
          properties: JSON.parse(rel.properties || '{}')
        }))
      };
    } catch (error) {
      this.logger.error('Failed to get entity relations:', error);
      throw error;
    }
  }

  // ============ OBSERVATION OPERATIONS ============

  async addObservation(observationData: Omit<Observation, 'id' | 'timestamp'>): Promise<Observation> {
    try {
      const { 
        entity_id, 
        observation, 
        observation_type = 'general', 
        confidence = 1.0, 
        source, 
        context 
      } = observationData;

      await this.db.runAsync(`
        INSERT INTO observations (entity_id, observation, observation_type, confidence, source, context)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [entity_id, observation, observation_type, confidence, source, context]);

      return await this.db.getAsync(
        'SELECT * FROM observations WHERE entity_id = ? ORDER BY id DESC LIMIT 1',
        [entity_id]
      );
    } catch (error) {
      this.logger.error('Failed to add observation:', error);
      throw error;
    }
  }

  async getEntityObservations(entityId: number, limit: number = 50): Promise<Observation[]> {
    try {
      return await this.db.allAsync(
        'SELECT * FROM observations WHERE entity_id = ? ORDER BY timestamp DESC LIMIT ?',
        [entityId, limit]
      );
    } catch (error) {
      this.logger.error('Failed to get entity observations:', error);
      throw error;
    }
  }

  // ============ GRAPH OPERATIONS ============

  async readGraph(options: {
    includeObservations?: boolean;
    maxEntities?: number;
  } = {}): Promise<{
    entities: Entity[];
    relations: Relation[];
    observations?: Observation[];
  }> {
    try {
      const { includeObservations = true, maxEntities = 100 } = options;

      const entities = await this.db.allAsync(
        'SELECT * FROM entities ORDER BY confidence DESC, updated_at DESC LIMIT ?',
        [maxEntities]
      );

      const entityIds = entities.map(e => e.id);
      
      const relations = entityIds.length > 0 ? await this.db.allAsync(
        `SELECT * FROM relations WHERE from_entity_id IN (${entityIds.map(() => '?').join(',')}) 
         OR to_entity_id IN (${entityIds.map(() => '?').join(',')})
         ORDER BY weight DESC, confidence DESC`,
        [...entityIds, ...entityIds]
      ) : [];

      let observations: Observation[] = [];
      if (includeObservations && entityIds.length > 0) {
        observations = await this.db.allAsync(
          `SELECT * FROM observations WHERE entity_id IN (${entityIds.map(() => '?').join(',')})
           ORDER BY timestamp DESC`,
          entityIds
        );
      }

      return {
        entities: entities.map(e => ({
          ...e,
          properties: JSON.parse(e.properties || '{}')
        })),
        relations: relations.map(r => ({
          ...r,
          properties: JSON.parse(r.properties || '{}')
        })),
        ...(includeObservations && { observations })
      };
    } catch (error) {
      this.logger.error('Failed to read graph:', error);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const [entityStats, relationStats, observationStats] = await Promise.all([
        this.db.allAsync('SELECT entity_type, COUNT(*) as count FROM entities GROUP BY entity_type'),
        this.db.allAsync('SELECT relation_type, COUNT(*) as count FROM relations GROUP BY relation_type'),
        this.db.getAsync('SELECT COUNT(*) as total FROM observations')
      ]);

      const totalEntities = entityStats.reduce((sum, stat) => sum + stat.count, 0);
      const totalRelations = relationStats.reduce((sum, stat) => sum + stat.count, 0);

      return {
        totalEntities,
        totalRelations,
        totalObservations: observationStats.total,
        entityTypes: entityStats,
        relationTypes: relationStats
      };
    } catch (error) {
      this.logger.error('Failed to get graph stats:', error);
      throw error;
    }
  }
}