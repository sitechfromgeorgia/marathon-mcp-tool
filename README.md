# 🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition

## 🇬🇪 ქართული აღწერა

**Marathon MCP Tool** არის უნივერსალური Model Context Protocol (MCP) ხელსაწყო, შექმნილი Claude AI-სთან მუშაობისთვის. ეს არის ერთი ხელსაწყო ყველა შესაძლებლობით - 80+ ფუნქცია 7 კატეგორიაში.

### ✨ მთავარი თავისებურებები

- 🇬🇪 **ქართული ინტერფეისი** - სრული ქართული ენის მხარდაჭერა
- 🌊 **ბათუმური ხელწერა** - შექმნილია სიყვარულით ბათუმში
- 🔧 **7 მოდული** - სრული ფუნქციონალით
- ⚡ **80+ ფუნქცია** - ყველა საჭირო ხელსაწყო
- 🎯 **უნივერსალური რეჟიმი** - ყველაფერი ერთ პაკეტში

### 📦 მოდულები

1. **🔧 ძირითადი სისტემა** - კონფიგურაცია და მართვა
2. **📁 ფაილების მენეჯმენტი** - ფაილებთან მუშაობა
3. **🐙 Git რეპოზიტორიები** - ვერსიის კონტროლი
4. **🧠 მეხსიერება და ცოდნა** - ინფორმაციის შენახვა
5. **⚙️ სისტემა და პროცესები** - სისტემური ფუნქციები
6. **📚 დოკუმენტაცია** - კონტენტის მართვა
7. **🚀 გაფართოებული ფუნქციები** - AI და ავტომატიზაცია

### 🚀 გამოყენება Claude Desktop-ში

```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["path/to/marathon-mcp-tool/dist/index.js"],
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "georgian"
      }
    }
  }
}
```

---

## 🇬🇧 English Description

**Marathon MCP Tool** is a universal Model Context Protocol (MCP) tool designed for working with Claude AI. It's one tool with all capabilities - 80+ functions across 7 categories.

### ✨ Key Features

- 🇬🇪 **Georgian Interface** - Full Georgian language support
- 🌊 **Batumi Craftsmanship** - Created with love in Batumi, Georgia
- 🔧 **7 Modules** - Complete functionality coverage
- ⚡ **80+ Functions** - All essential tools included
- 🎯 **Universal Mode** - Everything in one package

### 📦 Modules

1. **🔧 Core System** - Configuration and management
2. **📁 File Management** - File system operations
3. **🐙 Git Repositories** - Version control integration
4. **🧠 Memory & Knowledge** - Information storage and retrieval
5. **⚙️ System & Processes** - System-level functions
6. **📚 Documentation** - Content management
7. **🚀 Advanced Features** - AI assistance and automation

### 🛠️ Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the project:**
```bash
npm run build
```

4. **Configure Claude Desktop:**
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["path/to/marathon-mcp-tool/dist/index.js"],
      "cwd": "path/to/marathon-mcp-tool",
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

5. **Restart Claude Desktop** and enjoy!

### 🔧 Available Functions

#### Core System Module (6 functions)
- `marathon_test_connection` - Test connection and system status
- `marathon_get_config` - Get current configuration
- `marathon_set_config` - Update configuration
- `marathon_module_toggle` - Enable/disable modules
- `marathon_get_status` - Get system status
- `marathon_language_switch` - Switch interface language

#### File System Module (15 functions)
- File reading, writing, and editing operations
- Directory management and navigation
- File search and content search
- Path validation and security checks

#### Git Repository Module (10+ functions)
- Repository status and management
- Commit and push operations
- Branch management
- GitHub integration

#### Memory & Knowledge Module (10 functions)
- Information storage and retrieval
- Knowledge graph operations
- Entity management
- Memory search and filtering

#### System Process Module (8 functions)
- Safe command execution
- Process monitoring and management
- System information gathering
- Resource usage monitoring

#### Documentation Module (6 functions)
- Documentation fetching and parsing
- Content search and indexing
- README generation
- Multi-language support

#### Advanced Features Module (15+ functions)
- AI-powered command execution
- Intelligent assistance
- Symbol-based commands
- Workflow automation

### 🎨 Configuration Options

The tool supports extensive configuration through:
- Environment variables
- JSON configuration files
- Runtime parameter changes
- Module-specific settings

### 🔧 Development & Troubleshooting

#### Building from Source
```bash
# Clean build
npm run clean
npm run build

# Development mode
npm run dev

# Watch mode
npm run watch

# Type checking
npm run check
```

#### Testing
```bash
# Test connection
npm run marathon:test

# Configuration check
npm run marathon:config
```

#### Common Issues

1. **"Server disconnected" error:**
   - Check if the path in configuration is correct
   - Ensure the project is built (`npm run build`)
   - Verify Node.js version (>=18.0.0)

2. **Module import errors:**
   - Run `npm install` to ensure all dependencies
   - Check TypeScript compilation with `npm run check`

3. **Permission issues:**
   - Ensure proper file permissions for the dist directory
   - Check environment variables

### 🌊 Batumi Philosophy

This tool is crafted with the spirit of Batumi - the beautiful coastal city of Georgia. Like the waves of the Black Sea, it brings constant innovation and refreshing functionality to your AI workflow.

### 📈 Version History

- **v2.0.0** - Universal Edition with 7 modules and 80+ functions
- **v1.0.x** - Initial release with basic functionality

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### 📞 Support

- 🐛 **Issues:** [GitHub Issues](https://github.com/sitechfromgeorgia/marathon-mcp-tool/issues)
- 📧 **Email:** sitech.georgia@gmail.com
- 🌐 **Website:** [SiTech from Georgia](https://github.com/sitechfromgeorgia)

### 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**🌊 Created with ❤️ in Batumi, Georgia by SiTech**

*"ღია ზღვის ტალღებისგან ახალი ტექნოლოგიები" - "New technologies from the open sea waves"*
