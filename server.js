const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const corsSetup = require("./src/middlewares/cors");
console.log("corsSetup", corsSetup);

const models = require("./src/models");
const path = require("path");
const morgan = require("morgan");
const { stream } = require(path.resolve(
  __dirname,
  "./src/middlewares/winston"
));
const uploadFilePath = process.env.UPLOADFILEPATH;
const { sseMiddleware } = require("express-sse-middleware");
const server = require("http").Server(app);
const debug = require("debug")("express-template:server");
const port = normalizePort(process.env.PORT || "3000");

// Print environment variables
console.log(
  "==================================================================="
);
console.log(`Environment        : ${process.env.NODE_ENV}`);
console.log(`Port               : ${process.env.PORT}`);
console.log(`CORS Allows        : ${process.env.CORS_ALLOW_URLS}`);
console.log(
  "===================================================================\n"
);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

app.use(corsSetup);
app.use(morgan("combined", { stream }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(sseMiddleware);

// FilePath
app.use(express.static(__dirname + "/public"));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.disable("x-powered-by");

app.get("/", async function (req, res) {
  res.send("Server On");
});

app.get(models);

// route
app.use("/api/v1/htd", require(`${__dirname}/src/routes/api/v1/htd`));
app.use("/api/v1/user", require(`${__dirname}/src/routes/api/v1/user`));

server.listen(port, "0.0.0.0");
server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

const socketModule = require("./src/modules/socket");
// Body parsing middleware
app.use(express.json());
socketModule.init(server);
