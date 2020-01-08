const keys = require("./config/config_keys/keys");
const _ = require("lodash/array");

const { bot, pool } = require("./config/config_bot");
const { session } = require("./session");
const {
  dbStoreNewUser,
  getSubsCount,
  storeCompletePoll,
  storeUserClickedCount
} = require("./storage");
const { inUserStateMarkup, adminStateMarkup } = require("./Markup");

const messagePollFn = require("./messagePollFn");
const imagePollFn = require("./imagePollFn");
const { existPollReply } = require("./existPollReply");
const { draftPollReply } = require("./draftPollReply");
const { answerPollReplyConfig } = require("./answerPollReplyConfig");

bot.setWebHook(keys.externalUrl + `:443/bot` + keys.botToken);

////////////// JOIN BOT //////////////////

bot.onText(/\/start/, msg => {
  const { first_name, username, id: chat_id } = msg.chat;
  var status = "normal";
  var user_type, botAddressUser;
  {
    keys.adminsId.includes(chat_id)
      ? (user_type = "admin")
      : (user_type = "normal");
  }

  {
    first_name.includes("?")
      ? (botAddressUser = "There")
      : (botAddressUser = first_name);
  }

  bot.sendPhoto(
    chat_id,
    "https://res.cloudinary.com/dotogether/image/upload/v1576154842/Listings/Welcome%20Image.png"
  );
  bot.sendMessage(
    chat_id,
    `<b>Hi ${botAddressUser}!

Welcome to the Together Community!</b>

What can this bot do for you?
💡Get an outing idea with a single click below!
💡Get specially curated ideas from the together team posted <b>3 Times Weekly</b>!
  `,
    inUserStateMarkup()
  );
  dbStoreNewUser(chat_id, first_name, username, user_type, status);
});

/////////////// ADMIN CHECK FUNCTION ///////////////////

const adminsOnly = async msg => {
  const member = await bot
    .getChatMember(msg.chat.id, msg.chat.id)
    .catch(err => {
      console.log(err.message);
    });
  var reply = await session.getAdminList().catch(err => {
    console.log(err.message);
  });
  if (!reply) {
    session.setAdminList();
    var reply = keys.adminsId;
  }
  if (reply.includes(member.user.id)) {
    session.setAdminState("1");
    return true;
  } else {
    bot.sendMessage(
      msg.chat.id,
      `Sorry ${member.user.first_name}, you are not an admin :(`
    );
  }
};

////////////////// ENTER ADMIN STATE /////////////////////

bot.onText(/\/admin/, async msg => {
  const adminCheck = await adminsOnly(msg).catch(err => {
    console.log(err.message);
  });
  if (adminCheck) {
    session.setAdminState("1");
    bot.sendMessage(
      msg.chat.id,
      `Hi <b>${msg.chat.first_name}</b>! Welcome to the admin menu!
Please Select an Option:`,
      adminStateMarkup()
    );
  } else {
    console.log("Sorry you are not an admin");
  }
});

bot.onText(/Subscriber Count/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });

  if (adminState == "admin1") {
    let subsCount = await getSubsCount().catch(err => {
      console.log(err.message);
    });
    bot.sendMessage(
      msg.chat.id,
      `TogetherSG now has <b>${subsCount}</b> subsribers!`,
      { parse_mode: "HTML" }
    );
  }
});

bot.onText(/Poll Post/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  const pollExists = await session.getPollTitle().catch(err => {
    console.log(err.message);
  });

  if (adminState == "admin1" && pollExists) {
    session.setAdminState("4");
    async function showPollExisting() {
      const pollOptions = await session.getPollOptions().catch(err => {
        console.log(err.message);
      });
      const pollCount = await session.getPollCount().catch(err => {
        console.log(err.message);
      });
      const pollVoterLength = await session.lengthPollVoter().catch(err => {
        console.log(err.message);
      });
      existPollReply(msg.chat.id, pollOptions, pollCount, pollVoterLength);
    }
    showPollExisting();
    bot.sendMessage(msg.chat.id, "Choose an Option or Exit", {
      reply_markup: {
        keyboard: [["Exit Admin Session"]],
        resize_keyboard: true
      }
    });
  } else if (adminState == "admin1" && !pollExists) {
    session.delPollData();
    session.delPollVoter();
    session.setAdminState("5");
    bot.sendMessage(msg.chat.id, "Draft your main message:", {
      reply_markup: {
        keyboard: [["Back", "Exit Admin Session"]],
        resize_keyboard: true
      }
    });
  }
});

