const TelegramBot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const { log } = require('../utils/logger');

// Telegram Bot Setup
const telegramBot = new TelegramBot(config.telegramBotToken, { polling: false });

async function sendTelegramMessage(message) {
  try {
    await telegramBot.sendMessage(config.telegramChatId, message);
    log('Telegram message sent');
  } catch (err) {
    log(`Telegram send error: ${err.message}`, 'error');
  }
}

// SMTP Email Setup
const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpSecure,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

async function sendEmail(to, subject, htmlContent) {
  try {
    const info = await transporter.sendMail({
      from: `"AI Trading Bot" <${config.emailSender}>`,
      to,
      subject,
      html: htmlContent,
    });
    log(`Email sent: ${info.messageId}`);
  } catch (err) {
    log(`Email send error: ${err.message}`, 'error');
  }
}

module.exports = {
  sendTelegramMessage,
  sendEmail,
};
