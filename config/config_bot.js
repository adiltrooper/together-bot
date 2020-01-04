const keys = require("./config_keys/keys");

const TelegramBot = require("node-telegram-bot-api");

exports.bot = new TelegramBot(botToken, {
  webHook: { port: process.env.PORT, host: host }
});
