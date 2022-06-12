const path = require("path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createRequestHandler } = require("@remix-run/express");
require("dotenv").config();
const { json } = require("body-parser");
const invariant = require("tiny-invariant");

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "server/build");

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(json());

app.post("/socket/sendMessage", (req, res) => {
  const body = req.body;
  console.log(body.users);
  invariant(body.users && body.users.length > 0, "users must be defined");
  invariant(body.message, "message must be defined");
  const message = body.message;
  invariant(typeof message.text === "string", "text must be defined");
  invariant(typeof message.id === "string", "id must be defined");
  invariant(
    message.author &&
      message.author.name &&
      message.author.imageAlt &&
      message.author.imageSrc,
    "author must be defined"
  );
  invariant(
    typeof body.conversationId === "string",
    "conversationId must be defined"
  );
  console.log(message.text);
  console.log(body.users);
  body.users.forEach((userId) => {
    io.to(userId).emit("message", body.conversationId, message);
  });

  res.status(200).send("OK");
});

io.on("connection", (socket) => {
  console.log("socket connected");
  socket.onAny((...args) => {
    console.log(args);
  });
  socket.on("message", (messageType, userId) => {
    if (messageType === "user") {
      socket.join(userId);
    }
  });
});

app.use(compression());

// You may want to be more aggressive with this caching
app.use(express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));
app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: require("../build") })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require("../build");
        return createRequestHandler({ build, mode: MODE })(req, res, next);
      }
);

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
