const TelegramBot = require("node-telegram-bot-api");
const Session = require("./session");

const keys = require("./config_keys/keys");
const axios = require("axios");
const mysql = require("mysql");
const db = require("./config_db/db");
const express = require("express");
const bodyParser = require("body-Parser");

const PORT = process.env.PORT || 5000;

const connection = mysql.createConnection(db);

connection.connect(function(error) {
  if (error) {
    console.log("Error: " + error.message);
  } else {
    console.log("Connected");
  }
});

const app = express();
const session = new Session();

app.listen(5000, () => {
  console.log(`App listening on port ${PORT}`);
});

const bot = new TelegramBot(keys.botToken, { polling: true });

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

  connection.query(
    "INSERT INTO user_info (chat_id, first_name, username) VALUES (?, ?, ?)",
    [chat_id, first_name, username],
    function(err, results, fields) {
      if (err) {
        console.log(err.message);
      } else {
        return;
      }
    }
  );
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

  // function checkAdmin() {
  //   if member && member.id
  // }

  const adminsOnly = async msg => {
    const member = await bot.getChatMember(msg.chat.id, msg.chat.id);
    if (member && keys.adminsId.includes(member.user.id)) {
      return true;
    } else {
      bot.sendMessage(
        msg.chat.id,
        `Sorry ${member.user.first_name}, you are not an admin :(`
      );
    }
  };

  bot.onText(/\/admin/, msg => {
    adminsOnly(msg);
    console.log("hello");
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
});

// bot.start(ctx =>
//   ctx.reply(
//     `Hi ${ctx.message.from.first_name}! Welcome to the together community!`
//   )
// );

// bot.use(session());
// bot.on("text", ctx => {
//   console.log(ctx);
// });

// const generatorOptions = Markup.inlineKeyboard([
//   Markup.callbackButton("Feelin' Chill", "FEELING_CHILL"),
//   Markup.callbackButton("Adventurous", "ADVENTUROUS"),
//   Markup.callbackButton("Stay At Home", "STAY_AT_HOME")
// ]);

// bot.on("text", ctx =>
//   ctx.telegram.sendCopy(
//     ctx.chat.id,
//     ctx.message,
//     Extra.markup(generatorOptions)
//   )
// );
// bot.help(ctx => ctx.reply("Send me a sticker"));
// bot.on("sticker", ctx => ctx.reply("👍"));
// bot.hears("hi", ctx => ctx.reply("Hey there"));
// bot.command("oldschool", ctx => ctx.reply("Hello"));
// bot.command("modern", ({ reply }) => reply("Yo"));
// bot.command("hipster", Telegraf.reply("λ"));

// bot.start(ctx =>
//   ctx.reply(
//     "Welcome!",
//     Markup.inlineKeyboard([
//       Markup.callbackButton("Button 1", "BUTTON_1"),
//       Markup.callbackButton("Button 2", "BUTTON_2")
//     ]).extra()
//   )
// )
