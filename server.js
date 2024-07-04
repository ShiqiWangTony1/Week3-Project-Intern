const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Mock database for users
const users = [
  { username: 'testuser2', password: 'password222' } // Test
];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use CORS middleware
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route to handle requests to the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the MP3 streaming server. Go to /mp3 to stream the file.');
});

// Route to stream the MP3 file
app.get('/mp3', (req, res) => {
  const filePath = path.join(__dirname, 'wl_completion_sound.13a69e47a3545eb5ac81.mp3');
  console.log(`File path: ${filePath}`);

  // Check if the file exists before trying to read it
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } else {
    console.error('File not found:', filePath);
    res.status(404).send('File not found');
  }
});

// Route to handle /play
app.get('/play', (req, res) => {
  const filePath = path.join(__dirname, 'wl_completion_sound.13a69e47a3545eb5ac81.mp3');
  console.log(`File path: ${filePath}`);

  // Check if the file exists before trying to read it
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } else {
    console.error('File not found:', filePath);
    res.status(404).send('File not found');
  }
});

// Handle login request
app.post('/login', (req, res) => {
  console.log('Received login request');
  const { user, secret, remember } = req.body;
  console.log('Login request received:', { user, secret, remember });

  // Validate user credentials
  const foundUser = users.find(u => u.username === user && u.password === secret);
  if (foundUser) {
    console.log('Login successful');
    res.send('Login successful');
  } else {
    console.log('Invalid username or password');
    res.status(401).send('Invalid username or password');
  }
});

// Handle sign-up request
app.post('/signup', (req, res) => {
  console.log('Received sign-up request');
  const { user, secret } = req.body;
  console.log('Sign-up request received:', { user, secret });

  // Check if user already exists
  const existingUser = users.find(u => u.username === user);
  if (existingUser) {
    console.log('User already exists');
    res.status(400).send('User already exists');
  } else {
    // Add new user to mock database
    users.push({ username: user, password: secret });
    console.log('Sign-up successful');
    res.send('Sign-up successful');
  }
});

// Route to fetch lyrics
app.get('/lyrics', async (req, res) => {
  const { artist, title } = req.query;
  try {
    const response = await axios.get('https://api.musixmatch.com/ws/1.1/matcher.lyrics.get', {
      params: {
        q_artist: artist,
        q_track: title,
        apikey: '5bf900c01ea2326c52ffcb69853b0a26'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    res.status(500).send('Error fetching lyrics');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
