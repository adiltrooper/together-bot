const { bot, pool } = require("../config/config_bot.js");
const storage = require("../storage");
const { session } = require("../session");
const { adminsOnly } = require("../indexUtils");
const sinon = require("sinon");

let originalLog;

beforeAll(() => {
  originalLog = console.log;
});

afterAll(() => {
  console.log = originalLog;
});

describe("getConnection function", () => {
  let innerFn;
  let originalLog;
  let connection;
  const args = [0, "testFirstName", "testUser", "testUserType", "testStatus"];

  beforeAll(() => {
    originalLog = console.log;
    connection = { query: jest.fn(), release: jest.fn() };
    const getConnectionStub = sinon.stub(pool, "getConnection");
    storage.dbStoreNewUser(...args);
    sinon.assert.calledOnce(pool.getConnection);
    innerFn = getConnectionStub.getCall(0).args[0];
  });

  afterAll(() => {
    console.log = originalLog;
  });

  it("should not create a connection when there is an error", () => {
    console.log = jest.fn();
    innerFn("test error msg", connection);
    expect(console.log).toHaveBeenCalledWith("test error msg");
    expect(connection.query).not.toHaveBeenCalled();
    expect(connection.release).not.toHaveBeenCalled();
  });

  it("should create correct connection query when there is no error", () => {
    console.log = jest.fn();
    innerFn(null, connection);
    expect(console.log).not.toHaveBeenCalled();
    expect(connection.query).toHaveBeenCalledWith(
      "INSERT INTO bot_user_db (chat_id, first_name, username, user_type, status) VALUES (?, ?, ?, ?, ?)",
      args,
      expect.any(Function)
    );
    expect(connection.release).toHaveBeenCalledTimes(1);
  });
});

describe("adminsOnly function", () => {
  let stubs = [];

  beforeEach(() => {
    stubs.push(sinon.stub(bot, "getChatMember"));
    stubs.push(sinon.stub(session, "getAdminList"));
    stubs.push(sinon.stub(bot, "sendMessage"));
    stubs.push(sinon.stub(session, "setAdminList"));
    stubs.push(sinon.stub(session, "setAdminState"));
  });

  afterEach(() => {
    stubs.forEach(stub => stub.restore());
    stubs = [];
  });

  it("should set admin state to 1 when member is in admin list", async () => {
    stubs[0]
      .withArgs("testAdminId", "testAdminId")
      .resolves({ user: { id: "testMem" } });
    stubs[1].resolves(["1", "2", "testMem"]);

    await adminsOnly({ chat: { id: "testAdminId" } });

    sinon.assert.notCalled(session.setAdminList);
    sinon.assert.calledWith(session.setAdminState, "1");
    sinon.assert.notCalled(bot.sendMessage);
  });

  it("should set admin list when admin list is empty", async () => {
    stubs[0]
      .withArgs("testAdminId", "testAdminId")
      .resolves({ user: { id: "testMem", first_name: "testFirstName" } });
    stubs[1].resolves(null);

    await adminsOnly({ chat: { id: "testAdminId" } });

    sinon.assert.calledOnce(session.setAdminList);
    sinon.assert.notCalled(session.setAdminState);
    sinon.assert.calledWith(
      bot.sendMessage,
      "testAdminId",
      sinon.match("testFirstName")
    );
  });

  it("should send message when member is not in admin list", async () => {
    stubs[0]
      .withArgs("testAdminId", "testAdminId")
      .resolves({ user: { id: "testMem", first_name: "testFirstName" } });
    stubs[1].resolves(["1", "2", "testMem1"]);

    await adminsOnly({ chat: { id: "testAdminId" } });

    sinon.assert.notCalled(session.setAdminList);
    sinon.assert.notCalled(session.setAdminState);
    sinon.assert.calledWith(
      bot.sendMessage,
      "testAdminId",
      sinon.match("testFirstName")
    );
  });

  // should handle the case where member is null and member.user.id is undefined?
  // it("should handle getChatMember error", async () => {
  //   console.log = jest.fn();
  //   stubs[0]
  //     .withArgs("testAdminId", "testAdminId")
  //     .rejects({ message: "getChatMember error" });
  //   stubs[1].resolves(["1", "2", "testMem1"]);

  //   await adminsOnly({ chat: { id: "testAdminId" } });

  //   expect(console.log).toHaveBeenCalledWith("getChatMember error");

  //   sinon.assert.notCalled(session.setAdminList);
  //   sinon.assert.notCalled(session.setAdminState);
  //   sinon.assert.calledWith(
  //     bot.sendMessage,
  //     "testAdminId",
  //     sinon.match("testFirstName")
  //   );
  // });

  it("should handle getAdminList error", async () => {
    console.log = jest.fn();
    stubs[0]
      .withArgs("testAdminId", "testAdminId")
      .resolves({ user: { id: "testMem", first_name: "testFirstName" } });
    stubs[1].rejects({ message: "getAdminList error" });

    await adminsOnly({ chat: { id: "testAdminId" } });

    expect(console.log).toHaveBeenCalledWith("getAdminList error");

    sinon.assert.calledOnce(session.setAdminList);
    sinon.assert.notCalled(session.setAdminState);
    sinon.assert.calledWith(
      bot.sendMessage,
      "testAdminId",
      sinon.match("testFirstName")
    );
  });
});
