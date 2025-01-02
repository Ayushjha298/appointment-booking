require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const slotRoutes = require('./routes/slots');

const app = express();

// Middleware
app.use(express.json());

// Enable CORS
const corsOptions = {
    origin: 'https://appointment-booking-frontend-o55k.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
};
app.use(cors(corsOptions));

connectDB();

app.use('/api', slotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