bot.on("callback_query", async callbackQuery => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  if (
    adminState == "admin4" &&
    callbackQuery.data == "🛑Stop Poll & Create New 🛑"
  ) {
    bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
    const pollOptions = await session.getPollOptions().catch(err => {
      console.log(err.message);
    });

    pollOption1 = pollOptions[0];
    pollOption2 = pollOptions[1];
    pollOption3 = pollOptions[2];
    pollOption4 = pollOptions[3];

    const pollCount = await session.getPollCount().catch(err => {
      console.log(err.message);
    });
    parseInt(pollCount[0])
      ? (pollCount1 = parseInt(pollCount[0]))
      : (pollCount1 = 0);
    parseInt(pollCount[1])
      ? (pollCount2 = parseInt(pollCount[1]))
      : (pollCount2 = 0);
    parseInt(pollCount[2])
      ? (pollCount3 = parseInt(pollCount[2]))
      : (pollCount3 = 0);
    parseInt(pollCount[3])
      ? (pollCount4 = parseInt(pollCount[3]))
      : (pollCount4 = 0);

    const pollTitle = await session.getPollTitle().catch(err => {
      console.log(err.message);
    });

    storeCompletePoll(
      pollTitle,
      callbackQuery,
      pollOption1,
      pollCount1,
      pollOption2,
      pollCount2,
      pollOption3,
      pollCount3,
      pollOption4,
      pollCount4
    );

    session.delPollData();
    session.delPollVoter();
    session.setAdminState("5");
    bot.sendMessage(
      callbackQuery.from.id,
      `
      Current Poll has been Stopped and Saved

<b>Create your New Poll Below 👇🏻
Draft your main message:</b>
      `,
      {
        reply_markup: {
          keyboard: [["Back", "Exit Admin Session"]],
          resize_keyboard: true
        },
        parse_mode: "HTML"
      }
    );
  } else if (callbackQuery.data == "Keep Poll" && adminState == "admin4") {
    bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
    session.setAdminState("1");
    bot.sendMessage(
      callbackQuery.from.id,
      `Welcome Back to the admin menu! Please select an Option:`,
      adminStateMarkup()
    );
  }
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  if (
    adminState == "admin5" &&
    msg.text !== "Back" &&
    msg.text !== "Exit Admin Session" &&
    msg.text !== "☀️Feelin' Adventurous" &&
    msg.text !== "🧘🏼‍Feelin' Chill" &&
    msg.text !== "🏠I Wanna Stay Home" &&
    msg.text !== "/start" &&
    msg.text !== "New Post" &&
    msg.text !== "/admin"
  ) {
    await bot.sendMessage(
      msg.chat.id,
      `
<b>Send Your Options in the Format:</b>
/title/ My Poll Title
/1/ Option 1 /2/ Option 2 /3/ Option 3 /4/ Option 4 /end/
`,
      {
        parse_mode: "HTML"
      }
    );
    console.log(msg);
    if (msg.photo) {
      session.setPollImage(msg.photo[0].file_id);
      session.setPollMessage(msg.caption);
    } else {
      session.setPollMessage(msg.text);
    }
    session.setAdminState("6");
  }
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  if (
    adminState == "admin6" &&
    msg.text !== "Back" &&
    msg.text !== "Exit Admin Session" &&
    msg.text !== "☀️Feelin' Adventurous" &&
    msg.text !== "🧘🏼‍Feelin' Chill" &&
    msg.text !== "🏠I Wanna Stay Home" &&
    msg.text !== "/start" &&
    msg.text !== "New Post" &&
    msg.text !== "/admin" &&
    msg.text !== "/start" &&
    msg.text !== "Send Post"
  ) {
    const pollImage = await session.getPollImage().catch(err => {
      console.log(err.message);
    });

    const pollMessage = await session.getPollMessage().catch(err => {
      console.log(err.message);
    });

    var draftPoll = draftPollReply(msg, pollMessage);

    if (pollMessage && !pollImage) {
      bot.sendMessage(msg.chat.id, draftPoll, {
        reply_markup: {
          keyboard: [["Back", "Send Post"]],
          resize_keyboard: true
        },
        parse_mode: "HTML"
      });
    } else if (pollImage) {
      bot.sendPhoto(msg.chat.id, pollImage, {
        caption: draftPoll,
        reply_markup: {
          keyboard: [["Back", "Send Post"]],
          resize_keyboard: true
        },
        parse_mode: "HTML"
      });
    }
  }
});

