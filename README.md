# 🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition

## 🎉 **STATUS: PRODUCTION READY - ALL MODULES DEPLOYED!** 
**✅ Complete functional product with 11 tools across 7 modules!**  
**🇬🇪 ბათუმური ხელწერით შექმნილი სიყვარულით - Created with love in Batumi!**

---

## 🌟 **What's New in v2.0.0**

- 🆕 **7 Complete Modules** - All functional and tested
- ⚡ **11 Production Tools** - Ready for immediate use
- 🇬🇪 **Full Georgian Interface** - Beautiful native language support
- 🌊 **Batumi Theme** - Elegant coastal design philosophy
- 🧠 **Memory & Knowledge System** - Session persistence and context management
- 📦 **ES Module Format** - Modern JavaScript architecture
- 🚀 **Zero Compilation Errors** - Production-ready codebase

---

## 🇬🇪 ქართული აღწერა

**Marathon MCP Tool v2.0.0** არის სრული ფუნქციონალის Model Context Protocol (MCP) ხელსაწყო Claude AI-სთვის. ეს არის ერთი უნივერსალური ხელსაწყო ყველა შესაძლებლობით.

### ✨ მთავარი თავისებურებები

- 🇬🇪 **ქართული ინტერფეისი** - სრული ქართული ენის მხარდაჭერა
- 🌊 **ბათუმური ხელწერა** - შექმნილია სიყვარულით ბათუმში
- 🔧 **7 მოდული** - სრული ფუნქციონალით
- ⚡ **11 ინსტრუმენტი** - ყველა საჭირო ხელსაწყო
- 🧠 **მეხსიერების სისტემა** - სესიების შენახვა და გაგრძელება
- 🎯 **უნივერსალური რეჟიმი** - ყველაფერი ერთ პაკეტში

### 🏗️ მოდულები და ინსტრუმენტები

1. **📚 დოკუმენტაცია** (1 ინსტრუმენტი)
   - `marathon_get_help` - დახმარების ინფორმაცია

2. **🏃‍♂️ ძირითადი სისტემა** (2 ინსტრუმენტი)
   - `marathon_test_connection` - კავშირის ტესტირება
   - `marathon_get_status` - სისტემის სტატუსი

3. **📁 ფაილური სისტემა** (2 ინსტრუმენტი)
   - `marathon_read_file` - ფაილის წაკითხვა
   - `marathon_list_directory` - დირექტორიის სია

4. **🐙 Git რეპოზიტორია** (1 ინსტრუმენტი)
   - `marathon_git_status` - Git სტატუსი

5. **💻 სისტემური პროცესები** (1 ინსტრუმენტი)
   - `marathon_system_info` - სისტემური ინფორმაცია

6. **⚡ გაფართოებული ფუნქციები** (1 ინსტრუმენტი)
   - `marathon_symbol_command` - სიმბოლური ბრძანებები

7. **🧠 მეხსიერება და ცოდნა** (3 ინსტრუმენტი)
   - `marathon_simple_memory` - მარტივი მეხსიერება
   - `marathon_knowledge_store` - ცოდნის შენახვა
   - `marathon_session_context` - სესიის კონტექსტი

---

## 🇬🇧 English Description

**Marathon MCP Tool v2.0.0** is a complete functional Model Context Protocol (MCP) tool for Claude AI. It's one universal tool with all capabilities included.

### ✨ Key Features

- 🇬🇪 **Georgian Interface** - Full native language support
- 🌊 **Batumi Craftsmanship** - Created with love in Batumi, Georgia
- 🔧 **7 Modules** - Complete functionality coverage
- ⚡ **11 Tools** - All essential functions included
- 🧠 **Memory System** - Session persistence and context management
- 🎯 **Universal Mode** - Everything in one package

### 🏗️ Modules and Tools

1. **📚 Documentation Module** (1 tool)
   - `marathon_get_help` - Get help information

2. **🏃‍♂️ Core System Module** (2 tools)
   - `marathon_test_connection` - Test connection and system status
   - `marathon_get_status` - Get comprehensive system status

3. **📁 File System Module** (2 tools)
   - `marathon_read_file` - Read file contents
   - `marathon_list_directory` - List directory contents

4. **🐙 Git Repository Module** (1 tool)
   - `marathon_git_status` - Get Git repository status

