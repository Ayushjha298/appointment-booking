const express = require('express');
const { createSlots, getAvailableSlots, bookSlot } = require('../controllers/slotsController');

const router = express.Router();

router.post('/createSlots', createSlots);

router.get('/slots', getAvailableSlots);

router.post('/bookSlot', bookSlot);

module.exports = router;