bot.onText(/Send Post/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  if (adminState == "admin6") {
    const pollImage = await session.getPollImage().catch(err => {
      console.log(err.message);
    });
    const pollMessage = await session.getPollMessage().catch(err => {
      console.log(err.message);
    });
    const pollTitle = await session.getPollTitle().catch(err => {
      console.log(err.message);
    });
    const pollOptions = await session.getPollOptions().catch(err => {
      console.log(err.message);
    });

    var option1 = pollOptions[0];
    var option2 = pollOptions[1];
    var option3 = pollOptions[2];
    var option4 = pollOptions[3];

    async function getUsersFromDB() {
      const connection = await pool.getConnectionAsync();
      const query = new Promise((resolve, reject) => {
        connection.query("SELECT chat_id FROM bot_user_db", function(
          err,
          results,
          fields
        ) {
          if (err) {
            console.log(err.message);
          } else {
            var userArray = [];
            userArray = results.map(userData => {
              return userData.chat_id;
            });
            session.setUserSendList(JSON.stringify(userArray));
            resolve();
          }
        });
      });
      await query;
      connection.release();
    }

    const retrieveUserList = async () => {
      await getUsersFromDB();
      var userSendList = await session.getUserSendList().catch(err => {
        console.log(err.message);
      });
      console.log(`This is the after ${userSendList}`);
      if (userSendList.includes(",")) {
        var userSendList = userSendList
          .slice(1, userSendList.length - 1)
          .split(",")
          .map(numberString => {
            return Number(numberString);
          });
        console.log(userSendList);
      } else {
        var userSendList = userSendList.slice(1, userSendList.length - 1);
        var userSendList = Number(userSendList);
        var userSendListTemp = [];
        userSendListTemp.push(userSendList);
        userSendList = userSendListTemp;
      }

      var userSendList = _.chunk(userSendList, 2);
      console.log(userSendList);
      console.log(pollMessage);
      userSendList.map(subUserSendList => {
        const postMessages = () => {
          subUserSendList.map(userId => {
            if (!pollImage && pollMessage) {
              bot
                .sendMessage(
                  userId,
                  pollMessage,
                  messagePollFn(option1, option2, option3, option4)
                )
                .catch(err => {
                  console.log(err);
                  if (err.response.statusCode == 403) {
                    const blocked_id = err.response.request.body.substring(
                      err.response.request.body.indexOf("=") + 1,
                      err.response.request.body.lastIndexOf("&")
                    );

                    pool.getConnection(function(err, connection) {
                      if (err) console.log(err);
                      connection.query(
                        "UPDATE bot_user_db SET status = ? WHERE chat_id = ?",
                        ["blocked", blocked_id],
                        function(err, results, fields) {
                          if (err) console.log(err.message);
                        }
                      );
                      connection.release();
                      if (err) console.log(err);
                    });
                  }
                });
            } else {
              bot
                .sendPhoto(
                  userId,
                  pollImage,
                  imagePollFn(option1, option2, option3, option4, pollMessage)
                )
                .catch(err => {
                  console.log(err);
                  if (err.response.statusCode == 403) {
                    const blocked_id = err.response.request.body.substring(
                      err.response.request.body.indexOf("=") + 1,
                      err.response.request.body.lastIndexOf("&")
                    );

                    pool.getConnection(function(err, connection) {
                      if (err) console.log(err);
                      connection.query(
                        "UPDATE bot_user_db SET status = ? WHERE chat_id = ?",
                        ["blocked", blocked_id],
                        function(err, results, fields) {
                          if (err) console.log(err.message);
                        }
                      );
                      connection.release();
                      if (err) console.log(err);
                    });
                  }
                });
            }
          });
        };
        setTimeout(postMessages, 3000);
      });
    };
    retrieveUserList();
    bot.sendMessage(msg.chat.id, "Message Sending!", {
      reply_markup: {
        keyboard: [["Exit Admin Session"]],
        resize_keyboard: true
      }
    });
  }
});

bot.on("callback_query", async callbackQuery => {
  if (
    callbackQuery.data !== "Keep Poll" &&
    callbackQuery.data !== "🛑Stop Poll & Create New 🛑"
  ) {
    userPollSelection = callbackQuery.data;

    const pollOptions = await session.getPollOptions().catch(err => {
      console.log(err.message);
    });

    async function voteOrHasVoted(voter, vote) {
      votedUsers = await session.getPollVoter().catch(err => {
        if (err) {
          console.log(err);
        }
      });
      if (votedUsers.includes(voter.toString())) {
        bot.sendMessage(voter, "You have already voted!");
      } else {
        session.setPollVoter(voter);
        session.incrPollVote(vote);
        answerPollReplyConfig(callbackQuery, pollOptions);
      }
    }

    switch (userPollSelection) {
      case pollOption1:
        bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
        voteOrHasVoted(callbackQuery.from.id, "1");
        break;
      case pollOption2:
        bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
        voteOrHasVoted(callbackQuery.from.id, "2");
        break;
      case pollOption3:
        bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
        voteOrHasVoted(callbackQuery.from.id, "3");
        break;
      case pollOption4:
        bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
        voteOrHasVoted(callbackQuery.from.id, "4");
        break;
      default:
        bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
        voteOrHasVoted(callbackQuery.from.id, "1");
    }
  }
});

