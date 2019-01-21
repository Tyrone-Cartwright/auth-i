const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const db = require("./database/dbConfig.js");

const server = express();

server.use(helmet());
server.use(morgan("short"));
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Keep coding, it's Working");
});

server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

const port = 3300;
server.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
