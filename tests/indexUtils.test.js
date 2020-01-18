const indexUtils = require("../indexUtils");
const { bot } = require("../config/config_bot");
const keys = require("../config/config_keys/keys");
const sinon = require("sinon");
const { session } = require("../session");

describe("joinBotCallback function", () => {
  let stubs = [];

  beforeEach(() => {
    stubs = [sinon.stub(bot, "sendPhoto"), sinon.stub(bot, "sendMessage")];
  });

  afterEach(() => {
    stubs.forEach(stub => stub.restore());
  });

  it("should be admin and send first name when adminsId has chatId and firstName has no ?", () => {
    const dbStoreNewUser = sinon.stub();
    keys.adminsId = [1, 2, 3, 4, 5];

    indexUtils.joinBotCallback(
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

    indexUtils.joinBotCallback(
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

describe("subsCountCallback function", () => {
  let stubs = [];

  beforeEach(() => {
    stubs = [
      sinon.stub(session, "getAdminState"),
      sinon.stub(bot, "sendMessage")
    ];
  });

  afterEach(() => {
    stubs.forEach(stub => stub.restore());
  });

  it("should send message when admin state is admin1", async () => {
    stubs[0].resolves("admin1");
    const getSubsCount = sinon.stub().resolves(5);
    await indexUtils.subsCountCallback({ chat: { id: 2 } }, { getSubsCount });
    sinon.assert.calledWith(
      bot.sendMessage,
      2,
      sinon.match("5"),
      sinon.match.object
    );
  });

  it("should not send message when admin state is not admin1", async () => {
    stubs[0].resolves("admin2");
    const getSubsCount = sinon.stub().resolves(5);
    await indexUtils.subsCountCallback({ chat: { id: 2 } }, { getSubsCount });
    sinon.assert.notCalled(bot.sendMessage);
  });
});