5. **💻 System Process Module** (1 tool)
   - `marathon_system_info` - Get system information

6. **⚡ Advanced Features Module** (1 tool)
   - `marathon_symbol_command` - Process symbol commands (---, +++, etc.)

7. **🧠 Memory Knowledge Module** (3 tools)
   - `marathon_simple_memory` - Simple memory operations (save/load/list)
   - `marathon_knowledge_store` - Knowledge storage and search
   - `marathon_session_context` - Session context management

---

## 🛠️ Quick Installation Guide

### 📋 Prerequisites
- **Node.js** ≥ 18.0.0
- **Claude Desktop** application installed
- **Git** (for cloning the repository)

### 🚀 5-Minute Setup

1. **Clone the repository:**
```bash
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
```

2. **Install dependencies:**
```bash
npm install
```

3. **The dist folder is already built and ready!** ✅
   - No compilation needed - production files included
   - All modules are pre-built in ES format

4. **Configure Claude Desktop:**

**Windows users** - Edit: `%APPDATA%\Claude\claude_desktop_config.json`  
**Mac users** - Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["C:\\path\\to\\marathon-mcp-tool\\dist\\index.js"],
      "cwd": "C:\\path\\to\\marathon-mcp-tool",
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "georgian",
        "MARATHON_THEME": "batumi_sunset",
        "NODE_ENV": "production"
      }
    }
  }
}
```

**🔑 Important:** Replace `C:\\path\\to\\marathon-mcp-tool` with your actual path!

5. **Restart Claude Desktop** and test:
   - Try: "Test Marathon MCP connection"
   - Or use any of the 11 tools directly!

### ✅ Verification

Test that everything works:
```
marathon_test_connection with message "Hello from Batumi!"
```

You should see a beautiful Georgian response confirming the tool is working! 🎉

---

## 📖 Complete Tool Reference

### 🏃‍♂️ Core System Tools

#### `marathon_test_connection`
**Purpose:** Test connection and system status  
**Parameters:** 
- `message` (optional) - Test message

**Example:**
```
marathon_test_connection with message "Testing from Claude!"
```

#### `marathon_get_status` 
**Purpose:** Get comprehensive system status  
**Parameters:** None

**Example:**
```
marathon_get_status
```

### 📁 File System Tools

#### `marathon_read_file`
**Purpose:** Read file contents  
**Parameters:**
- `path` (required) - File path

**Example:**
```
marathon_read_file with path "C:\\Users\\YourName\\Documents\\test.txt"
```

#### `marathon_list_directory`
**Purpose:** List directory contents  
**Parameters:**
- `path` (required) - Directory path

**Example:**
```
marathon_list_directory with path "C:\\Users\\YourName\\Documents"
```

### 🧠 Memory & Knowledge Tools

#### `marathon_simple_memory`
**Purpose:** Simple memory operations  
**Parameters:**
- `action` (required) - save, load, list, clear
- `key` (for save/load) - Memory key
- `data` (for save) - Data to save

**Examples:**
```
marathon_simple_memory with action "save", key "my_notes", data "Important information here"
marathon_simple_memory with action "load", key "my_notes"
marathon_simple_memory with action "list"
```

#### `marathon_knowledge_store`
**Purpose:** Knowledge storage and search  
**Parameters:**
- `action` (required) - store, search, get_all
- `topic` (for store) - Knowledge topic
- `content` (for store) - Content to store
- `query` (for search) - Search query

**Examples:**
```
marathon_knowledge_store with action "store", topic "AI_Tips", content "Useful AI prompting techniques"
marathon_knowledge_store with action "search", query "AI"
```

#### `marathon_session_context`
**Purpose:** Session context management  
**Parameters:**
- `action` (required) - save_context, load_context, clear_context
- `context_data` (for save) - Context to save

**Examples:**
```
marathon_session_context with action "save_context", context_data "Working on project X, completed steps 1-3"
marathon_session_context with action "load_context"
```

### 🐙 Git Tools

#### `marathon_git_status`
**Purpose:** Get Git repository status  
**Parameters:**
- `path` (optional) - Repository path

**Example:**
```
marathon_git_status with path "C:\\path\\to\\your\\repo"
```

### 💻 System Tools

#### `marathon_system_info`
**Purpose:** Get system information  
**Parameters:** None

**Example:**
```
marathon_system_info
```

### ⚡ Advanced Tools

#### `marathon_symbol_command`
**Purpose:** Process symbol commands  
**Parameters:**
- `command` (required) - Symbol command (---, +++, etc.)

**Example:**
```
marathon_symbol_command with command "+++"
```

### 📚 Documentation Tools

#### `marathon_get_help`
**Purpose:** Get help information  
**Parameters:**
- `topic` (optional) - Help topic

**Example:**
```
marathon_get_help with topic "memory"
```

---

## 🔧 Advanced Configuration

### Environment Variables

```bash
MARATHON_MODE=universal          # Operation mode
MARATHON_LANGUAGE=georgian       # Interface language  
MARATHON_THEME=batumi_sunset     # Visual theme
NODE_ENV=production             # Environment
```

### Custom Configuration File

Create `marathon-config.json` in the project root:
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

---

## 🐛 Troubleshooting

### Common Issues & Solutions

1. **"Server disconnected" error:**
   - ✅ Check path in Claude config is correct
   - ✅ Ensure Node.js ≥ 18.0.0 is installed
   - ✅ Verify all files are in dist/ folder
   - ✅ Use absolute paths in configuration

2. **"Module not found" errors:**
   - ✅ Run `npm install` to ensure dependencies
   - ✅ Check that dist/modules/ folder exists
   - ✅ Verify file permissions

3. **Georgian text not displaying:**
   - ✅ Ensure UTF-8 encoding in terminal
   - ✅ Check MARATHON_LANGUAGE environment variable
   - ✅ Restart Claude Desktop after config changes

4. **Memory functions not working:**
   - ✅ Check that memory module is loaded
   - ✅ Verify sufficient disk space
   - ✅ Ensure proper permissions for file operations

### Debug Mode

Enable detailed logging:
```json
{
  "env": {
    "MARATHON_MODE": "universal",
    "MARATHON_LANGUAGE": "georgian", 
    "MARATHON_THEME": "batumi_sunset",
    "NODE_ENV": "development",
    "DEBUG": "marathon:*"
  }
}
```

### Getting Help

- 🐛 **GitHub Issues:** [Report Issues](https://github.com/sitechfromgeorgia/marathon-mcp-tool/issues)
- 📧 **Email:** sitech.georgia@gmail.com
- 📚 **Documentation:** Use `marathon_get_help` tool
- 🇬🇪 **Georgian Support:** Full native language assistance

---

## 🌊 About Batumi Philosophy

This tool embodies the spirit of Batumi - Georgia's beautiful coastal city where the Caucasus Mountains meet the Black Sea. Like the eternal dance of waves and mountains, Marathon MCP Tool brings together power and elegance, tradition and innovation.

**"ღია ზღვის ტალღებისგან ახალი ტექნოლოგიები"**  
*"New technologies from the open sea waves"*

---

## 🎯 Version History

### v2.0.0 (July 2025) - Universal Edition ✅
- **🎉 Complete Production Release**
- ✅ All 7 modules fully functional
- ✅ 11 tools tested and working
- ✅ Georgian interface perfected
- ✅ Memory & knowledge system operational  
- ✅ ES Module format implemented
- ✅ Zero compilation errors
- ✅ Ready for immediate use

### v1.x.x - Development Versions
- Initial prototypes and testing versions

---

## 🤝 Contributing

We welcome contributions! 🎉

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone and setup
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
npm install

# Development commands
npm run dev        # Development mode
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Code linting
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Free for personal and commercial use! 🎉

---

## 🌟 Acknowledgments

- 🇬🇪 **Georgian AI Community** - For inspiration and support
- 🌊 **City of Batumi** - For the beautiful coastal inspiration
- 🏔️ **Caucasus Mountains** - For the strength and resilience
- ⚡ **Claude AI Team** - For the amazing MCP protocol
- 🤝 **Open Source Community** - For tools and libraries

---

**🌊 Created with ❤️ in Batumi, Georgia by SiTech**

*Marathon MCP Tool v2.0.0 Universal Edition - ბათუმური ხელწერით შექმნილი სიყვარულით!*

**Ready to run the marathon with Claude AI? Let's go! 🏃‍♂️🇬🇪**