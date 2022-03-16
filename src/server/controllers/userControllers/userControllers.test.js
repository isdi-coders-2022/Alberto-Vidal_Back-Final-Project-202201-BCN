const bcrypt = require("bcrypt");
const User = require("../../../database/models/User");
const { userLogin, userRegister } = require("./userControllers");

const mockFindOneUser = jest.spyOn(User, "findOne");
const mockCreateUser = jest.spyOn(User, "create");

describe("Given a login user controller", () => {
  describe("When it's called with a username in the request that is not registered", () => {
    test("Then it should call next with an error with message 'invalid username or password' and status 409", async () => {
      const expectedError = {
        message: "incorrect username or password",
        status: 409,
      };
      mockFindOneUser.mockRejectedValue(new Error());
      const next = jest.fn();
      const res = null;
      const req = { body: { username: "pepe" } };

      await userLogin(req, res, next);
      const error = next.mock.calls[0][0];

      expect(error.message).toBe(expectedError.message);
      expect(error.status).toBe(expectedError.status);
    });
  });

  describe("When it's called with a username in the database and an incorrect password", () => {
    test("Then it should call next with an error with message 'invalid username or password' and status 409", async () => {
      const expectedError = {
        message: "incorrect username or password",
        status: 409,
      };
      const userInDb = {
        password: "asdasd",
        id: "ntheonuthenu",
        name: "paco",
        username: "pac0",
      };
      mockFindOneUser.mockResolvedValue(userInDb);
      const next = jest.fn();
      const res = null;
      const req = {
        body: {
          username: userInDb.username,
          password: "incorrect-password",
        },
      };

      await userLogin(req, res, next);
      const error = next.mock.calls[0][0];

      expect(error.message).toBe(expectedError.message);
      expect(error.status).toBe(expectedError.status);
    });
  });

  describe("When it's called with correct username and password", () => {
    test("Then it should call method json of res with a token with the id, name, and username as payload ", async () => {
      const password = "securePassword";
      const hashedPassword = await bcrypt.hash(password, 2);
      const userInDb = {
        password: hashedPassword,
        id: "ntheonuthenu",
        name: "paco",
        username: "pac0",
      };
      mockFindOneUser.mockResolvedValue(userInDb);
      const req = {
        body: {
          username: userInDb.username,
          password,
        },
      };
      const res = { json: jest.fn() };
      const next = null;

      await userLogin(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });
});

describe("Given a userRegister Controller", () => {
  describe("When it's called with a taken username in the request", () => {
    test("Then it should call function next with an error with message 'taken username' and status 409", async () => {
      mockCreateUser.mockRejectedValue(new Error());
      const req = { body: { username: "paco" } };
      const res = null;
      const next = jest.fn();
      const errorMessage = "username taken";

      await userRegister(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it's called with a correct user in the request", () => {
    test("Then it should call methods status and json of res with 201 and {created: username}", async () => {
      const user = { username: "paco" };
      mockCreateUser.mockResolvedValue(null);
      const req = { body: user };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = null;
      const expectedStatus = 201;
      const expectedjson = { created: user.username };

      await userRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedjson);
    });
  });
});
