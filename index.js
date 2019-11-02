const TelegramBot = require("node-telegram-bot-api"),
  host = process.env.HOST || "localhost", // probably this change is not required
  externalUrl = "https://together-bot.herokuapp.com",
  token = process.env.botToken,
  bot = new TelegramBot(token, {
    webHook: { port: process.env.PORT, host: host }
  });
bot.setWebHook(externalUrl + `:443/bot` + token);

// const Session = require("./session");
const keys = require("./config_keys/keys");
const axios = require("axios");
const mysql = require("mysql");
// const db = require("./config_db/db");
const express = require("express");

const bodyParser = require("body-parser");

// const connection = mysql.createConnection(db);
//
// connection.connect(function(error) {
//   if (error) {
//     console.log("Error: " + error.message);
//   } else {
//     console.log("Connected");
//   }
// });

const app = express();

bot.onText(/\/start/, msg => {
  bot.sendMessage(
    msg.chat.id,
    `Hi ${msg.from.first_name}! Welcome to the Together Community!`
  );

  bot.sendMessage(119860989, "Welcome", {
    reply_markup: {
      keyboard: [
        ["I'm feelin' adventurous", "I'm feelin chill"],
        ["I wanna stay home"]
      ]
    }
  });
  console.log(msg);

  const chat_id = msg.chat.id;
  const first_name = msg.chat.first_name;
  const username = msg.chat.username;

  // connection.query(
  //   "INSERT INTO user_info (chat_id, first_name, username) VALUES (?, ?, ?)",
  //   [chat_id, first_name, username],
  //   function(err, results, fields) {
  //     if (err) {
  //       console.log(err.message);
  //     } else {
  //       return;
  //     }
  //   }
  // );
});

bot.sendMessage(119860989, "Welcome", {
  reply_markup: {
    keyboard: [
      ["I'm feelin' adventurous", "I'm feelin chill"],
      ["I wanna stay home"]
    ]
  }
});

bot.on("message", msg => {
  switch (msg.text) {
    case "I'm feelin' adventurous":
      return connection.query(
        "SELECT * FROM testdb ORDER BY RAND() LIMIT 1",
        function(err, results, fields) {
          if (err) {
            console.log(err.message);
          } else {
            bot.sendMessage(119860989, results[0].activity);
          }
        }
      );
    case "I'm feelin chill":
      return "Hello";
    case "I wanna stay home":
      return "Nop";
  }
});

// function checkAdmin() {
//   if member && member.id
// }

const adminsOnly = async msg => {
  const member = await bot.getChatMember(msg.chat.id, msg.chat.id);
  if (member && member.user.id == keys.adminsId) {
    bot.sendMessage(
      msg.chat.id,
      `Hi ${member.user.first_name}! Welcome to the admin menu!`
    );
    return true;
  } else {
    bot.sendMessage(
      msg.chat.id,
      `Sorry ${member.user.first_name}, you are not an admin :(`
    );
  }
};

bot.onText(/\/admin/, msg => {
  if (adminsOnly(msg) == true) {
    bot.sendMessage(msg.chat.id, "Select Option:", {
      reply_markup: {
        keyboard: [["New Post", "Custom Post"], ["Exit Admin Mode"]]
      }
    });
  }
});

// bot.command(
//   "admin",
//   adminsOnly(msg => {
//     console.log("doing admin stuff");
//   })
// );
// if (msg.text === "I'm feelin' adventurous") {
//   connection.query("SELECT * FROM testdb ORDER BY RAND() LIMIT 1", function(
//     err,
//     results,
//     fields
//   ) {
//     if (err) {
//       console.log(err.message);
//     } else {
//       bot.sendMessage(119860989, results[0].activity);
//     }
//   });
// }
// });

// bot.start(ctx =>
//   ctx.reply(
//     `Hi ${ctx.message.from.first_name}! Welcome to the together community!`
//   )
// );

// bot.help(ctx => ctx.reply("Send me a sticker"));
// bot.on("sticker", ctx => ctx.reply("👍"));
// bot.hears("hi", ctx => ctx.reply("Hey there"));
// bot.command("oldschool", ctx => ctx.reply("Hello"));
// bot.command("modern", ({ reply }) => reply("Yo"));
// bot.command("hipster", Telegraf.reply("λ"));
