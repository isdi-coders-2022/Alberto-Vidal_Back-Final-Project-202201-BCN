const request = require("supertest");
const { default: ObjectID } = require("bson-objectid");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../../database");
const Project = require("../../database/models/Project");

let mongod;
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  connectDB(uri);
});

beforeEach(async () => {
  await Project.create({
    author: ObjectID(),
    likes: 3,
    preview: "image.png",
    links: {
      production: "vercel.app/project1",
      repo: "github.com/project1",
    },
  });
  await Project.create({
    author: ObjectID(),
    likes: 4,
    preview: "image.png",
    links: {
      production: "vercel.app/project1",
      repo: "github.com/project1",
    },
  });
});

afterEach(async () => {
  await Project.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

describe("Given a projects router", () => {
  describe("When it receives a request at /projects/all", () => {
    test("Then it should respond with all the projects in the database", () => {});
  });
});
