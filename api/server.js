const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const session = require("express-session"); // added library

const db = require("../database/dbConfig.js");

const server = express();

const sessionConfig = {
  secret: "nobody||tosses%a.dwarf.!",
  name: "monkey", // defaults to connect.sid
  httpOnly: true, // JS can't access this
  resave: false,
  saveUninitialized: false, // laws!
  cookie: {
    secure: false, // over httpS
    maxAge: 1 * 24 * 60 * 60 * 1000
  }
};

server.use(session(sessionConfig));

server.use(helmet());
server.use(morgan("short"));
server.use(express.json());
server.use(cors());

server.post("/api/register", (req, res) => {
  // Grab the username and password from body
  const creds = req.body;
  // generate the hash from the user's password
  const hash = bcrypt.hashSync(creds.password, 10); // rounds is 2^X
  // override the user.password with the hash
  creds.password = hash;
  // save the user to the database
  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      req.session.username = creds.username;
      res.status(201).json({ newUserId: id });
    })
    .catch(err => res.json(err));
});

server.post("/api/login", (req, res) => {
  // Grab the username and password from body
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        // passwords match and the user exists by the username
        res.status(200).json({ message: "Thank you for signing in!" });
      } else {
        // either username is invalid or password is wrong
        res.status(401).json({ message: "Please enter valid information!" });
      }
    })
    .catch(err => res.json(err));
});

// Protect this route, only authenticated users should see it
server.get("/api/users", protected, (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("Unable to logout");
      } else {
        res.send("You are logged out");
      }
    });
  }
});

// Protected Middleware
function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json("Not permitted");
  }
}

module.exports = server;
