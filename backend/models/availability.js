const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    slot: { type: String, required: true }, 
    booked: { type: Boolean, default: false },
});

const availabilitySchema = new mongoose.Schema({
    date: { type: String, required: true },
    slots: [slotSchema],
});

module.exports = mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);
