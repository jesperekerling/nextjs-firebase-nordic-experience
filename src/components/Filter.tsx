import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FilterProps {
  onDateChange: (startDate: Date, endDate: Date) => void;
  onGuestsChange: (guests: number) => void;
  maxGuests: number;
}

const Filter: React.FC<FilterProps> = ({ onDateChange, onGuestsChange, maxGuests }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(1);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start || undefined);
    setEndDate(end || undefined);
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
    <div className="filter">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        value={guests}
        onChange={(e) => handleGuestsChange(parseInt(e.target.value))}
        min={1}
        max={maxGuests}
        className="p-2 border border-gray-300 rounded"
      />
    </div>
  );
};

export default Filter;