bot.onText(/New Post/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  console.log(adminState);
  if (adminState == "admin1") {
    session.setAdminState("2");
    bot.sendMessage(msg.chat.id, "Draft your message here:", {
      reply_markup: {
        keyboard: [["Back", "Exit Admin Session"]],
        resize_keyboard: true
      }
    });
  } else {
    session.setAdminStateNull();
    bot.sendMessage(
      msg.chat.id,
      "Something went wrong, Please inform Adil. You can try again if you want to.",
      inUserStateMarkup()
    );
  }
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  if (
    adminState == "admin2" &&
    msg.text !== "Back" &&
    msg.text !== "Exit Admin Session" &&
    msg.text !== "☀️Feelin' Adventurous" &&
    msg.text !== "🧘🏼‍Feelin' Chill" &&
    msg.text !== "🏠I Wanna Stay Home" &&
    msg.text !== "/start" &&
    msg.text !== "New Post" &&
    msg.text !== "/admin" &&
    msg.text !== "/start"
  ) {
    await bot.sendMessage(
      msg.chat.id,
      "What do you want to do with your draft:",
      {
        reply_markup: {
          keyboard: [["Back", "Send Post"]],
          resize_keyboard: true
        }
      }
    );
    console.log(msg);
    if (msg.photo) {
      session.setDraftImage(msg.photo[0].file_id);
      session.setDraftMessage(msg.caption);
    } else {
      session.setDraftMessage(msg.text);
    }
    session.setAdminState("3");
  }
});
bot.onText(/Send Post/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  const draftImage = await session.getDraftImage().catch(err => {
    console.log(err.message);
  });
  const draftMessage = await session.getDraftMessage().catch(err => {
    console.log(err.message);
  });

  async function getUsersFromDB() {
    const connection = await pool.getConnectionAsync();
    const query = new Promise((resolve, reject) => {
      connection.query("SELECT chat_id FROM bot_user_db", function(
        err,
        results,
        fields
      ) {
        if (err) {
          console.log(err.message);
        } else {
          var userArray = [];
          userArray = results.map(userData => {
            return userData.chat_id;
          });
          session.setUserSendList(JSON.stringify(userArray));
          resolve();
        }
      });
    });
    await query;
    connection.release();
  }

  if (adminState == "admin3") {
    const retrieveUserList = async () => {
      await getUsersFromDB();
      var userSendList = await session.getUserSendList().catch(err => {
        console.log(err.message);
      });
      console.log(`This is the after ${userSendList}`);

      if (userSendList.includes(",")) {
        var userSendList = userSendList
          .slice(1, userSendList.length - 1)
          .split(",")
          .map(numberString => {
            return Number(numberString);
          });
        console.log(userSendList);
      } else {
        var userSendList = userSendList.slice(1, userSendList.length - 1);
        var userSendList = Number(userSendList);
        var userSendListTemp = [];
        userSendListTemp.push(userSendList);
        userSendList = userSendListTemp;
      }

      var userSendList = _.chunk(userSendList, 2);
      console.log(userSendList);
      userSendList.map(subUserSendList => {
        const postMessages = () => {
          subUserSendList.map(userId => {
            if (!draftImage) {
              bot.sendMessage(userId, draftMessage).catch(err => {
                console.log(err);
                if (err.response.statusCode == 403) {
                  const blocked_id = err.response.request.body.substring(
                    err.response.request.body.indexOf("=") + 1,
                    err.response.request.body.lastIndexOf("&")
                  );
                  console.log(blocked_id);

                  pool.getConnection(function(err, connection) {
                    if (err) console.log(err);
                    connection.query(
                      "UPDATE bot_user_db SET status = ? WHERE chat_id = ?",
                      ["blocked", blocked_id],
                      function(err, results, fields) {
                        if (err) console.log(err.message);
                      }
                    );
                    connection.release();
                    if (err) console.log(err);
                  });
                }
              });
            } else {
              console.log(userId);
              bot
                .sendPhoto(userId, draftImage, { caption: draftMessage })
                .catch(err => {
                  console.log(err);
                  if (err.response.statusCode == 403) {
                    const blocked_id = err.response.request.body.substring(
                      err.response.request.body.indexOf("=") + 1,
                      err.response.request.body.lastIndexOf("&")
                    );

                    pool.getConnection(function(err, connection) {
                      if (err) console.log(err);
                      connection.query(
                        "UPDATE bot_user_db SET status = ? WHERE chat_id = ?",
                        ["blocked", blocked_id],
                        function(err, results, fields) {
                          if (err) console.log(err.message);
                        }
                      );
                      connection.release();
                      if (err) console.log(err);
                    });
                  }
                });
            }
          });
        };
        setTimeout(postMessages, 3000);
      });
      session.delDraftImage();
      session.delDraftMessage();
    };
    retrieveUserList();
  }
});

/////////////////// EXITING /////////////////////////

bot.onText(/Exit Admin Session/, async msg => {
  await session.setAdminStateNull();
  bot.sendMessage(msg.chat.id, "Back to User Mode", inUserStateMarkup());
});

bot.onText(/Back/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  switch (adminState) {
    case "admin2":
      session.setAdminState("1");
      bot.sendMessage(
        msg.chat.id,
        `Please Select an Option:`,
        adminStateMarkup()
      );
      break;
    case "admin3":
      session.setAdminState("2");
      session.delDraftImage();
      session.delDraftMessage();
      bot.sendMessage(msg.chat.id, "Draft your message here:", {
        reply_markup: {
          keyboard: [["Back", "Exit Admin Session"]],
          resize_keyboard: true
        }
      });
      break;
    default:
      session.setAdminState("1");
      bot.sendMessage(
        msg.chat.id,
        `Please Select an Option:`,
        adminStateMarkup()
      );
  }
});

