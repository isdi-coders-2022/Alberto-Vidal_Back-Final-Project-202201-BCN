const Project = require("../../database/models/Project");
const { getAllProjects } = require("./projectsControllers");

jest.spyOn(Project, "find").mockReturnThis();
const mockProjectPopulate = jest.spyOn(Project, "populate");

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

      expect(res.json).toHaveBeenCalledWith(expectedProjects);
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
