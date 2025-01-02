import React from "react";

const DateSelector = ({ selectedDate, setSelectedDate, availableDays }) => {
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div>
      <label>Select a date: </label>
      <select value={selectedDate} onChange={handleDateChange}>
        {availableDays.map((day, index) => (
          <option key={index} value={day}>
            {day}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;