//GENERATOR FUNCTIONALITY

bot.on("message", async msg => {
  if (
    msg.text == "☀️Feelin' Adventurous" ||
    msg.text == "🧘🏼‍Feelin' Chill" ||
    msg.text == "🏠I Wanna Stay Home"
  ) {
    switch (msg.text) {
      case "☀️Feelin' Adventurous":
        var cat_id = 1;
        var cachedListing = await session.getCachedAdventurous().catch(err => {
          console.log(err.message);
        });
        break;
      case "🧘🏼‍Feelin' Chill":
        var cat_id = 2;
        var cachedListing = await session.getCachedChill().catch(err => {
          console.log(err.message);
        });
        break;
      case "🏠I Wanna Stay Home":
        var cat_id = 3;
        var cachedListing = await session.getCachedHome().catch(err => {
          console.log(err.message);
        });
        break;
      default:
        var cat_id = 1;
        var cachedListing = await session.getCachedAdventurous().catch(err => {
          console.log(err.message);
        });
    }

    var clickedUser = msg.chat.id;
    var clickedDateTime = new Date();
    var date =
      clickedDateTime.getFullYear() +
      "-" +
      (clickedDateTime.getMonth() + 1) +
      "-" +
      clickedDateTime.getDate();
    var time =
      clickedDateTime.getHours() +
      ":" +
      clickedDateTime.getMinutes() +
      ":" +
      clickedDateTime.getSeconds();
    var clickedDateTime = date + " " + time;

    session.setClickedUser(cat_id, clickedUser, clickedDateTime);

    const clickedUserArray = await session.getClickedUser().catch(err => {
      if (err) console.log(err);
    });

    const clickedDateTimeArray = await session
      .getClickedDateTime()
      .catch(err => {
        if (err) console.log(err);
      });

    const clickedCatArray = await session.getClickedCat().catch(err => {
      if (err) console.log(err);
    });

    if (clickedUserArray.length == 10) {
      storeUserClickedCount(
        clickedUserArray,
        clickedDateTimeArray,
        clickedCatArray
      );
      session.delClickedData();
    }

    var activity = cachedListing[0][0];
    var location = cachedListing[1][0];
    var short_desc = cachedListing[2][0];
    var price = cachedListing[3][0];
    var poi = cachedListing[4][0];
    var website = cachedListing[5][0];
    var imageURL = cachedListing[6][0];

    function determineFormat(price, poi, website) {
      if (
        price !== "null" &&
        price !== "0" &&
        poi !== "null" &&
        website !== "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

💸: from $${price}

📍: ${poi}
📮: ${website}`);
      } else if (
        (price == "null" || price == "0") &&
        poi !== "null" &&
        website !== "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</>

${short_desc}

📍: ${poi}
📮: ${website}`);
      } else if (
        (price == "null" || price == "0") &&
        poi == "null" &&
        website !== "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

📮: ${website}`);
      } else if (
        price !== "null" &&
        price !== "0" &&
        poi == "null" &&
        website !== "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

💸: from $${price}

📮: ${website}`);
      } else if (
        (price == "null" || price == "0") &&
        poi == "null" &&
        website == "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}`);
      } else if (
        price !== "null" &&
        price !== "0" &&
        poi !== "null" &&
        website == "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</>

${short_desc}

📍: ${poi}`);
      } else if (
        (price == "null" || price == "0") &&
        poi !== "null" &&
        website == "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</>

${short_desc}

📍: ${poi}`);
      }
    }

    determineFormat(price, poi, website);

    if (cachedListing[0][0]) {
      console.log("From Cache");
      bot.sendPhoto(msg.chat.id, imageURL, {
        caption: caption,
        disable_web_page_preview: true,
        parse_mode: "HTML"
      });
    } else {
      pool.getConnection(function(err, connection) {
        if (err) console.log(err);
        connection.beginTransaction(function(err) {
          if (err) console.log(err);
          connection.query(
            "SELECT location, activity, short_desc, price, poi, website, bot_category.category_name AS category, imageURL FROM bot_listings_db LEFT JOIN bot_listing_category ON bot_listings_db.id = bot_listing_id LEFT JOIN bot_category ON bot_category_id = bot_category.id WHERE bot_category_id = ? ORDER BY RAND() LIMIT 1",
            [cat_id],
            function(err, results, fields) {
              if (err) {
                return connection.rollback(function() {
                  console.log(err.message);
                  throw err;
                });
              } else {
                console.log(results);
                var activity = results[0].activity;
                var location = results[0].location;
                var short_desc = results[0].short_desc;
                var price = results[0].price;
                var poi = results[0].poi;
                var website = results[0].website;
                var imageURL = results[0].imageURL;

                function determineFormat2(price, poi, website) {
                  if (
                    price !== null &&
                    price !== 0 &&
                    poi !== null &&
                    website !== null
                  ) {
                    console.log("try0");
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

💸: from $${price}

📍: ${poi}
📮: ${website}
                `);
                  } else if (
                    (price == null || price == 0) &&
                    poi !== null &&
                    website !== null
                  ) {
                    console.log("try1");
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

📍: ${poi}
📮: ${website}
              `);
                  } else if (
                    (price == null || price == 0) &&
                    poi == null &&
                    website !== null
                  ) {
                    console.log("try2");
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

📮: ${website}
              `);
                  } else if (
                    price !== null &&
                    price !== 0 &&
                    poi == null &&
                    website !== null
                  ) {
                    console.log("try3");
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

💸: from $${price}

📮: ${website}
`);
                  } else if (
                    (price == null || price == 0) &&
                    poi == null &&
                    website == null
                  ) {
                    console.log("try4");
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}
            `);
                  } else if (
                    (price !== null || price !== 0) &&
                    poi !== null &&
                    website == null
                  ) {
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</>

  ${short_desc}

  📍: ${poi}`);
                  } else if (
                    (price == null || price == 0) &&
                    poi !== null &&
                    website == null
                  ) {
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</>

            ${short_desc}

            📍: ${poi}`);
                  } else {
                    console.log("FAILUREEEE");
                  }
                }
                determineFormat2(price, poi, website);

                bot.sendPhoto(msg.chat.id, results[0].imageURL, {
                  caption: caption2,

                  disable_web_page_preview: true,
                  parse_mode: "HTML"
                });
              }
              connection.query(
                "SELECT location, activity, short_desc, price, poi, website, bot_category.category_name AS category, imageURL FROM bot_listings_db LEFT JOIN bot_listing_category ON bot_listings_db.id = bot_listing_id LEFT JOIN bot_category ON bot_category_id = bot_category.id WHERE bot_category_id = ? ORDER BY RAND() LIMIT 10",
                [cat_id],
                function(err, results, fields) {
                  if (err) {
                    return connection.rollback(function() {
                      console.log(err.message);
                      throw err;
                    });
                  } else {
                    console.log(results);

                    const cachedActivity = results.map(result => {
                      return result.activity;
                    });
                    const cachedLocation = results.map(result => {
                      return result.location;
                    });
                    const cachedShort_desc = results.map(result => {
                      return result.short_desc;
                    });
                    const cachedPrice = results.map(result => {
                      return result.price;
                    });
                    const cachedPoi = results.map(result => {
                      return result.poi;
                    });
                    const cachedWebsite = results.map(result => {
                      return result.website;
                    });
                    const cachedImageURL = results.map(result => {
                      return result.imageURL;
                    });

                    session.setCachedListings(
                      cat_id,
                      cachedActivity,
                      cachedLocation,
                      cachedShort_desc,
                      cachedPrice,
                      cachedPoi,
                      cachedWebsite,
                      cachedImageURL
                    );
                  }
                  connection.commit(function(err) {
                    if (err) {
                      return connection.rollback(function() {
                        console.log(err);
                      });
                    }
                    console.log("cached");
                  });
                }
              );
            }
          );
        });
        connection.release();
      });
    }
  }
});
