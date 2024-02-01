
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(bodyParser.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

mongoose.connect('mongodb+srv://rushidilwale19:rushikesh@cluster0.9l5ibdz.mongodb.net/ecFile', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

 
  socket.emit('welcome', 'Welcome to the WebSocket server!');

  socket.on('disconnect', () => {
    console.log('Websocket disconnected');
  });
});

// Webhook Endpoint
app.post('/webhook', (req, res) => {
  const payload = req.body;
  console.log('Received webhook payload:', payload);

  io.emit('webhook', payload); 

  res.json({ success: true });
});

// Serve uploaded files
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Routes
app.use('/', userRoutes);

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});

















// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const http = require('http');
// const socketIO = require('socket.io');
// const userRoutes = require('./routes/userRoutes');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// app.use(cors());
// app.use(bodyParser.json());

// mongoose.connect('mongodb+srv://rushidilwale19:rushikesh@cluster0.9l5ibdz.mongodb.net/ecFile', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Socket.io Connection
// io.on('connection', (socket) => {
//   console.log('Websocket connected');
// });

// // Routes
// app.use('/', userRoutes);

// server.listen(3001, () => {
//   console.log('Server is running on http://localhost:3001');
// });
