/**
 * 🏃‍♂️ Marathon MCP Tool Logger System
 * 🇬🇪 ქართული ლოგირების სისტემა
 */

export class MarathonLogger {
  constructor() {
    this.logLevel = 'info';
  }

  info(message, ...args) {
    console.error(`ℹ️ ინფო ${new Date().toLocaleString('ka-GE')} ${message}`, ...args);
  }

  error(message, ...args) {
    console.error(`❌ შეცდომა ${new Date().toLocaleString('ka-GE')} ${message}`, ...args);
  }

  warn(message, ...args) {
    console.error(`⚠️ გაფრთხილება ${new Date().toLocaleString('ka-GE')} ${message}`, ...args);
  }

  debug(message, ...args) {
    if (this.logLevel === 'debug') {
      console.error(`🐛 დებაგი ${new Date().toLocaleString('ka-GE')} ${message}`, ...args);
    }
  }

  success(message, ...args) {
    console.error(`✅ წარმატება ${new Date().toLocaleString('ka-GE')} ${message}`, ...args);
  }

  setLogLevel(level) {
    this.logLevel = level;
  }

  georgian(message, ...args) {
    console.error(`🇬🇪 ${message}`, ...args);
  }

  batumi(message, ...args) {
    console.error(`🌊 ბათუმი: ${message}`, ...args);
  }
}