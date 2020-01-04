const keys = require("./config_keys/keys");
const mysql = require("mysql");
const db = require("./config_db/db");
var cloudinary = require("cloudinary");
const bluebird = require("bluebird");

const TelegramBot = require("node-telegram-bot-api");

exports.bot = new TelegramBot(keys.botToken, {
  webHook: { port: keys.port, host: keys.host }
});

exports.pool = bluebird.promisifyAll(mysql.createPool(db));

cloudinary.config({
  cloud_name: db.cloudinary_cloudname,
  api_key: db.cloudinary_apikey,
  api_secret: db.cloudinary_secret
});
