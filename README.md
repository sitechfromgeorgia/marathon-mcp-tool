# 🏃‍♂️ Marathon MCP Tool v1.0.0 Development Phase

<div align="center">

**ერთი ხელსაწყო - ყველა შესაძლებლობა! / One tool - all possibilities!**  
**80+ ფუნქცია 7 კატეგორიაში / 80+ functions in 7 categories**

🇬🇪 **ქართული ინტერფეისი / Georgian Interface** | 🌊 **ბათუმური ხელწერა / Batumi Style** | ⚡ **Development Edition**

[![Version](https://img.shields.io/badge/version-1.0.0--dev-orange.svg)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Georgian](https://img.shields.io/badge/ქართული-interface-red.svg)](#)
[![Batumi](https://img.shields.io/badge/🌊-ბათუმური_ხელწერა-blue.svg)](#)
[![Development](https://img.shields.io/badge/status-development-yellow.svg)](#)

*🏔️ კავკასიონის მთების სიძლიერით და შავი ზღვის სისუფთავით*  
*🏔️ With the strength of Caucasus Mountains and the purity of Black Sea*

</div>

---

## ⚠️ Development Status / განვითარების სტატუსი

> **🚧 This project is currently in active development phase**  
> **🚧 ეს პროექტი ამჟამად აქტიური განვითარების ფაზაშია**

- **Current Version**: 1.0.0-dev
- **Status**: Core functionality being implemented
- **Expected Stable Release**: Coming soon

> **მიმდინარე ვერსია**: 1.0.0-dev  
> **სტატუსი**: ძირითადი ფუნქციონალის განხორციელება  
> **მოსალოდნელი სტაბილური გამოშვება**: მალე

---

## 🌟 მთავარი მახასიათებლები / Main Features

- **🎛️ მოსანიშნი მოდულური სისტემა / Modular System** - ყველა მოდული ცალ-ცალკე ჩარ/თის შესაძლებლობით
- **⚡ 80+ ფუნქცია 7 კატეგორიაში / 80+ functions in 7 categories** - სრული ეკოსისტემა AI ასისტენტისთვის
- **🇬🇪 სრული ქართული ინტერფეისი / Full Georgian Interface** - ყველა ფუნქცია ქართულ ენაზე
- **🌊 ბათუმური ხელწერა / Batumi Style** - სიყვარულით შექმნილი საქართველოში
- **⚙️ სმარტ კონფიგურაცია / Smart Configuration** - მოიწყობება თქვენს საჭიროებაზე
- **🔧 სიმბოლური ბრძანებები / Symbol Commands** - სწრაფი წვდომა (---, +++, ..., ***, ###, @@@)

---

## 📋 მოდულური სისტემა / Modular System

### 🔧 1. Core System (ძირითადი სისტემა)
```
✅ marathon_test_connection     - კავშირის ტესტირება / Connection testing
✅ marathon_get_config          - კონფიგურაციის ნახვა / View configuration
✅ marathon_set_config          - კონფიგურაციის ცვლილება / Change configuration
✅ marathon_module_toggle       - მოდულების ჩართვა/გამორთვა / Toggle modules
✅ marathon_get_status          - სისტემის სტატუსი / System status
✅ marathon_language_switch     - ენის ცვლილება (ქართული/English) / Language switch
```

### 📁 2. File System Management (ფაილების მენეჯმენტი)
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

### 🐙 3. Git & Repository Management (Git რეპოზიტორიები)
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
✅ marathon_git_pr_status       - Pull Request-ის სტატუსი / Pull Request status

🐛 Issues Management:
✅ marathon_git_create_issue    - Issue-ის შექმნა / Create issue
✅ marathon_git_update_issue    - Issue-ის განახლება / Update issue
✅ marathon_git_list_issues     - Issue-ების სია / List issues

🔍 Advanced Search:
✅ marathon_git_search_code     - კოდის ძიება / Search code
✅ marathon_git_search_issues   - Issue-ების ძიება / Search issues
✅ marathon_git_search_users    - მომხმარებლების ძიება / Search users
```

### 🧠 4. Memory & Knowledge Management (მეხსიერება და ცოდნა)
```
💾 Simple Memory:
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
✅ marathon_kb_delete_relations - კავშირების წაშლა / Delete relations
```

### ⚙️ 5. System & Process Management (სისტემა და პროცესები)
```
💻 Command Execution:
✅ marathon_execute_command     - ბრძანების შესრულება / Execute command
✅ marathon_read_output         - შედეგის წაკითხვა / Read output
✅ marathon_force_terminate     - ძალით შეწყვეტა / Force terminate

📊 Process Management:
✅ marathon_list_processes      - პროცესების სია / List processes
✅ marathon_kill_process        - პროცესის დაკვლა / Kill process
✅ marathon_list_sessions       - სესიების სია / List sessions

⚙️ System Configuration:
✅ marathon_get_system_config   - სისტემის კონფიგურაცია / System configuration
✅ marathon_set_system_config   - კონფიგურაციის ცვლილება / Change configuration
```

### 📚 6. Documentation & Content (დოკუმენტაცია და კონტენტი)
```
📖 Documentation Access:
✅ marathon_fetch_docs          - დოკუმენტაციის მიღება / Fetch documentation
✅ marathon_search_docs         - დოკუმენტაციაში ძიება / Search documentation

🌐 Web Content:
✅ marathon_fetch_url_content   - URL კონტენტის მიღება / Fetch URL content
✅ marathon_web_scraping        - ვებ საიტების scraping / Web scraping

🎨 Content Generation:
✅ marathon_generate_markdown   - Markdown-ის გენერაცია / Generate Markdown
✅ marathon_export_content      - კონტენტის ექსპორტი / Export content
```

### 🚀 7. Advanced Features (გაფართოებული ფუნქციები) - Coming Soon
```
🤖 AI-Powered (Development):
🚧 marathon_smart_execute       - AI-powered ბრძანების შესრულება
🚧 marathon_ai_assistant        - ინტელექტუალური დამხმარე
🚧 marathon_workflow_create     - workflows-ის შექმნა

⚡ Symbol Commands (Development):
🚧 marathon_symbol_command      - სიმბოლური ბრძანებები

🔗 Integration (Planned):
🚧 marathon_integration_hub     - სხვა MCP tools-თან ინტეგრაცია
🚧 marathon_cloud_sync          - ღრუბლოვან სერვისებთან სინქრონიზაცია

📊 Analytics & Security (Planned):
🚧 marathon_analytics           - გამოყენების ანალიტიკა
🚧 marathon_security_check      - უსაფრთხოების შემოწმება
🚧 marathon_backup_restore      - backup/restore სისტემა
```

---

## 🚀 სწრაფი დაწყება / Quick Start

### ინსტალაცია / Installation

```bash
# რეპოზიტორიის კლონირება / Clone repository
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool

# დამოკიდებულებების ინსტალაცია / Install dependencies
npm install

# პროეკტის აშენება / Build project
npm run build

# ტესტირება / Testing
npm run marathon:test
```

### Claude Desktop კონფიგურაცია / Claude Desktop Configuration

Claude Desktop-ის `claude_desktop_config.json` ფაილში დაამატეთ:

```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["path/to/marathon-mcp-tool/dist/index.js"],
      "env": {
        "MARATHON_MODE": "development",
        "MARATHON_LANGUAGE": "georgian",
        "MARATHON_THEME": "batumi_sunset"
      }
    }
  }
}
```

### პირველი ტესტი / First Test

Claude Desktop-ში გამოსცადეთ:

```
marathon_test_connection
```

თუ ყველაფერი სწორადაა კონფიგურირებული, მიიღებთ:

```
🏃‍♂️ Marathon MCP Tool v1.0.0 Development Edition
🇬🇪 კავშირი წარმატებულია! / Connection successful!
🌊 ბათუმის შავი ზღვის ტალღებისგან მისალმება!
```

---

## ⚠️ Known Limitations / ცნობილი შეზღუდვები

### Current Development Status:
- ✅ Core system modules functional
- ✅ File system operations working
- ✅ Basic Git operations implemented
- 🚧 Advanced AI features in development
- 🚧 Symbol commands system in progress
- 🚧 Analytics and security features planned

### მიმდინარე განვითარების სტატუსი:
- ✅ ძირითადი სისტემური მოდულები ფუნქციონირებს
- ✅ ფაილების ოპერაციები მუშაობს  
- ✅ ძირითადი Git ოპერაციები განხორციელებული
- 🚧 გაფართოებული AI ფუნქციები განვითარების პროცესშია
- 🚧 სიმბოლური ბრძანებების სისტემა მიმდინარეობს
- 🚧 ანალიტიკა და უსაფრთხოების ფუნქციები დაგეგმილია

---

## 🛡️ უსაფრთხოება / Security

Marathon MCP Tool აქვს მრავალშრიანი უსაფრთხოების სისტემა:

- **🔐 File System Protection** - მხოლოდ ნებადართულ დირექტორიებზე წვდომა
- **🛡️ Command Validation** - ყველა ბრძანების ვალიდაცია
- **📝 Audit Logging** - სრული ქმედებების ლოგირება
- **🔒 Backup System** - ავტომატური backup-ები (planned)
- **⚠️ Confirmation Prompts** - საშიში ოპერაციების დადასტურება

---

## 🌊 ბათუმური ხელწერა / Batumi Style

Marathon MCP Tool შექმნილია **სიყვარულით ბათუმში, საქართველოში** 🇬🇪  
Marathon MCP Tool is created **with love in Batumi, Georgia** 🇬🇪

### ჩვენი ღირებულებები / Our Values:

- **🏔️ კავკასიონის მთების სიძლიერე** - მყარი და საიმედო
- **🌊 შავი ზღვის სისუფთავე** - სუფთა და ლამაზი კოდი
- **🍇 ქართული ტრადიციები** - ღირებულებების პატივისცემა
- **☕ ქართული ყავის ენერგია** - ენთუზიაზმი და მონდომება

---

## 🤝 წვლილი / Contributing

ღია წყაროების პროექტია და მოვიწვევთ კონტრიბუციას!  
This is an open source project and we welcome contributions!

### როგორ შეიძლება წვლილის შეტანა / How to contribute:

1. **🍴 Fork** - პროექტის fork-ი
2. **🌿 Branch** - ახალი feature branch-ის შექმნა
3. **💻 Code** - კოდის დაწერა ბათუმური ხელწერით
4. **🧪 Test** - ტესტების ჩატარება
5. **📝 PR** - Pull Request-ის შექმნა

### კონტრიბუციის წესები / Contribution Guidelines:

- **🇬🇪 ქართული კომენტარები** კოდში / Georgian comments in code
- **🌊 ბათუმური სტილი** - სუფთა და ლამაზი / Clean and beautiful
- **✅ ტესტების კოვერაჟი** - მინიმუმ 80% / Minimum 80% test coverage
- **📚 დოკუმენტაცია** - ყოველი ფუნქციისთვის / Documentation for every function

---

## 🐛 შეცდომების რეპორტი / Bug Reports

თუ შეცდომა გაგახვდათ / If you encounter a bug:

1. **🔍 შეამოწმეთ** [არსებული Issues](https://github.com/sitechfromgeorgia/marathon-mcp-tool/issues)
2. **📝 შექმენით ახალი Issue** დეტალური აღწერით
3. **🏷️ დაამატეთ მისაბმელი ლეიბლები**
4. **📋 თან დართეთ** ლოგები და კონფიგურაცია

---

## 🗺️ Roadmap / გეგმარი

### v1.1.0 - Q1 2025
- **✅ Core Functionality Stabilization** - ძირითადი ფუნქციონალის სტაბილიზაცია
- **🤖 Basic AI Enhancement** - ძირითადი AI ფუნქციების დამატება
- **🔧 Symbol Commands Implementation** - სიმბოლური ბრძანებების სისტემა

### v1.2.0 - Q2 2025
- **🌐 Multi-language Support Enhancement** - მრავალენოვანი მხარდაჭერის გაუმჯობესება
- **⚡ Performance Optimizations** - შესრულების ოპტიმიზაცია
- **📊 Basic Analytics** - ძირითადი ანალიტიკა

### v2.0.0 - Q3 2025 (Stable Release)
- **🚀 Full Feature Set** - სრული ფუნქციონალი
- **🧠 Advanced AI** - პროდვინული AI შესაძლებლობები
- **🏢 Enterprise Features** - კორპორაციული ფუნქციები

---

## 📄 ლიცენზია / License

MIT License - იხილეთ [LICENSE](LICENSE) ფაილი დეტალებისთვის.  
MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 კონტაქტი / Contact

- **🌐 Website**: [https://acura.ge](https://acura.ge)
- **📧 Email**: sitech.georgia@gmail.com
- **🐙 GitHub**: [@sitechfromgeorgia](https://github.com/sitechfromgeorgia)
- **🌊 Location**: ბათუმი, საქართველო 🇬🇪 / Batumi, Georgia 🇬🇪

---

<div align="center">

**🏃‍♂️ Marathon MCP Tool v1.0.0 - ერთი ხელსაწყო, ყველა შესაძლებლობა!**  
**🏃‍♂️ Marathon MCP Tool v1.0.0 - One tool, all possibilities!**

*🌊 შექმნილია სიყვარულით ბათუმში, საქართველოში* 🇬🇪  
*🌊 Created with love in Batumi, Georgia* 🇬🇪

*🏔️ კავკასიონის მთების სიძლიერითა და შავი ზღვის სისუფთავით*  
*🏔️ With the strength of Caucasus Mountains and the purity of Black Sea*

[![Star](https://img.shields.io/github/stars/sitechfromgeorgia/marathon-mcp-tool?style=social)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
[![Follow](https://img.shields.io/github/followers/sitechfromgeorgia?style=social)](https://github.com/sitechfromgeorgia)

**🚧 Development Phase - Coming Soon! 🚧**

</div>