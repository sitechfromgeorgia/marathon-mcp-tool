# 🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Made in Georgia](https://img.shields.io/badge/made%20in-🇬🇪%20Georgia-red.svg)](https://github.com/sitechfromgeorgia)

**ერთი ხელსაწყო - ყველა შესაძლებლობა!** 80+ ფუნქცია 8 კატეგორიაში. 🇬🇪 ქართული ინტერფეისი, ბათუმური ხელწერა.

## 🌟 მთავარი მახასიათებლები

### 📦 8 სრული მოდული
- **🔧 Core System** (10 ფუნქცია) - სისტემური მართვა და კონფიგურაცია
- **📁 File System** (10 ფუნქცია) - ფაილური სისტემის სრული მართვა
- **🔄 Git Repository** (10 ფუნქცია) - Git რეპოზიტორიის მენეჯმენტი
- **🧠 Memory Knowledge** (10 ფუნქცია) - მეხსიერება და ცოდნის ბაზა
- **⚙️ System Process** (10 ფუნქცია) - პროცესთა მართვა და მონიტორინგი
- **📚 Documentation** (10 ფუნქცია) - დოკუმენტაციის ავტომატიზაცია
- **🚀 Advanced Features** (20+ ფუნქცია) - დამატებითი ფუნქციონალი
- **📁 Enhanced Files** (10 ფუნქცია) - გაუმჯობესებული ფაილური ოპერაციები

### ✨ უნიკალური თვისებები
- 🇬🇪 **ბათუმური ხელწერა** - ქართული ინტერფეისი
- 🏃‍♂️ **Marathon Speed** - სწრაფი და ეფექტური
- 🌊 **Universal Edition** - ყველასთვის ხელმისაწვდომი
- 🎯 **80+ ფუნქცია** - ყოვლისმომცველი ფუნქციონალი

## 🚀 სწრაფი დაწყება

### 1. ინსტალაცია
```bash
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
npm install
npm run build
```

### 2. გაშვება
```bash
# MCP Server-ის გაშვება
npm start

# ან უშუალოდ
node dist/index.js
```

### 3. ტესტირება
```bash
# სწრაფი ტესტი
npm run marathon:test

# სრული ტესტ სუიტი
node test/marathon-test-suite.js
```

## 📖 მოდულების დეტალური აღწერა

### 🔧 Core System Module
სისტემური ფუნქციები და კონფიგურაცია:
- `marathon_test_connection` - კავშირის ტესტირება
- `marathon_get_status` - სისტემის სტატუსი
- `marathon_get_config` - კონფიგურაციის მიღება
- `marathon_set_config` - კონფიგურაციის განახლება
- `marathon_module_toggle` - მოდულების ჩართვა/გამორთვა
- `marathon_language_switch` - ენის შეცვლა
- და სხვა...

### 📁 File System Module
ფაილური სისტემის სრული მართვა:
- `marathon_smart_read` - ჭკვიანი ფაილის წაკითხვა
- `marathon_smart_write` - ჭკვიანი ფაილის ჩაწერა
- `marathon_file_analyze` - ფაილის ანალიზი
- `marathon_batch_process` - მრავალი ფაილის დამუშავება
- `marathon_file_compare` - ფაილების შედარება
- `marathon_search_advanced` - განვითარებული ძიება
- და სხვა...

### 🧠 Memory Knowledge Module
მეხსიერება და ცოდნის მენეჯმენტი:
- `marathon_memory_save` - ინფორმაციის შენახვა
- `marathon_memory_load` - ინფორმაციის ჩატვირთვა
- `marathon_memory_search` - მეხსიერებაში ძიება
- `marathon_kb_create_entities` - ცოდნის ერთეულების შექმნა
- `marathon_kb_search_nodes` - ცოდნის გრაფში ძიება
- და სხვა...

### 📚 Documentation Module
ავტომატური დოკუმენტაციის გენერაცია:
- `marathon_fetch_docs` - დოკუმენტაციის მიღება
- `marathon_search_docs` - დოკუმენტაციაში ძიება
- `marathon_generate_markdown` - Markdown გენერაცია
- `marathon_generate_summary` - რეზიუმეების შექმნა
- `marathon_translate_content` - თარგმანი
- და სხვა...

### 🚀 Advanced Features Module
20+ დამატებითი ფუნქცია:
- `marathon_smart_analyze` - AI ანალიზი
- `marathon_workflow_create` - Workflow-ების შექმნა
- `marathon_context_optimize` - კონტექსტის ოპტიმიზაცია
- `marathon_auto_resume` - ავტო-განახლება
- `marathon_cloud_sync` - ღრუბლოვან სინქრონიზაცია
- `marathon_backup_create` - ბექაპების შექმნა
- და კიდევ ბევრი...

## 🛠️ განვითარება

### პროექტის სტრუქტურა
```
marathon-mcp-tool/
├── src/                     # Source code
│   ├── modules/            # 8 მოდული
│   ├── config/             # კონფიგურაცია
│   └── utils/              # დამხმარე ფუნქციები
├── dist/                   # Compiled JavaScript
├── test/                   # ტესტები
├── examples/               # მაგალითები
└── docs/                   # დოკუმენტაცია
```

### Build პროცესი
```bash
# წვრილმანი build
npm run build

# სრული rebuild
npm run build:clean

# ტიპების შემოწმება
npm run check

# Watch mode
npm run watch
```

## 🤝 წვლილის შეტანა

მოდით ერთად გავხადოთ Marathon MCP Tool კიდევ უფრო მძლავრი! 

### როგორ დავრეკოთ წვლილი:
1. Fork Repository
2. Create Feature Branch
3. Make Changes
4. Submit Pull Request

### კოდის სტილი:
- TypeScript/JavaScript ES2022
- ქართული კომენტარები კოდში 🇬🇪
- ESLint + Prettier
- სწრაფი unit ტესტები

## 📄 ლიცენზია

MIT License - იხილეთ [LICENSE](LICENSE) ფაილი დეტალებისთვის.

## 👨‍💻 ავტორი

**SiTech from Georgia** 🇬🇪
- GitHub: [@sitechfromgeorgia](https://github.com/sitechfromgeorgia)
- Email: sitech.georgia@gmail.com
- Location: Batumi, Georgia 🌊

## 🙏 მადლობა

მადლობა ყველას ვისაც შეუძლია ხელი შეუწყოს ამ პროექტის განვითარებას!

---

<div align="center">

**🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition**

*ერთი ხელსაწყო - ყველა შესაძლებლობა!*

🇬🇪 Made with ❤️ in Batumi, Georgia 🌊

</div>