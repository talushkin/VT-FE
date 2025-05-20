import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import pageBg from "../../assets/desktop/bk_pool.png";
import PageHeader from "../../components/PageHeader";
import * as propertyActions from "../../store/redux/Property/actions";
import PropertyBoxShub from "./PropertyBoxShub";
import constants from "../../Util/constants";
import LoadingBox from "../../components/LoadingBox";
import SelectedPropertiesDropdown from "../../components/SelectedPropertiesDropdown";
import SortByDropdown from "../../components/SortByDropdown";

import eventsIcon from "../../assets/special-collection/icons/events.svg";
import eventsIconOn from "../../assets/special-collection/icons/events-on.svg";
import eventsLael from "../../assets/special-collection/icons/label-events.svg";

import dogsIcon from "../../assets/special-collection/icons/dogs.svg";
import dogsIconOn from "../../assets/special-collection/icons/dogs-on.svg";
import dogsLabel from "../../assets/special-collection/icons/label-pets.svg";

import greenIcon from "../../assets/special-collection/icons/green.svg";
import greenIconOn from "../../assets/special-collection/icons/green-on.svg";
import greenLabel from "../../assets/special-collection/icons/label-sustainable.svg";

import familiesIcon from "../../assets/special-collection/icons/kids.svg";
import familiesIconOn from "../../assets/special-collection/icons/kids-on.svg";
import familiesLabel from "../../assets/special-collection/icons/label-families.svg";

import filtersIcon from "../../assets/special-collection/icons/filter.png";

import AddToWishList from "../../components/AddToWishList";
import SelectedProperties from "../../components/SelectedProperties";
import { useLocation } from "react-router-dom";
import Paging from "../../components/Paging";

import "./shubProperty.scss";
import CollectionIcon from "../../components/CollectionIcon";

import { baseURL } from "../../core";
import axios from "axios";

