const request = require("supertest");
const bcrypt = require("bcrypt");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../../../database");
const app = require("../..");
const User = require("../../../database/models/User");

let mongod;
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  connectDB(uri);
});

const usersDatabase = [
  {
    username: "Jewel.Mills73",
    name: "Deshawn",
    password: "g7U2pvR1LIaJ2EW",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1055.jpg",
  },
  {
    username: "paco",
    name: "Buddy",
    password: "Fn3l_Oyf4YY0qEE",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1100.jpg",
  },
];

beforeEach(async () => {
  await User.create(usersDatabase);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

describe("Given a /user/login endpoint", () => {
  const endpoint = "/user/login";
  describe("When it receives a request with method post with a not yet registered user", () => {
    test("Then it should respond { error: 'incorrect username or password' }", async () => {
      const user = { username: "jose", password: "sahsateohusa" };
      const expectedResponse = { error: "incorrect username or password" };

      const { body } = await request(app).post(endpoint).send(user);

      expect(body).toEqual(expectedResponse);
    });
  });

  describe("When it receives a request with method post with a registered username but incorrect password", () => {
    test("Then it should respond with { error: 'incorrect username or password' }", async () => {
      const user = {
        username: usersDatabase[0].username,
        password: "incorrect-password",
      };
      const expectedResponse = { error: "incorrect username or password" };

      const { body } = await request(app).post(endpoint).send(user);

      expect(body).toEqual(expectedResponse);
    });
  });

  describe("When it receives a request with method post with a registered username and correct password", () => {
    test("Then it should respond a token", async () => {
      const password = "1234";
      const hashedPassword = await bcrypt.hash(password, 2);
      const registeredUser = {
        username: "jose",
        name: "jose",
        password: hashedPassword,
        avatar:
          "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1100.jpg",
      };
      await User.create(registeredUser);
      const loginRequestBody = { username: registeredUser.username, password };

      const { body } = await request(app).post(endpoint).send(loginRequestBody);

      expect(body).toHaveProperty("token");
    });
  });
});
