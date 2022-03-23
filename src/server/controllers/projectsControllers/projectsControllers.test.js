const fs = require("fs/promises");
const path = require("path");
const Project = require("../../../database/models/Project");
const {
  getAllProjects,
  deleteProject,
  createNewProject,
  editProject,
} = require("./projectsControllers");

jest.spyOn(Project, "find").mockReturnThis();
const mockProjectDelete = jest.spyOn(Project, "deleteOne");
const mockProjectPopulate = jest.spyOn(Project, "populate");
const mockProjectCreate = jest.spyOn(Project, "create");

jest.mock("firebase/storage", () => ({
  getStorage: () => ({}),
  ref: () => ({}),
  getDownloadURL: () => Promise.resolve("image.jpg"),
  uploadBytes: () => Promise.resolve(),
}));

jest.spyOn(fs, "rename").mockResolvedValue(undefined);
jest.spyOn(fs, "readFile").mockResolvedValue({});
const fsUnlink = jest.spyOn(fs, "unlink").mockResolvedValue(null);

jest.spyOn(path, "join").mockReturnThis("");

describe("Given a getAllProjets controller", () => {
  describe("When it's called and database provides an array of projects", () => {
    test("Then it call method json of res with the array of projects", async () => {
      const expectedProjects = [
        { name: "project", id: 1 },
        { name: "project2", id: 2 },
      ];
      mockProjectPopulate.mockImplementation(() =>
        Promise.resolve(expectedProjects)
      );
      const req = null;
      const res = { json: jest.fn() };
      const next = null;

      await getAllProjects(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ projects: expectedProjects });
    });
  });

  describe("When it's called and connection with database throws an error", () => {
    test("Then it should call function next with message 'error getting projects'", async () => {
      const error = new Error();
      mockProjectPopulate.mockImplementation(() => Promise.reject(error));
      const expectedErrorMessage = "error getting projects";
      const expectedError = new Error(expectedErrorMessage);
      const req = null;
      const res = null;
      const next = jest.fn();

      await getAllProjects(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a deleteproject controller", () => {
  describe("When it's called with a request with invalid id", () => {
    test("Then it should call method next with error message 'invalid id' and status 400", async () => {
      const expectedError = { status: 400, message: "invalid id" };
      const next = jest.fn();
      const res = null;
      const req = {
        params: {
          id: null,
        },
      };

      await deleteProject(req, res, next);
      const nextArgs = next.mock.calls[0][0];

      expect(nextArgs.status).toBe(expectedError.status);
      expect(nextArgs.message).toBe(expectedError.message);
    });
  });

  describe("When it's called with a request with a valid id", () => {
    test("Then it should call method json of res with {}", async () => {
      mockProjectDelete.mockResolvedValue(null);
      const expectedResponse = {};
      const next = null;
      const res = { json: jest.fn() };
      const req = {
        params: {
          id: "asdasd3232sasdasd",
        },
      };

      await deleteProject(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it's called and the method delete of project throws an error", () => {
    test("Then it should call function next with an error with message 'error deleting project'", async () => {
      const expectedErrorMessage = "error deleting project";
      mockProjectDelete.mockRejectedValue(new Error());
      const next = jest.fn();
      const res = null;
      const req = {
        params: {
          id: "asdasd3232sasdasd",
        },
      };

      await deleteProject(req, res, next);
      const errorMessage = next.mock.calls[0][0].message;

      expect(errorMessage).toBe(expectedErrorMessage);
    });
  });
});

describe("Given a createNewProject controller", () => {
  describe("When it's called with a project in the request body", () => {
    test("Then it should call method status and json of res with 201 and the new project returned from the database", async () => {
      const preview = {
        fieldname: "preview",
        originalname: "preview.jpg",
        encoding: "7bit",
        mimetype: "image/jpg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };
      const project = {
        author: "author",
        production: "production",
        repo: "repo",
      };
      const projectWithId = { ...project, id: "id" };
      mockProjectCreate.mockImplementation(() => ({
        populate: () => projectWithId,
      }));
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = null;
      const req = { body: project, file: preview };
      const expectedStatus = 201;

      await createNewProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(projectWithId);
    });
  });

  describe("When it's called with a project in the request body and the connection with db fails", () => {
    test("Then it should call next with ane rror with message 'error creating project' and call unlink method of fs", async () => {
      const errorMessage = "error creating project";
      mockProjectCreate.mockRejectedValue(new Error());
      const res = null;
      const next = jest.fn();
      const preview = {
        fieldname: "preview",
        originalname: "preview.jpg",
        encoding: "7bit",
        mimetype: "image/jpg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };
      const req = { body: {}, file: preview };

      await createNewProject(req, res, next);

      expect(fsUnlink).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it's called without a file and an error occurs ", () => {
    test("Then it should call next with ane rror with message 'error creating project'", async () => {
      const errorMessage = "error creating project";
      mockProjectCreate.mockRejectedValue(new Error());
      const res = null;
      const next = jest.fn();
      const req = { body: {} };

      await createNewProject(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });
});

describe("Given a editProject controller", () => {
  describe("When it's called with an invalid project in the request", () => {
    test("Then it should call method rext with an error with message 'error updating project'", async () => {
      const expectedErrorMessage = "error updating project";
      const res = null;
      const req = {
        body: {
          something: "something",
        },
      };
      const next = jest.fn();

      await editProject(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedErrorMessage
      );
    });
  });
});
