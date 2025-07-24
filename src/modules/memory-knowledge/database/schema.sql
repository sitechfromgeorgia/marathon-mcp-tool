-- 🏃‍♂️ Marathon MCP Tool - Memory & Knowledge Database Schema
-- 🇬🇪 მეხსიერება და ცოდნის მონაცემთა ბაზის სქემა

-- Simple Memory Storage (Key-Value pairs with metadata)
CREATE TABLE IF NOT EXISTS simple_memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    tags TEXT,
    category TEXT DEFAULT 'general',
    encrypted BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    access_count INTEGER DEFAULT 0,
    ttl_expires_at DATETIME
);

-- Knowledge Graph - Entities
CREATE TABLE IF NOT EXISTS kg_entities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    entity_type TEXT NOT NULL,
    properties TEXT,  -- JSON string
    description TEXT,
    confidence REAL DEFAULT 1.0,
    source TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Graph - Relations
CREATE TABLE IF NOT EXISTS kg_relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_entity_id INTEGER NOT NULL,
    to_entity_id INTEGER NOT NULL,
    relation_type TEXT NOT NULL,
    properties TEXT,  -- JSON string
    confidence REAL DEFAULT 1.0,
    bidirectional BOOLEAN DEFAULT FALSE,
    weight REAL DEFAULT 1.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(from_entity_id) REFERENCES kg_entities(id) ON DELETE CASCADE,
    FOREIGN KEY(to_entity_id) REFERENCES kg_entities(id) ON DELETE CASCADE,
    UNIQUE(from_entity_id, to_entity_id, relation_type)
);

-- Knowledge Graph - Observations  
CREATE TABLE IF NOT EXISTS kg_observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id INTEGER NOT NULL,
    observation TEXT NOT NULL,
    observation_type TEXT DEFAULT 'note',
    confidence REAL DEFAULT 1.0,
    source TEXT DEFAULT 'user',
    context TEXT,  -- Additional context information
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(entity_id) REFERENCES kg_entities(id) ON DELETE CASCADE
);

-- Semantic Search Cache (for performance)
CREATE TABLE IF NOT EXISTS semantic_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query_hash TEXT UNIQUE NOT NULL,
    query_text TEXT NOT NULL,
    results TEXT NOT NULL,  -- JSON array of results
    result_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ttl_expires_at DATETIME
);

-- Session Context Storage
CREATE TABLE IF NOT EXISTS session_contexts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    context_data TEXT NOT NULL,  -- JSON string
    context_type TEXT DEFAULT 'conversation',
    priority INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
);

-- System Metadata
CREATE TABLE IF NOT EXISTS system_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_simple_memory_key ON simple_memory(key);
CREATE INDEX IF NOT EXISTS idx_simple_memory_category ON simple_memory(category);
CREATE INDEX IF NOT EXISTS idx_simple_memory_created_at ON simple_memory(created_at);

CREATE INDEX IF NOT EXISTS idx_kg_entities_name ON kg_entities(name);
CREATE INDEX IF NOT EXISTS idx_kg_entities_type ON kg_entities(entity_type);

CREATE INDEX IF NOT EXISTS idx_kg_relations_from ON kg_relations(from_entity_id);
CREATE INDEX IF NOT EXISTS idx_kg_relations_to ON kg_relations(to_entity_id);
CREATE INDEX IF NOT EXISTS idx_kg_relations_type ON kg_relations(relation_type);

CREATE INDEX IF NOT EXISTS idx_kg_observations_entity ON kg_observations(entity_id);
CREATE INDEX IF NOT EXISTS idx_kg_observations_timestamp ON kg_observations(timestamp);

CREATE INDEX IF NOT EXISTS idx_semantic_cache_query_hash ON semantic_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_session_contexts_session_id ON session_contexts(session_id);

-- Default System Metadata
INSERT OR IGNORE INTO system_metadata (key, value) VALUES 
    ('db_version', '1.0.0'),
    ('created_at', datetime('now')),
    ('last_backup', ''),
    ('total_memories', '0'),
    ('total_entities', '0'),
    ('total_relations', '0'),
    ('total_observations', '0');