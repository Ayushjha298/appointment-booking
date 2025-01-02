import React, { useState } from "react";
import Calendar from "react-calendar"; 
import SlotGrid from "../components/SlotGrid";
import { fetchSlots, bookSlot } from "../services/api";
import "../styles.css";
import "react-calendar/dist/Calendar.css"; 

const HomePage = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const [username, setUsername] = useState("");

    const handleDateChange = async (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
  
      setSelectedDate(formattedDate);
      setMessage("");
      setLoading(true);
      setSlots([]);
      try {
          const slots = await fetchSlots(formattedDate);
          if (slots.length === 0) {
              setMessage("No slots available for the selected date.");
          }
          setSlots(slots);
      } catch (error) {
          setMessage("Error fetching available slots. Please try again.");
      } finally {
          setLoading(false);
      }
  };
  

    const handleBookSlot = async () => {
        if (!confirmation || !username.trim()) return;
        setLoading(true);
        try {
            const response = await bookSlot({
                date: selectedDate,
                slot: confirmation.slot,
                username,
            });
            setMessage(response.message || "Booking successful!");
            setConfirmation(null);
            setUsername("");
            handleDateChange(new Date(selectedDate));
        } catch (error) {
            setMessage(
                error.message ||
                    "An error occurred while booking. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancelConfirmation = () => {
        setConfirmation(null);
        setUsername("");
    };

    return (
        <div className="page">
            <h1>Book Your Slot</h1>

            <div className="card">
                <h2 className="section-title">Select a Date</h2>
                <Calendar
                    onChange={handleDateChange} 
                    value={selectedDate ? new Date(selectedDate) : new Date()}
                />
            </div>

            <div className="card">
                <h2 className="section-title">Available Slots</h2>
                {loading && (
                    <p className="loading-text">Loading available slots...</p>
                )}
                {!loading && slots.length > 0 ? (
                    <SlotGrid
                        slots={slots}
                        onBook={(slot) => setConfirmation(slot)}
                    />
                ) : (
                    <p>
                        {"No slots available for the selected date."}
                    </p>
                )}
            </div>

            {confirmation && (
                <div className="overlay">
                    <div className="dialog-content">
                        <h2 className="dialog-title">Confirm Booking</h2>
                        <p>
                            You are booking the slot:{" "}
                            <strong>{confirmation.slot}</strong>
                        </p>
                        <p>
                            Selected Date:{" "}
                            <strong>
                                {new Date(selectedDate).toDateString()}
                            </strong>
                        </p>
                        <label className="input-label">
                            Enter your name:
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your Name"
                                required
                                className="input-field"
                            />
                        </label>
                        <div className="button-container">
                            <button
                                onClick={handleBookSlot}
                                disabled={loading || !username.trim()}
                                className="confirm-button"
                            >
                                {loading ? "Booking..." : "Confirm"}
                            </button>
                            <button
                                onClick={handleCancelConfirmation}
                                disabled={loading}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
