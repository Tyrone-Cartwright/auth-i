const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require("bcryptjs"); // Added package and required it here

const db = require("./database/dbConfig.js");

const server = express();

server.use(helmet());
server.use(morgan("short"));
server.use(express.json());
server.use(cors());

server.post("/api/register", (req, res) => {
  // Grab the username and password from body
  const creds = req.body;
  // generate the hash from the user's password
  const hash = bcrypt.hashSync(creds.password, 14); // rounds is 2^X
  // override the user.password with the hash
  creds.password = hash;
  // save the user to the database
  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => json(err));
});

// Protect this route, only authenticated users should see it
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
