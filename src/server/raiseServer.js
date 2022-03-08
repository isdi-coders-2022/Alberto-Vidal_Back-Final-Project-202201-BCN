const debug = require("debug")("PS_api:serer:");
const chalk = require("chalk");

const raiseServer = (app, port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(
        chalk.bgGreen.black(`server listening at http://localhost:${port}`)
      );
      resolve();
    });

    server.on("error", () => {
      debug(chalk.red("error raising server"));
      reject();
    });
  });

module.exports = raiseServer;
