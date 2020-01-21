const { adminsOnly } = require("../indexUtils");
const { bot } = require("../config/config_bot");
const sinon = require("sinon");
const { session } = require("../session");

describe("adminsOnly function", () => {
  let stubs = [];
  let originalLog;

  beforeAll(() => {
    originalLog = console.log;
  });

  afterAll(() => {
    console.log = originalLog;
  });

  beforeEach(() => {
    stubs = [
      sinon.stub(bot, "getChatMember"),
      sinon.stub(session, "getAdminList"),
      sinon.stub(bot, "sendMessage"),
      sinon.stub(session, "setAdminList"),
      sinon.stub(session, "setAdminState")
    ];
  });

  afterEach(() => {
    stubs.forEach(stub => stub.restore());
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
