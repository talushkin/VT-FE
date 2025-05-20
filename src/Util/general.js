import moment from "moment";
import dayjs from "dayjs";
import countryList from "../Util/data/countries.json";
import { useEffect } from "react";

const log = require("loglevel").getLogger("General");
log.setLevel("error");

export const isNullOrEmpty = (value) => {
  return value == null || value === "";
};

export const isNullOrEmptyArray = (arr) => {
  return arr == null || arr.length === 0;
};
export function getStorageValue  (key) {
  if (localStorage.getItem(key)!=='undefined') {
  return localStorage.getItem(key)
  } else {return null}
};
export const calculateTotalNights = () => {
  return dayjs(getStorageValue("dateTo")).diff(
    getStorageValue("dateFrom"),
    "days"
  );
};

export const detectCurrency = (currency) => {
  const data = countryList?.filter(
    (curr) => curr?.currency?.code === currency
  )[0];
  return data?.currency?.symbol;
};

export const isPercentageOrAmount = (value, currency) => {
  return value === "FIXED" ? detectCurrency(currency) : "%";
};

export const countWeekendDays = (
  startDate = new Date(localStorage.getItem("dateFrom")),
  endDate = new Date(localStorage.getItem("dateTo")),
  weekendDays = []
) => {
  let numWeekendDays = 0;
  let currentDate = new Date(startDate.getTime());

  // Loop over each day from start date to end date
  while (currentDate <= endDate) {
    // Check if current day is Friday or Saturday
    if (
      currentDate.getDay() === (weekendDays[0] || 5) ||
      currentDate.getDay() === (weekendDays[1] || 6)
    ) {
      numWeekendDays++;
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return numWeekendDays;
};

export const isPercentage = (value) => {
  return value === "PERCENTAGE";
};
