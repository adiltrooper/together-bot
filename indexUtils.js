const keys = require("./config/config_keys/keys");

const { bot } = require("./config/config_bot");
const { dbStoreNewUser } = require("./storage");
const { inUserStateMarkup } = require("./Markup");

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
