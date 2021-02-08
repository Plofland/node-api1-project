const server = require('./api/server');

const port = 5000;

// START YOUR SERVER HERE

const express = require('express');
const generate = require('shortid').generate;

const app = express();
app.use(express.json());

let users = [
  { id: generate(), name: 'Pathfinder', role: 'Support/Scout' },
  { id: generate(), name: 'Octane', role: 'Forward/Offence' },
  { id: generate(), name: 'Wraith', role: 'Forward/Offence' },
  { id: generate(), name: 'Wattson', role: 'Support/Defence' },
  { id: generate(), name: 'Crypto', role: 'Scout' }
];

app.post('/api/users', (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) {
    res.status(400).json({ message: 'Name and role are required' });
  } else {
    const newUser = { id: generate(), name, role };
    users.push(newUser);
    res.status(200).json(newUser);
  }
});

app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

app.get('/api/users/:id', (req, res) => {
  res.status(status).json({ message: 'successMessage' });
});

app.delete('/api/users/:id', (req, res) => {
  res.status(status).json({ message: 'successMessage' });
});

app.put('/api/users/:id', (req, res) => {
  res.status(status).json({ message: 'successMessage' });
});
