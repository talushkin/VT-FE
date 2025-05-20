import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DateRangePicker } from "react-dates";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "./DatePickerComponent.scss"; // Ensure this import is correct
import dayjs from "dayjs";
import moment from "moment";
import clearIcon from '../../../../assets/icons/closeIcon.png'

const DatePickerComponent = ({ arrivalDate, departDate, fullCalendar, onChange, disabled }) => {
  const location = useLocation();
  const isPropertyPath = location.pathname.includes('property');
  const blocked = fullCalendar ? fullCalendar.filter((element) => (element?.allotment === 0)) : [];
  const blockedDates = blocked.map((x) => x.date.substring(0, 10));
  const [startDate, setArrivalDate] = useState(null);
  const [minNights, setMinNights] = useState(0);
  const [endDate, setDepartDate] = useState(null);
  const [firstBlock, setFirstBlock] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const getOrientation = () => {
    if (isPropertyPath) {
      return "vertical";
    }
    return window.matchMedia("(max-width: 768px)").matches ? "vertical" : "horizontal";
  };

  const [orientation, setOrientation] = useState(getOrientation());

  useEffect(() => {
    console.log(isPropertyPath); // Logs the value of isPropertyPath
  }, [isPropertyPath]);

  useEffect(() => {
    setMinNights(localStorage.getItem("minNights"));
  }, []);
  
  const changeDates = () => {
    if (arrivalDate && departDate) {
      const updatedArrivDate = moment.isMoment(arrivalDate)
        ? arrivalDate
        : moment(arrivalDate);
      const updatedDepartDate = moment.isMoment(departDate)
        ? departDate
        : moment(departDate);
      setArrivalDate(updatedArrivDate);
      setDepartDate(updatedDepartDate);

      if (!updatedArrivDate.isValid()) {
        setArrivalDate(null);
      } else {
        setArrivalDate(updatedArrivDate);
      }

      if (!updatedDepartDate.isValid()) {
        setDepartDate(null);
      } else {
        setDepartDate(updatedDepartDate);
      }
    }
  };

  const handleDatesChange = ({ startDate, endDate }) => {
    const dateFromValid = dayjs(startDate).isValid();
    const dateToValid = dayjs(endDate).isValid();

    setArrivalDate(startDate);
    setDepartDate(endDate);

    if (startDate === null || endDate === null) {
      localStorage.removeItem("dateFrom");
      localStorage.removeItem("dateTo");
    } else {
      localStorage.setItem("dateFrom", startDate);
      localStorage.setItem("dateTo", endDate);
    }

    if (fullCalendar && dateFromValid) {
      UntilFirstBlock(startDate, endDate);
      if (firstBlock && !dayjs(startDate).isBefore(dayjs(firstBlock))) {
        return; // Exit early if the endDate is reset
      }
    } else {
      setFirstBlock(null);
    }
    onChange(startDate, endDate);
  };

  useEffect(() => {
    changeDates();
  }, [arrivalDate, departDate]);

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(getOrientation());
    };

    window.addEventListener("resize", handleOrientationChange);
    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [isPropertyPath]);

  const UntilFirstBlock = (startDate, endDate) => {
    if (fullCalendar) {
      const firstDay = dayjs(startDate).format("DD-MM-YYYY");
      console.log("find first block after date:", firstDay);
      const firstBlock = fullCalendar.findIndex((element) => dayjs(startDate).isBefore(element.date) && !element.allotment);
      if (firstBlock > -1) {
        const block = fullCalendar[firstBlock];
        console.log("first block is", dayjs(block.date).format("DD-MM-YYYY"));
        setFirstBlock(block.date);
      }
    } else if (!startDate && !endDate) {
      setFirstBlock(null);
    }
  };

  const shouldDisableDate = (day) => {
    const today = dayjs();
    const dayIs = dayjs(day);
    const currentDate = dayIs.format("YYYY-MM-DD");
    if ((day.isBefore(today, "day")) || blockedDates.includes(currentDate) ||day.isBefore(startDate, "day") ) {
      return true;
    }
    if (firstBlock && startDate) {
      const blockDay = dayjs(firstBlock);
      if (blockDay.isBefore(day)) {
        return true;
      }
    }
    if (startDate ) {
      const maxNights=parseInt(localStorage.getItem("maxNights"))||365
      const diffDays = Math.ceil((day -startDate) / (1000 * 60 * 60 * 24));
      if (diffDays > maxNights) {
        return true
    }
    return false;
  }
}

  const dateInputStyle = {
    padding: isPropertyPath ? '0' : '0 10px'
  };

  return (
    <div className={isPropertyPath ? "propertyDatePicker" : ""}>
      <DateRangePicker
        className="datepicker"
        startDate={startDate}
        minimumNights={isPropertyPath ? parseInt(minNights) : 1}
        endDate={endDate}
        numberOfMonths={2}
        onDatesChange={handleDatesChange}
        focusedInput={focusedInput}
        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
        isOutsideRange={() => false}
        showClearDates
        customArrowIcon={null}
        // customCloseIcon={<CloseTwoToneIcon fontSize="medium" />}
        customCloseIcon={<img src={clearIcon} alt="" style={{ cursor: "pointer", width: "18px", marginRight: "5px" }}/>}
        isDayBlocked={shouldDisableDate}
        startDatePlaceholderText="Arrive"
        endDatePlaceholderText="Depart"
        startDateId={isPropertyPath ? "property-arrivedate" : "arrivedate"}
        endDateId={isPropertyPath ? "property-departdate" : "departdate"}
        displayFormat="DD.MM.YYYY"
        orientation={orientation}
        disabled={disabled}  
      />
      <style>
        {`
          .DateInput {
            display: flex !important;
            width: 100% !important;
            border-radius: 4px !important;
            padding: ${dateInputStyle.padding} !important;
          }
        `}
      </style>
    </div>
  );
};

export default DatePickerComponent;
