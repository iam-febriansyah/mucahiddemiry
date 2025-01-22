const express = require('express');
const cors = require('cors'); // Added CORS
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const logRoutes = require('./routes/logs'); // Import the log routes
const { protect } = require('./middleware/auth');
const path = require('path');
require('dotenv').config(); // Ensure environment variables are loaded

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Allows parsing JSON request bodies

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route to serve the index.html when visiting the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use the auth routes for login and registration
app.use('/api/auth', authRoutes);

// Log routes for adding and viewing logs
app.use('/api/logs', logRoutes); // Register the log routes

// Sample protected route for user logs (this can be extended for admin view)
app.get('/api/user/logs', protect, (req, res) => {
    if (req.user && req.user.isAdmin) {
        // Admin can view all users' logs here (future functionality)
        res.send('Admin view logs here');
    } else {
        // Users can only view their own logs
        res.send('User view their own logs here');
    }
});

// Start server on port specified in .env or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
