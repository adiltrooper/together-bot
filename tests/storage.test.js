const { pool } = require("../config/config_bot.js");
const storage = require("../storage");
const sinon = require("sinon");

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
