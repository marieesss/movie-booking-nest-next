"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateTimePicker = ({ onChange }: { onChange: (isoDate: string) => void }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const isoString = date.toISOString();
      onChange(isoString);
    }
  };
  return (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-gray-700 font-semibold">Sélectionnez une date et une heure :</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="dd/MM/yyyy HH:mm"
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholderText="Choisissez une date et une heure"
      />
    </div>
  );
};

export default DateTimePicker;
