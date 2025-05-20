import React, { useState, useEffect } from "react";
// import hotDestinationsBg from "../../assets/desktop/hot-destinations-bg.png";
import myvdo from "../../assets/eventsCollection.mp4";
import myvdo1 from "../../assets/familyCollection.mp4";
import myvdo2 from "../../assets/petsCollection.mp4";
import myvdo3 from "../../assets/sustainCollection.mp4";
import PageHeader from "../../components/PageHeader";
import Collection from "./Collection";
import { useHistory, useLocation } from "react-router-dom";
import "youtube-video-js";
import "./Collections.scss";
import { PATH_SEARCH } from "../../Util/constants";
import pageBg from "../../assets/desktop/bk_pool.png";
import { useDispatch, useSelector } from 'react-redux';
import * as propertyActions from '../../store/redux/Property/actions';
import { isNullOrEmptyArray, getStorageValue } from "../../Util/general";
import constants from "../../Util/constants";


const Collections = (props) => {
  const [flag, setflag] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCollection, setIsCollection] = useState(false);
  const [bgVdo, setBgVdo] = useState("");
  const [isCollectionPage, setIsCollectionPage] = useState(false);
  const dispatch = useDispatch();
  const [showSelection, setShowSelection] = useState(false);
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    setIsCollectionPage(!isCollectionPage);
    localStorage.removeItem('collections')
  }, []);

  const history = useHistory();
  const { tagName, token, agent, agency } = props;

  const isSearch = localStorage.getItem("isSearch");
  const doSearch = (pageNumber) => {
    // setShowSelection(false);
    setShowResults(true)
    if (destination) {
      dispatch(propertyActions.loadProperties(pageNumber, constants.PAGING_PAGE_SIZE))
      localStorage.setItem('formerDestination',destination)
    setShowResults(true)} else {
      setShowResults(false)
      localStorage.removeItem('formerDestination')
      localStorage.removeItem('geo')
      
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
  }
  history.push('/search', { triggerSearch: true })
    // readFavorites();
  };

  function PressSelection(collectionType, tagName, bg) {
    let collectionArray = [];
    collectionArray.push(tagName);
    localStorage.setItem("collections", JSON.stringify(collectionArray));
    localStorage.removeItem("destination");
    setSelectedCollection(collectionType);
    setIsCollection(true);
    setBgVdo(bg);
  }

  const renderBox = (bg, video, title, collectionType, tagName) => {
    let play = false;
    const handleMouseEnter = () => {
      play = true;
    };
    const handleMouseLeave = () => {
      play = false;
    };
    return (
      <>
        <div class="col-sm-6 px-2">
          <div
            className="card"
            // style={{ width: "80%" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => PressSelection(collectionType, tagName, bg)}
          >
            <video
              className="video-collection-box"
              type={selectedCollection}
              // onClick={() => PressSelection(collectionType, tagName, bg)}
              src={`${bg}`}
              class="col-sm-4"
              alt="video"
              style={{ width: "100%" , borderRadius:"10px"}}
              // controls={isAutoPlay}
              //autoPlay
              //play={play}
              onMouseOver={(e) => e.target.play()}
              onMouseOut={(e) => e.target.pause()}
              loop
              muted
              //  type="video/mp4"
            />
            <div class="card-body text-center">
              <h4 class="card-title">{title}</h4>
            </div>
          </div>
          <br></br>
        </div>
      </>
      // <video
      //   className="collections-box"
      //   type={selectedCollection}
      //   onClick={() => PressSelection(collectionType)}
      //   src={`${bg}`}
      //   // controls
      //   height="700vh"
      //   width="800vh"
      // >
      //   <div className="collections-box-footer">{title}</div>
      // </video>
    );
  };

  const onBackHandle = () => {
    setSelectedCollection(null);
    setIsCollection(false);
  };

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [flagModel, setFlagModel] = useState(false);
  const properties = useSelector((state) => state.property.properties);


  const handleAdvanceSearchModal = () => {
    setShowAdvancedSearch(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClosedAdvanceSearchModal = () => {
    setShowAdvancedSearch(false);
    document.body.style.overflow = 'auto';
  };

  const [arrivalDate, setArrivalDate] = useState(getStorageValue('dateFrom') || '');
  const [departDate, setDepartDate] = useState(getStorageValue('dateTo') || '');
  const [defaultPrice, setDefaultPrice] = useState(true)
  const [selectedCollections, setSelectedCollections] = useState([]);
  const collections = localStorage.getItem('collections');
  const destination =getStorageValue('destination')
  const [isDestinationNull, setIsDestinationNull] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const onChange = (arrivalDate, departDate) => {
    console.log("dates have changed!", arrivalDate, departDate)
    setArrivalDate(arrivalDate)
    setDepartDate(departDate)
    setDefaultPrice(false)
  };

  useEffect(() => {
    console.log("Destination:",destination)
    if (localStorage.getItem('destination') === 'undefined' && searchParams.get('country') === undefined) {
      localStorage.setItem('destination', 'Israel');
    }
    if (collections !== undefined && collections !== null) {
      setSelectedCollections(JSON.parse(collections));
    }
    // set period price if has both dateFrom + dateTo
    if (arrivalDate&&departDate) {
      setDefaultPrice(false)
    }
  }, []);

  const toggleCollection = (collection) => {
    if (selectedCollections.findIndex((i) => i === collection) > -1) {
      setSelectedCollections(selectedCollections.filter((f) => f !== collection));
    } else {
      setSelectedCollections([...selectedCollections, collection]);
    }

  };

  // useEffect(() => {
  //   if (properties?.listings?.length === 0) {
  //     setFlagModel(true);
  //   }
  // }, [properties, isSearch]);

  return (
    <div>
      <div className="collections-container" >
        <div className="collections-header" style={{
      backgroundImage: `url(${pageBg})`,
      "background-size": "cover",
    }}>
        <PageHeader
          agent={agent}
          agency={agency}
          onChange={onChange}
          arrivalDate={arrivalDate}
          departDate={departDate}
          selectedCollections={selectedCollections}
          setSelectedCollections={setSelectedCollections}
          doSearch={doSearch}
          setShowResults={setShowResults}
          searchOpen={true}
          destination={destination}
          flagModel={flagModel}
          setFlagModel={setFlagModel}
          handleAdvanceSearchModal={handleAdvanceSearchModal}
          handleClosedAdvanceSearchModal={handleClosedAdvanceSearchModal}
          showAdvancedSearch={showAdvancedSearch}
          setShowAdvancedSearch={setShowAdvancedSearch}
          setIsDestinationNull={setIsDestinationNull}

        />
        </div>
        {selectedCollection ? (
          <Collection
            token={token}
            bgVdo={bgVdo}
            type={selectedCollection}
            isCollection={isCollection}
            onBack={onBackHandle}
            showAdvancedSearch={showAdvancedSearch}
             setShowAdvancedSearch={setShowAdvancedSearch}
          />
        ) : (
          <>
            {/* <PageHeader
              agent={agent}
              agency={agency}
              searchOpen={null}
              flag={flag}
              doSearch={doSearch}
              isCollection={isCollection}
            /> */}
            {!showAdvancedSearch ? (
              <div className="collections-body px-4">
              <div className="collections-body-title mx-2 my-4">
                <h3 className="page-title">
                  Filter your search result to find properties that are perfect
                  for you
                </h3>
              </div>

              <div
                className="collections-boxes row "
                style={{ cursor: "pointer" }}
              >
                {renderBox(
                  myvdo,
                  "https://www.youtube.com/watch?v=WkRGl16eTm0",
                  "Event Collection",
                  "Event",
                  "eventCollection"
                )}
                {renderBox(
                  myvdo1,
                  "https://www.youtube.com/watch?v=Uw5uqhl8-io",
                  "Family Collection",
                  "Family",
                  "familyCollection"
                )}
                {renderBox(
                  myvdo2,
                  "https://www.youtube.com/watch?v=Uw5uqhl8-io",
                  "Pet-Friendly Collection",
                  "Pet Friendly",
                  "petsCollection"
                )}
                {renderBox(
                  myvdo3,
                  "https://www.youtube.com/watch?v=WkRGl16eTm0",
                  "Eco Friendly Collection",
                  "Eco Friendly",
                  "Eco Friendly Collection"
                )}
              </div>
            </div>
            ) : null}
            
          </>
        )}
      </div>
    </div>
  );
};

export default Collections;
