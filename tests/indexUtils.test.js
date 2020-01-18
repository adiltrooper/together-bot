const { joinBotCallback } = require("../indexUtils");
const { bot } = require("../config/config_bot");
const keys = require("../config/config_keys/keys");
const sinon = require("sinon");

describe("joinBotCallback function", () => {
  it("should be admin and send first name", () => {
    sinon.stub(bot, "sendPhoto");
    sinon.stub(bot, "sendMessage");
    const dbStoreNewUser = sinon.stub();
    keys.adminsId = [1, 2, 3, 4, 5];

    joinBotCallback(
      { chat: { first_name: "snoopdogg", username: "nanananana", id: 1 } },
      { dbStoreNewUser }
    );
    sinon.assert.calledWith(bot.sendPhoto, 1, sinon.match.string);
    sinon.assert.calledWith(
      bot.sendMessage,
      1,
      sinon.match("snoopdogg"),
      sinon.match.object
    );
    sinon.assert.calledWith(
      dbStoreNewUser,
      1,
      "snoopdogg",
      "nanananana",
      "admin",
      "normal"
    );
  });
});
