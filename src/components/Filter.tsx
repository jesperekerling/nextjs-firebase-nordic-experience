import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FilterProps {
  onDateChange: (startDate: Date, endDate: Date) => void;
  onGuestsChange: (guests: number) => void;
  maxGuests: number;
}

const Filter: React.FC<FilterProps> = ({ onDateChange, onGuestsChange, maxGuests }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      onDateChange(start, end);
    }
  };

  const handleGuestsChange = (newGuests: number) => {
    console.log(`Changing guests to: ${newGuests}`);
    if (newGuests >= 1 && newGuests <= maxGuests) {
      setGuests(newGuests);
      onGuestsChange(newGuests);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div>
        <label className="block mb-2 font-semibold">Select Date Range:</label>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          className="p-2 border border-gray-300 rounded"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date range"
        />
      </div>
      <div className="flex items-center">
        <label className="block mb-2 font-semibold mr-2">Number of Guests:</label>
        <button
          type="button"
          onClick={() => handleGuestsChange(guests - 1)}
          className="p-2 bg-gray-300 rounded-l"
          disabled={guests <= 1}
        >
          -
        </button>
        <span className="p-2 border-t border-b border-gray-300">{guests}</span>
        <button
          type="button"
          onClick={() => handleGuestsChange(guests + 1)}
          className="p-2 bg-gray-300 rounded-r"
          disabled={guests >= maxGuests}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Filter;