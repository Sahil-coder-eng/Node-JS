// server.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// In-memory array to store cards
let cards = [];
let nextId = 1; // auto-incrementing ID

// -------------------------
// ROUTES
// -------------------------

// GET /cards - list all cards
app.get('/cards', (req, res) => {
  res.json({
    success: true,
    data: cards
  });
});

// POST /cards - add a new card
// Expected JSON body: { "suit": "Hearts", "value": "Ace" }
app.post('/cards', (req, res) => {
  const { suit, value } = req.body;
  if (!suit || !value) {
    return res.status(400).json({ success: false, message: 'Suit and value are required.' });
  }
  const card = { id: nextId++, suit, value };
  cards.push(card);
  res.status(201).json({ success: true, data: card });
});

// GET /cards/:id - retrieve a card by ID
app.get('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const card = cards.find(c => c.id === id);
  if (!card) {
    return res.status(404).json({ success: false, message: 'Card not found.' });
  }
  res.json({ success: true, data: card });
});

// DELETE /cards/:id - delete a card by ID
app.delete('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = cards.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Card not found.' });
  }
  const removed = cards.splice(index, 1)[0];
  res.json({ success: true, message: 'Card deleted successfully.', data: removed });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Playing Cards API running at http://localhost:${PORT}`);
});