const SearchShub = (props) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [showSelection, setShowSelection] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCollections, setSelectedCollections] = useState([]);
  const { homepage, agent, agency } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoading = useSelector((state) => state.property.isLoading);
  const properties = useSelector((state) => state.property.properties);
  const selectedProperties = useSelector(
    (state) => state.property.selectedProperties
  );
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("jToken");
  const toggleCollection = (collection) => {
    if (selectedCollections.findIndex((i) => i === collection) > -1) {
      setSelectedCollections(
        selectedCollections.filter((f) => f !== collection)
      );
    } else {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  const filterCollections = () => {
    //console.log("tags:", selectedCollections);
    const tagsString = Object.keys(selectedCollections)
      .map((key) => selectedCollections[key])
      .join(",");
    localStorage.setItem("tags", tagsString);
    doSearch(0);
  };

  const userRequest = axios.create({
    baseURL: baseURL,
    headers: {
      token: `Bearer ${token}`,
    },
  });

  const readFavorites = async () => {
    const agentID = localStorage.getItem("agent_id");
    const favoritesResponse = await userRequest.get(
      `/favorite/get-favorites?agent_id=${agentID}`
    );
    console.log(
      "favorites respond >>>>",
      favoritesResponse.data.favorites[0].favorites
    );
    setFavorites(favoritesResponse.data.favorites[0].favorites);
  };

  const doSearch = (pageNumber) => {
    //console.log("page=",pageNumber);
    //console.log("skipping : ", pageNumber * constants.PAGING_PAGE_SIZE);
    setShowSelection(false);

    dispatch(propertyActions.loadProperties(pageNumber));
    readFavorites();
  };

  const clearSearch = () => {
    dispatch(propertyActions.clearProperties());
  };
  let totalCount = localStorage.getItem("count")
    ? localStorage.getItem("count")
    : 0;
  const propertyPagingFrom = 1 + pageNumber * constants.PAGING_PAGE_SIZE;
  let propertyPagingTo = (pageNumber + 1) * constants.PAGING_PAGE_SIZE;
  if (totalCount < propertyPagingTo) {
    propertyPagingTo = totalCount;
  }
  const onToggleProperty = (property) => {
    dispatch(propertyActions.toggleProperty(property));
  };

  const onChangePage = (pageNumber) => {
    //console.log("page=",pageNumber);
    setPageNumber(pageNumber);
    localStorage.setItem("page", pageNumber);
    doSearch(pageNumber);
  };

  const showBackgroundImage = homepage && properties == null;
  const style = showBackgroundImage
    ? { backgroundImage: `url(${pageBg})`, backgroundSize: "cover" }
    : { backgroundImage: `url(${pageBg})`, backgroundSize: "100%" };

  return (
	
    <div className="search-container" style={style}>
		<h1>sdasdasdasasd</h1>
      <PageHeader
        selectedCollections={selectedCollections}
        doSearch={doSearch}
        searchOpen={true}
      />
      {showSelection ? (
        <SelectedProperties doSearch={doSearch} 
        />
      ) : props.count === 0 ? (
        <AddToWishList onClearSearch={clearSearch} />
      ) : showBackgroundImage ? (
        <div
          className="search-shub-results col"
          style={{ backgroundColor: "transparent" }}
        />
      ) : (
        <div
          className="search-shub-results col"
          style={{ backgroundColor: "#ddf1e3" }}
        >
          <div className="search-top-panel row">
            <div className="col-lg-4 md-3">
              <div className="search-main-title">
                SHUB properties In {localStorage.getItem("destination")}
              </div>
              <div className="search-main-subtitle">
                Displaying SHUB properties {propertyPagingFrom}-
                {propertyPagingTo} of{" "}
                {localStorage.getItem("count")
                  ? localStorage.getItem("count")
                  : "?"}{" "}
                In{" "}
                {localStorage.getItem("destination")
                  ? localStorage.getItem("destination")
                  : "?"}
              </div>
              <div className="search-main-selection-title">
                Filter your search results to find properties that are perfect
                for you:
              </div>
              <div className="search-main-selection-icons">
                <CollectionIcon
                  path={eventsIcon}
                  pathOver={eventsIconOn}
                  selected={selectedCollections.indexOf("eventCollection") > -1}
                  label={eventsLael}
                  onClick={() => toggleCollection("eventCollection")}
                />
                <CollectionIcon
                  path={familiesIcon}
                  pathOver={familiesIconOn}
                  selected={
                    selectedCollections.indexOf("familyCollection") > -1
                  }
                  label={familiesLabel}
                  onClick={() => toggleCollection("familyCollection")}
                />
                <CollectionIcon
                  path={dogsIcon}
                  pathOver={dogsIconOn}
                  selected={selectedCollections.indexOf("petsCollection") > -1}
                  label={dogsLabel}
                  onClick={() => toggleCollection("petsCollection")}
                />
                <CollectionIcon
                  path={greenIcon}
                  pathOver={greenIconOn}
                  selected={
                    selectedCollections.indexOf("sustainCollection") > -1
                  }
                  label={greenLabel}
                  onClick={() => toggleCollection("sustainCollection")}
                />
                <img
                  src={filtersIcon}
                  alt=""
                  style={{ paddingTop: "5px", cursor: "pointer" }}
                  onClick={filterCollections}
                />
              </div>
            </div>
            <div className="col-lg-4 md-2">
              <SelectedPropertiesDropdown
                onShowSelection={() => setShowSelection(true)}
              />
            </div>
            <div className="col-lg-4 md-3">
              <SortByDropdown
                sortOrder={sortOrder}
                onSortSelection={() => setSortOrder(sortOrder)}
              />
            </div>
          </div>

          <LoadingBox visible={isLoading} />

          {properties && (
            <Paging
              totalItems={properties.count}
              currentPage={pageNumber}
              onChangePage={onChangePage}
            />
          )}

          <div className="search-boxes row">
            {properties &&
              properties.listings &&
              properties.listings.map((property, i) => {
                const selected =
                  selectedProperties.findIndex(
                    (p) => p._id === property.listing._id
                  ) > -1;
                //console.log(property._id," ",favorites.findIndex(p => p.value===property._id ))
                function checkValue(x) {
                  return x === property.listing._id;
                }
                const favorited = favorites.findIndex(checkValue) > -1;
                return (
                  <PropertyBoxShub
                    key={i}
                    favorited={favorited}
                    property={property}
                    selected={selected}
                    onToggle={() => onToggleProperty(property)}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchShub;
