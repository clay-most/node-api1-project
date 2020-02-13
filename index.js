const express = require("express");
const data = require("./data/db.js");

const server = express();
server.use(express.json());

//url base
server.get("/", (req, res) => {
  res.json("Anna's hobbit API");
});

//get all hobbits
server.get("/hobbits", (req, res) => {
  data
    .find()
    .then(hobbits => {
      res.status(200).json(hobbits);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage:
          "There was an error while saving the hobbit to the database"
      });
    });
});

//get hobbit by id
server.get("/hobbits/:id", (req, res) => {
  const { id } = req.params;
  data
    .findById(id)
    .then(hobbit => {
      if (!hobbit) {
        res.status(404).json({
          message: "The hobbit with the specified ID does not exist."
        });
      } else {
        res.status(200).json(hobbit);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The hobbit information could not be retrieved."
      });
    });
});

//add a new hobbit
server.post("/hobbits", (req, res) => {
  const newHobbit = req.body;
  if (!newHobbit.name || !newHobbit.bio) {
    res.status(400).json({
      errorMessage: "Please provide a name and bio for the hobbit"
    });
  } else {
    data
      .insert(newHobbit)
      .then(newHobbitID => {
        res.status(200).json(newHobbitID);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage:
            "There was an error while saving the hobbit to the database"
        });
      });
  }
});

//edit a hobbit by id
server.put("/hobbits/:id", (req, res) => {
  const { id } = req.params;
  const hobbit = req.body;
  if (!hobbit.name || !hobbit.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide a name and bio for the hobbit." });
  } else {
    data
      .update(id, hobbit)
      .then(hobbitID => {
        if (hobbit) {
          res.status(200).json(hobbitID);
        } else {
          res.status(404).json({
            errorMessage: "The hobbit with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage: "The hobbit information could not be modified."
        });
      });
  }
});

server.delete("/hobbits/:id", (req, res) => {
  const { id } = req.params;
  data
    .remove(id)
    .then(removed => {
      if (removed) {
        res.status(200).json(removed);
      } else {
        res
          .status(404)
          .json({
            message: "The hobbit with the specified ID does not exist."
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The hobbit could not be removed" });
    });
});

const port = 5000;

server.listen(port, () => console.log(` API is listening on port ${port} `));
