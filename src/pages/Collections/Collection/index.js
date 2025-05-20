import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollectionHeader from "./CollectionHeader";
import * as propertyActions from "../../../store/redux/Property/actions";
import constants from "../../../Util/constants";
import goBack from "../../../assets/go-back.svg";
import LoadingBox from "../../../components/LoadingBox";
import Paging from "../../../components/Paging";
import PropertyBox from "../../SearchProperty/PropertyBox";
import SelectedProperties from "../../../components/SelectedProperties";
import axios from 'axios';
import { baseURL } from '../../../core';
import SelectedPropertiesDropdown from "../../../components/SelectedPropertiesDropdown";
import { isNullOrEmptyArray, getStorageValue } from "../../../Util/general";
import "./Collection.scss";
import Row from "../../../components/Row";
import PageHeader from "../../../components/PageHeader";
import PageHeaderTopRow from "../../../components/PageHeaderTopRow";

const Collection = (props) => {
  const token = localStorage.getItem('jToken');
  const links = localStorage.getItem("noMenu") === 'true';
  const showAdvancedSearch = props.showAdvancedSearch
  const setShowAdvancedSearch = props.setShowAdvancedSearch
  const [toggleItem, setToggleItem] = useState({
    properties: [],
  });
  const [openSelection, setopenSelection] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [showSelection, setShowSelection] = useState(false);
  const isLoading = useSelector((state) => state.property.isLoading);
  const { type, onBack, setDestination, agent, agency, bgVdo, isCollection, setSelectedCurrency, selectedCurrency } =
    props;
  const properties = useSelector((state) => state.property.properties);
  const selectedProperties = useSelector(
    (state) => state.property.selectedProperties
  );
  console.log("selectedProperties----------------->", selectedProperties);
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([]);
  const [arrivalDate, setArrivalDate] = useState(getStorageValue('dateFrom') || '');
  const [departDate, setDepartDate] = useState(getStorageValue('dateTo') || '');
  const [defaultPrice, setDefaultPrice] = useState(true)
  useEffect(() => {
    const load = async () => {
      localStorage.removeItem('formerDestination')
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
      await dispatch(propertyActions.loadProperties(pageNumber));
    };
    load();
  }, []);

  const userRequest = axios.create({
    baseURL: baseURL,
    headers: {
      token: `Bearer ${token}`,
    },
  });
  const readFavorites = async () => {
    const agentID = localStorage.getItem('agent_id');
    const favoritesResponse = await userRequest.get(`/favorite/get-favorites?agent_id=${agentID}`);
    if (favoritesResponse?.data[0]?.favorites) {
      setFavorites(favoritesResponse.data[0].favorites);
    }
  };
  const doSearch = (pageNumber) => {
    //console.log("skipping : ", pageNumber * constants.PAGING_PAGE_SIZE);
    setShowSelection(false);
    dispatch(propertyActions.loadProperties(pageNumber));
    readFavorites();
  };

  const onToggleProperty = (property) => {
    const existingProperties = toggleItem.properties;
    const isAlreadySelected = existingProperties.some(
      (existingProp) => existingProp.listing._id === property.listing._id
    );

    let updatedProperties;

    if (!isAlreadySelected) {
      updatedProperties = [
        ...existingProperties,
        { ...property, selected: true },
      ];
    } else {
      updatedProperties = existingProperties.filter(
        (existingProp) => existingProp.listing._id !== property.listing._id
      );
    }


    setToggleItem({
      ...toggleItem,
      properties: updatedProperties,
    });
  };

  const onChangePage = (pageNumber) => {
    console.log("collection page=", pageNumber);
    setPageNumber(pageNumber);
    doSearch(pageNumber);
  };

  // if (showSelection) {
  //   return <SelectedProperties doSearch={doSearch} />;
  // }

  let totalCount = localStorage.getItem("count")
    ? localStorage.getItem("count")
    : 0;
  const propertyPagingFrom = 1 + pageNumber * constants.PAGING_PAGE_SIZE;
  let propertyPagingTo = (pageNumber + 1) * constants.PAGING_PAGE_SIZE;
  if (totalCount < propertyPagingTo) {
    propertyPagingTo = totalCount;
  }

  return (
    <div>
       {!showAdvancedSearch ? (
      <div className="collection-container">
        {/* background video */}
        <div class="video-container" 
        style={{ display: "none" }}
        >
          <video
            className="video-header"
            id={type === "Family" ? "family" : "dog-events-sustain"}
            src={bgVdo}
            autoPlay={true}
            loop
            muted
            width="100%"
            // style={{height:'300xp'}}
          />
        </div>
        {/* <div className="col-lg-5 col-12 p-1" style={{marginLeft: '32%', marginTop: '10px'}}>
            <SelectedPropertiesDropdown
              onShowSelection={() => setShowSelection(true)}
              selectedPropertiesItem={toggleItem}
              onToggle={onToggleProperty}
              openSelection={openSelection}
            />
          </div> */}
        <CollectionHeader
          pageNumber={pageNumber}
          propertyPagingTo={propertyPagingTo}
          propertyPagingFrom={propertyPagingFrom}
          bgVdo={props.bgVdo}
          type={type}
          onShowSelectedProperties={() => setShowSelection(true)}
          setShowSelection={setShowSelection}
          selectedPropertiesItem={toggleItem}
          onToggle={onToggleProperty}
          openSelection={openSelection}
          setDestination={setDestination}
          doSearch={doSearch}
          showAdvancedSearch={showAdvancedSearch}
          setShowAdvancedSearch={setShowAdvancedSearch}
        />
        <LoadingBox visible={isLoading} />
        <div style={{ padding: "0px 1rem" }}>
          <Row style={{ justifyContent: "space-between" }}>
            {!links&&(<div
              className="link18-bold-no-line px-3"
              style={{ display: "flex" }}
              onClick={onBack}
            >
              <img src={goBack} alt="" />
              &nbsp;&nbsp;Back
            </div>)}
            
            {properties && (
              <Paging
                perPage={constants.PAGING_PAGE_SIZE}
                totalItems={properties.count}
                currentPage={pageNumber}
                onChangePage={onChangePage}
              />
            )}
          </Row>
          <div className='search-boxes row col-lg-4'>
                            {properties &&
                              properties?.listings &&
                              properties?.listings.map((property, i) => {
                                const selected =
                                  selectedProperties.findIndex(
                                    (p) => p._id === property.listing._id
                                  ) > -1;

                                function checkValue(x) {
                                  return x === property.listing._id;
                                }
                                console.log(i,property)
                                const favorited = favorites.findIndex(checkValue) > -1;
                                return (
                                  <PropertyBox
                                  setSelectedCurrency={setSelectedCurrency}
                                    arrive={arrivalDate}
                                    depart={departDate}
                                    key={i}
                                    favorited={favorited}
                                    property={property?.listing}
                                    fullCalendar={property?.fullCalendar}
                                    xdata={property?.xdata}
                                    defaultPrice={defaultPrice}
                                    selected={toggleItem.properties.some(
                                      (prop) =>
                                        prop.listing._id === property?.listing._id
                                    )}
                                    onToggle={() => onToggleProperty(property)}
                                  />
                                );
                              })}
                          </div>
        </div>
      </div>
       ) : null}
       {showSelection && <SelectedProperties doSearch={doSearch} />}
    </div>
  );
};

export default Collection;
