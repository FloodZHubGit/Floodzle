import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the dictionary functions
const dictionaryPath = join(__dirname, '..', 'src', 'components', 'Dictionnary.js');
const dictionaryModule = await import(`file://${dictionaryPath}`);
const { getRandomWord } = dictionaryModule;

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST"]
  }
});

// Store rooms and game states
const gameRooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Create a new game room
  socket.on('createRoom', () => {
    const roomCode = generateRoomCode();
    
    // Create room with initial state
    gameRooms[roomCode] = {
      players: [{ id: socket.id, ready: false }],
      wordToGuess: getRandomWord(),
      started: false,
      scores: {}
    };

    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, playerId: socket.id });
    console.log(`Room created: ${roomCode}`);
  });

  // Join an existing room
  socket.on('joinRoom', (roomCode) => {
    const room = gameRooms[roomCode];
    
    if (!room) {
      socket.emit('error', { message: 'Room does not exist' });
      return;
    }

    if (room.started) {
      socket.emit('error', { message: 'Game already in progress' });
      return;
    }

    if (room.players.length >= 4) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    // Add player to room
    room.players.push({ id: socket.id, ready: false });
    room.scores[socket.id] = 0;

    socket.join(roomCode);
    socket.emit('roomJoined', { roomCode, playerId: socket.id });
    io.to(roomCode).emit('playerJoined', { players: room.players });
    console.log(`Player ${socket.id} joined room ${roomCode}`);
  });

  // Player ready
  socket.on('playerReady', (data) => {
    const { roomCode } = data;
    const room = gameRooms[roomCode];
    
    if (!room) return;

    // Set player to ready
    const player = room.players.find(p => p.id === socket.id);
    if (player) player.ready = true;

    // Check if all players are ready
    const allReady = room.players.every(p => p.ready);
    
    io.to(roomCode).emit('playerReadyUpdate', { players: room.players });
    
    if (allReady && room.players.length > 1) {
      // Start the game
      room.started = true;
      io.to(roomCode).emit('gameStart', { wordToGuess: room.wordToGuess });
    }
  });

  // Player's move
  socket.on('playerMove', (data) => {
    const { roomCode, row, text, status } = data;
    const room = gameRooms[roomCode];
    
    if (!room) return;

    // Broadcast move to all players in the room except sender
    socket.broadcast.to(roomCode).emit('opponentMove', {
      playerId: socket.id,
      row,
      text,
      status
    });
  });

  // Player wins round
  socket.on('playerWin', (data) => {
    const { roomCode } = data;
    const room = gameRooms[roomCode];
    
    if (!room) return;

    // Update score
    room.scores[socket.id] = (room.scores[socket.id] || 0) + 1;
    
    // Notify all players about the win
    io.to(roomCode).emit('roundComplete', { 
      winner: socket.id, 
      scores: room.scores,
      wordToGuess: room.wordToGuess
    });

    // Start new round after a delay
    setTimeout(() => {
      if (gameRooms[roomCode]) {
        // Reset game state for new round
        room.wordToGuess = getRandomWord();
        room.players.forEach(p => p.ready = false);
        io.to(roomCode).emit('newRound', { wordToGuess: room.wordToGuess });
      }
    }, 5000);
  });

  // Leave room
  socket.on('leaveRoom', (roomCode) => {
    leaveRoom(socket, roomCode);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    
    // Find and leave all rooms this socket is in
    Object.keys(gameRooms).forEach(roomCode => {
      const room = gameRooms[roomCode];
      if (room.players.some(p => p.id === socket.id)) {
        leaveRoom(socket, roomCode);
      }
    });
  });
});

// Helper function to handle a player leaving a room
function leaveRoom(socket, roomCode) {
  const room = gameRooms[roomCode];
  if (!room) return;

  const playerIndex = room.players.findIndex(p => p.id === socket.id);
  if (playerIndex !== -1) {
    room.players.splice(playerIndex, 1);
    delete room.scores[socket.id];
    
    socket.leave(roomCode);
    
    if (room.players.length === 0) {
      // Delete the room if empty
      delete gameRooms[roomCode];
      console.log(`Room ${roomCode} deleted (empty)`);
    } else {
      // Notify remaining players
      io.to(roomCode).emit('playerLeft', { players: room.players });
    }
  }
}

// Generate a random 4-character room code
function generateRoomCode() {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 6).toUpperCase();
  } while (gameRooms[code]);
  return code;
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});