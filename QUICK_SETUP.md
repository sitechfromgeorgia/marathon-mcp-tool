# 🚀 Marathon MCP Tool - Quick Setup Guide

## ჩქარი დაყენება (Quick Setup)

### 1️⃣ Repository Clone

```bash
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
```

### 2️⃣ Dependencies & Build

```bash
npm install
npm run build
```

### 3️⃣ Claude Desktop Configuration

**Windows:** `C:\Users\{YourName}\AppData\Roaming\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux:** `~/.config/Claude/claude_desktop_config.json`

Add this configuration:

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
        "MARATHON_EDITION": "v2.0.0",
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 4️⃣ Restart Claude Desktop

- Close Claude Desktop completely
- Reopen it
- The Marathon MCP Tool should appear in your tools list

### 5️⃣ Test Connection

Ask Claude: "Test marathon connection" or use `marathon_test_connection`

---

## 🔧 Troubleshooting

### ❌ "Server disconnected" Error

1. **Check file path:**
   ```bash
   # Verify the dist folder exists
   ls -la dist/
   
   # Ensure index.js is there
   ls -la dist/index.js
   ```

2. **Rebuild if necessary:**
   ```bash
   npm run clean
   npm run build
   ```

3. **Check Node.js version:**
   ```bash
   node --version  # Should be >=18.0.0
   ```

### ❌ Module Import Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### ❌ Permission Issues (Linux/macOS)

```bash
# Make the dist folder executable
chmod +x dist/index.js
```

### ❌ Wrong Server Running

If you see "claude-knowledge-base-mcp" instead of Marathon:

1. Check the exact path in your config
2. Ensure no other similar tools are running
3. Restart Claude Desktop
4. Clear Claude's cache if needed

---

## ✅ Verification Steps

1. **Build Success Check:**
   ```bash
   npm run marathon:test
   ```

2. **Configuration Check:**
   ```bash
   npm run marathon:config
   ```

3. **Manual Test:**
   ```bash
   node dist/index.js --test
   ```

Should output:
```
🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition
🇬🇪 ქართული ინტერფეისი
✅ ტესტირება წარმატებულია!
```

---

## 🆘 Quick Fixes

### Windows Users:
- Use full absolute paths (C:\Users\...)
- Use double backslashes in JSON: `C:\\path\\to\\marathon-mcp-tool`
- Ensure Node.js is in PATH

### macOS/Linux Users:
- Use absolute paths starting with `/` or `~`
- Check file permissions with `ls -la`
- Ensure execute permissions on files

### All Platforms:
- Node.js version must be 18.0.0 or higher
- NPM version should be recent
- No spaces in file paths (use quotes if needed)

---

## 📞 Still Having Issues?

1. **Create an issue:** [GitHub Issues](https://github.com/sitechfromgeorgia/marathon-mcp-tool/issues)
2. **Include this information:**
   - Operating System
   - Node.js version (`node --version`)
   - NPM version (`npm --version`)
   - Claude Desktop version
   - Full error message
   - Your configuration (remove sensitive data)

---

**🌊 ბათუმიდან სიყვარულით! From Batumi with Love!**
