require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors'); // Import cors middleware
const connectDB = require('./config/db');
const path = require('path'); // Import path to handle file paths
const app = express();

// Connect to MongoDB
connectDB(); 

// Middleware (body-parser for POST requests)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the 'frontend/public' directory
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Enable CORS for specific origins
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your React app's origin
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};

// Routes
const routes = require('./routes'); // Import your API routes
app.use('/api', cors(corsOptions), routes); 

// Fallback to index.html for client-side routing (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
