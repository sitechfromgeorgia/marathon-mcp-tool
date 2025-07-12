# 🏃‍♂️ Marathon MCP Tool v1.0.0 - Windows Compatible Edition

<div align="center">

**ერთი ხელსაწყო - ყველა შესაძლებლობა! / One tool - all possibilities!**  
**Georgian Interface with Windows Compatibility**

🇬🇪 **ქართული ინტერფეისი / Georgian Interface** | 🌊 **ბათუმური ხელწერა / Batumi Style** | 🪟 **Windows Compatible**

[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Georgian](https://img.shields.io/badge/ქართული-interface-red.svg)](#)
[![Windows](https://img.shields.io/badge/🪟-Windows_Compatible-blue.svg)](#)
[![Status](https://img.shields.io/badge/status-stable-green.svg)](#)

*🏔️ კავკასიონის მთების სიძლიერით და შავი ზღვის სისუფთავით*  
*🏔️ With the strength of Caucasus Mountains and the purity of Black Sea*

</div>

---

## 🌟 Overview | მიმოხილვა

**Marathon MCP Tool** is a powerful, bilingual (Georgian/English) Model Context Protocol (MCP) server that provides seamless integration between AI assistants and system operations. Built with love in Batumi, Georgia, this tool offers a unique Georgian interface while maintaining full Windows compatibility.

**მარათონ MCP ხელსაწყო** არის ძლიერი, ორენოვანი (ქართული/ინგლისური) მოდელის კონტექსტის პროტოკოლის (MCP) სერვერი, რომელიც უზრუნველყოფს უწყვეტ ინტეგრაციას AI ასისტენტებსა და სისტემურ ოპერაციებს შორის. შექმნილია სიყვარულით ბათუმში, საქართველოში.

### ✨ Key Features | ძირითადი ფუნქციები

- **🇬🇪 Native Georgian Interface** - Full Georgian language support / სრული ქართული ენის მხარდაჭერა
- **🪟 Windows Compatible** - Optimized for Windows environments / Windows-ის გარემოზე ოპტიმიზებული  
- **🔧 5 Core Functions** - Essential operations ready to use / 5 ძირითადი ფუნქცია მზადაა გამოსაყენებლად
- **💾 Simple Memory** - Built-in data storage system / ჩაშენებული მონაცემების შენახვის სისტემა
- **🌊 Batumi Style** - Designed with Georgian aesthetics / ქართული ესთეტიკით დიზაინი
- **⚡ Fast & Stable** - Lightweight and reliable / მსუბუქი და საიმედო

---

## 🚀 Quick Start | სწრაფი დაწყება

### Prerequisites | პირობები
- **Node.js 18+** 
- **Windows 10/11** (recommended / რეკომენდებული)
- **Claude Desktop** or compatible MCP client

### Installation | ინსტალაცია

1. **Clone the repository / რეპოზიტორიის კლონირება:**
```bash
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
```

2. **Install dependencies / დამოკიდებულებების ინსტალაცია:**
```bash
npm install
```

3. **Build the project / პროექტის აშენება:**
```bash
npm run build
```

4. **Test the installation / ინსტალაციის ტესტირება:**
```bash
npm run marathon:test
```

### Configuration | კონფიგურაცია

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["C:\\path\\to\\marathon-mcp-tool\\dist\\index.js"],
      "env": {
        "MARATHON_LANGUAGE": "georgian",
        "NODE_ENV": "production"
      }
    }
  }
}
```

---

## 🛠️ Available Functions | ხელმისაწვდომი ფუნქციები

### 1. 🔧 Connection Test | კავშირის ტესტი
```
marathon_test_connection
```
- Tests the MCP connection and system status
- კავშირისა და სისტემის სტატუსის ტესტირება

### 2. 💾 Simple Memory | მარტივი მეხსიერება  
```
marathon_simple_memory
```
- Store, retrieve, and manage data
- მონაცემების შენახვა, ამოღება და მართვა
- Actions: `save`, `load`, `list`, `clear`

### 3. 🏥 Health Check | ჯანმრთელობის შემოწმება
```
marathon_health_check  
```
- System diagnostics and performance metrics
- სისტემის დიაგნოსტიკა და შესრულების მეტრიკები

### 4. ⚙️ Configuration | კონფიგურაცია
```
marathon_get_config
```
- View current tool configuration
- მიმდინარე ხელსაწყოს კონფიგურაციის ნახვა

### 5. 🌐 Language Switch | ენის ცვლილება
```
marathon_language_switch
```
- Switch between Georgian and English
- ქართულსა და ინგლისურს შორის გადართვა
- Options: `georgian`, `english`, `auto`

---

## 💡 Usage Examples | გამოყენების მაგალითები

### Basic Connection Test | ძირითადი კავშირის ტესტი
```javascript
// Test the connection
marathon_test_connection({
  message: "Hello from Batumi!"
})
```

### Memory Operations | მეხსიერების ოპერაციები
```javascript
// Save data / მონაცემების შენახვა
marathon_simple_memory({
  action: "save",
  key: "project_info",
  data: "Marathon MCP Tool project details"
})

// Load data / მონაცემების ჩატვირთვა  
marathon_simple_memory({
  action: "load",
  key: "project_info"
})

// List all keys / ყველა გასაღების სია
marathon_simple_memory({
  action: "list"
})
```

### Language Switching | ენის ცვლილება
```javascript
// Switch to Georgian / ქართულზე გადართვა
marathon_language_switch({
  language: "georgian"
})

// Switch to English / ინგლისურზე გადართვა
marathon_language_switch({
  language: "english"
})
```

---

## 🔧 Development | განვითარება

### Scripts | სკრიპტები
```bash
npm run build          # Build TypeScript to JavaScript
npm run dev            # Run in development mode  
npm run test           # Run tests
npm run marathon:test  # Test Marathon functionality
npm run clean          # Clean build directory
npm run watch          # Watch for changes
```

### Project Structure | პროექტის სტრუქტურა
```
marathon-mcp-tool/
├── src/
│   └── index.ts       # Main server file
├── dist/              # Compiled JavaScript
├── package.json       # Dependencies and scripts  
├── tsconfig.json      # TypeScript configuration
└── README.md          # This file
```

---

## 🌊 Georgian Interface Features | ქართული ინტერფეისის ფუნქციები

The Marathon MCP Tool provides native Georgian language support with:

- **Bilingual responses** - All functions return both Georgian and English text
- **Georgian command descriptions** - Native language interface  
- **Cultural context** - Batumi and Georgian references throughout
- **Unicode safety** - Windows-compatible Georgian text rendering

მარათონ MCP ხელსაწყო უზრუნველყოფს ქართული ენის მხარდაჭერას:

- **ორენოვანი პასუხები** - ყველა ფუნქცია აბრუნებს ქართულ და ინგლისურ ტექსტს
- **ქართული ბრძანებების აღწერა** - მშობლიური ენის ინტერფეისი
- **კულტურული კონტექსტი** - ბათუმისა და საქართველოს მინიშნებები
- **Unicode უსაფრთხოება** - Windows-თან თავსებადი ქართული ტექსტის რენდერინგი

---

## 🛡️ Windows Compatibility | Windows-თან თავსებადობა

This version specifically addresses Windows compatibility issues:

- **UTF-8 Encoding** - Proper Unicode handling for Georgian text
- **JSON Parsing** - Safe JSON operations without Unicode errors  
- **Process Management** - Windows-optimized process handling
- **Error Handling** - Graceful fallbacks for Windows-specific issues
- **Safe Logging** - Console output that works reliably on Windows

ეს ვერსია სპეციალურად წყვეტს Windows-თან თავსებადობის პრობლემებს:

- **UTF-8 კოდირება** - ქართული ტექსტის სწორი Unicode დამუშავება
- **JSON ანალიზი** - Unicode შეცდომების გარეშე JSON ოპერაციები
- **პროცესების მართვა** - Windows-ზე ოპტიმიზებული პროცესების დამუშავება
- **შეცდომების დამუშავება** - Windows-ის სპეციფიკური პრობლემების შემთხვევაში მსუბუქი დაბრუნება

---

## 🏔️ About Georgia | საქართველოს შესახებ

This project is proudly created in **Batumi, Georgia** 🇬🇪 - a beautiful coastal city on the Black Sea. The tool reflects Georgian culture and language while providing world-class functionality.

**Batumi** (ბათუმი) is known for:
- Beautiful Black Sea coastline / ლამაზი შავი ზღვის სანაპირო
- Modern architecture and ancient culture / თანამედროვე არქიტექტურა და ძველი კულტურა  
- Warm Georgian hospitality / თბილი ქართული სტუმარმოყვარეობა
- Bridge between Europe and Asia / ხიდი ევროპასა და აზიას შორის

---

## 📝 License | ლიცენზია

MIT License - Feel free to use, modify, and distribute.

---

## 🤝 Contributing | წვლილი

Contributions are welcome! Please feel free to submit issues and pull requests.

წვლილი მიღებული იქნება სიამოვნებით! გთხოვთ, თავისუფლად წარადგინოთ პრობლემები და pull request-ები.

### Guidelines | მითითებები
- Maintain bilingual (Georgian/English) support
- Follow existing code style  
- Test on Windows environments
- Respect Georgian cultural elements

---

## 📞 Support | მხარდაჭერა

- **GitHub Issues**: [Report bugs or request features](https://github.com/sitechfromgeorgia/marathon-mcp-tool/issues)
- **Email**: sitech.georgia@gmail.com
- **Location**: Batumi, Georgia 🇬🇪

---

<div align="center">

**Made with ❤️ in Batumi, Georgia**  
**შექმნილია ❤️-ით ბათუმში, საქართველოში**

*🌊 From the shores of the Black Sea to the world / შავი ზღვის ნაპირებიდან მთელ მსოფლიოში*

</div>
