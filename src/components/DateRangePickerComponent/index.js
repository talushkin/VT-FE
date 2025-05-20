import React, { useState } from "react";
import { DateRangePicker } from "react-dates";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "./style.css";

const DateRangePickerComponent = ({ data, setTotalNights, setTotalPrice }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);

    if (startDate && endDate) {
      let sum = 0;
      let totalSelectedDays = 0;
      localStorage.setItem("dateFrom", startDate.format("YYYY-MM-DD"));
      localStorage.setItem("dateTo", endDate.format("YYYY-MM-DD"));

      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate, "day")) {
        const formattedDate = currentDate.format("YYYY-MM-DD");
        const selectedDays = data.find((d) => d.date === formattedDate);
        if (selectedDays && selectedDays.stopSell !== "StopSell") {
          sum += selectedDays.price || 0;
          totalSelectedDays++;
        }
        currentDate = currentDate.add(1, "day");
      }
      setTotalPrice(sum);
      setTotalNights(totalSelectedDays);
      console.log("Total Price:", sum, totalSelectedDays); // Print the sum to the console (optional)
    }
  };

  const handleFocusChange = (focusedInput) => {
    setFocusedInput(focusedInput);
  };

  const isDayBlocked = (day) => {
    const blockedDay = data.find(
      (data) => data.date === day.format("YYYY-MM-DD")
    );
    return blockedDay && blockedDay.stopSell === "StopSell";
  };

  return (
    <div>
      <DateRangePicker
        startDate={startDate}
        startDateId="start_date_id"
        endDate={endDate}
        endDateId="end_date_id"
        onDatesChange={handleDatesChange}
        focusedInput={focusedInput}
        onFocusChange={handleFocusChange}
        isDayBlocked={isDayBlocked} // Disable specific dates
        numberOfMonths={2}
        showClearDates
        small={false}
      />
    </div>
  );
};

export default DateRangePickerComponent;
