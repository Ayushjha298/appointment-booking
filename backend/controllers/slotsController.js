const Availability = require('../models/availability');
const Booking = require('../models/booking');
const { generateSlots } = require('../utils/dateUtils');

const createSlots = async (req, res) => {
    try {
        const { startDate, endDate } = req.body; 
        const allDates = generateSlots(startDate, endDate);

        for (const date of allDates) {
            const slots = [];
            let start = 9 * 60;
            const end = 17 * 60;

            while (start < end) {
                const hoursStart = Math.floor(start / 60).toString().padStart(2, '0');
                const minutesStart = (start % 60).toString().padStart(2, '0');
                const hoursEnd = Math.floor((start + 30) / 60).toString().padStart(2, '0');
                const minutesEnd = ((start + 30) % 60).toString().padStart(2, '0');

                const slot = `${hoursStart}:${minutesStart}-${hoursEnd}:${minutesEnd}`;
                slots.push({ slot, booked: false });

                start += 30; 
            }

            await Availability.updateOne(
                { date },
                { $set: { slots } },
                { upsert: true }
            );
        }

        res.status(201).json({ message: 'Slots created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;
        const availability = await Availability.findOne({ date });

        if (!availability) {
            return res.status(404).json({ message: 'No slots available for this date' });
        }

        res.status(200).json({ slots: availability.slots });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const bookSlot = async (req, res) => {
    try {
        const { date, slot, username } = req.body;

       
        if (!username || typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: 'Invalid username' });
        }

        
        const availability = await Availability.findOne({ date });
        if (!availability) {
            return res.status(404).json({ message: 'No slots available for this date' });
        }

       
        const targetSlot = availability.slots.find(s => s.slot === slot);
        if (!targetSlot) {
            return res.status(400).json({ message: 'Invalid slot' });
        }

      
        if (targetSlot.booked) {
            return res.status(409).json({ message: 'Slot already booked' });
        }

       
        const booking = new Booking({ username, date, slot });
        await booking.save();

        
        targetSlot.booked = true;
        await availability.save();

        res.status(200).json({ message: 'Slot booked successfully', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { createSlots, getAvailableSlots, bookSlot };
