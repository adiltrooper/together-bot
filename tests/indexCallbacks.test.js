const indexCallbacks = require("../indexCallbacks");
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

    indexCallbacks.joinBotCallback(
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

    indexCallbacks.joinBotCallback(
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

describe("adminStateCallback function", () => {
  let stubs = [];

  beforeEach(() => {
    stubs = [
      sinon.stub(session, "setAdminState"),
      sinon.stub(bot, "sendMessage")
    ];
  });

  afterEach(() => {
    stubs.forEach(stub => stub.restore());
  });

  it("should set adminstate and send message when adminscheck is true", async () => {
    const adminsOnly = jest.fn().mockResolvedValueOnce(true);

    await indexCallbacks.adminStateCallback(
      { chat: { id: 1, first_name: "testname" } },
      { adminsOnly }
    );

    sinon.assert.calledWith(session.setAdminState, "1");
    sinon.assert.calledWith(
      bot.sendMessage,
      1,
      sinon.match("testname"),
      sinon.match.object
    );
  });

  it("should set not adminstate and send message when adminscheck is false", async () => {
    const adminsOnly = jest.fn().mockResolvedValueOnce(false);

    await indexCallbacks.adminStateCallback(
      { chat: { id: 1, first_name: "testname" } },
      { adminsOnly }
    );

    sinon.assert.notCalled(session.setAdminState);
    sinon.assert.notCalled(bot.sendMessage);
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
    await indexCallbacks.subsCountCallback(
      { chat: { id: 2 } },
      { getSubsCount }
    );
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
    await indexCallbacks.subsCountCallback(
      { chat: { id: 2 } },
      { getSubsCount }
    );
    sinon.assert.notCalled(bot.sendMessage);
  });
});

describe("pollPostCallback function", () => {
  let stubs = [];

  beforeEach(() => {
    stubs = [
      sinon.stub(session, "getAdminState"),
      sinon.stub(session, "getPollTitle"),
      sinon.stub(session, "getPollOptions"),
      sinon.stub(session, "getPollCount"),
      sinon.stub(session, "lengthPollVoter"),
      sinon.stub(session, "setAdminState"),
      sinon.stub(session, "delPollData"),
      sinon.stub(session, "delPollVoter"),
      sinon.stub(bot, "sendMessage")
    ];
  });

  afterEach(() => {
    stubs.forEach(stub => stub.restore());
  });

  it("should send correct message when poll exists", async () => {
    stubs[0].resolves("admin1");
    stubs[1].resolves("testTitle");
    stubs[2].resolves({ test: "a" });
    stubs[3].resolves(4);
    stubs[4].resolves(5);
    const existPollReply = jest.fn();

    await indexCallbacks.pollPostCallback(
      { chat: { id: 10 } },
      { existPollReply }
    );
    expect(existPollReply).toHaveBeenCalledWith(10, { test: "a" }, 4, 5);
    sinon.assert.calledWith(session.setAdminState, "4");
    sinon.assert.calledWith(
      bot.sendMessage,
      10,
      "Choose an Option or Exit",
      sinon.match.object
    );
  });

  it("should send correct message when poll does not exist", async () => {
    stubs[0].resolves("admin1");
    stubs[1].resolves(null);
    stubs[2].resolves({ test: "a" });
    stubs[3].resolves(4);
    stubs[4].resolves(5);
    const existPollReply = jest.fn();

    await indexCallbacks.pollPostCallback(
      { chat: { id: 10 } },
      { existPollReply }
    );
    expect(existPollReply).not.toHaveBeenCalled();
    sinon.assert.calledWith(session.setAdminState, "5");
    sinon.assert.calledOnce(session.delPollData);
    sinon.assert.calledOnce(session.delPollVoter);
    sinon.assert.calledWith(
      bot.sendMessage,
      10,
      "Draft your main message:",
      sinon.match.object
    );
  });

  it("should do nothing when admin state is not admin1", async () => {
    stubs[0].resolves("admin2");
    stubs[1].resolves(null);
    stubs[2].resolves({ test: "a" });
    stubs[3].resolves(4);
    stubs[4].resolves(5);
    const existPollReply = jest.fn();

    await indexCallbacks.pollPostCallback(
      { chat: { id: 10 } },
      { existPollReply }
    );
    expect(existPollReply).not.toHaveBeenCalled();
    sinon.assert.notCalled(session.setAdminState);
    sinon.assert.notCalled(session.delPollData);
    sinon.assert.notCalled(session.delPollVoter);
    sinon.assert.notCalled(bot.sendMessage);
  });
});

describe("callbackQueryCallback function", () => {
  let stubs = [];

  beforeEach(() => {
    stubs = [
      sinon.stub(session, "getAdminState"),
      sinon.stub(session, "getPollTitle"),
      sinon.stub(session, "getPollOptions"),
      sinon.stub(session, "getPollCount"),
      sinon.stub(bot, "answerCallbackQuery"),
      sinon.stub(session, "setAdminState"),
      sinon.stub(session, "delPollData"),
      sinon.stub(session, "delPollVoter"),
      sinon.stub(bot, "sendMessage")
    ];
  });

  afterEach(() => {
    stubs.forEach(stub => stub.restore());
  });

  it("should store new poll when adminState is 4 and stop poll create new", async () => {
    stubs[0].resolves("admin4");
    stubs[1].resolves("testpoll");
    stubs[2].resolves(["a", "b", "c", "d"]);
    stubs[3].resolves(["4", "f", "-2.5", "NaN"]);
    const storeCompletePoll = jest.fn();
    const query = {
      from: { id: 12 },
      id: 11,
      data: "🛑Stop Poll & Create New 🛑"
    };

    await indexCallbacks.callbackQueryCallback(query, { storeCompletePoll });

    sinon.assert.calledWith(bot.answerCallbackQuery, 11, { show_alert: true });
    expect(storeCompletePoll).toHaveBeenCalledWith(
      "testpoll",
      query,
      "a",
      4,
      "b",
      0,
      "c",
      -2,
      "d",
      0
    );
    sinon.assert.calledOnce(session.delPollData);
    sinon.assert.calledOnce(session.delPollVoter);
    sinon.assert.calledWith(session.setAdminState, "5");
    sinon.assert.calledWith(
      bot.sendMessage,
      12,
      sinon.match("Draft"),
      sinon.match.object
    );
  });

  it("should keep poll when adminState is 4 and keep poll", async () => {
    stubs[0].resolves("admin4");
    stubs[1].resolves("testpoll");
    stubs[2].resolves(["a", "b", "c", "d"]);
    stubs[3].resolves(["4", "f", "-2.5", "NaN"]);
    const storeCompletePoll = jest.fn();
    const query = {
      from: { id: 12 },
      id: 11,
      data: "Keep Poll"
    };

    await indexCallbacks.callbackQueryCallback(query, { storeCompletePoll });

    sinon.assert.calledWith(bot.answerCallbackQuery, 11, { show_alert: true });
    expect(storeCompletePoll).not.toHaveBeenCalled();
    sinon.assert.notCalled(session.delPollData);
    sinon.assert.notCalled(session.delPollVoter);
    sinon.assert.calledWith(session.setAdminState, "1");
    sinon.assert.calledWith(
      bot.sendMessage,
      12,
      sinon.match("select"),
      sinon.match.object
    );
  });

  it("should do nothing when data is unrecognised", async () => {
    stubs[0].resolves("admin4");
    stubs[1].resolves("testpoll");
    stubs[2].resolves(["a", "b", "c", "d"]);
    stubs[3].resolves(["4", "f", "-2.5", "NaN"]);
    const storeCompletePoll = jest.fn();
    const query = {
      from: { id: 12 },
      id: 11,
      data: "fake"
    };

    await indexCallbacks.callbackQueryCallback(query, { storeCompletePoll });

    sinon.assert.notCalled(bot.answerCallbackQuery);
    expect(storeCompletePoll).not.toHaveBeenCalled();
    sinon.assert.notCalled(session.delPollData);
    sinon.assert.notCalled(session.delPollVoter);
    sinon.assert.notCalled(session.setAdminState);
    sinon.assert.notCalled(bot.sendMessage);
  });

  it("should do nothing when adminState is not 4", async () => {
    stubs[0].resolves("admin3");
    stubs[1].resolves("testpoll");
    stubs[2].resolves(["a", "b", "c", "d"]);
    stubs[3].resolves(["4", "f", "-2.5", "NaN"]);
    const storeCompletePoll = jest.fn();
    const query = {
      from: { id: 12 },
      id: 11,
      data: "Keep Poll"
    };

    await indexCallbacks.callbackQueryCallback(query, { storeCompletePoll });

    sinon.assert.notCalled(bot.answerCallbackQuery);
    expect(storeCompletePoll).not.toHaveBeenCalled();
    sinon.assert.notCalled(session.delPollData);
    sinon.assert.notCalled(session.delPollVoter);
    sinon.assert.notCalled(session.setAdminState);
    sinon.assert.notCalled(bot.sendMessage);
  });
});
