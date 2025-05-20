import React, { useEffect, useState } from "react";
import pets from "../../../../assets/collections/icons/pets.png";
import events from "../../../../assets/collections/icons/events.png";
import family from "../../../../assets/collections/icons/family.png";
import sustainable from "../../../../assets/collections/icons/sustainable.png";
import constants from "../../../../Util/constants";
import "./CollectionHeader.scss";
import SelectedPropertiesDropdown from "../../../../components/SelectedPropertiesDropdown";
import SortByDropdown from "../../../../components/SortByDropdown";
import DestinationsDropDown from "../../../../components/DestinationsDropDown";
import { getStorageValue } from "../../../../Util/general";

const CollectionHeader = (props) => {
  const {
    propertyPagingTo,
    propertyPagingFrom,
    type,
    onShowSelectedProperties,
    setShowSelection,
    doSearch,
    selectedPropertiesItem,
    onToggle,
    openSelection,
    bgVdo,
    showAdvancedSearch,
    setShowAdvancedSearch,
    mobile
  } = props;
  const [sortOrder, setSortOrder] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("")
  const sortOrderAction = (order) => {
    setSortOrder(order);
    doSearch(0);
    console.log("refresh search!")
  };
  const selectDestination = (destination) => {
    console.log("sort into destination:", destination);
    localStorage.setItem("destination", destination);
    doSearch(0);
  };
  const src =
    type === "Event"
      ? events
      : type === "Family"
      ? family
      : type === "Pet Friendly"
      ? pets
      : sustainable;

  let totalCount = localStorage.getItem("count")
    ? localStorage.getItem("count")
    : 0;
  const DropdownSelectedDestination = (destination) => {
    setSelectedDestination(destination)
  }

  return (
    <>
      <div className="row search-top-panel px-3 pt-3 pb-0">
        <div className="col-lg-4 col-12 p-1 collection-lable-logo">
          <img src={src} alt="" />
          <div className="row">
            <div className="col-12 p-1">
              <div>
                <h5 className="page-title">
                { selectedDestination ? (
                  `The ${selectedDestination} ${type} Collection`
                ) : (`The Global ${type} Collection`)}
                  </h5>
              </div>
              <div style={{ fontSize: "18px", whiteSpace: "nowrap" }}>
                Displaying properties {propertyPagingFrom}-{propertyPagingTo} of{" "}
                {totalCount ? totalCount : "?"} In{" "}
                {localStorage.getItem("destination")
                  ? localStorage.getItem("destination")
                  : "the whole world"}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-12 p-1 selected">
          <SelectedPropertiesDropdown
            onShowSelection={onShowSelectedProperties}
            setShowSelection={setShowSelection}
             selectedPropertiesItem={selectedPropertiesItem}
              onToggle={onToggle}
              openSelection={openSelection}
          />
        </div>
        <div className="col-lg-3 col-12 p-1" style={{width:'197.5px'}}>
          <DestinationsDropDown
            DropdownSelectedDestination={DropdownSelectedDestination}
            destination="Destination"
            formerDestination={getStorageValue("destination")}
            selectDestination={selectDestination}
          />
        </div>
        <div className="col-lg-2 col-12 p-1" style={{width:'280.1px'}}>
          <SortByDropdown
            sortOrder={sortOrder}
            onSortSelection={() => sortOrderAction(sortOrder)}
          />
        </div>
      </div>
    </>
  );
};

export default CollectionHeader;
