import React, { useEffect, useRef, useState } from "react";
import guests from "../../assets/icons/guests.png";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import "./GuestsPicker.scss";
import PickerField from "./PickerField";
import clearIcon from "../../assets/icons/closeIcon.png";

const GuestsPicker = (props) => {
  const [showFloater, setShowFloater] = useState(false);
  const storedAdults = parseInt(localStorage.getItem("adults"), 10) || 2;
  const storedChildren = parseInt(localStorage.getItem("children"), 10) || 0;
  const storedBedrooms = parseInt(localStorage.getItem("bedrooms"), 10) || 1;
  const storedBathrooms = parseInt(localStorage.getItem("bathrooms"), 10) || 1;

  const [adults, setAdults] = useState(storedAdults);
  const [children, setChildren] = useState(storedChildren);
  const [bedrooms, setBedrooms] = useState(storedBedrooms);
  const [bathrooms, setBathrooms] = useState(storedBathrooms);

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const options = document.querySelectorAll(".guests-picker-floater");
      options.forEach((option) => {
        const optionWidth = containerWidth - 1;
        option.style.width = `${optionWidth}px`;
      });
    }
  }, [showFloater]);

  useEffect(() => {
    localStorage.setItem("adults", adults);
    localStorage.setItem("children", children);
    localStorage.setItem("bedrooms", bedrooms);
    localStorage.setItem("bathrooms", bathrooms);
  }, [adults, children, bedrooms, bathrooms]);

  const updateBedrooms = (newAdults, newChildren) => {
    const requiredBedrooms = Math.max(
      0,
      Math.floor((newAdults + newChildren) / 2) - 1
    );
    if (bedrooms < requiredBedrooms) {
      setBedrooms(requiredBedrooms);
      localStorage.setItem("bedrooms", requiredBedrooms);
    }
  };

  const handleAdultsChange = (newAdults) => {
    setAdults(newAdults);
    updateBedrooms(newAdults, children);
  };

  const handleChildrenChange = (newChildren) => {
    setChildren(newChildren);
    updateBedrooms(adults, newChildren);
  };

  const requiredBedrooms = Math.max(0, Math.floor((adults + children) / 2) - 1);
  const disableReduceBedrooms = bedrooms <= requiredBedrooms;

  let text = "Any Guests, Any Bedrooms";

  if (adults > 0 || children > 0 || bedrooms > 0 || bathrooms > 0) {
    const elements = [];
    if (adults > 0) {
      elements.push(`${adults} Guests`);
    }
    if (children > 0) {
      elements.push(`${children} Children`);
    }
    if (bedrooms > 0) {
      elements.push(`${bedrooms} Bedrooms`);
    }
    if (bathrooms > 0) {
      elements.push(`${bathrooms} Bathrooms`);
    }

    text = elements.join(", ");
  }

  const borderRadius = showFloater
    ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
    : {};
  const resetselection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdults(2)
    setChildren(0)
    setBedrooms(1)
    setBathrooms(1)
    setShowFloater(false)
  }
  const getComboIcon = () => {
    if (text === "" || (adults === 2 && children === 0 && bedrooms === 1 && bathrooms === 1)) {
      return '';
    } else {
      return (
        <img
          src={clearIcon}
          alt=""
          style={{ cursor: "pointer", width: "18px", marginRight: "5px" }}
          onClick={(e) => resetselection(e)}
        />
      );
    }
  };

  return (
    <>
      {showFloater && (
        <div
          className="page-transparent-blocker"
          onClick={() => setShowFloater(false)}
        />
      )}
      <div className="guests-picker-wrapper">
        <div
          style={borderRadius}
          className="guests-picker-container"
          ref={containerRef}
          onClick={() => setShowFloater(!showFloater)}
        >
          <div className="picker-icon">
            <img src={guests} style={{ padding: "0 10px" }} />
            <div className="guests-picker-text" title={text}>
              {text}
            </div>
          </div>
          
          <div className="guests-picker-icon">
          {getComboIcon()}
            {showFloater ? (
              <BsChevronUp style={{ marginRight: "5px" }} />
            ) : (
              <BsChevronDown style={{ marginRight: "5px" }} />
            )}
          </div>
        </div>
        {showFloater && (
          <div className="guests-picker-floater">
            <div className="picker-container">
              <div className="selectors">
                <h5 className="picker-titles">Adults</h5>
                <h6 className="picker-subtitles">Ages 13 and Above</h6>
              </div>
              <PickerField
                value={adults}
                max={20}
                onAdd={() => handleAdultsChange(adults + 1)}
                onReduce={() => handleAdultsChange(adults - 1)}
              />
            </div>
            <div className="picker-container">
              <div className="selectors">
                <h5 className="picker-titles">Children</h5>
                <h6 className="picker-subtitles">Ages 12 and Below</h6>
              </div>
              <PickerField
                value={children}
                max={20}
                onAdd={() => handleChildrenChange(children + 1)}
                onReduce={() => handleChildrenChange(children - 1)}
              />
            </div>
            <div className="picker-container">
              <div className="selectors">
                <h5 className="picker-titles">Bedrooms</h5>
              </div>
              <PickerField
                value={bedrooms}
                max={20}
                onAdd={() => setBedrooms(bedrooms + 1)}
                onReduce={() => setBedrooms(bedrooms - 1)}
                disableReduce={disableReduceBedrooms}
              />
            </div>
            <div className="picker-container">
              <div className="selectors">
                <h5 className="picker-titles">Bathrooms</h5>
              </div>
              <PickerField
                value={bathrooms}
                max={20}
                onAdd={() => setBathrooms(bathrooms + 1)}
                onReduce={() => setBathrooms(bathrooms - 1)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GuestsPicker;
