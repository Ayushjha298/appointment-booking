import axios from "axios";

const BASE_URL = "https://appointment-booking-backend-sljd.onrender.com/api";

export const fetchSlots = async (date) => {
  try {
    const response = await axios.get(`${BASE_URL}/slots?date=${date}`);
    return response.data.slots;
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw error;
  }
};

export const bookSlot = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/bookSlot`, data);
    return response.data;
  } catch (error) {
    console.error("Error booking slot:", error.response.data);
    throw error.response.data;
  }
};
