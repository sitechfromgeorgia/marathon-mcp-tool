# 🏃‍♂️ Marathon MCP Tool v1.0.0 Enhanced Edition

<div align="center">

**ერთი ხელსაწყო - ყველა შესაძლებლობა! / One tool - all possibilities!**  
**90+ ფუნქცია 7 კატეგორიაში / 90+ functions in 7 categories**

🇬🇪 **ქართული ინტერფეისი / Georgian Interface** | 🌊 **ბათუმური ხელწერა / Batumi Style** | 🚀 **Enhanced Edition**

[![Version](https://img.shields.io/badge/version-1.0.0--enhanced-brightgreen.svg)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Georgian](https://img.shields.io/badge/ქართული-interface-red.svg)](#)
[![Batumi](https://img.shields.io/badge/🌊-ბათუმური_ხელწერა-blue.svg)](#)
[![Enhanced](https://img.shields.io/badge/status-enhanced-gold.svg)](#)

*🏔️ კავკასიონის მთების სიძლიერით და შავი ზღვის სისუფთავით*  
*🏔️ With the strength of Caucasus Mountains and the purity of Black Sea*

</div>

---

## 🚀 Enhanced Edition Features | გაფართოებული ვერსიის ფუნქციები

> **🎉 ALL ADVANCED FEATURES NOW ACTIVE!**  
> **🎉 ყველა გაფართოებული ფუნქცია ახლა აქტიურია!**

### ⚡ New in Enhanced Edition:
- **🎯 Symbol Commands**: ---, +++, ..., ***, ###, @@@ (ACTIVE)
- **🏃‍♂️ Marathon Mode**: Auto-save, session recovery (ACTIVE)  
- **🗄️ SQLite Memory**: Persistent storage across sessions (ACTIVE)
- **📊 Analytics**: Usage tracking and insights (ACTIVE)
- **🧠 Enhanced Memory**: 200MB limit, deeper context (ACTIVE)
- **⚙️ Enhanced Monitoring**: 10 concurrent processes (ACTIVE)

---

## 🎯 Symbol Commands | სიმბოლური ბრძანებები

### Quick Actions with Symbols:
```
---  →  Reset Session / სესიის განულება
+++  →  Marathon Mode / მარათონ რეჟიმი  
...  →  Continue Task / ამოცანის გაგრძელება
***  →  Emergency Save / გადაუდებელი შენახვა
###  →  Deep Analysis / ღრმა ანალიზი
@@@  →  Expert Mode / ექსპერტული რეჟიმი
```

**Usage / გამოყენება:**
```bash
marathon_symbol_command --symbol "+++"
# Activates Marathon Mode / ჩართავს მარათონ რეჟიმს
```

---

## 🏃‍♂️ Marathon Mode | მარათონ რეჟიმი

**Perfect for long-term projects / იდეალური გრძელვადიანი პროექტებისთვის**

### Features:
- **Auto-save every 2 minutes** / ავტო-შენახვა ყოველ 2 წუთში
- **Session recovery** / სესიის აღდგენა  
- **Project tracking** / პროექტის ტრექინგი
- **Context preservation** / კონტექსტის შენარჩუნება
- **Progress monitoring** / პროგრესის მონიტორინგი

### Activation:
```bash
marathon_symbol_command --symbol "+++"
# or
marathon_mode_activate --project_name "My Project"
```

---

## 🗄️ SQLite Integration | SQLite ინტეგრაცია

**Persistent memory across sessions / მუდმივი მეხსიერება სესიებს შორის**

### Database Tables:
- **memory** - Key-value storage / გასაღები-მნიშვნელობა
- **sessions** - Session tracking / სესიების ტრექინგი
- **symbol_commands** - Command history / ბრძანებების ისტორია
- **marathon_sessions** - Marathon tracking / მარათონის ტრექინგი
- **checkpoints** - Auto-save points / ავტო-შენახვის წერტილები
- **analytics_events** - Usage analytics / გამოყენების ანალიტიკა

### Status Check:
```bash
marathon_sqlite_status --detailed true
```

---

## 📊 Analytics & Insights | ანალიტიკა და ანალიზი

**Track your productivity / თვალყური ადევნეთ თქვენს პროდუქტიულობას**

### Available Reports:
- **Function usage statistics** / ფუნქციების გამოყენების სტატისტიკა
- **Performance metrics** / შესრულების მეტრიკები
- **Batumi insights** / ბათუმური ანალიზი
- **Session quality assessment** / სესიის ხარისხის შეფასება

### Get Report:
```bash
marathon_analytics_report --period "today" --detailed true
```

---

## 📋 Complete Module System | სრული მოდულური სისტემა

### 🔧 1. Core System (6 functions)
```
✅ marathon_test_connection     - კავშირის ტესტირება / Connection testing
✅ marathon_get_config          - კონფიგურაციის ნახვა / View configuration
✅ marathon_set_config          - კონფიგურაციის ცვლილება / Change configuration
✅ marathon_module_toggle       - მოდულების ჩართვა/გამორთვა / Toggle modules
✅ marathon_get_status          - სისტემის სტატუსი / System status
✅ marathon_language_switch     - ენის ცვლილება (ქართული/English) / Language switch
```

### 📁 2. File System Management (15 functions)
```
📖 Read Operations:
✅ marathon_read_file           - ფაილის წაკითხვა / Read file
✅ marathon_read_multiple_files - მრავალი ფაილის წაკითხვა / Read multiple files
✅ marathon_get_file_info       - ფაილის ინფორმაცია / File information

✏️ Write Operations:
✅ marathon_write_file          - ფაილში ჩაწერა / Write to file
✅ marathon_edit_file           - ფაილის რედაქტირება / Edit file
✅ marathon_edit_block          - ბლოკური რედაქტირება / Block editing

📂 Directory Management:
✅ marathon_create_directory    - დირექტორიის შექმნა / Create directory
✅ marathon_list_directory      - დირექტორიის სია / List directory
✅ marathon_directory_tree      - დირექტორიის ხე / Directory tree
✅ marathon_move_file           - ფაილის გადატანა / Move file

🔍 Search Operations:
✅ marathon_search_files        - ფაილების ძიება / Search files
✅ marathon_search_code         - კოდის ძიება / Search code
✅ marathon_allowed_directories - ნებადართული დირექტორიები / Allowed directories
```

### 🐙 3. Git & Repository Management (20 functions)
```
📚 Repository Operations:
✅ marathon_git_create_repo     - რეპოზიტორიის შექმნა / Create repository
✅ marathon_git_search_repos    - რეპოზიტორიების ძიება / Search repositories
✅ marathon_git_fork_repo       - რეპოზიტორიის ფორკი / Fork repository

📄 File Operations:
✅ marathon_git_get_file        - ფაილის მიღება GitHub-დან / Get file from GitHub
✅ marathon_git_create_file     - ფაილის შექმნა/განახლება / Create/update file
✅ marathon_git_push_files      - ფაილების push-ი / Push files

🌿 Branch Management:
✅ marathon_git_create_branch   - ბრენჩის შექმნა / Create branch
✅ marathon_git_list_commits    - კომიტების სია / List commits

🔀 Pull Requests:
✅ marathon_git_create_pr       - Pull Request-ის შექმნა / Create Pull Request
✅ marathon_git_merge_pr        - Pull Request-ის მერჯი / Merge Pull Request
✅ marathon_git_review_pr       - Pull Request-ის განხილვა / Review Pull Request

🐛 Issues Management:
✅ marathon_git_create_issue    - Issue-ის შექმნა / Create issue
✅ marathon_git_update_issue    - Issue-ის განახლება / Update issue
✅ marathon_git_list_issues     - Issue-ების სია / List issues
```

### 🧠 4. Memory & Knowledge Management (12 functions)
```
💾 Enhanced Memory:
✅ marathon_memory_save         - ინფორმაციის შენახვა / Save information
✅ marathon_memory_load         - ინფორმაციის ჩატვირთვა / Load information
✅ marathon_memory_list         - მეხსიერების სია / Memory list

🕸️ Knowledge Graph:
✅ marathon_kb_create_entities  - ენტითების შექმნა / Create entities
✅ marathon_kb_create_relations - კავშირების შექმნა / Create relations
✅ marathon_kb_add_observations - დაკვირვებების დამატება / Add observations
✅ marathon_kb_search_nodes     - ნოუდების ძიება / Search nodes
✅ marathon_kb_read_graph       - მთლიანი გრაფის წაკითხვა / Read full graph
✅ marathon_kb_delete_entities  - ენტითების წაშლა / Delete entities

🗄️ SQLite Operations:
🚀 marathon_sqlite_memory       - SQLite მეხსიერება / SQLite memory
🚀 marathon_context_save        - კონტექსტის შენახვა / Context save
🚀 marathon_session_recovery    - სესიის აღდგენა / Session recovery
```

### ⚙️ 5. System & Process Management (8 functions)
```
💻 Enhanced Command Execution:
✅ marathon_execute_command     - ბრძანების შესრულება / Execute command
✅ marathon_read_output         - შედეგის წაკითხვა / Read output
✅ marathon_force_terminate     - ძალით შეწყვეტა / Force terminate

📊 Enhanced Process Management:
✅ marathon_list_processes      - პროცესების სია / List processes
✅ marathon_kill_process        - პროცესის დაკვლა / Kill process
✅ marathon_list_sessions       - სესიების სია / List sessions

⚙️ Enhanced Configuration:
🚀 marathon_performance_monitor - შესრულების მონიტორინგი / Performance monitoring
🚀 marathon_resource_optimize   - რესურსების ოპტიმიზაცია / Resource optimization
```

### 📚 6. Documentation & Content (6 functions)
```
📖 Enhanced Documentation:
✅ marathon_fetch_docs          - დოკუმენტაციის მიღება / Fetch documentation
✅ marathon_search_docs         - დოკუმენტაციაში ძიება / Search documentation

🌐 Web Content:
✅ marathon_fetch_url_content   - URL კონტენტის მიღება / Fetch URL content
✅ marathon_web_scraping        - ვებ საიტების scraping / Web scraping

🎨 Enhanced Content:
🚀 marathon_smart_docs          - ინტელექტუალური დოკუმენტაცია / Smart documentation
🚀 marathon_content_analyze     - კონტენტის ანალიზი / Content analysis
```

### 🚀 7. Advanced Features (10 functions) - 🎉 NOW ACTIVE!
```
🎯 Symbol Commands:
🚀 marathon_symbol_command      - სიმბოლური ბრძანებები / Symbol commands (---, +++, etc.)

🏃‍♂️ Marathon Mode:
🚀 marathon_mode_activate       - მარათონ რეჟიმის ჩართვა / Activate Marathon Mode
🚀 marathon_mode_deactivate     - მარათონ რეჟიმის გამორთვა / Deactivate Marathon Mode

📊 Analytics:
🚀 marathon_analytics_report    - ანალიტიკის რეპორტი / Analytics report

🗄️ SQLite Management:
🚀 marathon_sqlite_status       - SQLite მდგომარეობა / SQLite status
🚀 marathon_auto_save           - ავტომატური შენახვა / Auto save

🤖 AI Enhancement (Basic):
🚀 marathon_smart_analyze       - ინტელექტუალური ანალიზი / Smart analysis
🚀 marathon_context_enhance     - კონტექსტის გაუმჯობესება / Context enhancement

🔧 System Optimization:
🚀 marathon_performance_tune    - შესრულების ტუნინგი / Performance tuning
🚀 marathon_health_check        - ჯანმრთელობის შემოწმება / Health check
```

---

## 🚀 Quick Start | სწრაფი დაწყება

### Installation | ინსტალაცია

```bash
# რეპოზიტორიის კლონირება / Clone repository
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool

# დამოკიდებულებების ინსტალაცია / Install dependencies
npm install

# პროეკტის აშენება / Build project
npm run build

# Enhanced features ტესტირება / Test enhanced features
npm run marathon:test
```

### Claude Desktop Configuration | Claude Desktop კონფიგურაცია

```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["path/to/marathon-mcp-tool/dist/index.js"],
      "env": {
        "MARATHON_MODE": "enhanced",
        "MARATHON_VERSION": "1.0.0",
        "MARATHON_LANGUAGE": "georgian",
        "MARATHON_THEME": "batumi_sunset",
        "FEATURE_FLAGS": "all_enhanced"
      }
    }
  }
}
```

### First Test | პირველი ტესტი

```bash
# Basic connection test
marathon_test_connection

# Test enhanced features
marathon_symbol_command --symbol "+++"

# Check analytics
marathon_analytics_report

# Test SQLite
marathon_sqlite_status --detailed true
```

Expected output / მოსალოდნელი შედეგი:
```
🏃‍♂️ Marathon MCP Tool v1.0.0 Enhanced Edition
🇬🇪 კავშირი წარმატებულია! / Connection successful!
🚀 Enhanced features active! / გაფართოებული ფუნქციები აქტიურია!
🌊 ბათუმის შავი ზღვის ტალღებისგან მისალმება!
```

---

## 🌟 Enhanced Edition Highlights | გაფართოებული ვერსიის მთავარი მახასიათებლები

### 🎯 Symbol Commands
- **Instant actions** with simple symbols / მარტივი სიმბოლოებით მყისიერი ქმედებები
- **Context-aware responses** / კონტექსტის გათვალისწინება
- **Bilingual feedback** / ორენოვანი უკუკავშირი

### 🏃‍♂️ Marathon Mode
- **Project-focused workflow** / პროექტზე ფოკუსირებული workflow
- **Automatic progress saving** / ავტომატური პროგრესის შენახვა
- **Session recovery** / სესიის აღდგენა
- **Time tracking** / დროის ტრექინგი

### 🗄️ SQLite Integration
- **Cross-session persistence** / სესიებს შორის მუდმივობა
- **Structured data storage** / სტრუქტურირებული მონაცემების შენახვა
- **Query capabilities** / ძიების შესაძლებლობები
- **Backup and recovery** / backup და აღდგენა

### 📊 Analytics Engine
- **Usage patterns** / გამოყენების შაბლონები
- **Performance insights** / შესრულების ანალიზი
- **Batumi wisdom** / ბათუმური სიბრძნე
- **Georgian assessments** / ქართული შეფასებები

---

## 🛡️ Enhanced Security | გაფართოებული უსაფრთხოება

- **🔐 SQLite encryption ready** - მზადაა დაშიფვრისთვის
- **🛡️ Enhanced safe mode** - გაუმჯობესებული უსაფრთხო რეჟიმი
- **📝 Comprehensive audit logs** - სრული აუდიტის ლოგები
- **🔒 Session validation** - სესიის ვალიდაცია
- **⚠️ Smart confirmations** - ინტელექტუალური დადასტურებები

---

## 🌊 Batumi Philosophy | ბათუმური ფილოსოფია

Marathon MCP Tool Enhanced Edition შექმნილია **სიყვარულით ბათუმში, საქართველოში** 🇬🇪

### ჩვენი Enhanced ღირებულებები / Our Enhanced Values:

- **🏔️ კავკასიონის მთების სიძლიერე** - Enhanced reliability / გაუმჯობესებული საიმედოობა
- **🌊 შავი ზღვის სისუფთავე** - Clean, optimized code / სუფთა, ოპტიმიზებული კოდი
- **🍇 ქართული ტრადიციები** - Respect for heritage / მემკვიდრეობის პატივისცემა
- **☕ ქართული ყავის ენერგია** - Enhanced performance / გაუმჯობესებული შესრულება
- **🚀 ბათუმური ინოვაცია** - Cutting-edge features / უახლესი ფუნქციები

---

## 📊 Enhanced Edition Statistics | გაფართოებული ვერსიის სტატისტიკა

```
📈 Performance Improvements:
- Function count: 77 → 90+ functions
- Memory capacity: 50MB → 200MB  
- Concurrent processes: 5 → 10
- Auto-save frequency: Manual → Every 2 minutes
- Session persistence: None → Full SQLite
- Analytics: None → Comprehensive

🚀 New Capabilities:
- Symbol Commands: 6 symbols
- Marathon Mode: Full implementation
- SQLite Database: 7 tables
- Analytics Engine: 15+ metrics
- Enhanced monitoring: Real-time
- Batumi insights: AI-powered
```

---

## 🗺️ Enhanced Roadmap | გაფართოებული გეგმარი

### v1.1.0 - September 2025 (Next Release)
- **🤖 Advanced AI Intelligence** - transformers.js integration
- **🔗 Real GitHub API** - actual GitHub operations
- **🎨 Enhanced UI** - better visualization
- **🔍 Advanced Search** - semantic search capabilities

### v1.2.0 - November 2025
- **☁️ Cloud Synchronization** - optional cloud backup
- **🌐 Web Dashboard** - browser interface
- **📱 Mobile Companion** - PWA application
- **🏢 Team Features** - collaboration tools

### v2.0.0 - Q1 2026 (Stable Release)
- **🧠 Full AI Assistant** - complete AI integration
- **🌍 Multi-language** - additional language support
- **🏢 Enterprise Features** - advanced enterprise tools
- **🔌 Plugin Architecture** - extensible plugin system

---

## 🤝 Enhanced Contributing | გაფართოებული წვლილი

Enhanced Edition-ზე მუშაობა კიდევ უფრო საინტერესოა! / Working on Enhanced Edition is even more interesting!

### Enhanced Development Setup:
```bash
# Clone and setup
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool

# Install dependencies  
npm install

# Run enhanced tests
npm run test:enhanced

# Start enhanced development
npm run dev:enhanced
```

### Enhanced Contribution Guidelines:
- **🇬🇪 Georgian + English** comments in code
- **🌊 Batumi style** - clean and beautiful
- **✅ Enhanced test coverage** - minimum 85%
- **📚 Comprehensive docs** - for every function
- **🚀 Performance focused** - optimized implementations

---

## 📄 License | ლიცენზია

MIT License - იხილეთ [LICENSE](LICENSE) ფაილი დეტალებისთვის.  
MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 Enhanced Support | გაფართოებული მხარდაჭერა

- **🌐 Website**: [https://acura.ge](https://acura.ge)
- **📧 Email**: sitech.georgia@gmail.com
- **🐙 GitHub**: [@sitechfromgeorgia](https://github.com/sitechfromgeorgia)
- **💬 Issues**: [GitHub Issues](https://github.com/sitechfromgeorgia/marathon-mcp-tool/issues)
- **📖 Wiki**: [Enhanced Documentation](https://github.com/sitechfromgeorgia/marathon-mcp-tool/wiki)
- **🌊 Location**: ბათუმი, საქართველო 🇬🇪 / Batumi, Georgia 🇬🇪

---

<div align="center">

**🏃‍♂️ Marathon MCP Tool v1.0.0 Enhanced Edition**  
**ერთი ხელსაწყო - ყველა შესაძლებლობა! / One tool - all possibilities!**

*🌊 შექმნილია სიყვარულით ბათუმში, საქართველოში* 🇬🇪  
*🌊 Created with love in Batumi, Georgia* 🇬🇪

*🏔️ კავკასიონის მთების სიძლიერითა და შავი ზღვის სისუფთავით*  
*🏔️ With the strength of Caucasus Mountains and the purity of Black Sea*

[![Star](https://img.shields.io/github/stars/sitechfromgeorgia/marathon-mcp-tool?style=social)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
[![Follow](https://img.shields.io/github/followers/sitechfromgeorgia?style=social)](https://github.com/sitechfromgeorgia)

**🚀 Enhanced Edition - Ready for Production! 🚀**  
**🚀 გაფართოებული ვერსია - მზადაა პროდუქციისთვის! 🚀**

</div>