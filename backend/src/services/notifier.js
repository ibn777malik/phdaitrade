const TelegramBot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const { log } = require('../utils/logger');

// Telegram Bot Setup - only if token is provided
let telegramBot;
if (config.telegramBotToken) {
  telegramBot = new TelegramBot(config.telegramBotToken, { polling: false });
} else {
  log('Telegram bot token not configured, notifications will be logged only', 'warn');
}

async function sendTelegramMessage(message) {
  if (!telegramBot || !config.telegramChatId) {
    log(`Telegram (Demo): ${message}`, 'info');
    return;
  }

  try {
    await telegramBot.sendMessage(config.telegramChatId, message);
    log('Telegram message sent');
  } catch (err) {
    log(`Telegram send error: ${err.message}`, 'error');
  }
}

// SMTP Email Setup - only if configured
let transporter;
if (config.smtpHost && config.smtpUser) {
  transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });
} else {
  log('Email SMTP not configured, emails will be logged only', 'warn');
}

async function sendEmail(to, subject, htmlContent) {
  if (!transporter) {
    log(`Email (Demo) to ${to}: ${subject} - ${htmlContent}`, 'info');
    return;
  }

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