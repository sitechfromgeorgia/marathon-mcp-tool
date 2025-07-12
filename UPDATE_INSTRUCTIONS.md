# 🔄 Local Update Instructions / ლოკალური განახლების ინსტრუქცია

## 🇬🇪 ქართული ინსტრუქცია

### 1️⃣ GitHub-დან ახალი ვერსიის მიღება

```bash
cd C:\Users\Louie\marathon-mcp-tool
git pull origin main
```

### 2️⃣ პროექტის ხელახალი აგება

```bash
npm install
npm run clean
npm run build
```

### 3️⃣ Claude Desktop-ის რესტარტი

- Claude Desktop-ის სრული დახურვა
- რამდენიმე წამის ლოდინი
- Claude Desktop-ის ხელახალი გაშვება

### 4️⃣ კავშირის ტესტირება

Claude-ს ითხოვეთ: "Test marathon connection" ან გამოიყენეთ `marathon_test_connection`

---

## 🇬🇧 English Instructions

### 1️⃣ Pull Latest Version from GitHub

```bash
cd C:\Users\Louie\marathon-mcp-tool
git pull origin main
```

### 2️⃣ Rebuild the Project

```bash
npm install
npm run clean
npm run build
```

### 3️⃣ Restart Claude Desktop

- Completely close Claude Desktop
- Wait a few seconds
- Reopen Claude Desktop

### 4️⃣ Test Connection

Ask Claude: "Test marathon connection" or use `marathon_test_connection`

---

## 🚨 Problem Resolution / პრობლემების გადაჭრა

### ❌ Still seeing old version / ძველი ვერსია ჩანს

```bash
# Force clean and rebuild
rm -rf node_modules
rm -rf dist
npm install
npm run build
```

### ❌ Git pull conflicts / Git კონფლიქტები

```bash
# Reset to latest GitHub version
git fetch origin
git reset --hard origin/main
npm install
npm run build
```

### ❌ Claude Desktop cache issues / Cache პრობლემები

**Windows:**
```bash
# Delete Claude cache (close Claude first)
rmdir /s "C:\Users\Louie\AppData\Roaming\Claude\logs"
rmdir /s "C:\Users\Louie\AppData\Local\Claude"
```

**Then restart Claude Desktop**

---

## ✅ Verification Steps / ვერიფიკაციის ნაბიჯები

### 1. Check Git Status
```bash
git status
git log --oneline -5
```

### 2. Verify Build
```bash
ls -la dist/
node dist/index.js --test
```

Should show:
```
🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition
🇬🇪 ქართული ინტერფეისი
✅ ტესტირება წარმატებულია!
```

### 3. Test in Claude
Ask Claude: "What marathon functions are available?" 

You should see all 30+ functions across 7 modules.

---

## 🔧 Automated Update Script / ავტომატური განახლების სკრიპტი

Create a batch file `update_marathon.bat`:

```batch
@echo off
echo Updating Marathon MCP Tool...
cd C:\Users\Louie\marathon-mcp-tool
git pull origin main
npm install
npm run clean
npm run build
echo.
echo ✅ Update complete! Please restart Claude Desktop.
pause
```

Or PowerShell script `update_marathon.ps1`:

```powershell
Write-Host "Updating Marathon MCP Tool..." -ForegroundColor Green
Set-Location "C:\Users\Louie\marathon-mcp-tool"
git pull origin main
npm install
npm run clean
npm run build
Write-Host "✅ Update complete! Please restart Claude Desktop." -ForegroundColor Green
Read-Host "Press Enter to continue"
```

---

## 📅 Regular Update Schedule / რეგულარული განახლების გრაფიკი

### Daily / ყოველდღიური
```bash
git pull && npm run build
```

### Weekly / ყოველკვირეული  
```bash
git pull && npm install && npm run clean && npm run build
```

### Monthly / ყოველთვიური
```bash
# Full clean reinstall
rm -rf node_modules
git pull
npm install
npm run build
```

---

## 🆘 Emergency Reset / საგანგებო აღდგენა

If everything is broken / თუ ყველაფერი გაფუჭდა:

```bash
cd C:\Users\Louie
rm -rf marathon-mcp-tool
git clone https://github.com/sitechfromgeorgia/marathon-mcp-tool.git
cd marathon-mcp-tool
npm install
npm run build
```

Then restart Claude Desktop.

---

**🌊 ყოველთვის განახლებული ბათუმური ხელწერით! Always Updated with Batumi Love!**
