# 🚀 Marathon MCP Tool v2.0.0 - Complete Installation Guide

## 📋 Table of Contents

- [Quick Start (5 minutes)](#-quick-start-5-minutes)
- [Detailed Installation](#-detailed-installation)
- [Configuration Examples](#-configuration-examples)
- [Testing & Verification](#-testing--verification)
- [Troubleshooting](#-troubleshooting)
- [Georgian Installation Guide](#-georgian-installation-guide)

---

## ⚡ Quick Start (5 minutes)

### Prerequisites Check ✅
- **Node.js ≥ 18.0.0** ([Download here](https://nodejs.org/))
- **Claude Desktop** ([Download here](https://claude.ai/download))
- **Git** ([Download here](https://git-scm.com/))

### 1. Clone & Setup
```bash
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
npm install
```

### 2. Configure Claude Desktop

**Windows:** Edit `%APPDATA%\Claude\claude_desktop_config.json`  
**Mac:** Edit `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["C:\\YOUR\\PATH\\TO\\marathon-mcp-tool\\dist\\index.js"],
      "cwd": "C:\\YOUR\\PATH\\TO\\marathon-mcp-tool",
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

### 3. Test Connection
1. Restart Claude Desktop
2. Type: `marathon_test_connection with message "Hello Batumi!"`
3. You should see a beautiful Georgian response! 🇬🇪

---

## 🔧 Detailed Installation

### Step 1: System Requirements

**Minimum Requirements:**
- Node.js 18.0.0 or higher
- 100MB free disk space
- Claude Desktop application
- Windows 10/11, macOS 10.15+, or Linux

**Recommended:**
- Node.js 20.x LTS
- 500MB free disk space
- Fast SSD for better performance

### Step 2: Download and Setup

#### Option A: Git Clone (Recommended)
```bash
# Clone the repository
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git

# Navigate to directory
cd marathon-mcp-tool

# Install dependencies
npm install

# Verify installation
npm run test
```

#### Option B: Download ZIP
1. Go to [Marathon MCP Tool Repository](https://github.com/sitechfromgeorgia/marathon-mcp-tool)
2. Click "Code" → "Download ZIP"
3. Extract to your desired location
4. Open terminal in extracted folder
5. Run `npm install`

### Step 3: Directory Structure Verification

After installation, your directory should look like:
```
marathon-mcp-tool/
├── dist/
│   ├── index.js                    # Main entry point
│   ├── config/
│   │   └── marathon-config.js      # Configuration
│   ├── utils/
│   │   └── logger.js              # Logger system
│   └── modules/
│       ├── documentation/
│       ├── core-system/
│       ├── file-system/
│       ├── git-repository/
│       ├── system-process/
│       ├── advanced-features/
│       └── memory-knowledge/
├── package.json
├── README.md
└── LICENSE
```

---

## ⚙️ Configuration Examples

### Basic Configuration
```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["PATH_TO_MARATHON/dist/index.js"],
      "cwd": "PATH_TO_MARATHON"
    }
  }
}
```

### Full Configuration with Environment Variables
```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["PATH_TO_MARATHON/dist/index.js"],
      "cwd": "PATH_TO_MARATHON",
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "georgian",
        "MARATHON_THEME": "batumi_sunset",
        "NODE_ENV": "production",
        "DEBUG": "marathon:*"
      }
    }
  }
}
```

### Multiple Language Configuration
```json
{
  "mcpServers": {
    "marathon-georgian": {
      "command": "node",
      "args": ["PATH_TO_MARATHON/dist/index.js"],
      "cwd": "PATH_TO_MARATHON",
      "env": {
        "MARATHON_LANGUAGE": "georgian"
      }
    },
    "marathon-english": {
      "command": "node",
      "args": ["PATH_TO_MARATHON/dist/index.js"],
      "cwd": "PATH_TO_MARATHON",
      "env": {
        "MARATHON_LANGUAGE": "english"
      }
    }
  }
}
```

### Platform-Specific Paths

#### Windows Examples:
```json
{
  "args": ["C:\\Users\\YourName\\Projects\\marathon-mcp-tool\\dist\\index.js"],
  "cwd": "C:\\Users\\YourName\\Projects\\marathon-mcp-tool"
}
```

#### macOS Examples:
```json
{
  "args": ["/Users/YourName/Projects/marathon-mcp-tool/dist/index.js"],
  "cwd": "/Users/YourName/Projects/marathon-mcp-tool"
}
```

#### Linux Examples:
```json
{
  "args": ["/home/yourname/Projects/marathon-mcp-tool/dist/index.js"],
  "cwd": "/home/yourname/Projects/marathon-mcp-tool"
}
```

---

## ✅ Testing & Verification

### Basic Connection Test
```
marathon_test_connection
```
**Expected Result:** Beautiful Georgian success message with system info

### Module Testing Checklist

#### Core System Module ✅
```
marathon_get_status
```

#### File System Module ✅
```
marathon_list_directory with path "C:\\Windows"
marathon_read_file with path "C:\\Windows\\System32\\drivers\\etc\\hosts"
```

#### Memory Module ✅
```
marathon_simple_memory with action "save", key "test", data "Hello World"
marathon_simple_memory with action "load", key "test"
marathon_simple_memory with action "list"
```

#### Knowledge Module ✅
```
marathon_knowledge_store with action "store", topic "AI", content "Artificial Intelligence notes"
marathon_knowledge_store with action "search", query "AI"
```

#### Session Context Module ✅
```
marathon_session_context with action "save_context", context_data "Working on project setup"
marathon_session_context with action "load_context"
```

#### Git Module ✅
```
marathon_git_status with path "C:\\path\\to\\your\\git\\repo"
```

#### System Info Module ✅
```
marathon_system_info
```

#### Advanced Features Module ✅
```
marathon_symbol_command with command "+++"
```

#### Documentation Module ✅
```
marathon_get_help with topic "memory"
```

### Performance Verification

#### Response Time Test
All tools should respond within 1-2 seconds for basic operations.

#### Memory Usage Test
Check that memory operations persist between calls:
```
marathon_simple_memory with action "save", key "performance_test", data "Testing memory persistence"
# Wait a moment, then:
marathon_simple_memory with action "load", key "performance_test"
```

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: "Server disconnected immediately"
**Symptoms:** Claude shows server as disconnected  
**Solutions:**
1. ✅ Check Node.js version: `node --version` (should be ≥18.0.0)
2. ✅ Verify path is absolute and correct
3. ✅ Check file permissions on dist/ folder
4. ✅ Ensure package.json exists in root directory
5. ✅ Try: `npm install` to reinstall dependencies

#### Issue: "Cannot find module" errors
**Symptoms:** Module import errors in Claude logs  
**Solutions:**
1. ✅ Run `npm install` to ensure all dependencies
2. ✅ Verify dist/modules/ directory exists and has all 7 modules
3. ✅ Check that each module has an index.js file
4. ✅ Restart Claude Desktop after configuration changes

#### Issue: Georgian text appears as squares/question marks
**Symptoms:** Georgian characters not displaying properly  
**Solutions:**
1. ✅ Ensure Claude Desktop supports UTF-8 (usually automatic)
2. ✅ Check MARATHON_LANGUAGE environment variable
3. ✅ Try switching to English: `"MARATHON_LANGUAGE": "english"`
4. ✅ Update Claude Desktop to latest version

#### Issue: Memory functions don't persist
**Symptoms:** Saved data disappears between sessions  
**Solutions:**
1. ✅ Memory is in-memory only (by design for v2.0.0)
2. ✅ Data persists within same Claude session
3. ✅ Use session_context for longer persistence
4. ✅ For permanent storage, use external files

#### Issue: File operations fail
**Symptoms:** Cannot read/write files  
**Solutions:**
1. ✅ Check file paths are absolute and correct
2. ✅ Verify file/directory permissions
3. ✅ Use forward slashes or escaped backslashes in paths
4. ✅ Test with a simple, accessible file first

### Debug Mode

Enable detailed logging by adding to environment:
```json
{
  "env": {
    "DEBUG": "marathon:*",
    "NODE_ENV": "development"
  }
}
```

### Getting Help

1. **Check Logs:** Claude Desktop logs show detailed error information
2. **GitHub Issues:** [Create an issue](https://github.com/sitechfromgeorgia/marathon-mcp-tool/issues)
3. **Email Support:** sitech.georgia@gmail.com
4. **Test Tool:** Use `marathon_get_help` for built-in assistance

---

## 🇬🇪 Georgian Installation Guide

### წინაპირობები
- **Node.js ≥ 18.0.0** ([ჩამოტვირთვა](https://nodejs.org/))
- **Claude Desktop** ([ჩამოტვირთვა](https://claude.ai/download))

### ინსტალაციის ნაბიჯები

#### 1. რეპოზიტორიის კლონირება
```bash
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
npm install
```

#### 2. Claude Desktop კონფიგურაცია

**Windows:** შეცვალეთ `%APPDATA%\Claude\claude_desktop_config.json`
```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["C:\\თქვენი\\ბილიკი\\marathon-mcp-tool\\dist\\index.js"],
      "cwd": "C:\\თქვენი\\ბილიკი\\marathon-mcp-tool",
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "georgian",
        "MARATHON_THEME": "batumi_sunset"
      }
    }
  }
}
```

#### 3. ტესტირება
```
marathon_test_connection with message "გამარჯობა ბათუმი!"
```

### ხელმისაწვდომი ფუნქციები

#### ძირითადი ინსტრუმენტები:
- `marathon_test_connection` - კავშირის ტესტირება
- `marathon_get_status` - სისტემის სტატუსი

#### მეხსიერების ინსტრუმენტები:
- `marathon_simple_memory` - მარტივი მეხსიერება
- `marathon_knowledge_store` - ცოდნის შენახვა
- `marathon_session_context` - სესიის კონტექსტი

#### ფაილური სისტემა:
- `marathon_read_file` - ფაილის წაკითხვა
- `marathon_list_directory` - დირექტორიის სია

#### სხვა ინსტრუმენტები:
- `marathon_git_status` - Git სტატუსი
- `marathon_system_info` - სისტემური ინფორმაცია
- `marathon_symbol_command` - სიმბოლური ბრძანებები
- `marathon_get_help` - დახმარება

### მხარდაჭერა
- 📧 **ელ-ფოსტა:** sitech.georgia@gmail.com
- 🐛 **პრობლემები:** [GitHub Issues](https://github.com/sitechfromgeorgia/marathon-mcp-tool/issues)
- 🇬🇪 **ქართული მხარდაჭერა:** სრული ნაცნობი ენის დახმარება

---

## 🎯 Configuration Profiles

### Profile 1: Basic User
```json
{
  "mcpServers": {
    "marathon-basic": {
      "command": "node",
      "args": ["PATH_TO_MARATHON/dist/index.js"],
      "cwd": "PATH_TO_MARATHON",
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "english"
      }
    }
  }
}
```

### Profile 2: Power User
```json
{
  "mcpServers": {
    "marathon-power": {
      "command": "node", 
      "args": ["PATH_TO_MARATHON/dist/index.js"],
      "cwd": "PATH_TO_MARATHON",
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "georgian",
        "MARATHON_THEME": "batumi_sunset",
        "DEBUG": "marathon:*",
        "NODE_ENV": "development"
      }
    }
  }
}
```

### Profile 3: Georgian Native
```json
{
  "mcpServers": {
    "marathon-georgian": {
      "command": "node",
      "args": ["PATH_TO_MARATHON/dist/index.js"],
      "cwd": "PATH_TO_MARATHON",
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "georgian",
        "MARATHON_THEME": "batumi_sunset"
      }
    }
  }
}
```

---

**🌊 Installation completed! Welcome to Marathon MCP Tool v2.0.0!**  
**ინსტალაცია დასრულებულია! კეთილი იყოს თქვენი მობრძანება Marathon MCP Tool v2.0.0-ში! 🇬🇪**

Ready to run the marathon with Claude AI? **მზად ხართ Claude AI-თან ერთად მარათონის გასაშვებად?** 🏃‍♂️