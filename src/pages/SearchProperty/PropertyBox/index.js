import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import bathsIcon from "../../../assets/property/baths.png";
import picLeft from "../../../assets/property/pic-left.svg";
import picLeftOn from "../../../assets/property/pic-left-on.svg";
import picRight from "../../../assets/property/pic-right.svg";
import picRightOn from "../../../assets/property/pic-right-on.svg";
import likeFull from "../../../assets/icons/like-full.png";
import favoriteIcon from "../../../assets/icons/favorite.png";
import bedsIcon from "../../../assets/property/beds.png";
import peopleIcon from "../../../assets/property/people.png";
import mapIcon from "../../../assets/property/map-pin.svg";
import downloadPdf from "../../../assets/property/download-pdf-icon.svg";
import eventsIcon from "../../../assets/collections/icons/events.png";
import familyIcon from "../../../assets/collections/icons/family.png";
import petsIcon from "../../../assets/collections/icons/pets.png";
import sustainIcon from "../../../assets/collections/icons/sustainable.png";
import selectedProperty from "../../../assets/property/selected.png";
import unselectedProperty from "../../../assets/property/unselected.png";
import numeral from "numeral";
import "./PropertyBox.scss";
import {
  isNullOrEmptyArray,
  detectCurrency,
  isPercentageOrAmount,
  isPercentage, // Ensure this is imported
} from "../../../Util/general";
import ImageWithHover from "../../../components/ImageWithHover";
import constants, { PATH_PROPERTY } from "../../../Util/constants";
import axios from "axios";
import

makeCalculations from "../../../Hooks/makeCalculations.jsx";
import dayjs from "dayjs";
import countryList from "../../../Util/data/countries.json";

