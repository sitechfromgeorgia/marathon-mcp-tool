/**
 * 🏃‍♂️ Marathon MCP Tool Configuration System
 * 🇬🇪 ქართული კონფიგურაციის სისტემა
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export class MarathonConfig {
  constructor() {
    // Default configuration
    this.data = {
      version: '2.0.0',
      edition: 'universal',
      language: 'georgian',
      theme: 'batumi_sunset',
      performance_mode: 'balanced',
      auto_backup: true,
      security_level: 'standard',
      
      modules: {
        core_system: { enabled: true },
        file_system: { enabled: true },
        git_repository: { enabled: true },
        memory_knowledge: { enabled: true },  // NOW ENABLED!
        system_process: { enabled: true },
        documentation: { enabled: true },
        advanced_features: { enabled: true }
      }
    };
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
  }

  isModuleEnabled(moduleName) {
    return this.data.modules[moduleName]?.enabled || false;
  }

  getTheme() {
    return this.data.theme || 'batumi_sunset';
  }

  getLanguage() {
    return this.data.language || 'georgian';
  }

  getVersion() {
    return this.data.version || '2.0.0';
  }

  getEdition() {
    return this.data.edition || 'universal';
  }

  getAllModules() {
    return this.data.modules;
  }

  enableModule(moduleName) {
    if (this.data.modules[moduleName]) {
      this.data.modules[moduleName].enabled = true;
    }
  }

  disableModule(moduleName) {
    if (this.data.modules[moduleName]) {
      this.data.modules[moduleName].enabled = false;
    }
  }
}