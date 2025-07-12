# 🏃‍♂️ Marathon MCP Tool - ლოკალური setup სახელმძღვანელო

## 🛠️ ლოკალური ინსტალაცია

### 1️⃣ რეპოზიტორიის კლონირება
```bash
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
```

### 2️⃣ დამოკიდებულებების ინსტალაცია
```bash
npm install
```

### 3️⃣ პროექტის აშენება
```bash
npm run build
```

### 4️⃣ ტესტირება
```bash
npm run marathon:test
```

## 🔧 Claude Desktop კონფიგურაცია

### Windows Path:
```
C:\Users\[USERNAME]\AppData\Roaming\Claude\claude_desktop_config.json
```

### Config Example:
```json
{
  "mcpServers": {
    "marathon-mcp-tool": {
      "command": "node",
      "args": ["C:\\path\\to\\marathon-mcp-tool\\dist\\index.js"],
      "env": {
        "MARATHON_MODE": "universal",
        "MARATHON_LANGUAGE": "georgian",
        "MARATHON_THEME": "batumi_sunset"
      }
    }
  }
}
```

## 🐛 მოსალოდნელი შეცდომები და გამოსავალი

### TypeScript Compilation შეცდომები:
```bash
# სუფთა build
npm run clean
npm run build
```

### Module Resolution შეცდომები:
```bash
# Dependencies განახლება
npm install --force
npm run build
```

### Path მახვილები:
- ყოველთვის იყენებთ **absolute paths**
- Windows-ზე გზები `\\` სეპარატორებით
- Path-ში არ იყოს ქართული სიმბოლოები

### 🇬🇪 ქართული ენის მხარდაჭერა
```bash
# ქართული ლოგების შესამოწმებლად
npm run marathon:test

# ენის შეცვლა
marathon_language_switch georgian
```

## 📋 ხშირი შეცდომები

### 1. "Module not found" შეცდომა:
```bash
npm run build:clean
```

### 2. "Permission denied" შეცდომა:
```bash
# Windows-ზე Administrator-ად Run
# ან Path-ში არ არის spaces
```

### 3. Config არ იტვირთება:
```bash
# შეამოწმეთ claude_desktop_config.json syntax
# Path სწორად წერია?
```

### 4. Georgian ტექსტი არ გამოჩნდება:
```bash
# Terminal UTF-8 encoding
chcp 65001
```

## ✅ სწრაფი შემოწმება

თუ ყველაფერი სწორადაა კონფიგურირებული:

1. **Build უნდა გაიშვას წარმატებით**: `npm run build`
2. **Test უნდა ჩაიტვირთოს**: `npm run marathon:test`  
3. **Claude Desktop უნდა აჩვენოს**: marathon ფუნქციები
4. **ქართული უნდა ჩანდეს**: `marathon_test_connection`

## 📞 დახმარების მიღება

თუ პრობლემა გრძელდება:
1. GitHub Issues: https://github.com/sitechfromgeorgia/marathon-mcp-tool/issues
2. ნახეთ logs: `C:\Users\[USERNAME]\AppData\Roaming\Claude\logs`
3. ოპერაციული სისტემა: Windows 10/11 recommended

🌊 **ბათუმური ხელწერით შექმნილი სიყვარულით** 🇬🇪
