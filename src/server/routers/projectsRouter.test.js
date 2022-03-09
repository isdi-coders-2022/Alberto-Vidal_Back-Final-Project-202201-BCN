const request = require("supertest");
const { default: ObjectID } = require("bson-objectid");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../../database");
const Project = require("../../database/models/Project");
const app = require("..");

let mongod;
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  connectDB(uri);
});

const projectsDatabase = [
  {
    author: ObjectID("62275e1f60e1a2984ec63453"),
    likes: 3,
    preview: "image.png",
    production: "vercel.app/project1",
    repo: "github.com/project1",
  },
  {
    author: ObjectID("62275e1f60e1a2984ec63454"),
    likes: 4,
    preview: "image.png",
    production: "vercel.app/project1",
    repo: "github.com/project1",
  },
];

beforeEach(async () => {
  await Project.create(projectsDatabase[0]);
  await Project.create(projectsDatabase[1]);
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
    test("Then it should respond with all the projects in the database", async () => {
      const { body } = await request(app).get("/projects/all");

      expect(body).toHaveLength(projectsDatabase.length);
      expect(body[0].author).toEqual(projectsDatabase[0].author.toHexString());
      expect(body[1].author).toEqual(projectsDatabase[1].author.toHexString());
    });
  });
});
