require('dotenv').config();

const config = {
  metaApiToken: process.env.METAAPI_TOKEN,
  mtAccountId: process.env.MT_ACCOUNT_ID,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  mongodbUri: process.env.MONGODB_URI,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  emailSender: process.env.EMAIL_SENDER,
  backendApiUrl: process.env.BACKEND_API_URL,
  frontendWsUrl: process.env.FRONTEND_WS_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
};

module.exports = config;
