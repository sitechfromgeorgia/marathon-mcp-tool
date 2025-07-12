# 🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition

<div align="center">

**ერთი ხელსაწყო - ყველა შესაძლებლობა!**  
**80+ ფუნქცია 7 კატეგორიაში**

🇬🇪 **ქართული ინტერფეისი** | 🌊 **ბათუმური ხელწერა** | ⚡ **Universal Edition**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Georgian](https://img.shields.io/badge/ქართული-interface-red.svg)](#)
[![Batumi](https://img.shields.io/badge/🌊-ბათუმური_ხელწერა-blue.svg)](#)

*🏔️ კავკასიონის მთების სიძლიერით და შავი ზღვის სისუფთავით*

</div>

---

## 🌟 მთავარი მახასიათებლები

- **🎛️ მოსანიშნი მოდულური სისტემა** - ყველა მოდული ცალ-ცალკე ჩარ/თის შესაძლებლობით
- **⚡ 80+ ფუნქცია 7 კატეგორიაში** - სრული ეკოსისტემა AI ასისტენტისთვის
- **🇬🇪 სრული ქართული ინტერფეისი** - ყველა ფუნქცია ქართულ ენაზე
- **🌊 ბათუმური ხელწერა** - სიყვარულით შექმნილი საქართველოში
- **⚙️ სმარტ კონფიგურაცია** - მოიწყობება თქვენს საჭიროებაზე
- **🔧 სიმბოლური ბრძანებები** - სწრაფი წვდომა (---, +++, ..., ***, ###, @@@)

---

## 📋 მოდულური სისტემა

### 🔧 1. Core System (ძირითადი სისტემა)
```
✅ marathon_test_connection     - კავშირის ტესტირება
✅ marathon_get_config          - კონფიგურაციის ნახვა
✅ marathon_set_config          - კონფიგურაციის ცვლილება
✅ marathon_module_toggle       - მოდულების ჩართვა/გამორთვა
✅ marathon_get_status          - სისტემის სტატუსი
✅ marathon_language_switch     - ენის ცვლილება (ქართული/English)
```

### 📁 2. File System Management (ფაილების მენეჯმენტი)
```
📖 Read Operations:
✅ marathon_read_file           - ფაილის წაკითხვა
✅ marathon_read_multiple_files - მრავალი ფაილის წაკითხვა
✅ marathon_get_file_info       - ფაილის ინფორმაცია

✏️ Write Operations:
✅ marathon_write_file          - ფაილში ჩაწერა
✅ marathon_edit_file           - ფაილის რედაქტირება
✅ marathon_edit_block          - ბლოკური რედაქტირება

📂 Directory Management:
✅ marathon_create_directory    - დირექტორიის შექმნა
✅ marathon_list_directory      - დირექტორიის სია
✅ marathon_directory_tree      - დირექტორიის ხე
✅ marathon_move_file           - ფაილის გადატანა

🔍 Search Operations:
✅ marathon_search_files        - ფაილების ძიება
✅ marathon_search_code         - კოდის ძიება
✅ marathon_allowed_directories - ნებადართული დირექტორიები
```

### 🐙 3. Git & Repository Management (Git რეპოზიტორიები)
```
📚 Repository Operations:
✅ marathon_git_create_repo     - რეპოზიტორიის შექმნა
✅ marathon_git_search_repos    - რეპოზიტორიების ძიება
✅ marathon_git_fork_repo       - რეპოზიტორიის ფორკი

📄 File Operations:
✅ marathon_git_get_file        - ფაილის მიღება GitHub-დან
✅ marathon_git_create_file     - ფაილის შექმნა/განახლება
✅ marathon_git_push_files      - ფაილების push-ი

🌿 Branch Management:
✅ marathon_git_create_branch   - ბრენჩის შექმნა
✅ marathon_git_list_commits    - კომიტების სია

🔀 Pull Requests:
✅ marathon_git_create_pr       - Pull Request-ის შექმნა
✅ marathon_git_merge_pr        - Pull Request-ის მერჯი
✅ marathon_git_review_pr       - Pull Request-ის განხილვა
✅ marathon_git_pr_status       - Pull Request-ის სტატუსი

🐛 Issues Management:
✅ marathon_git_create_issue    - Issue-ის შექმნა
✅ marathon_git_update_issue    - Issue-ის განახლება
✅ marathon_git_list_issues     - Issue-ების სია

🔍 Advanced Search:
✅ marathon_git_search_code     - კოდის ძიება
✅ marathon_git_search_issues   - Issue-ების ძიება
✅ marathon_git_search_users    - მომხმარებლების ძიება
```

### 🧠 4. Memory & Knowledge Management (მეხსიერება და ცოდნა)
```
💾 Simple Memory:
✅ marathon_memory_save         - ინფორმაციის შენახვა
✅ marathon_memory_load         - ინფორმაციის ჩატვირთვა
✅ marathon_memory_list         - მეხსიერების სია

🕸️ Knowledge Graph:
✅ marathon_kb_create_entities  - ენტითების შექმნა
✅ marathon_kb_create_relations - კავშირების შექმნა
✅ marathon_kb_add_observations - დაკვირვებების დამატება
✅ marathon_kb_search_nodes     - ნოუდების ძიება
✅ marathon_kb_read_graph       - მთლიანი გრაფის წაკითხვა
✅ marathon_kb_delete_entities  - ენტითების წაშლა
✅ marathon_kb_delete_relations - კავშირების წაშლა
```

### ⚙️ 5. System & Process Management (სისტემა და პროცესები)
```
💻 Command Execution:
✅ marathon_execute_command     - ბრძანების შესრულება
✅ marathon_read_output         - შედეგის წაკითხვა
✅ marathon_force_terminate     - ძალით შეწყვეტა

📊 Process Management:
✅ marathon_list_processes      - პროცესების სია
✅ marathon_kill_process        - პროცესის დაკვლა
✅ marathon_list_sessions       - სესიების სია

⚙️ System Configuration:
✅ marathon_get_system_config   - სისტემის კონფიგურაცია
✅ marathon_set_system_config   - კონფიგურაციის ცვლილება
```

### 📚 6. Documentation & Content (დოკუმენტაცია და კონტენტი)
```
📖 Documentation Access:
✅ marathon_fetch_docs          - დოკუმენტაციის მიღება
✅ marathon_search_docs         - დოკუმენტაციაში ძიება

🌐 Web Content:
✅ marathon_fetch_url_content   - URL კონტენტის მიღება
✅ marathon_web_scraping        - ვებ საიტების scraping

🎨 Content Generation:
✅ marathon_generate_markdown   - Markdown-ის გენერაცია
✅ marathon_export_content      - კონტენტის ექსპორტი
```

### 🚀 7. Advanced Features (გაფართოებული ფუნქციები)
```
🤖 AI-Powered:
✅ marathon_smart_execute       - AI-powered ბრძანების შესრულება
✅ marathon_ai_assistant        - ინტელექტუალური დამხმარე
✅ marathon_workflow_create     - workflows-ის შექმნა

⚡ Symbol Commands:
✅ marathon_symbol_command      - სიმბოლური ბრძანებები
                                (---, +++, ..., ***, ###, @@@)

🔗 Integration:
✅ marathon_integration_hub     - სხვა MCP tools-თან ინტეგრაცია
✅ marathon_cloud_sync          - ღრუბლოვან სერვისებთან სინქრონიზაცია

📊 Analytics & Security:
✅ marathon_analytics           - გამოყენების ანალიტიკა
✅ marathon_security_check      - უსაფრთხოების შემოწმება
✅ marathon_backup_restore      - backup/restore სისტემა
```

---

## 🚀 სწრაფი დაწყება

### ინსტალაცია

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

### Claude Desktop კონფიგურაცია

Claude Desktop-ის `claude_desktop_config.json` ფაილში დაამატეთ:

```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["path/to/marathon-mcp-tool/dist/index.js"],
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "georgian",
        "MARATHON_THEME": "batumi_sunset"
      }
    }
  }
}
```

### პირველი ტესტი

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

---

## ⚡ სიმბოლური ბრძანებები

Marathon MCP Tool აქვს უნიკალური სიმბოლური ბრძანებების სისტემა:

| სიმბოლო | ფუნქცია | აღწერა |
|---------|---------|---------|
| `---` | სისტემის restart | კონტექსტის ჩატვირთვა და restart |
| `+++` | კომპლექსური ტასკი | AI-powered complex task execution |
| `...` | ინფორმაციის შენახვა | მეხსიერებაში ინფორმაციის შენახვა |
| `***` | მარათონ რეჟიმი | ხანგრძლივი ტასკების მენეჯმენტი |
| `###` | კონფიგურაცია | სისტემის კონფიგურაციის ცვლილება |
| `@@@` | ინტეგრაცია | სხვა სისტემებთან სწრაფი კავშირი |

### გამოყენების მაგალითები:

```bash
# სისტემის სტატუსის შემოწმება
marathon_get_status

# ფაილის წაკითხვა
marathon_read_file /path/to/file.txt

# GitHub რეპოზიტორიის შექმნა
marathon_git_create_repo my-awesome-project

# სიმბოლური ბრძანება
marathon_symbol_command +++
```

---

## ⚙️ კონფიგურაცია

### ძირითადი კონფიგურაცია

```json
{
  "version": "2.0.0",
  "edition": "universal",
  "language": "georgian",
  "theme": "batumi_sunset",
  "performance_mode": "balanced",
  "auto_backup": true,
  "security_level": "standard"
}
```

### მოდულების კონფიგურაცია

```bash
# მოდულის ჩართვა
marathon_module_toggle file_system true

# მოდულის გამორთვა  
marathon_module_toggle git_repository false

# ყველა მოდულის სტატუსი
marathon_get_status --detailed
```

### ენის ცვლილება

```bash
# ქართულზე გადასვლა
marathon_language_switch georgian

# ინგლისურზე გადასვლა
marathon_language_switch english
```

---

## 🛡️ უსაფრთხოება

Marathon MCP Tool აქვს მრავალშრიანი უსაფრთხოების სისტემა:

- **🔐 File System Protection** - მხოლოდ ნებადართულ დირექტორიებზე წვდომა
- **🛡️ Command Validation** - ყველა ბრძანების ვალიდაცია
- **📝 Audit Logging** - სრული ქმედებების ლოგირება
- **🔒 Backup System** - ავტომატური backup-ები
- **⚠️ Confirmation Prompts** - საშიში ოპერაციების დადასტურება

### უსაფრთხოების შემოწმება

```bash
marathon_security_check
```

---

## 📊 ანალიტიკა და მონიტორინგი

### სისტემის სტატისტიკა

```bash
# მთლიანი სტატისტიკა
marathon_get_status --detailed

# გამოყენების ანალიტიკა
marathon_analytics

# მეხსიერების სტატისტიკა
marathon_memory_list
```

### შესაძლებლობების მონიტორინგი

- **📈 Usage Statistics** - ფუნქციების გამოყენების ანალიტიკა
- **⏱️ Performance Metrics** - სისწრაფის მეტრიკები
- **🔍 Error Tracking** - შეცდომების ტრეკინგი
- **💾 Memory Usage** - მეხსიერების გამოყენება

---

## 🔗 ინტეგრაციები

Marathon MCP Tool ეუღებს თანამშრომლობას სხვა MCP tools-თან:

### მხარდაჭერილი ინტეგრაციები

- **🗂️ @modelcontextprotocol/server-filesystem** - File operations
- **🐙 GitHub MCP** - Git repository management  
- **🧠 Memory MCP** - Persistent memory
- **⚙️ Desktop Commander** - System operations
- **📚 Documentation MCP** - Documentation access

### კასტომ ინტეგრაციები

```bash
# ინტეგრაციების ჰაბი
marathon_integration_hub

# ღრუბლოვანი სერვისები
marathon_cloud_sync
```

---

## 🌊 ბათუმური ხელწერა

Marathon MCP Tool შექმნილია **სიყვარულით ბათუმში, საქართველოში** 🇬🇪

### ჩვენი ღირებულებები:

- **🏔️ კავკასიონის მთების სიძლიერე** - მყარი და საიმედო
- **🌊 შავი ზღვის სისუფთავე** - სუფთა და ლამაზი კოდი
- **🍇 ქართული ტრადიციები** - ღირებულებების პატივისცემა
- **☕ ქართული ყავის ენერგია** - ენთუზიაზმი და მონდომება

---

## 🤝 წვლილი

ღია წყაროების პროექტია და მოვიწვევთ კონტრიბუციას!

### როგორ შეიძლება წვლილის შეტანა:

1. **🍴 Fork** - პროექტის fork-ი
2. **🌿 Branch** - ახალი feature branch-ის შექმნა
3. **💻 Code** - კოდის დაწერა ბათუმური ხელწერით
4. **🧪 Test** - ტესტების ჩატარება
5. **📝 PR** - Pull Request-ის შექმნა

### კონტრიბუციის წესები:

- **🇬🇪 ქართული კომენტარები** კოდში
- **🌊 ბათუმური სტილი** - სუფთა და ლამაზი
- **✅ ტესტების კოვერაჟი** - მინიმუმ 80%
- **📚 დოკუმენტაცია** - ყოველი ფუნქციისთვის

---

## 🐛 შეცდომების რეპორტი

თუ შეცდომა გაგახვდათ:

1. **🔍 შეამოწმეთ** [არსებული Issues](https://github.com/sitechfromgeorgia/marathon-mcp-tool/issues)
2. **📝 შექმენით ახალი Issue** დეტალური აღწერით
3. **🏷️ დაამატეთ მისაბმელი ლეიბლები**
4. **📋 თან დართეთ** ლოგები და კონფიგურაცია

---

## 🗺️ დაგეგმილი ფუნქციები

### v2.1.0 - Q1 2025
- **🤖 AI Enhancement** - გაუმჯობესებული AI ფუნქციები
- **🌐 Multi-language Support** - მრავალენოვანი მხარდაჭერა
- **⚡ Performance Optimizations** - შესრულების ოპტიმიზაცია

### v2.2.0 - Q2 2025
- **👥 Collaboration Features** - გუნდური მუშაობის ფუნქციები
- **☁️ Cloud Integration** - ღრუბლოვანი ინტეგრაციები
- **📱 Mobile Support** - მობილური მხარდაჭერა

### v3.0.0 - Q3 2025
- **🧠 Advanced AI** - პროდვინული AI შესაძლებლობები
- **🌍 Global Platform** - გლობალური პლატფორმა
- **🏢 Enterprise Features** - კორპორაციული ფუნქციები

---

## 📄 ლიცენზია

MIT License - იხილეთ [LICENSE](LICENSE) ფაილი დეტალებისთვის.

---

## 📞 კონტაქტი

- **🌐 Website**: [https://acura.ge](https://acura.ge)
- **📧 Email**: sitech.georgia@gmail.com
- **🐙 GitHub**: [@sitechfromgeorgia](https://github.com/sitechfromgeorgia)
- **🌊 Location**: ბათუმი, საქართველო 🇬🇪

---

<div align="center">

**🏃‍♂️ Marathon MCP Tool - ერთი ხელსაწყო, ყველა შესაძლებლობა!**

*🌊 შექმნილია სიყვარულით ბათუმში, საქართველოში* 🇬🇪

*🏔️ კავკასიონის მთების სიძლიერითა და შავი ზღვის სისუფთავით*

[![Star](https://img.shields.io/github/stars/sitechfromgeorgia/marathon-mcp-tool?style=social)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
[![Follow](https://img.shields.io/github/followers/sitechfromgeorgia?style=social)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)

</div>