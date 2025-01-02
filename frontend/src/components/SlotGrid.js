import React from "react";

const SlotGrid = ({ slots, onBook }) => {
  return (
    <div className="slot-grid">
      {slots.map((slot) => (
        <button
          key={slot._id}
          disabled={slot.booked}
          className={slot.booked ? "booked" : "available"}
          onClick={() => onBook(slot)}
        >
          {slot.slot}
        </button>
      ))}
    </div>
  );
};

export default SlotGrid;
