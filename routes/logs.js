const express = require('express');
const router = express.Router();
const Log = require('../models/log');
const { protect } = require('../middleware/auth');

// Route to add a log (a stop)
router.post('/add', protect, async (req, res) => {
    const { clientName, startTime, endTime } = req.body;
    const user = req.user;
    
    try {
        if (!clientName || !startTime || !endTime) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        if (!user) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        const newLog = new Log({
            username: user.username,
            clientName,
            startTime,
            endTime
        });

        await newLog.save();
        res.status(201).json({ message: 'Log added successfully', log: newLog });
    } catch (error) {
        console.error('Error adding log:', error);
        res.status(500).json({ message: 'Error saving log' });
    }
});

// Route to get logs - handles both admin and regular users
router.get('/view', protect, async (req, res) => {
    const user = req.user;
    try {
        // If user is admin, return all logs, otherwise return only user's logs
        const query = user.isAdmin ? {} : { username: user.username };
        const logs = await Log.find(query).sort({ startTime: -1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

module.exports = router;