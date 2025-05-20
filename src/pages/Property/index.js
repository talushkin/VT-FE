import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import picLeft from "../../assets/property/pic-left-dark.png";
import picLeftOn from "../../assets/property/pic-left-on-dark.png";
import picRight from "../../assets/property/pic-right-dark.png";
import picRightOn from "../../assets/property/pic-right-on-dark.png";
import saveIcon from "../../assets/property/pic-icons/save.png";
import favoriteIcon from "../.././assets/icons/favorite.png";
import likeFull from "../.././assets/icons/like-full.png";
import bathIcon from "../../assets/property/baths.png";
import bedsIcon from "../../assets/property/beds.png";
import peopleIcon from "../../assets/property/people.png";
import eventsIcon from "../../assets/collections/icons/events.png";
import familyIcon from "../../assets/collections/icons/family.png";
import petsIcon from "../../assets/collections/icons/pets.png";
import sustainIcon from "../../assets/collections/icons/sustainable.png";
import PageHeader from "../../components/PageHeader";
import ImageWithHover from "../../components/ImageWithHover";
import { PATH_SEARCH, PATH_RESERVE } from "../../Util/constants";
import "./Property.scss";
import Button from "../../components/Buttons/Button/Button";
import Row from "../../components/Row";
import { UseCreateObject } from "../../Hooks/UseCreateObject.jsx";
import getHouseRules from "../../Hooks/getHouseRules.jsx";
import { baseURL } from "../../core";
import axios from "axios";
import LinesEllipsis from "react-lines-ellipsis";
import numeral from "numeral";
import DatePickerComponent from "../../components/Forms/Fields/DatePickerComponent/DatePickerComponent.jsx";
import countryList from "../../Util/data/countries.json";
import { userRequest } from "../../api/requestMethods.js";
import SaveSearchPopup from "../../components/SelectedProperties/SaveSearchPopup/index.js";
import shareSelection from '../../assets/icons/share-selection-on.svg';
import ShareSelectionPopup from '../../components/SelectedProperties/ShareSelectionPopup';
import shareSelectionOn from '../../assets/icons/share-selection.png';
import {
  calculateTotalNights,
  getStorageValue,
  isNullOrEmptyArray,
} from "../../Util/general";
import dayjs from "dayjs";
import goBack from "../../assets/go-back.svg";
import makeCalculations from "../../Hooks/makeCalculations.jsx";
import { UPSALE, AGENCY_COMMISION } from "../../Util/constants";
import LoadingBox from '../../components/LoadingBox';
import loadingImage from '../../assets/icons/loading_ajax.gif'
import swal from "sweetalert";
import AuthService from "../../services/auth.service.js";
import Modal from "../../components/Modal/Modal.js";
import * as propertyActions from "../../store/redux/Property/actions";
import constants from "../../Util/constants"; 
const Property = (props) => {

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
  console.log('path:',location, history)
  const property = location?.state?.property;
  const xdata = location?.state?.xdata;
  console.log('data from id:',xdata,property)
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
  const [totalExPrice, setTotalExPrice] = useState(null)

  const price = makeCalculations({
    property,
    fullCalendar,
    activeRatePlan,
    dateFrom: startDate,
    dateTo: endDate,
    adults: parseInt(localStorage.getItem("adults") || "1"),
    children: parseInt(localStorage.getItem("children") || "0"),
    currency: selectedCurrency || "USD",
    setTotalExPrice
  });

  console.log("return price var",price)

  const [loadingPrice, setLoadingPrice] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(1);
  const [refreshPrice, setRefreshPrice] = useState(null);
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
    if (!currencies) {
      fetchCurrencies();
      console.log('fetchCurrencies()')
    }
  }, [])


  useEffect(() => {
    const storedArrivalDate = localStorage.getItem("dateFrom");
    const storedDepartDate = localStorage.getItem("dateTo");
    //console.log('loading?', price.loadingPrice)
    if (storedArrivalDate && storedDepartDate) {
      const newRefreshPrice = (price.totalAmount + price.totalTaxes) / exchangeRate;
      setRefreshPrice(newRefreshPrice);
    } else {
      setRefreshPrice(0);
      localStorage.removeItem("totalExPrice")
    }

  }, [price, defaultPrice, exchangeRate, selectedCurrency]);

  // useEffect(() => {
  //   console.log('PRICE LOADED?',isSH&&!localStorage.getItem("totalExPrice"))
  //   setLoadingPrice(isSH&&!localStorage.getItem("totalExPrice"))
  // }, [price,isSH]);

  useEffect(() => {
    console.log('123?', localStorage.getItem("totalExPrice"))
    setLoadingPrice(isSH&&!localStorage.getItem("totalExPrice"))
  }, [localStorage.getItem("totalExPrice")]);

  useEffect(() => {
    localStorage.removeItem('calculated') 
    console.log('isLoding:', isLoading)
  }, [isLoading]);

  useEffect(() => {
    const storedRules = JSON.parse(localStorage.getItem("rulesArray"));
    if (storedRules) {
      setRulesArray(storedRules);
    }
    localStorage.removeItem('totalExPrice')
  }, []);

  useEffect(() => {
    const storedErrors = localStorage.getItem("bookingErrors");
    if (storedErrors) {
      setErrors(JSON.parse(storedErrors));
    }
  }, []);


  const doBack = (params) => {
    history.push("/search");
    window.location.reload();
  };

  function formattedDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  const openModal = () => {
    setModalIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const selectedClient = JSON.parse(localStorage.getItem("selectedClient")) || {};
    const clientName = `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim();
    const clientId = selectedClient.client_id || 0;

    const submitPayload = {
      client_id: clientId,
      agent_id: props.agent?.agent_id,
      agency_id: props.agent?.agency_id,
      requestDate: formatDates(new Date()),
      destination: property?.address?.country,
      clientName: clientName || 'test',
      arrive: formatDates(localStorage.getItem('dateFrom')),
      depart: formatDates(localStorage.getItem('dateTo')),
      guests: ((localStorage.getItem("children")) + (localStorage.getItem("adults"))) || 1,
      bedroom: localStorage.getItem("bedrooms") || 0,
      propertyType: form.propertyType,
      collections: form.collections,
      priceRange: form.priceRange,
      offer: "",
    };

    AuthService.addWishListAPi(submitPayload)
      .then((response) => {
        closeModal();
        if (response) {
          swal({
            title: "Success",
            text: response.message,
            icon: "success",
          }).then(() => {
            history.push('/wishlist');
          });
        }
      })
      .catch((e) => {
        swal({
          title: "Error",
          text: e.response.data.message,
          icon: "error",
        });
      });
  };



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
    localStorage.removeItem('EXPriceError');
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

  const handleOpenSaveSearch = () => {
    setShowSaveSearch(true);
    document.body.style.overflow = "hidden";
  };

  const handleOpenShareAsPDF = () => {
    setShowShareAsPdf(true);
    document.body.style.overflow = "hidden";
  };

  const onChange = (arrivalDate, departDate) => {
    console.log("dates have changed!", arrivalDate, departDate);
    setStartDate(arrivalDate);
    setEndDate(departDate);
  };

  const handleCloseSaveSearch = () => {
    setShowSaveSearch(false);
    document.body.style.overflow = "auto";
  };

  let favoriteIds_localstorage = localStorage.getItem("favoriteIds");
  console.log('out',favoriteIds_localstorage)
  if( (typeof favoriteIds_localstorage === 'string' && favoriteIds_localstorage === 'undefined') || favoriteIds_localstorage === '' ) {
    console.log('In',favoriteIds_localstorage)
    localStorage.setItem("favoriteIds", []);
    favoriteIds_localstorage = [];
  } 
  const favoriteIdsArray = (Array.isArray(favoriteIds_localstorage) && favoriteIds_localstorage.length) ? JSON.parse(favoriteIds_localstorage) : favoriteIds_localstorage;
  const agentID = localStorage.getItem("agent_id");

  const [isPropertyInFavorites, setIsPropertyInFavorites] = useState(
    favoriteIdsArray ? favoriteIdsArray.includes(property?._id) : false
  );

  const favoriteAdd = async (propertyId) => {
    const favoritesResponse = await userRequest.post(
      `/favorite/add-favorite?agent_id=${agentID}&property_id=${propertyId}`
    );
  };

  const favoriteRemove = async (propertyId) => {
    const favoritesResponse = await userRequest.post(
      `/favorite/remove-favorite?agent_id=${agentID}&property_id=${propertyId}`
    );
  };

  const handleFavoriteToggle = async () => {
    try {
      setLoading(true);

      if (property) {
        const propertyId = property._id;
        if (isPropertyInFavorites) {
          await favoriteRemove(propertyId);
        } else {
          await favoriteAdd(propertyId);
        }
        setIsPropertyInFavorites(!isPropertyInFavorites);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  const setNextPic = () => {
    setPicIndex(picIndex + 1);
  };

  const setPrevPic = () => {
    let p = picIndex - 1;
    if (p < 0) {
      p += xdata?.pictures?.length || property?.pictures?.length;
    }
    setPicIndex(p);
  };

  const doSearch = (params) => {
    history.push(PATH_SEARCH);
  };


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

    const bullet = (index) => {
      return (
        <span
          key={index}
          style={{
            fontSize: "26px",
            color: index === picPosition ? "#44C8F5" : "#D1D1D1",
            padding: "0 3px",
          }}
        >
          &bull;
        </span>
      );
    };
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

    const toggleShowAllSummary = () => {
      setShowAllSummary(!showAllSummary);
    };

    const renderSentences = () => {
      const sentences = summary
        .split(".")
        .filter((sentence) => sentence.trim() !== "");

      return showAllSummary ? sentences : sentences.slice(0, 3);
    };
    const amenities = property?.amenities;
    const summary = xdata?.desc || property?.publicDescription?.summary || property?.publicDescription?.space

    const toggleShowAll = () => {
      setShowAll(!showAll);
    };

    const renderAmenitiesss = (amenitiesToShow) => {
      return amenitiesToShow.map((amenity, idx) => (
        <li key={idx}>{amenity}</li>
      ));
    };

    const columnsArray = showAll
      ? Array.from({ length: Math.ceil(amenities.length / 6) }, (_, index) =>
        amenities.slice(index * 6, index * 6 + 6)
      )
      : Array.from({ length: 3 }, (_, index) =>
        amenities.slice(index * 6, index * 6 + 6)
      );

    prop = UseCreateObject(property);
    const mapContainerStyle = {
      width: "100%",
      height: "500px",
    };

    const center = {
      lat: prop.lat,
      lng: prop.lng,
    };

    const position = {
      lat: prop.lat,
      lng: prop.lng,
    };

    const onLoad = (marker) => { };

    const calculateSummaryLines = () => {
      const sentences = summary
        .split(".")
        .filter((sentence) => sentence.trim() !== "");
      const approximateLineHeight = 20;
      const totalLines = sentences.length;
      return totalLines > 8
        ? Math.ceil((totalLines * approximateLineHeight) / 20)
        : null;
    };

    const moreThanEightLines = calculateSummaryLines();
    const arrivalDate = getStorageValue("dateFrom") || "";
    const departDate = getStorageValue("dateTo") || "";
    //console.log("property price", property?.prices?.basePrice,property?.prices?.currency, '*', exchangeRate,'(',selectedCurrency?.currency_code,')' );
    localStorage.setItem("SelectedPropertiesItem", JSON.stringify(property));
    localStorage.setItem("totalSelectedPropertiesItem", 1);
    //console.log("onDemand", onDemand)
    return (
      <>

        {!noMenu && showSaveSearch && (
          <SaveSearchPopup onClose={handleCloseSaveSearch} />
        )}
        {showShareAsPdf && (
          <ShareSelectionPopup
            title="Share selection as PDFs for the client"
            icon={shareSelection}
            agent={agent}
            agency={agency}
            selectedProperties={[{ ...property, selected: true }]}
            showShareAsPdf={showShareAsPdf}
            onClose={() => setShowShareAsPdf(false)}
          />
        )}
        <LoadingBox visible={isLoading} />
        <div className="property-page-wrapper fluid-container">
          {!noMenu && (
            <PageHeader
              agent={agent}
              agency={agency}
              bgColor="#16395C"
              doSearch={doSearch}
              onChange={onChange}
            />
          )}

          <div ref={ref} className="property-page-container">
            {!links && (
              <div
                className="link18-bold-no-line px-3"
                style={{ display: "flex" }}
                onClick={doBack}
              >
                <img onClick={doBack} src={goBack} alt="" />
                &nbsp;&nbsp;Back
              </div>
            )}
            <div className="property-main-top py-2">
              <div
                id="carouselExampleControlsNoTouching"
                className="carousel slide"
                data-bs-touch="false"
                data-bs-interval="false"
              >
                <div
                  className="carousel-inner"
                  style={{
                    paddingLeft: "30px",
                    paddingRight: "30px",
                  }}
                >
                  <div className="carousel-item active">
                    <img
                      src={pic}
                      className="d-block w-100"
                      style={{ height: "100%" }}
                      alt={pic}
                    />
                  </div>
                </div>
                <ImageWithHover
                  path={picLeft}
                  pathOver={picLeftOn}
                  className="property-page-prev-next-pic position-absolute top-50 start-0 translate-middle-y"
                  onClick={setPrevPic}
                />
                <ImageWithHover
                  path={picRight}
                  pathOver={picRightOn}
                  className="property-page-prev-next-pic position-absolute top-50 end-0 translate-middle-y"
                  onClick={setNextPic}
                />
              </div>
              <div className="property-main-picture-bullets mobile-dots">
                {property &&
                  prop?.photos &&
                  !isNullOrEmptyArray(prop?.photos) &&
                  prop?.photos.map((pic, i) => bullet(i))}
              </div>
            </div>
            <div className="container">
              <div className="row m-3">
                <div className="col-12 col-md-8 order-md-first order-last ">
                  <div className="row">
                    <div className="col">
                      <div className="property-page-body-top-title text-start property-title">
                        <span>
                          {xdata?.title || property?.title +
                            "(" +
                            property?.propertyType +
                            ")"}
                        </span>
                      </div>
                      <div className="property-page-body-top-subtitle text-start">
                        {prop?.city}, {xdata?.region || prop?.state}, {prop?.countryName}
                      </div>
                    </div>
                    <div className="col-2">
                      <span>
                        <img
                          className="property-main-picture-icon"
                          style={{ height: "35px", cursor: "pointer" }}
                          src={shareSelection}
                          alt="save searched"
                          disabled={loading}
                          onClick={handleOpenShareAsPDF}
                        />
                      </span>
                      <span>
                        <img
                          className="property-main-picture-icon"
                          style={{ height: "35px", cursor: "pointer" }}
                          src={saveIcon}
                          alt="save searched"
                          disabled={loading}
                          onClick={handleOpenSaveSearch}
                        />
                      </span>
                      <span style={{ padding: "15px" }}>
                        <img
                          className="property-main-picture-icon"
                          style={{ cursor: "pointer" }}
                          src={
                            isPropertyInFavorites ? likeFull : favoriteIcon
                          }
                          onClick={handleFavoriteToggle}
                          alt="favorite"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="border mt-4 mb-3" />
                  <div className="property-page-body-feature-row">
                    <Row mobileClass="mobile-class">
                      {renderAmount("Guests", peopleIcon, prop.accommodates)}
                      {renderAmount("Bedrooms", bedsIcon, prop.bedrooms)}
                      {renderAmount("Bathrooms", bathIcon, prop.bathrooms)}
                      {prop.tags.indexOf("eventCollection") > -1
                        ? renderAmount("Event Places", eventsIcon)
                        : ""}
                      {prop.tags.indexOf("familyCollection") > -1
                        ? renderAmount("For Families", familyIcon)
                        : ""}
                      {prop.tags.indexOf("petsCollection") > -1
                        ? renderAmount("Pets Welcome", petsIcon)
                        : ""}
                      {prop.tags.indexOf("sustainCollection") > -1
                        ? renderAmount("Sustainable", sustainIcon)
                        : ""}
                    </Row>
                  </div>
                  <div className="border mt-4 mb-3" />
                  <div>
                    <div
                      style={{
                        fontSize: "25px",
                        fontWeight: "bold",
                        paddingBottom: "8px",
                      }}
                    >
                      Overview
                    </div>
                    <ul>
                      {renderSentences().map((sentence, index) => (
                        <li style={{ paddingTop: "10px" }} key={index}>
                          {sentence}
                        </li>
                      ))}
                    </ul>
                    {moreThanEightLines && (
                      <div className="text-right d-flex justify-content-end">
                        <span
                          style={{
                            borderBottom: "1px solid blue",
                            color: "blue",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          onClick={toggleShowAllSummary}
                        >
                          {!showAllSummary ? "Read More" : "Read Less"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="border mt-4 mb-3" />
                  <div>
                    <div
                      style={{
                        fontSize: "25px",
                        fontWeight: "bold",
                        paddingBottom: "8px",
                      }}
                    >
                      Amenities
                    </div>
                    <div className="row">
                      {columnsArray.map((column, columnIndex) => (
                        <div key={columnIndex} className="col-md-4">
                          <ul>{renderAmenitiesss(column)}</ul>
                        </div>
                      ))}
                    </div>
                    {amenities.length > 18 && (
                      <div className="text-right d-flex justify-content-end">
                        <span
                          style={{
                            borderBottom: "1px solid blue",
                            color: "blue",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          onClick={toggleShowAll}
                        >
                          {!showAll ? "All Amenities" : "Less Amenities"}
                        </span>
                      </div>
                    )}
                  </div>

                  {dateTo && dateFrom &&
                    <>
                      <div className="border mt-4 mb-3" />
                      <div className="py-2">
                        <div
                          style={{
                            fontSize: "25px",
                            fontWeight: "bold",
                            paddingBottom: "8px",
                          }}
                        >
                          Check-in and Check-out
                        </div>
                        <div>
                          Check-in time is <b>{formattedDate(dateFrom)}, {property?.defaultCheckInTime}</b>
                        </div>
                        <div>
                          Check-out time is <b>{formattedDate(dateTo)}, {property?.defaultCheckOutTime}</b>
                        </div>
                      </div>
                    </>}

                  <div className="border mt-4 mb-3" />
                  <div className="py-2">
                    <div style={{ fontSize: "25px", fontWeight: "bold" }}>
                      House rules and a cancellation policy
                    </div>
                    <div>
                      <div className="row">
                        <div className="col-md-12">
                          <ul className="px-4">
                            {rulesArray.map((rule, index) => (
                              <li key={index}>{rule}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div style={{ fontSize: "20px", color: "#707070" }}>
                        <br />
                        we'll make every effort to work with property management
                        to find options if your
                        <br />
                        plans change but refunds cannot be guaranteed and and on
                        a best-effort basis.
                        <br />
                        If canceled within 60 days before arrival, a penalty fee
                        of 50% of the reservation amount will apply.
                        <br />
                        <br />
                        <div className="link18-bold">
                          <a href="/terms-and-conditions">
                            Click here to view complete property terms &
                            conditions
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-4 p-3 pt-0 order-md-last order-first">
                  <div className="property-page-body-top-right">
                    {((!dateFrom || !dateTo) && !onDemand) && (
                      <div className="p-4 pt-0">
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
                            { (<span style={{ fontSize: "48px" }}>
                              {` ${numeral(price?.totalAmount).format("0,0")}`}
                            </span>
                            )}


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
                            { (<span style={{ fontSize: "48px" }}>
                              {(price?.totalAmount / 10).toFixed(1)}
                            </span>
                            )}

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
                            {
                              loadingPrice && (
                                <span style={{ fontSize: "48px" }}>
                                  <img className="loading-image-exprice" src={loadingImage} alt="Loading" />
                                </span>
                              )}
                            {!loadingPrice && (<span style={{ fontSize: "48px" }}>
                              {` ${numeral(price?.totalAmount).format("0,0")}`}
                            </span>
                            )}
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
                            { loadingPrice&&
                               (
                                <span style={{ fontSize: "28px" }}>
                                  <img className="loading-image-exprice" src={loadingImage} alt="Loading" />
                                </span>
                              )}
                            { !loadingPrice&&(<span style={{ fontSize: "28px" }}>
                              {(price?.totalAmount / 10).toFixed(1)}
                            </span>
                            )}
                          </span>
                        </div>
                        <div className="property-page-body-top-agency ml-2">
                          Agency Commission
                        </div>
                        <div className="property-page-body-top-agency ml-2" style={{color: 'red'}}>
                          {
                            localStorage.getItem('EXPriceError') && (`${localStorage.getItem('EXPriceError')}`)
                          }
                        </div>
                      </div>
                    )}
                    <div className="container">
                      <div className="row gap-3">
                        <div className="col">Arrive</div>
                        <div className="col">Departure</div>
                      </div>
                    </div>

                    <div className="container">
                      <div className="col-lg-12 col-12 mx-1 row gap-3 datepicker">
                        <DatePickerComponent
                          arrivalDate={arrivalDate}
                          departDate={departDate}
                          fullCalendar={fullCalendar}
                          onChange={onChange}
                        //disabled={noMenu}
                        />
                      </div>
                    </div>

                    {!onDemand && <div className="col-12 curr-dropdown"style={{marginTop: "15px"}}>
                      <label style={{margin: 'unset'}}>Select your currency</label>
                      <select
                        className="form-select"
                        aria-label="Currency select"
                        onChange={handleCurrencyChange}
                        value={selectedCurrency || ""}
                        style={{marginTop: "10px"}}
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
                              onClick={openModal}
                              style={{ width: "100%" }}
                              variant="green"
                              text="Request a Hold"
                            />

                            {modalIsOpen && (
                              <Modal
                                title="Request a hold on demand property"
                                form={form}
                                onchangeHandler={handleInputChange}
                                submitHandler={submitHandler}
                                cancleClickButton={closeModal}
                                property={property}
                              />
                            )}

                          </>
                        )}
                    </div>
                    {/* <div className="d-flex justify-content-center mt-1">
                      <button onClick={openModal}>RESERVATION</button>
                      <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="GS Price and Reservation"
                        style={{
                          content: {
                            top: "50%",
                            left: "50%",
                            right: "auto",
                            bottom: "auto",
                            marginRight: "-50%",
                            transform: "translate(-50%, -50%)",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            width: "60vw",
                          },
                        }}
                      >
                        <h2>GS Price and Reservation</h2>
                        <pre>{JSON.stringify(GSPriceAndRes, null, 2)}</pre>
                        <button onClick={closeModal}>Close</button>
                      </Modal>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="property-location" style={{ width: "100%" }}>
              <div style={{ padding: "0 40px" }}>
                <h1>Location</h1>
                <div>
                  <LoadScript googleMapsApiKey="AIzaSyA6TmWVrRTP93bEIGqQG9e_1qvVwcwNJ2k">
                    <GoogleMap
                      id="marker-example"
                      mapContainerStyle={{ width: "100%", height: "500px" }}
                      zoom={14}
                      center={center}
                      options={{
                        mapTypeId: "terrain",
                        mapTypeControl: false,
                        zoomControl: true,
                        fullscreenControl: false,
                        rotateControl: false,
                        streetViewControl: false,
                      }}
                    >
                      <Marker onLoad={onLoad} position={position} />
                    </GoogleMap>
                  </LoadScript>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>

    );
  }
};

export default Property;