const PropertyBox = (props) => {
  const villaParamProps = props.villaParamProps;
  const [picIndex, setPicIndex] = useState(0);
  const {
    villa,
    agent,
    agency,
    property,
    xdata,
    fullCalendar,
    ratePlan,
    bookingLimits,
    selected,
    favorited,
    dontSelect,
    onToggle,
    arrivalDate, // Passed from SearchProperty
    departDate,
    onDemand,
    selectedCurrency,
    selectedProps=false,
    exchangeRate,
    selectedPrices,
    setSelectedPrices={}
  } = props;
  const storedArrivalDate = localStorage.getItem("dateFrom");
  const storedDepartDate = localStorage.getItem("dateTo");

  let price = makeCalculations({
    property,
    fullCalendar,
    dateFrom: localStorage.getItem("dateFrom"),
    dateTo: localStorage.getItem("dateTo"),
    children: parseInt(localStorage.getItem("children") || "0"),
    adults: parseInt(localStorage.getItem("adults") || "1"),
    currency: selectedCurrency|| "USD",
  });

  const [count, setCount] = useState(parseInt(localStorage.getItem("count") || 0)); // Defined count state
  const [mapOpened, setMapOpened] = useState(false); // Defined mapOpened state
    useState(0);
  const [totalPrice, setTotalPrice] = useState(0);


  const [favorites, setFavorites] = useState(favorited);
  const history = useHistory();
  const location = useLocation();
  const [refreshPrice, setRefreshPrice] = useState(0);
  const [screenSize, setScreenSize] = useState(
    getStorageValue("screenSize", 0)
  );


  useEffect(() => {
    const agentInfo = JSON.parse(localStorage.getItem("agent") || "{}");
    const agentCurrency = agentInfo.currency || "";
    const handleResize = () => {
      const size = window.innerWidth;
      localStorage.setItem("screenSize", size);
      setScreenSize(size);
    };

    window.addEventListener("resize", handleResize);

    const handleStorageChange = (e) => {
      if (e.key === "screenSize") {
        setScreenSize(parseInt(e.newValue, 10));
      }
    };
    localStorage.removeItem("clientEmail");
    window.addEventListener("storage", handleStorageChange);
    localStorage.setItem('currency', agentCurrency);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);



  // useEffect(() => {
  //   if (arrivalDate && departDate) {
  //     setRefreshPrice((price.totalAmount + price.totalTaxes)*exchangeRate);
  //     setTotalPrice(price.totalAmount*exchangeRate || 0);
  //   } else {
  //     setRefreshPrice(0);
  //     setTotalPrice(price.totalAmount*exchangeRate || 0);
  //     console.log(' change to /night as no dates selected , refreshPrice=0, ')
      
  //   }
  // }, [arrivalDate, departDate, price.totalAmount, price.totalTaxes, exchangeRate]);


  useEffect(() => {
      console.log('cur:',selectedCurrency)
      const exchangeRates = JSON.parse(localStorage.getItem("exchange") || "[]");
      const exchangeRate = exchangeRates.find(
        (rate) => rate.currency_code === selectedCurrency
      )?.conversion_rates || 1;
      console.log('newExchange:',exchangeRate)
      console.log(property,
        fullCalendar)
      const newP = makeCalculations({
        property,
        fullCalendar,
        dateFrom: localStorage.getItem("dateFrom"),
        dateTo: localStorage.getItem("dateTo"),
        children: parseInt(localStorage.getItem("children") || "0"),
        adults: parseInt(localStorage.getItem("adults") || "1"),
        currency: selectedCurrency|| "USD",
      });
      //console.log(newP)
      const newRefreshPrice = newP?.totalAmount + newP?.totalTaxes
      const newTotal = newP?.totalAmount
      console.log('newPrice:',newRefreshPrice)
      console.log('totalPrice:',newTotal)
      setRefreshPrice(newRefreshPrice);
      setTotalPrice(newTotal);
      // if (selectedProps)
      // {
      //   console.log(' price of prop:',property._id,
      //     property?.price
      //   )
      //   console.log('selectedPrices',selectedPrices)
      // }

      // add the refreshedPrice to selectedPrices if the property is (selected)
      // if (selected) {
      //   updatePrices({ propertyId: property._id, prices: price })
      //  // console.log(property._id, price);
        
      // }
      // localStorage.setItem(`refreshPrice_${property._id}`, newRefreshPrice);
  }, [price.totalAmount, price.totalTaxes, exchangeRate, selectedCurrency]);


  useEffect(() => {
    const load = async () => {
      // any additional logic for loading can be added here
    };
    load();
  }, [villa]);

  const token = localStorage.getItem("jToken");
  const baseURL = constants.BASE_URL; // Define your base URL here
  const userRequest = axios.create({
    baseURL: baseURL,
    headers: {
      token: `Bearer ${token}`,
    },
  });

  const savePricesAndToggle = () => {
    if (property?._id && price) {
      console.log('propertyId and price:', property._id, price);  // These are defined
      property.price=price
      console.log(property)
      onToggle(property);
       // Ensure these arguments are passed correctly
    } else {
      console.error('Missing property._id or price');
    }
  };
  
 

  const favoriteAdd = async (propertyId) => {
    const agentID = localStorage.getItem("agent_id");

    const favoritesResponse = await userRequest.post(
      `/favorite/add-favorite?agent_id=${agentID}&property_id=${propertyId}`
    );
  };

  function getStorageValue(key, defaultValue) {
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : defaultValue;
  }

  const favoriteRemove = async (propertyId) => {
    const agentID = localStorage.getItem("agent_id");
    const favoritesResponse = await userRequest.post(
      `/favorite/remove-favorite?agent_id=${agentID}&property_id=${propertyId}`
    )
    console.log(favoritesResponse)
  };

  const hotDestinationAdd = async (location) => {
    const { destination = "", country } = location
    const HotDestResponse = await userRequest.post(
      `/hotdestination/add-one-like?country=${country}&destination=${destination}`
    )
    console.log(HotDestResponse)
  };

  const hotDestinationDec = async (location) => {
    const { destination = "", country } = location
    const HotDestResponse = await userRequest.post(
      `/hotdestination/remove-one-like?country=${country}&destination=${destination}`
    )
    console.log(HotDestResponse)
  };

  const isOnDemand = (property) => {
    if (property) {
      if (property.tags) {
        if (Array.isArray(property.tags)) {
          if (property.tags.includes("onDemand")) {
            return true;
          }
        } else {
          return false;
        }
      }
    }
    return false;
  };

  const isSH = (property) => {
    return property._id?.substring(0, 2) === 'sh'
  };

  const loadFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (savedFavorites) {
      setFavorites(savedFavorites);
    }
  };

  const toggleFavorites = () => {
    const updatedFavorites = !favorites;
    setFavorites(updatedFavorites);

    const favoritePropertyIds =
      (localStorage.getItem("favoritePropertyIds") &&
        JSON.parse(localStorage.getItem("favoritePropertyIds"))) ||
      [];

    if (updatedFavorites) {
      if (!favoritePropertyIds.includes(property._id)) {
        favoritePropertyIds.push(property._id);
        localStorage.setItem(
          "favoritePropertyIds",
          JSON.stringify(favoritePropertyIds)
        );
        favoriteAdd(property._id);
        hotDestinationAdd({ destination: xdata?.region, country: xdata?.country });
      }
    } else {
      const index = favoritePropertyIds.indexOf(property._id);
      if (index > -1) {
        favoritePropertyIds.splice(index, 1);
        localStorage.setItem(
          "favoritePropertyIds",
          JSON.stringify(favoritePropertyIds)
        );
        favoriteRemove(property._id);
        hotDestinationDec({ destination: xdata?.region, country: xdata?.country });
      }
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const favoritePropertyIds =
    (localStorage.getItem("favoritePropertyIds") &&
      JSON.parse(localStorage.getItem("favoritePropertyIds"))) ||
    [];
  const isFavorite = favoritePropertyIds.includes(property._id);

  let renderedIcons = 0;

  const renderLimitedCollectionIcon = (collectionType, icon) => {
    if (renderedIcons < 2) {
      renderedIcons++;
    return renderCollectionIcon(collectionType, icon);
    } else {
      return null;
    }
  };

  const renderCollectionIcon = (collection, icon) => {
    return (
      <div className="property-box-footer-left-icon-small">
        <img src={xdata?.tags?.indexOf(collection) > -1 ? icon : ""} />
      </div>
    );
  };


  const getCurrencyDisplaySymbol = (currencyCode) => {
    const country = countryList.find(
      (country) => country.currency.code === currencyCode
    );
    if (country) {
      const { code, symbol } = country.currency;
      return `${symbol} `;
    }
    return currencyCode;
  };

  const showProperty = () => {
    localStorage.setItem("propertyId", property._id);
    localStorage.setItem("minNights", property.terms.minNights);

    //history.push(`${PATH_PROPERTY}/${property._id}`, {
    history.push(`${PATH_PROPERTY}`, {
      property,
      xdata,
      fullCalendar,
      agency,
      agent,
      totalPrice,
      agencyCommision: totalPrice / 10,
      currency:selectedCurrency,
      exchangeRate,
      isLoading:false,
      selectedCurrency
    });
  };

  let pic = null;

  const setNextPic = () => {
    setPicIndex(picIndex + 1);
  };

  const setPrevPic = () => {
    let p = picIndex - 1;
    if (p < 0) {
      p += property.pictures.length;
    }
    setPicIndex(p);
  };

  if (!isNullOrEmptyArray(property.pictures)) {
    pic = //property.pictures[picIndex % property.pictures.length].thumbnail||
    property.pictures[picIndex % property.pictures.length].original||
    property.pictures[picIndex % property.pictures.length].thumbnail;
  }

  const regularProperties = [];
  const onDemandProperties = [];
  if (property) {
    if (isOnDemand(property)) {
      onDemandProperties.push(property);
    } else {
      regularProperties.push(property);
    }
  }

  const renderCollections = () => {
    const iconMappings = [
      { key: "familyCollection", icon: familyIcon },
      { key: "petsCollection", icon: petsIcon },
      { key: "eventCollection", icon: eventsIcon },
      { key: "sustainCollection", icon: sustainIcon }
    ];
    const filteredIcons = iconMappings.filter(({ key }) => xdata.tags.indexOf(key) > -1);
    // const leftColumn = filteredIcons.filter((_, index) => index % 2 === 0);
    // const rightColumn = filteredIcons.filter((_, index) => index % 2 !== 0);
    // Group icons into sections with max 2 items per section
    const sections = [];
    for (let i = 0; i < filteredIcons.length; i += 2) {
      sections.push(filteredIcons.slice(i, i + 2));
    }
    console.log(filteredIcons, sections)

    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={`section${sectionIndex + 1}`} style={{ display: "flex", flexDirection: "column" }}>
            {section.map((item, index) => (
              <div key={index} className="property-box-footer-left-icon-small">
                <img src={item.icon} alt={item.key} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
    // console.log(filteredIcons)

    // <div>
            
    //   {screenSize > 800 && (
    //     <div>
    //       {renderLimitedCollectionIcon("familyCollection", familyIcon)}
    //       {renderLimitedCollectionIcon("petsCollection", petsIcon)}
          
    //     </div>
    //   )}
    // </div>
    // return '';
  }

  return (
    <div
      className={`property-box-wrapper ${!villaParamProps && count > 2 && screenSize > 1750
        ? "col-xxl-4"
        : "col-lg-6"
        } col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12`}
      style={{
        padding: "20px",
        paddingTop: 0,
        overflow: villaParamProps ? "auto" : "hidden",
      }}
    >
      <div
        className="property-box-container"
        style={{
          backgroundImage: pic ? `url(${pic})` : "transparent",
          backgroundSize: "cover",
          height: "300px",
          maxWidth: "100%",
        }}
      >
        <ImageWithHover
          path={picLeft}
          pathOver={picLeftOn}
          className="property-box-prev-next-pic"
          style={{ left: "10px" }}
          onClick={setPrevPic}
        />
        <div
          className="property-box-center"
          onClick={() => showProperty(property._id)}
        />
        <ImageWithHover
          path={picRight}
          pathOver={picRightOn}
          className="property-box-prev-next-pic"
          style={{ right: "10px" }}
          onClick={setNextPic}
        />
        <div className="property-box-selected-icon d-flex" onClick={savePricesAndToggle}>
          {favorited || dontSelect ? (
            ""
          ) : (
            <div className="selectedProperty-toggle">
              <img
                src={selected ? selectedProperty : unselectedProperty}
                alt=""
              />
            </div>
          )}
          {property && mapOpened && (
            <div className="selectedProperty-toggle">
              <img src={mapIcon} alt="" />
            </div>
          )}
          <div className="onDemand-container">
            {property && isOnDemand(property) && (
              <button
                className="btn-onDemand btn btn-success"
                style={{ fontSize: "14px !important", alignItems: "center" }}
              >
                On Demand
              </button>
            )}
          </div>
          <div className="onDemand-container">
            {agent?.role === 'admin' && property && isSH(property) && (
              <button
                className="btn-onDemand btn btn-success"
                style={{ fontSize: "14px !important", alignItems: "center" }}
              >
                EX Prop
              </button>
            )}
          </div>
          <div className="onDemand-container">
            {property && xdata?.city !== "" && xdata?.city !== null && (
              <button
                className="btn-cityname btn btn-success"
                style={{ fontSize: "14px !important", alignItems: "right" }}
              >
                {property?.address?.city}
              </button>
            )}
          </div>
        </div>
        <div className="property-box-image-footer">
          <span
            className="property-box-image-footer-text"
            title={property?.title}
          >
            {property?.title}
          </span>
        </div>
      </div>
      <div className="property-box-footer row" style={{height: '120px'}}>
        <div className="property-box-footer-left col-md-6 col-sm-6 col-6">
          <div className="property-box-footer-left-icon">
            <img src={peopleIcon} alt="" />
            {property?.accommodates}
          </div>
          <div className="property-box-footer-left-icon">
            <img src={bedsIcon} alt="" />
            {property?.bedrooms > 0 ? property?.bedrooms : "0"}
          </div>
          <div className="property-box-footer-left-icon">
            {screenSize > 800 && (
              <>
                <img src={bathsIcon} alt="" />
                {property?.bathrooms}
              </>
            )}
          </div>
          {screenSize > 800 && (
          // <div>
           
            
          //     <div>
          //       {renderLimitedCollectionIcon("familyCollection", familyIcon)}
          //       {renderLimitedCollectionIcon("petsCollection", petsIcon)}
                
          //     </div>
          //     <div>
          //       {xdata?.tags?.includes("eventCollection") && (
          //         <div className="property-box-footer-left-icon-small">
          //           <img src={eventsIcon} alt="Events Icon" />
          //         </div>
          //       )}
          //       {renderLimitedCollectionIcon("sustainCollection", sustainIcon)}
          //     </div>

          // </div>
         
            renderCollections()
          
          )}
        </div>
        <div className="property-box-footer-right col-md-6 col-sm-6 col-6 h-100">
          <div className="property-box-footer-right-top d-flex align-items-center flex-row-reverse">
            <div
              className="property-box-favorites-icon d-flex flex-1 "
              onClick={toggleFavorites}
            >
              <img src={isFavorite ? likeFull : favoriteIcon} alt="alt" />
            </div>
            {!isOnDemand(property) && (
              <div className="minWmaxW155 d-flex flex-3 align-items-center">
                {refreshPrice === 0 ? (
                  <div className="property-box-footer-right-top-dollar">
                    <sup>
                      <span className="d-inline property-currency">
                        {getCurrencyDisplaySymbol(
                          selectedCurrency
                        )}
                      </span>
                    </sup>
                    <span style={{ marginRight: "5px" }}>
                      {` ${numeral(totalPrice).format("0,0")}`}
                    </span>
                    <sup>
                      <span className="property-box-footer-right-top-night">
                        /night
                      </span>
                    </sup>
                  </div>
                ) : (
                  <div className="property-box-footer-right-top-dollar">
                    <sup>
                      <span className="d-inline property-currency">  {getCurrencyDisplaySymbol(
                        selectedCurrency
                      )}</span>
                    </sup>
                    <span style={{ marginRight: "5px" }}>
                      {refreshPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </span>
                    <sup>
                      <span className="property-box-footer-right-top-night">
                        /period
                      </span>
                    </sup>
                  </div>
                )}
              </div>
            )}
          </div>
          {!isOnDemand(property) && (
            <div className="property-box-footer-right-bottom d-flex flex-row-reverse">
              {refreshPrice === 0 ? (
                <>
                  <div className="minWmaxW120 text-sm property-agency text-agency-comission minWmaxW120">
                    Agency Commission
                  </div>
                  <div className="minWmaxW80100 property-box-footer-right-bottom-price">
                    <span className="property-box-footer-right-bottom-dollar">
                      {/* <sup> */}
                        <span className="d-inline property-currency n-marg">
                          {getCurrencyDisplaySymbol(
                            selectedCurrency
                          )}
                        </span>
                      {/* </sup> */}
                      {/* <sup> */}
                      {` ${numeral((refreshPrice||totalPrice) / 10).format(
                        "0,0"
                      )}`}
                      {/* </sup> */}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="minWmaxW120 text-sm property-agency text-agency-comission minWmaxW120">
                    Agency Commission
                  </div>
                  <div className="minWmaxW80100 property-box-footer-right-bottom-price">
                    <span className="property-box-footer-right-bottom-dollar">
                      {/* <sup> */}
                        <span className="d-inline property-currency n-marg">
                          {getCurrencyDisplaySymbol(
                            selectedCurrency
                          )}
                        </span>
                      {/* </sup> */}
                      {/* <sup> */}
                      {` ${numeral((refreshPrice||totalPrice) / 10).format(
                        "0,0"
                      )}`}
                      {/* </sup> */}
                    </span>
                  </div>
                </>)}

            </div>
          )} 
        </div>
      </div>
    </div>
  );
};

export default PropertyBox;
