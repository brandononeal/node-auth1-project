const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");

const KnexSessionStore = require("connect-session-knex")(session);

const authRouter = require("./auth/auth-router");
const userRouter = require("./users/user-router");
const middleware = require("./middleware/middleware");

const server = express();

const config = {
  name: "sessionId",
  secret: "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require("../data/dbConfig"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(session(config));
server.use(express.json());
server.use(helmet());
server.use(cors());

server.use("/auth", authRouter);
server.use("/api/users", middleware.restricted, userRouter);

module.exports = server;
