const { joinBotCallback } = require("../indexUtils");
const { bot } = require("../config/config_bot");
const keys = require("../config/config_keys/keys");
const sinon = require("sinon");

describe("joinBotCallback function", () => {
  let stubs = [];

  beforeEach(() => {
    stubs.push(sinon.stub(bot, "sendPhoto"));
    stubs.push(sinon.stub(bot, "sendMessage"));
  });

  afterEach(() => {
    stubs.forEach(stub => stub.restore());
    stubs = [];
  });

  it("should be admin and send first name when adminsId has chatId and firstName has no ?", () => {
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

  it("should be normal and send hi there when adminsId does not have chatId and firstName has ?", () => {
    const dbStoreNewUser = sinon.stub();
    keys.adminsId = [2, 3, 4, 5];

    joinBotCallback(
      { chat: { first_name: "snoopdogg?", username: "nanananana", id: 1 } },
      { dbStoreNewUser }
    );
    sinon.assert.calledWith(bot.sendPhoto, 1, sinon.match.string);
    sinon.assert.calledWith(
      bot.sendMessage,
      1,
      sinon.match("Hi There"),
      sinon.match.object
    );
    sinon.assert.calledWith(
      dbStoreNewUser,
      1,
      "snoopdogg?",
      "nanananana",
      "normal",
      "normal"
    );
  });
});
