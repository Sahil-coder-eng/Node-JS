// server.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// ------------------------------
// In-memory seat storage
// ------------------------------
// Each seat has: id, status ("available", "locked", "booked"), lockedBy, lockExpires
const seats = {};
const TOTAL_SEATS = 10;

// Initialize seats
for (let i = 1; i <= TOTAL_SEATS; i++) {
  seats[i] = { id: i, status: "available", lockedBy: null, lockExpires: null };
}

// Utility to release expired locks automatically
function releaseExpiredLocks() {
  const now = Date.now();
  for (const seat of Object.values(seats)) {
    if (seat.status === "locked" && seat.lockExpires && seat.lockExpires < now) {
      seat.status = "available";
      seat.lockedBy = null;
      seat.lockExpires = null;
      console.log(`Lock expired: Seat ${seat.id} is now available.`);
    }
  }
}
// Run cleanup every 10 seconds
setInterval(releaseExpiredLocks, 10_000);

// ------------------------------
// Routes
// ------------------------------

// View all seats
app.get('/seats', (req, res) => {
  releaseExpiredLocks();
  res.json({ success: true, data: Object.values(seats) });
});

// Lock a seat for a user
// POST /lock { "seatId": 5, "userId": "userA" }
app.post('/lock', (req, res) => {
  const { seatId, userId } = req.body;
  const seat = seats[seatId];
  if (!seat) {
    return res.status(404).json({ success: false, message: "Seat not found." });
  }

  // Clean up expired locks first
  releaseExpiredLocks();

  if (seat.status === "booked") {
    return res.status(400).json({ success: false, message: "Seat already booked." });
  }

  if (seat.status === "locked" && seat.lockedBy !== userId) {
    return res.status(400).json({ success: false, message: "Seat is currently locked by another user." });
  }

  // Lock the seat for 1 minute
  seat.status = "locked";
  seat.lockedBy = userId;
  seat.lockExpires = Date.now() + 60_000; // 60 seconds
  res.json({
    success: true,
    message: `Seat ${seatId} locked for user ${userId} for 1 minute.`,
    data: seat
  });
});

// Confirm booking
// POST /confirm { "seatId": 5, "userId": "userA" }
app.post('/confirm', (req, res) => {
  const { seatId, userId } = req.body;
  const seat = seats[seatId];
  if (!seat) {
    return res.status(404).json({ success: false, message: "Seat not found." });
  }

  releaseExpiredLocks();

  if (seat.status === "booked") {
    return res.status(400).json({ success: false, message: "Seat already booked." });
  }

  if (seat.status !== "locked" || seat.lockedBy !== userId) {
    return res.status(400).json({ success: false, message: "Seat is not locked by this user or lock expired." });
  }

  // Confirm booking
  seat.status = "booked";
  seat.lockedBy = null;
  seat.lockExpires = null;
  res.json({ success: true, message: `Seat ${seatId} successfully booked by ${userId}.`, data: seat });
});

// Start server
app.listen(PORT, () => {
  console.log(`Concurrent Ticket Booking API running at http://localhost:${PORT}`);
});
