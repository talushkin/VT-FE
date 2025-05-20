import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import pageBg from '../../assets/desktop/bk_pool.png';
import calBg from '../../assets/desktop/bk_poolhouse.png';
import PageHeader from '../../components/PageHeader';
import * as propertyActions from '../../store/redux/Property/actions';
import PropertyBox from './PropertyBox';
import constants, { PATH_PROPERTY } from '../../Util/constants';
import { isNullOrEmptyArray, getStorageValue } from "../../Util/general";
import LoadingBox from '../../components/LoadingBox';
import SelectedPropertiesDropdown from '../../components/SelectedPropertiesDropdown';
import SortByDropdown from '../../components/SortByDropdown';
import eventsIcon from '../../assets/special-collection/icons/events.svg';
import eventsIconOn from '../../assets/special-collection/icons/events-on.svg';
import eventsLabel from '../../assets/special-collection/icons/label-events.svg';
import dogsIcon from '../../assets/special-collection/icons/dogs.svg';
import dogsIconOn from '../../assets/special-collection/icons/dogs-on.svg';
import dogsLabel from '../../assets/special-collection/icons/label-pets.svg';
import greenIcon from '../../assets/special-collection/icons/green.svg';
import greenIconOn from '../../assets/special-collection/icons/green-on.svg';
import greenLabel from '../../assets/special-collection/icons/label-sustainable.svg';
import familiesIcon from '../../assets/special-collection/icons/kids.svg';
import familiesIconOn from '../../assets/special-collection/icons/kids-on.svg';
import familiesLabel from '../../assets/special-collection/icons/label-families.svg';
import filtersIcon from '../../assets/special-collection/icons/filter.png';
import AddToWishList from '../../components/AddToWishList';
import SelectedProperties from '../../components/SelectedProperties';
import { useLocation, useHistory } from 'react-router-dom';
import Paging from '../../components/Paging';
import dayjs from 'dayjs';

import './searchProperty.scss';
import CollectionIcon from '../../components/CollectionIcon';
import { data } from './data.json';
import { baseURL } from '../../core';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import log from 'loglevel';
import Caru from './Carousel/Caru.js'
import countryList from "../../Util/data/countries.json";
import { toast } from 'react-toastify';
import VideoCarousel from './Videocarousel/VidCarousel.js';
import SearchedMaps from './SearchMaps/index.js';

const ACCESS_TOKEN = 'pk.eyJ1IjoiZXRlcm5pdGVjaCIsImEiOiJjbG84aDJ6ZWgwMTR5MnBvNjV3MTJyZDB3In0.iT6rWXmDQcaj8EZrnhqnQg';

const apiToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImlzc3VlZCI6IjE2NzUxMTI3NDYxMzYiLCJleHAiOjE2NzUxMTI4MDYsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6ImVmNzY1MDIyLTZhNzctNGZkMy04Njg1LTFhZTFhZmEzOTJhZSIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.N9MIeiLyrT3hBUtMJsTvwbYW5Z_o7ZSBuZmir2ytrb8DiE4MoXcmh8C6KriWhmnRqUnSMBRtuLcauVbqjFTorOcWMOd2RQGmisPgXBm1tHT30Hl0i57rQuLZHAVW201ot-TdQwW9oEZ3n2HTGu_A6tRhTizVmG6NRAd5KhOB2_c"

