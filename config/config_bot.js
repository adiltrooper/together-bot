const keys = require("./config/config_keys/keys");

const TelegramBot = require("node-telegram-bot-api"),
  host = process.env.HOST || "localhost", // probably this change is not required
  externalUrl = process.env.externalURL,
  token = keys.botToken;

exports.bot = new TelegramBot(token, {
  webHook: { port: process.env.PORT, host: host }
});
