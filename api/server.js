// BUILD YOUR SERVER HERE

const express = require('express');
const { restart } = require('nodemon');
const server = express();
const dbFunctions = require('./users/model');

console.log('Server working');

server.use(express.json());

server.get('/users', (req, res) => {
  dbFunctions
    .find()
    .then((users) => res.status(200).json(users))
    .catch(() =>
      res
        .status(500)
        .json({ message: 'The users information could not be retrieved' })
    );
});

server.get('/users/:id', (req, res) => {
  const { id } = req.params;
  dbFunctions
    .findById(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: 'The user information could not be retrieved' });
    });
});

server.post('/users', async (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.bio) {
    res
      .status(401)
      .json({ message: 'Please provide name and bio for the user' });
  } else {
    try {
      const newlyCreatedUser = await dbFunctions.insert(newUser);
      res.status(201).json(newlyCreatedUser);
    } catch (error) {
      res.status(500).json({
        message: 'There was an error while saving the user to the database'
      });
    }
  }
});

server.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  dbFunctions
    .remove(id)
    .then((deleted) => {
      if (deleted) {
        res.status(200).json(deleted);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      }
    })
    .catch(() =>
      res.status(500).json({ message: 'The user could not be removed' })
    );
});

server.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ message: 'Please provide name and bio for the user' });
  } else {
    try {
      const updatedUser = await dbFunctions.update(id, changes);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: 'The user information could not be modified' });
    }
  }
});

server.use('*', (req, res) => {
  res.status(404).json({ message: '404 Not Found, sorry mate' });
});

module.exports = server;
