import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FilterProps {
  onCityChange: (city: string) => void;
  onDateChange: (startDate: Date, endDate: Date) => void;
  onGuestsChange: (guests: number) => void;
  cities: string[];
  maxGuests: number;
}

const Filter: React.FC<FilterProps> = ({ onCityChange, onDateChange, onGuestsChange, cities, maxGuests }) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(1);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    onCityChange(city);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start || undefined);
    setEndDate(end || undefined);
    if (start && end) {
      onDateChange(start, end);
    }
  };

  const handleGuestsChange = (newGuests: number) => {
    if (newGuests >= 1 && newGuests <= maxGuests) {
      setGuests(newGuests);
      onGuestsChange(newGuests);
    }
  };

  return (
    <div className="filter flex flex-wrap gap-4 mb-4 bg-secondary py-7 px-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-black mb-1">City</label>
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">People</label>
        <input
          type="number"
          value={guests}
          onChange={(e) => handleGuestsChange(parseInt(e.target.value))}
          min={1}
          max={maxGuests}
          className="p-2 border border-gray-300 text-sm rounded text-center w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Travel dates</label>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          placeholderText="Choose dates"
          className="p-2 border border-gray-300 rounded text-sm"
        />
      </div>
    </div>
  );
};

export default Filter;