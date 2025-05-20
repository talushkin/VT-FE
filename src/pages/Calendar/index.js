import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { PATH_SEARCH, PATH_RESERVE } from "../../Util/constants.js";
import "./Calendar.scss";
import Button from "../../components/Buttons/Button/Button.jsx";
import Row from "../../components/Row/index.js";
import { UseCreateObject } from "../../Hooks/UseCreateObject.jsx";
import getHouseRules from "../../Hooks/getHouseRules.jsx";
import { baseURL } from "../../core/index.js";
import axios from "axios";
import LinesEllipsis from "react-lines-ellipsis";
import numeral from "numeral";
import DatePickerComponent from "../../components/Forms/Fields/DatePickerComponent/DatePickerComponent.jsx";
import countryList from "../../Util/data/countries.json";
import constants from "../../Util/constants.js";
import {
  calculateTotalNights,
  getStorageValue,
  isNullOrEmptyArray,
} from "../../Util/general.js";
import dayjs from "dayjs";
import makeCalculations from "../../Hooks/makeCalculations.jsx";

import LoadingBox from '../../components/LoadingBox/index.js';

const Calendar = (props) => {

  const loggedRef = useRef(false);

  const propertyId = localStorage.getItem("propertyId")
  const jToken = localStorage.getItem("jToken");
  const links = localStorage.getItem("noMenu") === 'true';
  const { agent, agency, noMenu } = props;
  const [showAll, setShowAll] = useState(false);
  const [showAllSummary, setShowAllSummary] = useState(false);
  const [showShareAsPdf, setShowShareAsPdf] = useState(false);
  const [picIndex, setPicIndex] = useState(0);
  const [rulesArray, setRulesArray] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  /*
property,
    xdata,
    fullCalendar,
    agency,
    agent,
    totalPrice,
    agencyCommision: totalPrice / 10,
    currency:selectedCurrency,
    exchangeRate
*/

  const property = location?.state?.property;
  const xdata = location?.state?.xdata;
  const fullCalendar = location?.state?.fullCalendar;
  const activeRatePlan = location?.state?.activeRatePlan;
  const channelSource = location?.state?.channelSource;
  const selectedNights = location?.state?.nights;
  const [errors, setErrors] = useState([]);
  const [startDate, setStartDate] = useState(
    dayjs(getStorageValue("dateFrom")) || null
  );
  const [endDate, setEndDate] = useState(getStorageValue("dateTo") || null);
  const SH_PROP = useState(getStorageValue("SH_PROP") || null);
  const [minStay, setMinStay] = useState(null);
  const [maxStay, setMaxStay] = useState(null);
  const [currencies, setCurrencies] = useState(localStorage.getItem("exchange") ? JSON.parse(localStorage.getItem("exchange")) : []);
  const [selectedCurrency, setSelectedCurrency] = useState(localStorage.getItem("currency"));
  const [onDemand, setonDemand] = useState(property?.tags?.indexOf("onDemand") > -1);
  const dateFrom = getStorageValue("dateFrom");
  const dateTo = getStorageValue("dateTo");
  const adults = Number(localStorage.getItem('adults') || '1');
  const children = Number(localStorage.getItem('children'))
  const ref = React.createRef();
  const [showSaveSearch, setShowSaveSearch] = useState(false);

  const [defaultPrice, setDefaultPrice] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const isBookConfirmed = searchParams.get("confirmed") ? true : false;
  const isLoading = useSelector((state) => state.property.isLoading);
  const properties = useSelector((state) => state.property.properties);
  const isSH = property ? property._id.substring(0, 2) === 'sh' : false
  const [loadingPrice, setLoadingPrice] = useState(false)
  const price = makeCalculations({
    property,
    fullCalendar,
    activeRatePlan,
    dateFrom: startDate,
    dateTo: endDate,
    adults: parseInt(localStorage.getItem("adults") || "1"),
    children: parseInt(localStorage.getItem("children") || "0"),
    currency: selectedCurrency || "USD"
  });

  const [exchangeRate, setExchangeRate] = useState(1);
  const [refreshPrice, setRefreshPrice] = useState((price?.totalAmount + price?.totalTaxes) * exchangeRate);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const formatDates = (date) => {
    return dayjs(date).format('DD-MM-YYYY')
  };

  const [form, setForm] = useState({
    clientFullName: "please choose client",
    extraDetails: "",
    destination: property?.address?.country,
    arrive: dayjs(localStorage.getItem('dateFrom')).format('DD-MM-YYYY'),
    depart: dayjs(localStorage.getItem('dateTo')).format('DD-MM-YYYY'),
    collections: "",
    amenities: "",
    guests: Number(localStorage.getItem('adults')) + Number(localStorage.getItem('children')),
    bedroom: localStorage.getItem('bedrooms'),
    priceRange: "",
    propertyType: "",
    mustHave: "",
  });

  useEffect(() => {

    const fetchCurrencies = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${jToken}`;
        const response = await axios.get(constants.SHUB_URL+"/xchange");
        const data = response.data;
        localStorage.setItem("exchange", JSON.stringify(data));
        setCurrencies(data);
      }
      catch (error) {
        console.error("Error fetching currencies:", error);
      }
    }

    const agentInfo = JSON.parse(localStorage.getItem("agent") || "{}");
    const agentCurrency = agentInfo.currency || "USD";
    console.log('selected currency:', selectedCurrency || agentCurrency || 'USD')
    console.log('CALENDAR PAGE ONLY!')
    if (!currencies) {
      fetchCurrencies();
      console.log('fetchCurrencies()')
    }
  }, [])


  useEffect(() => {
    const storedArrivalDate = localStorage.getItem("dateFrom");
    const storedDepartDate = localStorage.getItem("dateTo");

    if (storedArrivalDate && storedDepartDate) {
      const newRefreshPrice = (price.totalAmount + price.totalTaxes) / exchangeRate;
      setRefreshPrice(newRefreshPrice);
    } else {
      setRefreshPrice(0);
    }
  }, [price?.totalAmount, price?.totalTaxes, defaultPrice, exchangeRate, selectedCurrency]);


  useEffect(() => {
    localStorage.removeItem('calculated')
    console.log('isLoding:', isLoading)
  }, [isLoading]);

  useEffect(() => {
    const storedRules = JSON.parse(localStorage.getItem("rulesArray"));
    if (storedRules) {
      setRulesArray(storedRules);
    }
  }, []);

  useEffect(() => {
    const storedErrors = localStorage.getItem("bookingErrors");
    if (storedErrors) {
      setErrors(JSON.parse(storedErrors));
    }
  }, []);


  const selectedClient = JSON.parse(localStorage.getItem("selectedClient")) || {};
  const clientName = `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim();
  const clientId = selectedClient.client_id || 0;


  const handleCurrencyChange = (event) => {
    const selectedCurrencyCode = event.target.value;
    const selectedCurrency = currencies.find(
      (currency) => currency.currency_code === selectedCurrencyCode
    );
    console.log('changed cur:', selectedCurrencyCode, selectedCurrency)
    if (selectedCurrency) {
      setSelectedCurrency(selectedCurrency.currency_code);
      localStorage.setItem("currency", selectedCurrencyCode);
    }
  };


  const getCurrencyDisplayName = (currencyCode) => {
    const country = countryList.find(
      (country) => country.currency.code === currencyCode
    );
    if (country) {
      const { code, symbol, name } = country.currency;
      return `${code} ${symbol} (${name})`;
    }
    return currencyCode;
  };


  const getCurrencyDisplaySymbol = (currencyCode) => {
    const country = countryList.find(
      (country) => country.currency.code === currencyCode
    );
    if (country) {
      const { code, symbol } = country.currency;
      return `${code} ${symbol} `;
    }
    return currencyCode;
  };

  useEffect(() => {
    console.log(
      "dates have changed!",
      getStorageValue("dateFrom"),
      getStorageValue("dateTo")
    );
    const getMinStay = (day) => {
      let result = 0;
      const dayIs = dayjs(day).format("YYYY-MM-DD");
      if (fullCalendar) {
        fullCalendar
          .filter((date) => date.date.substring(0, 10) === dayIs)
          .forEach((element) => {
            result = element.minStay;
          });
      }
      if (result) {
        console.log("MinStay PER DAY:", dayIs, result);
      }
      return result;
    };

    const getMaxStay = (day) => {
      let result = 0;
      const dayIs = dayjs(day).format("YYYY-MM-DD");
      if (fullCalendar) {
        fullCalendar
          .filter((date) => date.date.substring(0, 10) === dayIs)
          .forEach((element) => {
            result = element.maxStay;
          });
      }
      result = result === 0 ? 365 : result;
      if (result) {
        console.log("MaxStay PER DAY:", dayIs, result);
      }
      return result;
    };
    const storedErrors = localStorage.getItem("bookingErrors");
    if (storedErrors) {
      setErrors(JSON.parse(storedErrors));
    }

    setDefaultPrice(false);
    if (startDate && !endDate) {
      setMinStay(getMinStay(startDate));
      setMaxStay(getMaxStay(startDate));

    } else if (!startDate && !endDate) {
      setMinStay(null);
      setMaxStay(null);
    }
  }, [startDate, endDate, fullCalendar, selectedCurrency]);

  const onChange = (arrivalDate, departDate) => {
    console.log("dates have changed!", arrivalDate, departDate);
    setStartDate(arrivalDate);
    setEndDate(departDate);
  };

  const agentID = localStorage.getItem("agent_id");


  const doBook = (params) => {
    history.push(PATH_RESERVE,
      {
        property,
        fullCalendar,
        agency,
        agent,
        totalPrice: price?.totalAmount,
        security: price?.security,
        selectedCurrency: selectedCurrency,
        activeRatePlan
      });
  };

  if (property && property !== undefined) {
    let searchPropertiesArray = [];
    let prop = UseCreateObject(property, xdata);
    let pic = null;
    let picPosition = 0;

    if (!isNullOrEmptyArray(prop?.photos) && picIndex != null) {
      pic = prop?.photos[picIndex % prop.photos.length].original;
      picPosition = picIndex % prop?.photos?.length;
    }


    const renderAmount = (title, pic, amount) => {
      return (
        <div className="property-page-body-top-left-info-amount">
          <div className="row d-flex justify-content-center m-2">
            <img src={pic} alt="" style={{ width: "40px" }} />
          </div>
          <div className="row d-flex justify-content-center m-2">{title}</div>
          <div className="row d-flex justify-content-center m-2">
            {amount ? amount : ``}
          </div>
        </div>
      );
    };



    prop = UseCreateObject(property);


    const arrivalDate = getStorageValue("dateFrom") || "";
    const departDate = getStorageValue("dateTo") || "";


    console.log('calendarId page!')

    return (
      <>
        <LoadingBox visible={isLoading} />
        <div className="property-page-wrapper fluid-container">
          <div ref={ref} className="property-page-container">
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-4 pt-0 order-md-last order-first">
                  <div className="property-page-body-top-right">
                    {((!dateFrom || !dateTo) && !onDemand) && (
                      <div className="pt-0">
                        <div
                          className="row d-flex justify-content-start"
                          style={{ color: "#606466" }}
                        >
                          Starting from
                        </div>
                        <div className="d-flex flex-row gap-2 justify-content-start align-items-center">
                          <div className="property-page-body-top-price mr-2 ">
                            <span>
                              <span
                                className="d-inline"
                                style={{ fontSize: "28px" }}
                              >
                                {getCurrencyDisplaySymbol(
                                  selectedCurrency
                                )}
                              </span>
                            </span>
                            <span style={{ fontSize: "48px" }}>
                              {` ${numeral(price?.totalAmount).format("0,0")}`}
                            </span>
                          </div>
                          <div className="property-page-body-top-night">
                            Per night
                          </div>
                        </div>
                        <div className="d-flex flex-row justify-content-start gap-2 align-items-center">
                          <div className="property-page-body-top-commission-price mr-2">
                            <span>
                              <span className="d-inline commision">
                                {getCurrencyDisplaySymbol(
                                  selectedCurrency
                                )}
                              </span>
                            </span>
                            <span style={{ fontSize: "28px" }}>
                              &nbsp;
                              {` ${numeral((price?.totalAmount) / 10).format(
                                "0,0.0"
                              )}`}
                            </span>
                          </div>
                          <div className="property-page-body-top-agency ml-2">
                            Agency Commission
                          </div>
                        </div>
                      </div>
                    )}

                    {(dateFrom && dateTo && !onDemand) && (
                      <div className="text-head-color">
                        <h3 className="text-start">Total Booking Amount</h3>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="fw-bold currency-font currency-style">
                            <span style={{ fontSize: "28px" }}>
                              {getCurrencyDisplaySymbol(
                                selectedCurrency
                              )}
                            </span>
                            {price?.totalAmount.toFixed(0)}
                          </div>
                          <div className="h5">
                            For{" "}
                            {selectedNights
                              ? selectedNights
                              : calculateTotalNights()}{" "}
                            Nights
                          </div>
                          <div>
                            <ul
                              style={{
                                listStyleType: "none",
                                padding: 0,
                                textAlign: "left",
                              }}
                            >

                              <li style={{ color: "green" }}>
                                {(minStay > 1) && (<>
                                  min:{minStay} nights <br />
                                </>)}
                                {maxStay && (<>
                                  max:{maxStay} nights <br />
                                </>)}
                              </li>
                              {errors.map((error, index) => {
                                return (
                                  <li style={{ color: "red" }} key={index}>
                                    {error}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                        <div className="property-page-body-top-commission-price mr-2">
                          <span>
                            <span className="d-inline commision">
                              {getCurrencyDisplaySymbol(
                                selectedCurrency
                              )}
                            </span>
                          </span>
                          <span style={{ fontSize: "28px" }}>
                            &nbsp;
                            {(price?.totalAmount / 10).toFixed(1)}
                          </span>
                        </div>
                        <div className="property-page-body-top-agency ml-2">
                          Agency Commission
                        </div>
                      </div>
                    )}



                    {/*                     <div className="container">
                      <div className="row">
                        <div className="col">Arrive</div>
                        <div className="col">Departure</div>
                      </div>
                    </div> */}

                    <div className="container">
                      <div className="col-lg-12 col-12 mx-1 datepicker">
                        <DatePickerComponent
                          arrivalDate={arrivalDate}
                          departDate={departDate}
                          fullCalendar={fullCalendar}
                          onChange={onChange}
                        //disabled={noMenu}
                        />
                      </div>
                    </div>

                    {!onDemand && <div className="col-12 curr-dropdown">
                      <select
                        className="form-select"
                        aria-label="Currency select"
                        onChange={handleCurrencyChange}
                        value={selectedCurrency || ""}
                      >
                        <option value="">Select Currency</option>
                        {currencies.map((currency, index) => (
                          <option key={index} value={currency.currency_code}>
                            {getCurrencyDisplayName(currency.currency_code)}
                          </option>
                        ))}
                      </select>
                    </div>
                    }

                    {onDemand && (
                      <div className="mt-3 d-flex justify-content-center">
                        This property is &nbsp;<b>"On Demand"</b>
                      </div>
                    )}
                    {agent?.role === 'admin' && property && isSH && (
                      <div className="mt-3 d-flex justify-content-center">
                        This property is &nbsp;<b>"External RU/BP"</b>
                      </div>
                    )}
                    <div className="container mt-3">
                      {dateFrom !== null &&
                        dateTo !== null &&
                        dateFrom !== "null" &&
                        dateTo !== "null" &&
                        prop?.tags.indexOf("onDemand") === -1 && (
                          <Button
                            onClick={doBook}
                            style={{ width: "100%", margin: "10px 0" }}
                            variant="primary"
                            text="Book this Property Now"
                          />
                        )}
                      {dateFrom !== null &&
                        dateTo !== null &&
                        dateFrom !== "null" &&
                        dateTo !== "null" &&
                        prop.tags.indexOf("onDemand") > -1 && (
                          <>
                            <Button
                              style={{ width: "100%" }}
                              variant="green"
                              text="Request a Hold"
                            />

                          </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Calendar;