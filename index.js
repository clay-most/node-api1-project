const express = require("express");
const data = require("./data/db.js");

const server = express();
server.use(express.json());

//url base
server.get("/api/", (req, res) => {
  res.json("Anna's user API");
});

//get all users
server.get("/api/users", (req, res) => {
  data
    .find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage:
          "There was an error while saving the user to the database"
      });
    });
});

//get user by id
server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  data
    .findById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The user information could not be retrieved."
      });
    });
});

//add a new user
server.post("/api/users", (req, res) => {
  const newuser = req.body;
  if (!newuser.name || !newuser.bio) {
    res.status(400).json({
      errorMessage: "Please provide a name and bio for the user"
    });
  } else {
    data
      .insert(newuser)
      .then(newuserID => {
        res.status(201).json(newuserID);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      });
  }
});

//edit a user by id
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = req.body;
  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide a name and bio for the user." });
  } else {
    data
      .update(id, user)
      .then(userID => {
        if (user) {
          res.status(200).json(userID);
        } else {
          res.status(404).json({
            errorMessage: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage: "The user information could not be modified."
        });
      });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  data
    .remove(id)
    .then(removed => {
      if (removed) {
        res.status(204).json(removed);
      } else {
        res
          .status(404)
          .json({
            message: "The user with the specified ID does not exist."
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The user could not be removed" });
    });
});

const port = 5000;

server.listen(port, () => console.log(` API is listening on port ${port} `));
