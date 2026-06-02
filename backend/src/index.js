require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { initDb } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const meetingRoutes = require('./routes/meetings');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendPath));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/meetings', meetingRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const rooms = {};

function socketAuth(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

io.on('connection', (socket) => {
  const user = socketAuth(socket.handshake.auth?.token);
  if (!user) {
    socket.emit('error', 'Autentikasi gagal');
    socket.disconnect();
    return;
  }

  socket.user = user;

  socket.on('join-room', ({ roomId }) => {
    if (!roomId) return;
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = new Set();
    rooms[roomId].add(socket.id);
    const participants = Array.from(rooms[roomId]).map(id => {
      const s = io.sockets.sockets.get(id);
      return s ? { socketId: id, userId: s.user?.id, name: s.user?.name } : null;
    }).filter(Boolean);
    socket.emit('room-joined', { roomId, participants });
    socket.to(roomId).emit('user-joined', {
      socketId: socket.id,
      userId: user.id,
      name: user.name
    });
  });

  socket.on('leave-room', ({ roomId }) => {
    if (roomId) {
      socket.leave(roomId);
      rooms[roomId]?.delete(socket.id);
      if (rooms[roomId]?.size === 0) delete rooms[roomId];
      socket.to(roomId).emit('user-left', { socketId: socket.id });
    }
  });

  socket.on('offer', ({ to, offer }) => {
    io.to(to).emit('offer', { from: socket.id, offer });
  });

  socket.on('answer', ({ to, answer }) => {
    io.to(to).emit('answer', { from: socket.id, answer });
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    io.to(to).emit('ice-candidate', { from: socket.id, candidate });
  });

  socket.on('disconnect', () => {
    for (const [roomId, members] of Object.entries(rooms)) {
      if (members.has(socket.id)) {
        members.delete(socket.id);
        if (members.size === 0) delete rooms[roomId];
        socket.to(roomId).emit('user-left', { socketId: socket.id });
      }
    }
  });
});

(async () => {
  await initDb();
  server.listen(PORT, () => {
    console.log(`Virtual Campus API running on http://localhost:${PORT}`);
  });
})();
