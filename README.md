# 🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition

<div align="center">

**One Tool - All Capabilities!**  
**80+ Functions in 7 Categories**

🇬🇪 **Georgian Interface** | 🌊 **Created in Batumi** | ⚡ **Universal Edition**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Georgian](https://img.shields.io/badge/ქართული-interface-red.svg)](#)
[![Batumi](https://img.shields.io/badge/🌊-Made_in_Batumi-blue.svg)](#)

*🏔️ With the strength of Caucasus Mountains and the purity of Black Sea*

[🇬🇪 ქართული ვერსია](#-ქართული-ვერსია) | [🇺🇸 English Version](#-english-version)

</div>

---

## 🇺🇸 English Version

### 🌟 Key Features

- **🎛️ Modular System** - Each module can be enabled/disabled independently
- **⚡ 80+ Functions in 7 Categories** - Complete ecosystem for AI assistant
- **🇬🇪 Georgian Interface Support** - All functions available in Georgian
- **🌊 Batumi Craftsmanship** - Created with love in Georgia
- **⚙️ Smart Configuration** - Adapts to your needs
- **🔧 Symbol Commands** - Quick access (---, +++, ..., ***, ###, @@@)

### 🚀 Quick Start

#### Installation

```bash
# Clone the repository
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool

# Install dependencies
npm install

# Build the project
npm run build

# Test installation
npm run marathon:test
```

#### Claude Desktop Configuration

Add to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["C:/path/to/marathon-mcp-tool/dist/index.js"],
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "english",
        "MARATHON_THEME": "batumi_sunset"
      }
    }
  }
}
```

#### First Test

In Claude Desktop, try:

```
marathon_test_connection
```

If everything is configured correctly, you'll receive:

```
🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition
🇬🇪 Connection successful!
🌊 Greetings from the Black Sea waves of Batumi!
```

### 📋 Module System

#### 🔧 1. Core System
```
✅ marathon_test_connection     - Test connection
✅ marathon_get_config          - View configuration  
✅ marathon_set_config          - Change configuration
✅ marathon_module_toggle       - Enable/disable modules
✅ marathon_get_status          - System status
✅ marathon_language_switch     - Switch language (Georgian/English)
```

#### 📁 2. File System Management
```
📖 Read Operations:
✅ marathon_read_file           - Read file
✅ marathon_read_multiple_files - Read multiple files
✅ marathon_get_file_info       - File information

✏️ Write Operations:
✅ marathon_write_file          - Write to file
✅ marathon_edit_file           - Edit file
✅ marathon_edit_block          - Block editing

📂 Directory Management:
✅ marathon_create_directory    - Create directory
✅ marathon_list_directory      - List directory
✅ marathon_directory_tree      - Directory tree
✅ marathon_move_file           - Move file

🔍 Search Operations:
✅ marathon_search_files        - Search files
✅ marathon_search_code         - Search code
✅ marathon_allowed_directories - Allowed directories
```

#### 🐙 3. Git & Repository Management
```
📚 Repository Operations:
✅ marathon_git_create_repo     - Create repository
✅ marathon_git_search_repos    - Search repositories
✅ marathon_git_fork_repo       - Fork repository

📄 File Operations:
✅ marathon_git_get_file        - Get file from GitHub
✅ marathon_git_create_file     - Create/update file
✅ marathon_git_push_files      - Push files

🌿 Branch Management:
✅ marathon_git_create_branch   - Create branch
✅ marathon_git_list_commits    - List commits

🔀 Pull Requests:
✅ marathon_git_create_pr       - Create Pull Request
✅ marathon_git_merge_pr        - Merge Pull Request
✅ marathon_git_review_pr       - Review Pull Request
✅ marathon_git_pr_status       - Pull Request status

🐛 Issues Management:
✅ marathon_git_create_issue    - Create issue
✅ marathon_git_update_issue    - Update issue
✅ marathon_git_list_issues     - List issues

🔍 Advanced Search:
✅ marathon_git_search_code     - Search code
✅ marathon_git_search_issues   - Search issues
✅ marathon_git_search_users    - Search users
```

#### 🧠 4. Memory & Knowledge Management
```
💾 Simple Memory:
✅ marathon_memory_save         - Save information
✅ marathon_memory_load         - Load information
✅ marathon_memory_list         - Memory list

🕸️ Knowledge Graph:
✅ marathon_kb_create_entities  - Create entities
✅ marathon_kb_create_relations - Create relations
✅ marathon_kb_add_observations - Add observations
✅ marathon_kb_search_nodes     - Search nodes
✅ marathon_kb_read_graph       - Read entire graph
✅ marathon_kb_delete_entities  - Delete entities
✅ marathon_kb_delete_relations - Delete relations
```

#### ⚙️ 5. System & Process Management
```
💻 Command Execution:
✅ marathon_execute_command     - Execute command
✅ marathon_read_output         - Read output
✅ marathon_force_terminate     - Force terminate

📊 Process Management:
✅ marathon_list_processes      - List processes
✅ marathon_kill_process        - Kill process
✅ marathon_list_sessions       - List sessions

⚙️ System Configuration:
✅ marathon_get_system_config   - System configuration
✅ marathon_set_system_config   - Set configuration
```

#### 📚 6. Documentation & Content
```
📖 Documentation Access:
✅ marathon_fetch_docs          - Fetch documentation
✅ marathon_search_docs         - Search documentation

🌐 Web Content:
✅ marathon_fetch_url_content   - Fetch URL content
✅ marathon_web_scraping        - Web scraping

🎨 Content Generation:
✅ marathon_generate_markdown   - Generate Markdown
✅ marathon_export_content      - Export content
```

#### 🚀 7. Advanced Features
```
🤖 AI-Powered:
✅ marathon_smart_execute       - AI-powered execution
✅ marathon_ai_assistant        - Intelligent assistant
✅ marathon_workflow_create     - Create workflows

⚡ Symbol Commands:
✅ marathon_symbol_command      - Symbol commands
                                (---, +++, ..., ***, ###, @@@)

🔗 Integration:
✅ marathon_integration_hub     - Integration with other MCP tools
✅ marathon_cloud_sync          - Cloud services sync

📊 Analytics & Security:
✅ marathon_analytics           - Usage analytics
✅ marathon_security_check      - Security check
✅ marathon_backup_restore      - Backup/restore system
```

### ⚡ Symbol Commands

Marathon MCP Tool features a unique symbol command system:

| Symbol | Function | Description |
|--------|----------|-------------|
| `---` | System restart | Context reload and restart |
| `+++` | Complex task | AI-powered complex task execution |
| `...` | Save information | Save information to memory |
| `***` | Marathon mode | Long-term task management |
| `###` | Configuration | System configuration changes |
| `@@@` | Integration | Quick connection to other systems |

### 🌊 Batumi Craftsmanship

Marathon MCP Tool is **crafted with love in Batumi, Georgia** 🇬🇪

#### Our Values:

- **🏔️ Strength of Caucasus Mountains** - Solid and reliable
- **🌊 Purity of Black Sea** - Clean and beautiful code
- **🍇 Georgian Traditions** - Respect for values
- **☕ Georgian Coffee Energy** - Enthusiasm and dedication

---

## 🇬🇪 ქართული ვერსია

### 🌟 მთავარი მახასიათებლები

- **🎛️ მოსანიშნი მოდულური სისტემა** - ყველა მოდული ცალ-ცალკე ჩარ/თის შესაძლებლობით
- **⚡ 80+ ფუნქცია 7 კატეგორიაში** - სრული ეკოსისტემა AI ასისტენტისთვის
- **🇬🇪 სრული ქართული ინტერფეისი** - ყველა ფუნქცია ქართულ ენაზე
- **🌊 ბათუმური ხელწერა** - სიყვარულით შექმნილი საქართველოში
- **⚙️ სმარტ კონფიგურაცია** - მოიწყობება თქვენს საჭიროებაზე
- **🔧 სიმბოლური ბრძანებები** - სწრაფი წვდომა (---, +++, ..., ***, ###, @@@)

### 🚀 სწრაფი დაწყება

#### ინსტალაცია

```bash
# რეპოზიტორიის კლონირება
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool

# დამოკიდებულებების ინსტალაცია
npm install

# პროეკტის აშენება
npm run build

# ტესტირება
npm run marathon:test
```

#### Claude Desktop კონფიგურაცია

Claude Desktop-ის `claude_desktop_config.json` ფაილში დაამატეთ:

```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["C:/path/to/marathon-mcp-tool/dist/index.js"],
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "georgian",
        "MARATHON_THEME": "batumi_sunset"
      }
    }
  }
}
```

#### პირველი ტესტი

Claude Desktop-ში გამოსცადეთ:

```
marathon_test_connection
```

თუ ყველაფერი სწორადაა კონფიგურირებული, მიიღებთ:

```
🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition
🇬🇪 კავშირი წარმატებულია!
🌊 ბათუმის შავი ზღვის ტალღებისგან მისალმება!
```

### ⚡ სიმბოლური ბრძანებები

Marathon MCP Tool აქვს უნიკალური სიმბოლური ბრძანებების სისტემა:

| სიმბოლო | ფუნქცია | აღწერა |
|---------|---------|---------|
| `---` | სისტემის restart | კონტექსტის ჩატვირთვა და restart |
| `+++` | კომპლექსური ტასკი | AI-powered complex task execution |
| `...` | ინფორმაციის შენახვა | მეხსიერებაში ინფორმაციის შენახვა |
| `***` | მარათონ რეჟიმი | ხანგრძლივი ტასკების მენეჯმენტი |
| `###` | კონფიგურაცია | სისტემის კონფიგურაციის ცვლილება |
| `@@@` | ინტეგრაცია | სხვა სისტემებთან სწრაფი კავშირი |

### 🌊 ბათუმური ხელწერა

Marathon MCP Tool შექმნილია **სიყვარულით ბათუმში, საქართველოში** 🇬🇪

#### ჩვენი ღირებულებები:

- **🏔️ კავკასიონის მთების სიძლიერე** - მყარი და საიმედო
- **🌊 შავი ზღვის სისუფთავე** - სუფთა და ლამაზი კოდი
- **🍇 ქართული ტრადიციები** - ღირებულებების პატივისცემა
- **☕ ქართული ყავის ენერგია** - ენთუზიაზმი და მონდომება

---

## 📞 Contact / კონტაქტი

- **🌐 Website**: [https://acura.ge](https://acura.ge)
- **📧 Email**: sitech.georgia@gmail.com
- **🐙 GitHub**: [@sitechfromgeorgia](https://github.com/sitechfromgeorgia)
- **🌊 Location**: Batumi, Georgia / ბათუმი, საქართველო 🇬🇪

---

<div align="center">

**🏃‍♂️ Marathon MCP Tool - One Tool, All Capabilities!**

*🌊 Created with love in Batumi, Georgia* 🇬🇪

*🏔️ With the strength of Caucasus Mountains and the purity of Black Sea*

[![Star](https://img.shields.io/github/stars/sitechfromgeorgia/marathon-mcp-tool?style=social)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
[![Follow](https://img.shields.io/github/followers/sitechfromgeorgia?style=social)](https://github.com/sitechfromgeorgia)

</div>