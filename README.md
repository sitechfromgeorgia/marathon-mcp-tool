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

---

## 🇬🇧 English Description

**Marathon MCP Tool** is a universal Model Context Protocol (MCP) tool designed for working with Claude AI. It's one tool with all capabilities - 80+ functions across 7 categories.

### ✨ Key Features

- 🇬🇪 **Georgian Interface** - Full Georgian language support
- 🌊 **Batumi Craftsmanship** - Created with love in Batumi, Georgia
- 🔧 **7 Modules** - Complete functionality coverage
- ⚡ **80+ Functions** - All essential tools included
- 🎯 **Universal Mode** - Everything in one package

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
      "args": ["path/to/marathon-mcp-tool/dist/test-start.js"],
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

---

**🌊 Created with ❤️ in Batumi, Georgia by SiTech**

*"ღია ზღვის ტალღებისგან ახალი ტექნოლოგიები" - "New technologies from the open sea waves"*