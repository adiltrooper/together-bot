const keys = require("./config/config_keys/keys");

const { bot } = require("./config/config_bot");
const { inUserStateMarkup, adminStateMarkup } = require("./Markup");
const { session } = require("./session");

////////////// JOIN BOT //////////////////

exports.joinBotCallback = (msg, dbCallbacks) => {
  const { first_name, username, id: chat_id } = msg.chat;
  const { dbStoreNewUser } = dbCallbacks;
  const status = "normal";
  const user_type = keys.adminsId.includes(chat_id) ? "admin" : "normal";
  const botAddressUser = first_name.includes("?") ? "There" : first_name;

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
};

exports.subsCountCallback = async (msg, dbCallbacks) => {
  const { getSubsCount } = dbCallbacks;
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });

  if (adminState == "admin1") {
    let subsCount = await getSubsCount().catch(err => {
      console.log(err.message);
    });
    bot.sendMessage(
      msg.chat.id,
      `TogetherSG now has <b>${subsCount}</b> subscribers!`,
      { parse_mode: "HTML" }
    );
  }
};

exports.pollPostCallback = async (msg, dbCallbacks) => {
  const { existPollReply } = dbCallbacks;
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
    await showPollExisting();
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
};

exports.callbackQueryCallback = async (callbackQuery, dbCallbacks) => {
  const { storeCompletePoll } = dbCallbacks;
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

    const [pollOption1, pollOption2, pollOption3, pollOption4] = pollOptions;

    const pollCount = await session.getPollCount().catch(err => {
      console.log(err.message);
    });
    const [pollCount1, pollCount2, pollCount3, pollCount4] = pollCount.map(
      count => parseInt(count) || 0
    );

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
};
