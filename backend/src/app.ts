import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
console.log('[DEBUG] MONGO_URI:', process.env.MONGO_URI);
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import serverRoutes from './routes/serverRoutes';
import drawingRoutes from './routes/drawingRoutes';
import createServer from './sockets/drawingSocket';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/drawings', drawingRoutes);

// Debug : affiche toutes les routes Express
if (app._router && app._router.stack) {
  app._router.stack
    .filter((r: any) => r.route)
    .forEach((r: any) => console.log('[DEBUG ROUTE]', r.route.path, Object.keys(r.route.methods)));
}

// Socket.io setup
io.on('connection', (socket) => {
  console.log('[SOCKET][CONNECT] id:', socket.id);
});
createServer(io);
console.log('[SOCKET][BOOTSTRAP] Socket.io branché sur HTTP server');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!, { })
  .then(() => {
    console.log('MongoDB connected');
    // Start the server only after DB is connected
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });