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
    .catch((error) => res.status(500).json({ error: error.message }));
});

server.get('/users/:id', (req, res) => {
  const { id } = req.params;
  dbFunctions
    .findById(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: `No user with the id of ${id}` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

server.post('/users', async (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.bio) {
    res.status(401).json({ message: 'Name and bio are required' });
  } else {
    try {
      const newlyCreatedUser = await dbFunctions.insert(newUser);
      res.status(201).json(newlyCreatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
          .json({ message: `User with id of ${id} cannot be found` });
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
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

module.exports = server; // EXPORT YOUR SERVER instead of {}

// //POST a new user to the user array
// server.post('/users', (req, res) => {
//   const { name, role } = req.body;
//   if (!name || !role) {
//     res.status(400).json({ message: 'Name and role are required' });
//   } else {
//     const newUser = { id: generate(), name, role };
//     users.push(newUser);
//     res.status(200).json(newUser);
//   }
// });

// //GET the array of users
// server.get('/users', (req, res) => {
//   res.status(200).json(users);
// });

// //GET an individual user with this id
// server.get('/users/:id', (req, res) => {
//   const idVar = req.params.id;
//   const user = users.find((usr) => usr.id === idVar);
//   if(!user){
//     res.status(404).json({message: `ID: ${idVar} does not exist`})
//   } else{
//     res.status(200).json(user);
//   }
//   //something goes here?
// });

// //DELETE user with this id
// server.delete('/users/:id', (req, res) => {
//   res.status(status).json({ message: 'successMessage' });
// });

// //PUT update the user with this id
// server.put('/users/:id', (req, res) => {
//   res.status(status).json({ message: 'successMessage' });
// });

// server.use('*', (req, res) => {
//   res.status(404).json({ message: '404 Not Found, sorry mate' });
// });
