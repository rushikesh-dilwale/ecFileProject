const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://rushidilwale19:rushikesh@cluster0.9l5ibdz.mongodb.net/ecFile', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check MongoDB Connection
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('Websocket connected');
});

// Routes
app.use('/', userRoutes);

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
