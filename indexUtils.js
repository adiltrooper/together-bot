const keys = require("./config/config_keys/keys");

const { bot } = require("./config/config_bot");
const { session } = require("./session");

/////////////// ADMIN CHECK FUNCTION ///////////////////

exports.adminsOnly = async msg => {
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