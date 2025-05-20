import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import clearIcon from "../../assets/icons/closeIcon.png";
import arrowDown from "../../assets/icons/arrow-down.png";
import AuthService from "../../services/auth.service";
import "./DestinationsDropDown.scss";
import mapLocationIcon from "../../assets/icons/location.png";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { PATH_MAP } from "../../Util/constants";
import { updateValidSearchDestination } from "../../store/redux/Property/actions";

const DestinationsDropDown = (props) => {
  const dispatch = useDispatch();
  const validsearchdestination = useSelector(state => state.property.validsearchdestination);
  function safeParse(item) {
    try {
      return JSON.parse(item);
    } catch (e) {
      return null; // Return null if parsing fails
    }
  }
  
  const regions = safeParse(localStorage.getItem("regions")) || [];
  const countries = safeParse(localStorage.getItem("countries")) || [];
  const cities = safeParse(localStorage.getItem("cities")) || [];
  
  const history = useHistory();
  const {
    selectDestination,
    formerDestination,
    destination,
    DropdownSelectedDestination,
    setIsDestinationNull,
    setFavoriteSelected,
  } = props;
  const [validDestination, setValidDestination] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [countriesMarker, setcountriesMarker] = useState(null);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const villa = queryParams.get("villa");

  
  useEffect(() => {
    if (window.location.pathname.includes("search?country")) {
      setSearchText(localStorage.getItem("destination"));
    } else if (destination) {
      setSearchText(destination);
    } else {
      localStorage.setItem("isSearch", false);
    }
    console.log("dest=", destination);
  }, []);

  const getComboIcon = () => {
    // console.log(selectedOption, showCloseButton)
    if (selectedOption !== "" || showCloseButton) {
      return (
        <img
          src={clearIcon}
          alt=""
          style={{ cursor: "pointer", width: "18px", marginRight: "5px" }}
          onClick={() => selectOption("","")}
        />
      );
    }

    return (
      <img
        src={arrowDown}
        onClick={() => setShowOptions(!showOptions)}
        style={{
          width: "18px",
          transform: `rotateX(${showOptions ? "180deg" : "0deg"})`,
        }}
      />
    );
  };

  const checkifValidDestination = (text) => {
    let matchCountries = countries;
    let matchCities = cities;
    let matchRegions = regions;
    if (text !== "" && text !== null) {
     // console.log("text search:#", searchText, "#");
    
      matchCountries = countries ? countries.filter( (country) => country.toLowerCase() === text?.toLowerCase() ) : [];
      matchCities = cities ? cities.filter( (city) => city.toLowerCase() === text?.toLowerCase() ) : [];
      matchRegions = regions ? regions.filter( (region) => region.toLowerCase() === text?.toLowerCase() ) : [];
    }
    // console.log(matchRegions , matchCities , matchCountries)
    if (matchRegions.length || matchCities.length || matchCountries.length) {
      return true;
    } else {
      return false;
    }
  }

  const updateText = (text) => {
    // console.log(text === "")
    setSearchText(text === "" ? "" : capitalizeFLetter(text));
    // console.log('valid searc destination check',checkifValidDestination(text))
    dispatch(updateValidSearchDestination(checkifValidDestination(text)))
    if (text === "") {
      //window.location.reload();
      console.log("reset dest");
      localStorage.removeItem("destination");
      localStorage.removeItem("propertyType");
      localStorage.removeItem("selectedTypes");
      localStorage.removeItem("selectedPrices");
      localStorage.removeItem("selectedMusthave");
      localStorage.removeItem("selectedAmenities");
      localStorage.removeItem("searchedAmenities");
      localStorage.removeItem("selectedPropertiesItem");
      localStorage.removeItem("searchedPriceRange");
      localStorage.removeItem("searchedTypes");
      localStorage.removeItem("searchedMustHave");
      localStorage.removeItem("dateFrom");
      localStorage.removeItem("dateTo");
    }
  };

  useEffect(() => {
    setSearchText(localStorage.getItem("destination") || ""); // Set searchText to localStorage value or blank if not available
    setShowCloseButton(!!localStorage.getItem("destination")); // Set showCloseButton based on localStorage value
  }, []);

  const selectOption = (text,destType) => {
    // console.log('hhhheeee',typeof text,destType)
    setShowOptions(false);
    setSelectedOption(text);
    // setSearchText(text !== "" && typeof text !== 'undefined' ? text : '');
    if (setIsDestinationNull !== null && setIsDestinationNull !== undefined) {
      setIsDestinationNull(text);
    }
    updateText(text !== "" && typeof text !== 'undefined' ? text : '');
    setShowCloseButton(text !== "");
    dispatch(updateValidSearchDestination(text !== ""))
    if (text !== "") {
      updateValidSearchDestination(text !== "")
      localStorage.setItem("destination", text);
      localStorage.setItem("geo", destType+':'+text);
    }
    if (typeof DropdownSelectedDestination === "function") {
      DropdownSelectedDestination(text);
    }
    if (typeof selectDestination === "function") {
      selectDestination(text !== "" && typeof text !== 'undefined' ? text : ''); // Trigger the API call
    }
  };

  function capitalizeFLetter(Word) {
    return Word[0]?.toUpperCase() + Word?.slice(1);
  }

  const getTitleOption = (text) => {
    return (
      <div key={text} className="destinations-title-option">
        {text}
      </div>
    );
  };

  const getLabelOption = (type, text) => {
    return (
      <div
        key={`${type}-${text}`}
        className="destinations-label-option"
        title={text}
        onClick={() => selectOption(capitalizeFLetter(text),type)}
      >
        {capitalizeFLetter(text)}
      </div>
    );
  };

  const comboResults = () => {
    const results = [];
    let matchCountries = countries;
    let matchCities = cities;
    let matchRegions = regions;
    localStorage.setItem("destination", searchText);
    if (searchText !== "" && searchText !== null) {
     // console.log("text search:#", searchText, "#");

      matchCountries = countries
        ? countries.filter(
          (country) =>
            country.toLowerCase().indexOf(searchText?.toLowerCase()) > -1
        )
        : [];
      matchCities = cities
        ? cities.filter(
          (city) => city.toLowerCase().indexOf(searchText?.toLowerCase()) > -1
        )
        : [];
      matchRegions = regions
        ? regions.filter(
          (region) =>
            region.toLowerCase().indexOf(searchText?.toLowerCase()) > -1 &&
            !matchCountries.includes(region)
        )
        : [];
    }
    if (!matchRegions || !matchCities || !matchCountries) {
      return <div className="destinations-no-results">No matches</div>;
    }
    if (matchCountries) {
      if (matchCountries.length > 0) {
        results.push(getTitleOption("Country"));
        const uniqueMatchCountries = matchCountries
          .map(country => country.toLowerCase())
          .filter((country, index, self) => self.indexOf(country) === index)
          .map((country, index, self) => matchCountries.find(c => c.toLowerCase() === country));
        matchCountries = [...uniqueMatchCountries];
        matchCountries.forEach((c) =>
          (typeof c !== 'undefined' && c.toLowerCase() !== 'unmapped' && c.length > 3) && results.push(getLabelOption("country", c))
        );
      }
    }
    if (matchCities) {
      if (matchCities.length > 0) {
        results.push(getTitleOption("City"));
        matchCities.forEach((c) =>
          (typeof c !== 'undefined' && c.toLowerCase() !== 'unmapped' && c.length > 3) &&
          results.push(getLabelOption("city", c))

        );
      }
    }
    if (matchRegions) {
      if (matchRegions.length > 0) {
        results.push(getTitleOption("Region"));
        matchRegions.forEach((c) => (typeof c !== 'undefined' && c.toLowerCase() !== 'unmapped' && c.length > 3) && results.push(getLabelOption("region", c)));
      }
    }

    return results;
  };

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const options = document.querySelectorAll(".destinations-floater");
      options.forEach((option) => {
        const optionWidth = containerWidth - 1;
        option.style.width = `${optionWidth}px`;
      });
    }
  }, [selectedOption, showOptions]);

  return (
    <>
      {showOptions && (
        <div
          className="page-transparent-blocker"
          onClick={() => setShowOptions(false)}
        />
      )}
      <div className="destinations-wrapper">
        <div className="destinations-container" ref={containerRef}>
          <img src={mapLocationIcon} style={{ padding: "0 10px" }} />
          <input
            type="text"
            value={searchText ? searchText : ""}
            // onClick={() => setShowOptions(true)}
            onChange={(e) => {
              if(e.target.value !== '' && e.target.value.length && typeof e.target.value !== 'undefined') {
                if(e.target.value.length >= 3) {
                  setShowOptions(true)
                } else {
                  setShowOptions(false)
                }
                
                updateText(e.target.value)
              } else {
                setSearchText('')
              }
              
            }}
            // placeholder={destination ? destination : "Where to?"}
            placeholder={"Where to?"}
            className="destinations-input form-control placeholder-css"
          />
          {getComboIcon()}
        </div>
        {showOptions && (
          <div className="destinations-floater">{comboResults()}</div>
        )}
      </div>
    </>
  );
};

export default DestinationsDropDown;
