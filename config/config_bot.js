const keys = require("./config_keys/keys");

const TelegramBot = require("node-telegram-bot-api");

exports.bot = new TelegramBot(keys.botToken, {
  webHook: { port: keys.port, host: keys.host }
});
