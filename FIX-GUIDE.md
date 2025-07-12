# 🏃‍♂️ Marathon MCP Tool v1.0.0 - გამოსწორების სახელმძღვანელო

**IMPORTANT FIX GUIDE | მნიშვნელოვანი გამოსწორების სახელმძღვანელო**

თუ Marathon MCP Tool-ი აჩვენებს მხოლოდ 3 ფუნქციას 77+ ფუნქციის ნაცვლად, გაყევით ეს ნაბიჯები:

## 🔧 სწრაფი გამოსწორება / Quick Fix

### ნაბიჯი 1: Git Clone & Setup
```bash
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
npm install
```

### ნაბიჯი 2: Build გამოსწორება / Build Fix
```bash
# Run the build fixer
node fix-build.js

# Force clean build
npm run build:clean

# Test the installation
npm run marathon:test
```

### ნაბიჯი 3: Claude Desktop კონფიგურაცია
`C:\Users\Louie\AppData\Roaming\Claude\claude_desktop_config.json`-ში:

```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["C:/path/to/marathon-mcp-tool/dist/index.js"],
      "env": {}
    }
  }
}
```

### ნაბიჯი 4: Claude Desktop-ის რესტარტი
1. Claude Desktop-ი სრულად დახურეთ
2. ხელახლა გაშვებეთ
3. შეამოწმეთ Available Tools - უნდა იყოს 77+ ფუნქცია

## 🏥 პრობლემების დიაგნოსტიკა / Problem Diagnostics

### პრობლემა: მხოლოდ 3 ფუნქცია ჩნდება
**მიზეზი:** TypeScript არ არის კომპაილირებული

**გამოსწორება:**
```bash
npm run build
# თუ error-ი მოდის:
npm run marathon:fix
```

### პრობლემა: "Module not found" errors
**მიზეზი:** ES Module import paths

**გამოსწორება:**
```bash
# Check tsconfig.json is correct
npm run check

# Rebuild completely  
npm run build:clean
```

### პრობლემა: Config loading errors
**მიზეზი:** Config directory არ არსებობს

**გამოსწორება:** კოდი ავტომატურად შექმნის directory-ს, მაგრამ შეგიძლიათ მანუალურად:
```bash
mkdir -p ~/.marathon-mcp
```

## 📊 შედეგის შემოწმება / Result Verification

თუ ყველაფერი სწორად მუშაობს, Claude-ში უნდა ნახოთ:

### ✅ Core System Module (6 tools):
- `marathon_test_connection` - კავშირის ტესტირება
- `marathon_get_config` - კონფიგურაციის ნახვა  
- `marathon_set_config` - კონფიგურაციის ცვლილება
- `marathon_module_toggle` - მოდულების ჩართვა/გამორთვა
- `marathon_get_status` - სისტემის სტატუსი
- `marathon_language_switch` - ენის ცვლილება

### ✅ File System Module (5+ tools):
- `marathon_read_file` - ფაილის წაკითხვა
- `marathon_write_file` - ფაილში ჩაწერა
- `marathon_create_directory` - დირექტორიის შექმნა
- `marathon_list_directory` - დირექტორიის სია
- `marathon_search_files` - ფაილების ძიება

### ✅ სხვა მოდულები:
- Git Repository Module (20+ tools)
- Memory & Knowledge Module (12+ tools)  
- System Process Module (8+ tools)
- Documentation Module (6+ tools)
- Advanced Features Module (10+ tools) - Symbol Commands!

## 🚀 სიმბოლური ბრძანებები / Symbol Commands

თუ ყველაფერი კარგადაა, ამ სიმბოლური ბრძანებებიც უნდა იმუშაოს:

- `---` - Session reset | სესიის განულება
- `+++` - Marathon Mode | მარათონ რეჟიმი
- `...` - Continue task | ამოცანის გაგრძელება
- `***` - Emergency save | გადაუდებელი შენახვა
- `###` - Deep analysis | ღრმა ანალიზი
- `@@@` - Expert mode | ექსპერტ რეჟიმი

## 🆘 თუ მაინც არ მუშაობს / If Still Not Working

1. **შეამოწმეთ Claude Desktop logs:**
   `C:\Users\Louie\AppData\Roaming\Claude\logs`

2. **Manual verification:**
   ```bash
   cd marathon-mcp-tool
   node dist/index.js --test
   ```

3. **Full reinstall:**
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

4. **Check Node.js version:**
   ```bash
   node --version  # უნდა იყოს >= 18.0.0
   ```

## 🇬🇪 ბათუმური მხარდაჭერა / Batumi Support

თუ პრობლემები გრძელდება, შექმენით issue GitHub-ზე:
- მიუთითეთ Claude Desktop version
- მიუთითეთ Node.js version  
- მიუთითეთ error logs
- ქართულად თუ ინგლისურად - ორივე კარგია!

---

**🌊 ბათუმური სიზუსტით შექმნილია / Created with Batumi precision**
**🏔️ კავკასიონის მთების სიმაგრით / With the strength of Caucasus Mountains**

*77+ ფუნქცია - ერთი ხელსაწყო, ყველა შესაძლებლობა!*