const SearchProperty = (props) => {
  
  const { role } = JSON.parse(localStorage.getItem('agent')) || [];
  const [calPic, setCalPic] = useState(true);
  const [flagModel, setFlagModel] = useState(false);
  const flagwishlistmodel = useSelector((state) => state.property.flagwishlistmodel);
  const [openSelection, setopenSelection] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [showSelection, setShowSelection] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const { homepage, activeMenu } = props;
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.property.isLoading);
  const searchedproperties = useSelector((state) => state.property.properties);
  const [properties, setProperties] = useState(searchedproperties);
  const selectedProperties = useSelector((state) => state.property.selectedProperties);
  const [favorites, setFavorites] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [countriesMarker, setcountriesMarker] = useState(null);
  const [citiesCount, setCitiesCount] = useState(null);
  const [isDestinationNull, setIsDestinationNull] = useState("");
  const token = localStorage.getItem('jToken');
  const isSearch = localStorage.getItem('isSearch');
  const agent = getStorageValue('agent') ? JSON.parse(localStorage.getItem('agent')) : {};
  const agency = getStorageValue('travelAgency') ? JSON.parse(localStorage.getItem('travelAgency')) : {};
  const destination = getStorageValue('destination')
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const country = searchParams.get('country');
  const city = searchParams.get('city');
  const region = searchParams.get('region');
  const guests = searchParams.get('guests');
  const [paramcountry, setParamCountry] = useState(searchParams.get('country') || '');
  const [paramcity, setParamCity] = useState(searchParams.get('city') || '');
  const [paramregion, setParamRegion] = useState(searchParams.get('region') || '');
  const [paramguests, setParamGuests] = useState(searchParams.get('guests') || '');
  // console.log(city, region, country)
  const villa = searchParams.get('villa');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const property = searchParams.get('id');
  const collections = localStorage.getItem('collections');
  const [arrivalDate, setArrivalDate] = useState(getStorageValue('dateFrom') || '');
  const [departDate, setDepartDate] = useState(getStorageValue('dateTo') || '');
  const [defaultPrice, setDefaultPrice] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const fullCalendar = location?.state?.fullCalendar;
  const [startDate, setStartDate] = useState(
    getStorageValue("dateFrom") || null
  );
  const [endDate, setEndDate] = useState(getStorageValue("dateTo") || null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const [allpropertycount, setAllpropertycount] = useState(localStorage.getItem('allpropertycount') || 0);
  const [withondemandpropertycount, setWithondemandpropertycount] = useState(localStorage.getItem('withondemandpropertycount') || 0);
  const [onDemandCeck, setOnDemandCheck] = useState(localStorage.getItem("onDemand") ? localStorage.getItem("onDemand") == 'true' : false);
  const [searchstartTime, setSearchStartTime] = useState(null);
  const [searchelapsedTime, setSearchElapsedTime] = useState(0);

  const validsearchdestination = useSelector(state => state.property.validsearchdestination);
  const showinmap = useSelector(state => state.property.ShowMapInSearch)

  useEffect(() => {
    setProperties(searchedproperties);
  },[searchedproperties])

  useEffect(() => {
    const country = paramcountry || '';
    const city = paramcity || '';
    const region = paramregion || '';
    const guests = paramguests || '';
    let geoStr = '';
    let adults = guests;
    let destination = '';
    if(country !== null && country !== '') {
      geoStr += geoStr ? `&country:${country}` : `country:${country}`;
      destination = country;
    } else if(city !== null && city !== '') {
      geoStr += geoStr ? `&city:${city}` : `city:${city}`;
      destination = city;
    } else if(region !== null && region !== '') {
      geoStr += geoStr ? `&region:${region}` : `region:${region}`;
      destination = region;
    }
    dispatch(propertyActions.updateValidSearchDestination(destination !== ''));
    localStorage.setItem("destination", destination);
    localStorage.setItem("geo", geoStr);
    localStorage.setItem("adults", adults);
    
    dispatch(propertyActions.updateSearchParams({ 
      geo: geoStr, 
      adults: adults 
    }));
    doSearch(pageNumber)
    
  },[paramcountry, paramcity, paramregion, paramguests, pageNumber]);
  //timer for search - praveen
  useEffect(() => {
    if(isLoading) {
      setSearchStartTime(Date.now())
    } else if(searchstartTime) {
      setSearchElapsedTime((Date.now() - searchstartTime) / 1000)
      setSearchStartTime(null)
    }
  }, [isLoading])

   // Function to format elapsed time
   const formatTime = (seconds) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = (seconds % 60).toFixed(2);
      return `${minutes} min ${remainingSeconds} sec`;
    }
    return `${seconds.toFixed(2)} sec`; // Show seconds with 2 decimal places
  };
  // timer for search

  useEffect(() => {
    const agentInfo = JSON.parse(localStorage.getItem("agent") || "{}");
    const agentCurrency = agentInfo.currency || "USD";
    console.log('agent currency:', agentCurrency)
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(constants.SHUB_URL+"/xchange");
        const data = response.data;
        localStorage.setItem("exchange", JSON.stringify(data));
        setCurrencies(data);
        const selectedCurrency = data.find(
          (currency) => currency.currency_code === agentCurrency
        ) || data[0];
        console.log("SELECTED CUR:", selectedCurrency.currency_code, selectedCurrency.conversion_rates)
        if (selectedCurrency) {
          setSelectedCurrency(selectedCurrency.currency_code);
          setExchangeRate(selectedCurrency.conversion_rates);

          const basePrice = property?.prices?.basePrice / 0.86;
          const agencyCommission = basePrice / 10;
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const storedArrivalDate = localStorage.getItem("dateFrom");
    const storedDepartDate = localStorage.getItem("dateTo");

    setArrivalDate(storedArrivalDate ? new Date(storedArrivalDate) : "");
    setDepartDate(storedDepartDate ? new Date(storedDepartDate) : "");
  }, [defaultPrice, exchangeRate]);

  useEffect(() => {
    if (properties?.listings?.length === 0) {
      setFlagModel(true);
    }
  }, [properties, isSearch]);

  const onChange = (newArrivalDate, newDepartDate) => {
    setArrivalDate(newArrivalDate);
    setDepartDate(newDepartDate);
    setDefaultPrice(false)
  };

  useEffect(() => {
    filterCollections()
  }, [selectedCollections]);

  useEffect(() => {
    setAllpropertycount(localStorage.getItem('allpropertycount'));
    setWithondemandpropertycount(localStorage.getItem('withondemandpropertycount'));
    setOnDemandCheck(localStorage.getItem("onDemand") ? localStorage.getItem("onDemand") == 'true' : false)
  }, [localStorage.getItem('allpropertycount'), localStorage.getItem('withondemandpropertycount'), localStorage.getItem('onDemand')]);

  useEffect(() => {
    
    return () => {
      setAllpropertycount(0);
      setWithondemandpropertycount(0);
      localStorage.setItem('destination', '')
      localStorage.setItem('allpropertycount', 0)
      localStorage.setItem('withondemandpropertycount', 0)
    };
  }, []);

  useEffect(() => {
    localStorage.removeItem('collections');
    setSelectedCollections([]);
    // if (localStorage.getItem('destination') === 'undefined' ) { // && searchParams.get('country') === undefined
    //   localStorage.setItem('destination', 'GST008');
    // }
    if (arrivalDate && departDate) {
      setDefaultPrice(false);
    }
  }, []);

  const toggleCollection = (collection) => {
    if (selectedCollections.findIndex((i) => i === collection) > -1) {
      setSelectedCollections(selectedCollections.filter((f) => f !== collection));
    } else {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  const updatePrices = (propertyId, prices) => {
    // const { propertyId, prices } = newPrice
    console.log('push selectedPrices', propertyId, prices)
    const idExists = selectedPrices.includes(propertyId)
    if (idExists) {
      //remove from array
      selectedPrices.filter((id) => id === propertyId)
    } else { //add to array
      setSelectedPrices([...selectedPrices, prices])
    }
  };

  const filterCollections = () => {
    localStorage.setItem('collections', JSON.stringify(selectedCollections));
    doSearch(0);
  };

  const sortOrderAction = (order) => {
    
    setSortOrder(order);
    doSearch(0);
  };

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
    setShowSelection(false);
    setShowResults(true);
    
    localStorage.setItem('allpropertycount', 0);
    localStorage.setItem('withondemandpropertycount', 0);
    setAllpropertycount(0);
    setWithondemandpropertycount(0);
    if (destination && validsearchdestination) {
      
      dispatch(propertyActions.loadProperties(pageNumber, constants.PAGING_PAGE_SIZE))
      // dispatch(propertyActions.toggleOnDemandandloadProperties(pageNumber, constants.PAGING_PAGE_SIZE))
      

      localStorage.setItem('formerDestination', destination);
      setShowResults(true);
    } else {
      setShowResults(false);
      localStorage.removeItem('formerDestination');
      localStorage.removeItem("propertyType");
      localStorage.removeItem("selectedTypes");
      localStorage.removeItem("selectedPrices");
      localStorage.removeItem("selectedMusthave");
      localStorage.removeItem("selectedAmenities");
      localStorage.removeItem("selectedPropertiesItem");
      localStorage.removeItem("searchedPriceRange");
      localStorage.removeItem("searchedTypes");
      localStorage.removeItem("searchedMustHave");
      localStorage.removeItem("minNights");
      console.log('here in search')
      console.log(destination, validsearchdestination, flagModel, localStorage.getItem("wishlist"))
      if(destination !== '' && !validsearchdestination) {
        console.log('here in search')
        // toast.error('Please select a valid destination from the list.', {
        //   position: 'top-right',
        //   toastClassName: 'custom-toast',
        // });
        localStorage.setItem("wishlist", true);
        setFlagModel(true)
      }
    }
    readFavorites();
  };

  useEffect(() => {
    return () => {
      // dispatch(propertyActions.resetProperties())
      // setArrivalDate("");
      // setDepartDate("");
      // localStorage.removeItem("dateFrom");
      // localStorage.removeItem("dateTo");
      // localStorage.removeItem("destination");
      // localStorage.removeItem('formerDestination');
      // localStorage.removeItem("onDemand")
      // localStorage.setItem('allpropertycount', 0);
      // localStorage.setItem('withonDemandpropertycount', 0);
      // localStorage.removeItem("bedrooms");
      // localStorage.removeItem("adults");
      // localStorage.removeItem("collections");
      // localStorage.removeItem("searchedTypes");
      // localStorage.removeItem("selectedPrices");
      // localStorage.removeItem("selectedMusthave");
      // localStorage.removeItem("selectedAmenities");
      // localStorage.removeItem('selectedClientName');
      // localStorage.setItem('allpropertycount', '-');
      // localStorage.setItem('withondemandpropertycount', '-');
      // localStorage.removeItem("onDemand");
      
      // localStorage.removeItem("propertyType");
      // localStorage.removeItem("selectedTypes");
      // localStorage.removeItem("selectedPrices");
      // localStorage.removeItem("selectedMusthave");
      // localStorage.removeItem("selectedAmenities");
      // localStorage.removeItem("selectedPropertiesItem");
      // localStorage.removeItem("searchedPriceRange");
      // localStorage.removeItem("searchedTypes");
      // localStorage.removeItem("searchedMustHave");
      // localStorage.removeItem("minNights");
    };
  }, []);

  const clearSearch = () => {
    dispatch(propertyActions.clearProperties());
    localStorage.removeItem("destination");
    localStorage.removeItem("propertyType");
    localStorage.removeItem("selectedTypes");
    localStorage.removeItem("selectedPrices");
    localStorage.removeItem("selectedMusthave");
    localStorage.removeItem("selectedAmenities");
    localStorage.removeItem("selectedTypes");
  };

  let totalCount = localStorage.getItem('count') ? localStorage.getItem('count') : 0;
  const propertyPagingFrom = 1 + pageNumber * constants.PAGING_PAGE_SIZE;
  let propertyPagingTo = (pageNumber + 1) * constants.PAGING_PAGE_SIZE;
  if (totalCount < propertyPagingTo) {
    propertyPagingTo = totalCount;
  }

  const [toggleItem, setToggleItem] = useState({
    properties: [],

  });

  const handleCurrencyChange = (event) => {
    const selectedCurrencyCode = event.target.value;
    const selectedCurrency = currencies.find(
      (currency) => currency.currency_code === selectedCurrencyCode
    );
    console.log('changed cur:', selectedCurrencyCode, selectedCurrency)
    if (selectedCurrency) {
      setSelectedCurrency(selectedCurrency.currency_code);
      setExchangeRate(selectedCurrency.conversion_rates);
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


  const onToggleProperty = (property) => {
    const existingProperties = toggleItem.properties;
    const isAlreadySelected = existingProperties.some(
      (existingProp) => existingProp.listing._id === property.listing._id
    );

    let updatedProperties;

    if (!isAlreadySelected) {
      updatedProperties = [...existingProperties, { ...property, selected: true }];
    } else {
      updatedProperties = existingProperties.filter(
        (existingProp) => existingProp.listing._id !== property.listing._id
      );
    }

    setToggleItem({
      ...toggleItem,
      properties: updatedProperties,
    });
    console.log(updatedProperties);
  };

  const onChangePage = (pageNumber) => {
    setPageNumber(pageNumber);
    localStorage.setItem('page', pageNumber);
    doSearch(pageNumber);
  };

  const showBackgroundImage = homepage && properties == null;
  const style = showBackgroundImage
    ? { backgroundImage: `url(${pageBg})`, backgroundSize: 'cover' }
    : { backgroundImage: `url(${pageBg})`, backgroundSize: '100%' };

  const handleAdvanceSearchModal = () => {
    setShowAdvancedSearch(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClosedAdvanceSearchModal = () => {
    setShowAdvancedSearch(false);
    document.body.style.overflow = 'auto';
  };

  const toggleonDemand = () => {
    if(onDemandCeck) {
      localStorage.setItem('onDemand', 'false')
    } else {
      localStorage.setItem('onDemand', 'true')
    }
    doSearch(pageNumber);
  }
  console.log('properties - pr',properties)
  return (
    <>
      <PageHeader
        agent={agent}
        agency={agency}
        calPic={calPic}
        setCalPic={setCalPic}
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
      {showAdvancedSearch ? null : (
        <div
          className='search-container'
        >
          {showSelection ? (
            <SelectedProperties
            selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              selectedPropertiesItem={toggleItem}
              exchangeRate={exchangeRate}
              agent={agent}
              agency={agency}
              arrivalDate={arrivalDate}
              departDate={departDate}
              doSearch={doSearch}
              favorites={favorites}
              defualtPrice={defaultPrice} />
          )
            : showBackgroundImage ? (
              <div
                className='search-results col'
                style={{
                  backgroundColor: 'transprent',
                  maxHeight: '100vh',
                  minHeight: '100vh',
                  width: '100%',
                  overflow: 'hidden',
                }}
              />
            )
              : (
                showResults ? (
                  <div
                    className={showAdvancedSearch ? 'content-hidden' : 'search-results col'}
                    style={{
                      backgroundColor: '#FFF',
                      maxHeight: '120vh',
                      minHeight: '100vh',
                      position: "absolute",
                      zIndex: -1,
                    }}

                  >

                    <div className={activeMenu ? 'row search-top-panel gy-1 gx-1' : 'row search-top-panel-mobile gy-1 gx-1'}>
                      <div className='col-lg-3 col-12 p-1'>
                        <div className='row'>
                          <div className='col-12 p-1' style={{ overflow: 'hidden !important' }}>
                            {
                              !isLoading && (
                                <div>
                                  <h4 className='search-main-title'>
                                    Villa Tracker {localStorage.getItem('formerDestination') == "null" || localStorage.getItem('formerDestination') == "" ? "" : `In ${localStorage.getItem('formerDestination')}`}
                                  </h4>
                                </div>
                              )
                            }
                            
                            {(!isLoading && searchelapsedTime > 0 && role === 'admin') && (
                              <div>
                                <h5 style={{fontSize: '16px', fontWeight: 'bold'}}>
                                  Search completed in {formatTime(searchelapsedTime)}
                                </h5>
                              </div>
                            )}
                            {role === 'admin' && !isLoading && (
                              <>
                                Displaying properties {propertyPagingFrom}-{propertyPagingTo} of{' '}
                                {localStorage.getItem('count') ? localStorage.getItem('count') : '?'} In{' '}
                                {localStorage.getItem('formerDestination') ? localStorage.getItem('formerDestination') : '?'}
                              </>
                            )}
                          </div>
                          {
                            !isLoading && (
                              <div className='col-12 p-1' style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold', color: '#100857' }}>
                                <span style={{cursor: 'pointer', color: onDemandCeck ? '#165093' : '#100857'}} onClick={toggleonDemand}>{allpropertycount} properties</span>
                                <span> | </span>
                                <span style={{cursor: 'pointer', color: onDemandCeck ? '#100857' : '#165093'}} onClick={toggleonDemand}>{withondemandpropertycount} On Demand</span>
                                
                                {/* {`${allpropertycount} properties / ${withondemandpropertycount} On Demand`} */}
                              </div>
                            )
                          }
                          
                          
                          <div className='col-12 p-1' style={{ marginTop: '10px' }}>
                            <h6 style={{ color: '#100857' }}> Filter by collection:</h6>
                            <div className='search-main-selection-icons'>
                              <CollectionIcon
                                path={eventsIcon}
                                pathOver={eventsIconOn}
                                selected={selectedCollections.indexOf('eventCollection') > -1}
                                label={eventsLabel}
                                onClick={() => toggleCollection('eventCollection')}
                              />
                              <CollectionIcon
                                path={familiesIcon}
                                pathOver={familiesIconOn}
                                selected={selectedCollections.indexOf('familyCollection') > -1}
                                label={familiesLabel}
                                onClick={() => toggleCollection('familyCollection')}
                              />
                              <CollectionIcon
                                path={dogsIcon}
                                pathOver={dogsIconOn}
                                selected={selectedCollections.indexOf('petsCollection') > -1}
                                label={dogsLabel}
                                onClick={() => toggleCollection('petsCollection')}
                              />
                              <CollectionIcon
                                path={greenIcon}
                                pathOver={greenIconOn}
                                selected={selectedCollections.indexOf('eco friendly') > -1}
                                label={greenLabel}
                                onClick={() => toggleCollection('eco friendly')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='col-lg-3 p-1 selected-prop' style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
                        <SelectedPropertiesDropdown
                          onShowSelection={() => setShowSelection(true)}
                          selectedPropertiesItem={toggleItem}
                          onToggle={onToggleProperty}
                          openSelection={openSelection}
                          setShowSelection={setShowSelection}
                        />
                        <div style={{fontSize: '18px !important', color: 'green', fontWeight: 'bold', width: '450px', marginTop: '200px'}}>Select up to 5 properties to send to your client</div>
                      </div>

                      <div className='col-lg-3 col-12 p-1' style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
                        <SortByDropdown sortOrder={sortOrder} onSortSelection={() => sortOrderAction(sortOrder)} />
                        <div className="col-12 curr-dropdown">
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
                      </div>


                      {properties && !isLoading && showResults && (
                        <Paging totalItems={properties.count} currentPage={pageNumber} onChangePage={onChangePage} />
                      )}
                    </div>

                    <LoadingBox visible={isLoading} />

                    {!showAdvancedSearch && !isLoading && showResults ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignContent: "center",
                        }}
                      >
                        {villa && country && lat && lng ? (
                          <div className="d-flex flex-column flex-md-row" style={{ height: "100vh" }}>
                            <div
                              className="flex-grow-1 map"
                              id="map"
                              style={{ width: "50%" }}
                            ></div>
                            {
                              showinmap && properties && properties?.listings  ? (
                                <div style={{display: 'flex', justifyContent:'center'}}><SearchedMaps properties={properties} /></div>
                              ) : ('')
                            }
                            <div className='search-boxes row flex-grow-1' style={{ height: "100vh", overflowY: villa ? 'auto' : 'hidden', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                              {properties &&
                                properties?.listings &&
                                properties?.listings.map((property, i) => {
                                  const selected =
                                    selectedProperties.findIndex(
                                      (p) => p._id === property.listing._id
                                    ) > -1;
                                  const onDemand = property?.listing?.tags?.includes("onDemand")
                                  function checkValue(x) {
                                    return x === property.listing._id;
                                  }
                                  const favorited =
                                    favorites.findIndex(checkValue) > -1;
                                  console.log(i, property, property.xdata)
                                  return (
                                    <PropertyBox
                                      dontSelect={false}
                                      setSelectedCurrency={setSelectedCurrency}
                                      updatePrices={updatePrices}
                                      onDemand={onDemand}
                                      agency={agency}
                                      agent={agent}
                                      arrive={arrivalDate}
                                      depart={departDate}
                                      key={i}
                                      favorited={favorited}
                                      property={property?.listing}
                                      fullCalendar={property?.fullCalendar}
                                      xdata={property?.xdata}
                                      villa={villa}
                                      defaultPrice={defaultPrice}
                                      selected={toggleItem.properties.some(
                                        (prop) =>
                                          prop.listing._id === property?.listing._id
                                      )}
                                      selectedCurrency={selectedCurrency}
                                      arrivalDate={arrivalDate}
                                      departDate={departDate}
                                      onToggle={() => onToggleProperty(property)}
                                    />
                                  );
                                })}
                            </div>
                          </div>
                        ) : (
                          <div className='search-boxes row col-lg-4'>
                            {
                              showinmap && properties && properties?.listings  ? (
                                <div style={{display: 'flex', justifyContent:'center'}}><SearchedMaps properties={properties} /></div>
                              ) : ('')
                            }
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
                                //console.log(i,property)
                                //console.log( property?.listing?.tags?.includes("onDemand") )
                                const onDemand = property?.listing?.tags?.includes("onDemand")
                                
                                const favorited = favorites.findIndex(checkValue) > -1;

                                // let notAvail = false
                                // let currentDate = dayjs(arrivalDate);
                                // const toDate = dayjs(departDate);
                                // if(currentDate.isBefore(toDate, 'day')) {
                                //   const formattedDate = currentDate.format('YYYY-MM-DD');
                                //   const selectedDay = property?.fullCalendar ? property?.fullCalendar.filter((period) => dayjs(period?.date).isSame(formattedDate, 'day')) : null
                                //   if (selectedDay && Array.isArray(selectedDay)) {
                                //     if (!selectedDay[0]?.allotment) {
                                //       notAvail = true
                                //     }
                                //   } else {
                                //     notAvail = true
                                //   }
                                // }
                                // console.log('notavailable - pr',notAvail)
                                // if(notAvail === false) {
                                  
                                // }
                                return (
                                  <PropertyBox
                                    updatePrices={updatePrices}
                                    setSelectedCurrency={setSelectedCurrency}
                                    dontSelect={false}
                                    onDemand={false}
                                    agency={agency}
                                    agent={agent}
                                    arrive={arrivalDate}
                                    depart={departDate}
                                    key={i}
                                    favorited={favorited}
                                    property={property?.listing}
                                    fullCalendar={property?.fullCalendar}
                                    xdata={property?.xdata}
                                    defaultPrice={defaultPrice}
                                    selectedCurrency={selectedCurrency}
                                    arrivalDate={arrivalDate}
                                    departDate={departDate}
                                    selected={toggleItem.properties.some(
                                      (prop) =>
                                        prop.listing._id === property?.listing._id
                                    )}
                                    onToggle={() => onToggleProperty(property)}
                                  />
                                );
                              })}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  // <Caru />
                  <VideoCarousel />
                )
              )
          }
        </div>
      )}
    </>
  );
};

export default SearchProperty;
