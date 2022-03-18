const request = require("supertest");
const { default: ObjectID } = require("bson-objectid");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../../../database");
const Project = require("../../../database/models/Project");
const app = require("../..");
const User = require("../../../database/models/User");

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
    author: ObjectID("62275e1f60e1a2984ec63453"),
    likes: 4,
    preview: "image.png",
    production: "vercel.app/project1",
    repo: "github.com/project1",
  },
];

const user = {
  username: "josele",
  name: "jose",
  password: "aeusaeouthuseaothu",
  avatar: "avatar.png",
  _id: ObjectID("62275e1f60e1a2984ec63453"),
};

beforeEach(async () => {
  await Project.create(projectsDatabase[0]);
  await Project.create(projectsDatabase[1]);
  await User.create(user);
});

afterEach(async () => {
  await Project.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

describe("Given a projects router", () => {
  describe("When it receives a request at /projects/all with method get", () => {
    test("Then it should respond with all the projects in the database", async () => {
      const loggedUser = await User.findById("62275e1f60e1a2984ec63453");
      const expectedProjects = projectsDatabase.map((project) => ({
        ...project,
        author: loggedUser,
      }));

      const { body } = await request(app).get("/projects/all").expect(200);

      expect(body.projects).toHaveLength(expectedProjects.length);
      expect(body.projects[0].author.username).toBe(
        expectedProjects[0].author.username
      );
    });
  });

  describe("When it receives a request at /id with method delete", () => {
    test("Then it should respond {}", async () => {
      const initialProjects = await Project.find();
      // eslint-disable-next-line no-underscore-dangle
      const idToDelete = ObjectID(initialProjects[0]._id).toHexString();
      const expectedResponse = {};

      const { body } = await request(app)
        .delete(`/projects/delete/${idToDelete}`)
        .expect(200);
      const projects = await Project.find();

      expect(body).toEqual(expectedResponse);
      expect(projects).toHaveLength(initialProjects.length - 1);
    });
  });

  describe("When it receves a request at /new with method post with incorrect project inside", () => {
    test("Then it should respond with { error: 'Validation Failed' } and status 500", async () => {
      const expectedResponse = { error: "Validation Failed" };

      const { body } = await request(app).post(`/projects/new`).expect(500);

      expect(body).toEqual(expectedResponse);
    });
  });

  describe("When it receives a request at /new with method post with correct project inside", () => {
    test("Then it should respond with status 201 and the project with id", async () => {
      const project = {
        author: ObjectID().toHexString(),
        preview: "preview",
        repo: "repo",
        production: "production",
      };

      const { body } = await request(app)
        .post(`/projects/new`)
        .send(project)
        .expect(201);

      expect(body).toHaveProperty("id");
    });
  });

  describe("When it receives a request at /update with method post and a modified project", () => {
    test("Then it should respond with the updatedProject and status 200", async () => {
      const changedProperty = { preview: "picture.jpg" };
      const expectedStatus = 200;
      const { body: projectsInTheDatabase } = await request(app).get(
        "/projects/all"
      );

      const modifiedProject = {
        ...projectsInTheDatabase.projects[0],
        ...changedProperty,
      };

      const { body } = await request(app)
        .put("/projects/edit")
        .send(modifiedProject)
        .expect(expectedStatus);

      expect(body).toHaveProperty("preview", changedProperty.preview);
    });
  });
});
