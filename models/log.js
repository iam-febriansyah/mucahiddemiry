const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    username: { type: String, required: true },
    clientName: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Log', LogSchema);
