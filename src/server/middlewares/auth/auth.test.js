const jwt = require("jsonwebtoken");
const auth = require("./auth");

const jwtMock = jest.spyOn(jwt, "verify");

describe("Given an auth middleware", () => {
  describe("When it receives a request with no authorization", () => {
    test("Then it should call methods status and json of res with 403 and {error: 'no token provided'}", () => {
      const req = { header: () => "" };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const expectedResponse = { error: "no token provided" };
      const expectedStatus = 403;

      auth(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives a request with an invalid token", () => {
    test("Then it should call next with an error with message 'invalid token' and status 403", () => {
      const req = { headers: { Authorization: "Bearer asdasdasd" } };
      const res = null;
      const next = jest.fn();
      const error = new Error("invalid token");
      error.status = 403;

      auth(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a request with a valid token", () => {
    test("Then it should call next", () => {
      jwtMock.mockReturnThis();
      const req = { header: () => "Bearer asdasdasd" };
      const res = null;
      const next = jest.fn();

      auth(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
