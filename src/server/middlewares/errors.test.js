const { notFound, serverError } = require("./errors");

describe("Given a notFound error handler", () => {
  describe("When it's called", () => {
    test("Then it should call method status and json of res with 404 and {error: 'resource not found'}", () => {
      const expectedStatus = 404;
      const expectedJson = { error: "resource not found" };
      const req = null;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      notFound(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });
});

describe("Given a servererror handler", () => {
  describe("When it's called with err and res with no error status neither message provided", () => {
    test("Then it should call method status and json of res with 500 and {error: 'internal server error'}", () => {
      const expectedStatus = 500;
      const expectedJson = { error: "internal server error" };
      const err = {};
      const req = null;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = null;

      serverError(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it's called with err and res with err status 409 and error message 'conflict'", () => {
    test("Then it should call method status and json of res with 409 and {error: 'conflict'}", () => {
      const errorMessage = "conflict";
      const expectedStatus = 409;
      const expectedJson = { error: errorMessage };
      const err = {
        message: errorMessage,
        status: expectedStatus,
      };
      const req = null;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = null;

      serverError(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });
});
