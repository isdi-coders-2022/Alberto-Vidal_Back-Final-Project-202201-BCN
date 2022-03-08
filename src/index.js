require("dotenv").config();
const connectDB = require("./database");
const raiseServer = require("./server/raiseServer");
const app = require("./server");

const port = process.env.PORT || 5555;
const uri = process.env.URI;

(async () => {
  await connectDB(uri);
  await raiseServer(app, port);
})();
