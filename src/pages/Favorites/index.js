import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import pageBg from "../../assets/SigninPicNew_resize.png";
import goBack from "../../assets/go-back.svg";
import PageHeader from "../../components/PageHeader";
import LoadingBox from "../../components/LoadingBox";
import SortByDropdown from "../../components/SortByDropdown";
import Paging from "../../components/Paging";
import PropertyBox from "../SearchProperty/PropertyBox";
import likeFull from "../../assets/icons/like-full.png";
import * as propertyActions from "../../store/redux/Property/actions";
import constants, { PATH_SEARCH } from "../../Util/constants";
import "./Favorites.scss";
import DestinationsDropDown from "../../components/DestinationsDropDown";
import { getStorageValue } from "../../Util/general";

const Favorites = (props) => {
  const { agency, agent } = props;
  const [sortOrder, setSortOrder] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const isLoading = useSelector((state) => state.property.isLoading);
  const favorites = useSelector((state) => state.property.favorites);
  const selectedProperties = useSelector(
    (state) => state.property.selectedProperties
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState("")
  const myparam = location.state && location.state.params;
  function filterListingsByCountry(listings, country) {
    return listings?.filter((item) => item.listing.address.country.toLowerCase() === country.toLowerCase());
  }
  const filteredListingsForIndia = filterListingsByCountry(favorites?.listings, selectedDestination );

  useEffect(() => {
    const load = async () => {
      dispatch(propertyActions.loadFavorites(pageNumber));
    };
    load();
  }, [myparam]);

  const doSearch = (pageNumber) => {
    dispatch(propertyActions.loadFavorites(pageNumber));
  };

  const onToggleProperty = (property) => {
    dispatch(propertyActions.toggleProperty(property));
  };

  const onChangePage = (pageNumber) => {
    setPageNumber(pageNumber);
    doSearch(pageNumber);
  };

  const sortOrderAction = (order) => {
    setSortOrder(order);
    doSearch(0);
  };
  // Retrieving total count from localStorage or defaulting to 0
  let totalCount = localStorage.getItem("totalFavorites") || 0;
  totalCount = parseInt(totalCount);

  // Calculate paging range
  const propertyPagingFrom = 1 + pageNumber * constants.PAGING_PAGE_SIZE;
  let propertyPagingTo = (pageNumber + 1) * constants.PAGING_PAGE_SIZE;
  if (totalCount < propertyPagingTo) {
    propertyPagingTo = totalCount;
  }

  const selectDestination = (destination) => {
    console.log("sort into destination:", destination);
    localStorage.setItem("destination", destination);
    doSearch(0);
  };
  const DropdownSelectedDestination = (destination) => {
    setSelectedDestination(destination)
  }

  // Save favorite property IDs to localStorage
  if (favorites) {
    const favoritePropertyIds = favorites.listings?.map(
      ({ listing }) => listing._id
    ) || [];

    localStorage?.setItem("favoritePropertyIds", JSON.stringify(favoritePropertyIds));
  }

  //   if (favorites == null) {
  //     return (
  //       <div
  //         className="favorites-container"
  //         style={{ backgroundImage: `url(${pageBg})`, backgroundSize: "100%" }}
  //       />
  //     );
  //   }
  
  const filteredFavorites = {
    // count: filteredListings.length,
    listings: favorites?.listings?.filter((item) => item?.listing?.address?.country === selectedDestination)
  };
  return (
    <>
      <div className="favorites-container" style={{
            backgroundImage: `url(${pageBg})`,
            "background-size": "cover",
          }}>
        <div className="favorites-header">
          <PageHeader
            agent={agent}
            agency={agency}
            doSearch={doSearch}
            searchOpen={false}
          />
        </div>
        <div className="image-container" style={{height: '174px',backgroundColor:'rgba(19, 59, 113, 0.8)'}}>
          {/* <img src={pageBg} className="w-100" alt="Background" /> */}
        </div>
      </div>
      <div
        className="favorites-results mx-3"
        style={{ backgroundColor: "#FFF" }}
      >
        <div className="row search-top-panel justify-content-between align-items-center">
          <div className="col-lg-4 col-12 properties-lable">
            <div className="row align-items-center">
              <div className="col-2">
                <img src={likeFull} alt="Favorite" />
              </div>
              <div className="col-10">
                <h4 className="favorite-txt mb-0">My Favorite Properties</h4>
              </div>
            </div>
          </div>
          {/* <div className="col-lg-4 col-md-6 col-12 text-lg-end mt-3 mt-lg-0 dropdown">
            <SortByDropdown
              sortOrder={sortOrder}
              onSortSelection={() => sortOrderAction(sortOrder)}
            />
          </div> */}
          <div className="col-lg-3 col-12 p-1">
          <DestinationsDropDown
            DropdownSelectedDestination={DropdownSelectedDestination}
            //destination="Destination"
            formerDestination={getStorageValue("destination")}
            selectDestination={selectDestination}
          />
        </div>
          <span className="me-3">Displaying {totalCount} properties</span>
        </div>

        <LoadingBox visible={isLoading} />

        <div className="row mt-2 d-flex justify-content-between">
          <div className="col-lg-4 col-12 properties-lable">
            <div
              className="col-12"
              style={{ cursor: "pointer" }}
              onClick={() => history.push(PATH_SEARCH)}
            >
              <span className="text-start back-btn">
                <img src={goBack} alt="back" />
                &nbsp;Back
              </span>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mt-3 mt-lg-0 text-lg-end">
            {favorites && (
              <Paging
                totalItems={favorites.count}
                currentPage={pageNumber}
                onChangePage={onChangePage}
              />
            )}
          </div>
        </div>

        {/* <div className="favorites-boxes row">
          {favorites &&
            favorites.listings.map((property, i) => {
              const selected =
                selectedProperties.findIndex((p) => p._id === property._id) >
                -1;

              return (
                <PropertyBox
                  key={i}
                  favorited={true}
                  property={property?.listing}
                  selected={selected}
                  onToggle={() => onToggleProperty(property)}
                />
              );
            })}
        </div> */}

        <div className="search-boxes row">
          {selectedDestination ? 
          <>
             {filteredFavorites &&
            filteredFavorites?.listings?.map((property, i) => {
              const selected =
                selectedProperties.findIndex((p) => p._id === property._id) >
                -1;

              return (
                <PropertyBox
                dontSelect={true}
                  key={i}
                  favorited={true}
                  property={property?.listing}
                  selected={selected}
                  onToggle={() => onToggleProperty(property)}
                  onDemand={false}
                />
              );
            })}
          </> 
          :
          <>
             {favorites &&
            favorites?.listings?.map((property, i) => {
              const selected =
                selectedProperties.findIndex((p) => p._id === property._id) >
                -1;

              return (
                <PropertyBox
                dontSelect={true}
                  key={i}
                  favorited={true}
                  property={property?.listing}
                  selected={selected}
                  onToggle={() => onToggleProperty(property)}
                  onDemand={false}
                />
              );
            })}
          </>}

        </div>
      </div>
    </>
  );
};

export default Favorites;
