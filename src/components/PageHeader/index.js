import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageHeaderTopRow from "../PageHeaderTopRow";
import advancedSearch from "../../assets/btn-advanced-search.png";
import searchLogo from "../../assets/icons/search.png";
import GuestsPicker from "../../components/GuestsPicker";
import Button from "../Buttons/Button/Button";
import AdvancedSearch from "../../pages/SearchProperty/AdvancedSearch";
import "./PageHeader.scss";
import DestinationsDropDown from "../../components/DestinationsDropDown";
import { getStorageValue } from "../../Util/general";
import priceRange from "../../Util/data/PriceRange.json";
import PCT from "../../Util/data/PCT.json";
import MustHave from "../../Util/data/MustHave.json";
import Amenities from "../../Util/data/Amenities.json";
import removeIcon from "../../assets/icons/remove.png";
import AuthService from "../../services/auth.service";
import swal from "sweetalert";
import Modal from "../Modal/Modal";
import DatePickerComponent from "../Forms/Fields/DatePickerComponent/DatePickerComponent";
import { useHistory } from "react-router-dom";
import moment from "moment";
import EditClient from "../../pages/Clients/EditClient";
import { useDispatch, useSelector } from "react-redux";
import { toggleMapInSearch } from "../../store/redux/Property/actions";


const PageHeader = ({
  flagModel,
  bgColor,
  topBgColor,
  doSearch,
  agent,
  agency,
  destination,
  setShowAdvancedSearch,
  showAdvancedSearch,
  handleClosedAdvanceSearchModal,
  handleAdvanceSearchModal,
  setFlagModel,
  handleSearchFuntionality,
  addUser,
  handlSearchButtonAdmin,
  isCollection,
  isCollectionPage,
  onChange,
  setIsDestinationNull,
  arrivalDate,
  departDate,
  setSelectedCollections,
  setCalPic
}) => { 
  // const [arrivalDate, setArrivalDate] = useState('');
  // const [departDate, setDepartDate] = useState('');
  const token = localStorage.getItem('jToken');
  const storedSelectedPrices = localStorage.getItem("selectedPrices");
  const storedSelectedTypes = localStorage.getItem("selectedTypes");
  const storedSelectedMustHave = localStorage.getItem("selectedMusthave");
  const storedSelectedAmenities = localStorage.getItem("selectedAmenities");
  const links = localStorage.getItem("noMenu") === 'true';
  const updatedPrices =
    storedSelectedPrices && JSON.parse(storedSelectedPrices);
  const updatedTypes = storedSelectedTypes && JSON.parse(storedSelectedTypes);
  const updatedMustHave =
    storedSelectedMustHave && JSON.parse(storedSelectedMustHave);
  const updatedAmenities =
    storedSelectedAmenities && JSON.parse(storedSelectedAmenities);

  const [modalDismissed, setModalDismissed] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState(updatedPrices || []);
  const [selectedTypes, setSelectedTypes] = useState(updatedTypes || []);
  const [selectedMusthave, setSelectedMusthave] = useState(
    updatedMustHave || []
  );
  const [selectedAmenities, setSelectedAmenities] = useState(
    updatedAmenities || []
  );
  const dispatch = useDispatch();
  const ShowMapInSearch = useSelector((state) => state.property.ShowMapInSearch);

  const [form, setform] = useState({
    clientFullName: "please choose client",
    extraDetails: "",
    destination: "",
    arrive: "",
    depart: "", 
    collections: '',
   amenities: "",

    guests: "",
    bedroom: "",
    priceRange: "",
    propertyType: "",
    mustHave: "",
  });
  const [searchOpen, setSearchOpen] = useState(true);
  const [chkOnlyOnDemand, setChkOnlyOnDemand] = useState(localStorage.getItem("onDemand")==="true");
  const [chkOnlyWithPrice, setChkOnlyWithPrice] = useState(localStorage.getItem("onPrice")==="true");
  const [error, setError] = useState({ ...form });
  const [submit, setsubmit] = useState(false);
  const [selectedClientToEdit, setSelectedClientToEdit] = useState(null);
  const localtion = useLocation();
  const history = useHistory();

  const URL = localtion.pathname;
  const mobile = localStorage.getItem("screen");
  const priceItems = priceRange.map((p) => ({ value: p.code, label: p.name }));
  const typeItems = PCT.map((p) => ({ value: p.name, label: p.name })).sort(
    (a, b) => a.label.localeCompare(b.label)
  );
  const mustHaveItems = MustHave.map((p) => ({
    value: p.name,
    label: p.name,
  })).sort((a, b) => a.label.localeCompare(b.label));
  const amenitiesItems = Amenities.map((p) => ({
    value: p.name,
    label: p.name,
  }));

  let SearchedValues = {
    q: destination,
    limit: "1",
    skip: "0",
    sortBy: "data.bedrooms:-1",
  };

  useEffect(() => {
    const load = async () => {
    // setArrivalDate (getFormattedDate("dateFrom") || "");
    // setDepartDate (getFormattedDate("dateTo") || "");
    };
    load();
    // localStorage.removeItem("destination");
    // localStorage.removeItem('dateFrom');
    // localStorage.removeItem('dateTo');
    // localStorage.removeItem('adults');
    // localStorage.removeItem('children');
    // localStorage.removeItem('bedrooms');
    // localStorage.removeItem('bathrooms');
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedPrices", JSON.stringify(selectedPrices));
  }, [selectedPrices]);

  useEffect(() => {
    localStorage.setItem("selectedTypes", JSON.stringify(selectedTypes));
  }, [selectedTypes]);

  useEffect(() => {
    localStorage.setItem("selectedMusthave", JSON.stringify(selectedMusthave));
  }, [selectedMusthave]);

  useEffect(() => {
    localStorage.setItem(
      "selectedAmenities",
      JSON.stringify(selectedAmenities)
    );
  }, [selectedAmenities]);

  useEffect(() => {
    const destination = localStorage.getItem("destination");
    const bedrooms = localStorage.getItem("bedrooms") || 0; 
    const adults = localStorage.getItem("adults") || 1; 
    const collections = getStorageValue("collections");
    const propertyType = getStorageValue("searchedTypes");
    const selectedPrices = getStorageValue("selectedPrices");
    const selectedMusthave = getStorageValue("selectedMusthave");
    const selectedAmenities = getStorageValue("selectedAmenities");
    localStorage.setItem('selectedClientName', '');
  
    const updatePayload = {
      clientFullName: form.clientFullName,
      extraDetails: form.extraDetails,
      destination: destination || '',
      arrive: arrivalDate ? moment(arrivalDate).format('DD.MM.YYYY') : '', 
      depart: departDate ? moment(departDate).format('DD.MM.YYYY') : '', 
      collections: collections ? JSON.parse(collections)?.map((x) => x).join(',') : [],
      amenities: selectedAmenities ? JSON.parse(selectedAmenities)?.map((x) => x.label).join(',') : [],
      guests: adults,
      bedroom: bedrooms,
      priceRange: selectedPrices ? JSON.parse(selectedPrices).map((x) => x.label).join(',') : [],
      propertyType: propertyType,
      mustHave: selectedMusthave ? JSON.parse(selectedMusthave).map((x) => x.label).join(',') : [],
    };
  
    setform(updatePayload);
    //console.log(updatePayload);
  }, [arrivalDate, departDate, selectedPrices, selectedTypes, selectedMusthave, selectedAmenities, flagModel]);
  

  const selectDestination = (destination) => {
    localStorage.setItem("destination", destination);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const toggleWithPrice = () => {
    setChkOnlyWithPrice(!chkOnlyWithPrice);
    setChkOnlyOnDemand(false);
    localStorage.setItem("onPrice", !chkOnlyWithPrice);
    if (chkOnlyOnDemand) {
      localStorage.setItem("onDemand", chkOnlyWithPrice);
    }
  };

  const toggleOnDemand = () => {
    setChkOnlyOnDemand(!chkOnlyOnDemand);
    setChkOnlyWithPrice(false);
    localStorage.setItem("onDemand", !chkOnlyOnDemand);
    if (chkOnlyWithPrice) {
    localStorage.setItem("onPrice", chkOnlyOnDemand);
    }
  };

  const updatePrices = (item) => {
    const selectedIndex = selectedPrices.findIndex(
      (i) => i.value === item.value
    );
    if (selectedIndex > -1) {
      setSelectedPrices([]);
      localStorage.setItem("selectedPrices", "");
      return;
    }
    setSelectedPrices([item]);
  };

  const resetUpdatePrices = (e) => {
    e.preventDefault();
    e.stopPropagation()
    setSelectedPrices([]);
    localStorage.setItem("selectedPrices", "");
  }

  const updateTypes = (item) => {
    const selectedIndex = selectedTypes.findIndex(
      (i) => i.value === item.value
    );
    if (selectedIndex > -1) {
      setSelectedTypes([]);
      localStorage.setItem("selectedTypes", "");
      return;
    }
    setSelectedTypes([item]);
  };
  const resetUpdateTypes = (e) => {
    e.preventDefault();
    e.stopPropagation()
    setSelectedTypes([]);
    localStorage.setItem("selectedTypes", "");
  }

  const updateMusthave = (item) => {
    if (selectedMusthave.findIndex((i) => i.value === item.value) > -1) {
      setSelectedMusthave(
        selectedMusthave.filter((f) => f.value !== item.value)
      );
    } else {
      setSelectedMusthave([...selectedMusthave, item]);
    }
  };
  
  const resetUpdateMustHave = (e) => {
    e.preventDefault();
    e.stopPropagation()
    setSelectedMusthave([]);
  }

  const updateAmenities = (item) => {
    if (selectedAmenities.findIndex((i) => i.value === item.value) > -1) {
      setSelectedAmenities(
        selectedAmenities.filter((f) => f.value !== item.value)
      );
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const resetUpdateAmenities = (e) => {
    e.preventDefault();
    e.stopPropagation()
    setSelectedAmenities([]);
  }

  const renderSelectedItem = (item, index, removeFunction) => {
    return (
      <div
        key={index}
        className="advanced-property-search-selected-item d-flex"
      >
        <span style={{ marginRight: "10px" }}>{item.label}</span>
        <img
          src={removeIcon}
          style={{ cursor: "pointer" }}
          onClick={removeFunction}
        />
      </div>
    );
  };

  const searchFilters = () => {
    const priceRangePaylod = selectedPrices.map(({ value }) => value);
    const propertyTypesPaylod = selectedTypes.map(({ value }) => value);
    const mustHavesPaylod = selectedMusthave.map(({ value }) => value);
    const amenitiesPaylod = selectedAmenities.map(({ value }) => value);
    localStorage.setItem("searchedPriceRange", priceRangePaylod);
    localStorage.setItem("searchedTypes", propertyTypesPaylod);
    localStorage.setItem("searchedMustHave", mustHavesPaylod);
    localStorage.setItem("searchedAmenities", amenitiesPaylod);
    // localStorage.setItem("amenitiesMustHaves", JSON.stringify(amenitiesPaylod));
    SearchedValues.amenitiesMustHaves = amenitiesPaylod;
    // localStorage.setItem("priceRange", JSON.stringify(priceRangePaylod));
    SearchedValues.priceRange = priceRangePaylod;
    // localStorage.setItem("propertyType", JSON.stringify(propertyTypesPaylod));
    SearchedValues.propertyType = propertyTypesPaylod;
  };

  const handleSearchButton = () => {
    localStorage.setItem("isSearch", true);

    // Retrieve the current setSearch value, convert it to an integer, increment it, and then store it back in localStorage
    const currentSearchCount = parseInt(localStorage.getItem("setSearch"), 10) || 0;
    localStorage.setItem("setSearch", currentSearchCount + 1);

    // Update state that should trigger makeCalculations
    searchFilters(); // Assuming this updates some state that affects makeCalculations
    
    if (showAdvancedSearch) {
        setShowAdvancedSearch(false);
    }

    if (getStorageValue('destination') === '') {
        localStorage.removeItem('destination');
    }

    doSearch(0);
    // window.location.reload()
};

  

  // useEffect(() => {
  //   if (properties?.listings?.length === 0) {
  //     setFlagModel(true);
  //   }
  // },[properties])

  const handleAdvanceSearchButton = () => {
    localStorage.setItem("isSearch", true);
    searchFilters();
    showAdvancedSearch && setShowAdvancedSearch(false);
    if (getStorageValue('destination')==='') {localStorage.removeItem('destination')}
    // if (properties?.listings?.length === 0) {
    //   setFlagModel(true);
    // }
    if (!arrivalDate || !departDate) {
      swal("Please select a date first", "", "error");
    }
    doSearch(0);
  };
  // useEffect(() => {
  //   if (properties?.listings?.length === 0) {
  //     setFlagModel(true);
  //   }
  // },[properties])

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchButton();
    }
  };
  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const onSearchAdvance = () => {
    setShowAdvancedSearch(false);
  };

  const cancleClickButton = () => {
    // setFlagModel(false);
    setModalDismissed(true);
    localStorage.setItem("wishlist", false);
    flagModel = false;

    // localStorage.removeItem("selectedPrices")
    // localStorage.removeItem("selectedTypes");
    // localStorage.removeItem("selectedMusthave")
    // localStorage.removeItem("selectedAmenities");
    setSelectedPrices([])
    setSelectedTypes([])
    setSelectedMusthave([])
    setSelectedAmenities([])
    setSelectedCollections([])
    localStorage.setItem("selectedClientName", ``);
    localStorage.setItem("selectedClientEmail", ``);
  };

  const onchangeHandler = (e) => {
    let { name, value } = e.target;
    setform({ ...form, [name]: value });
  };

  function validate() {
    if (form.destination === "") {
      error.destination = "Enter destination *";
    }
    if (form.customor === "") {
      error.customor = "Enter customer *";
    }
    if (form.description === "") {
      error.description = "Enter description *";
    }

    setError(error);
  }

  const getFormattedDate = (storageKey) => {
    const storedDate = getStorageValue(storageKey);
    if (!storedDate) return "";
    const date = new Date(storedDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const formattedDate = `${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")}.${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${currentDate.getFullYear()}`;

    const submitPaylod = {
      client_id: localStorage.getItem('selectedClientid'),
      agent_id: agent?.agent_id,
      agency_id: agent?.agency_id,
      requestDate: formattedDate,
      destination: form.destination,
      clientName: localStorage.getItem("selectedClientName"),
      clientEmail: localStorage.getItem("selectedClientEmail"),
      clientPhone: localStorage.getItem("selectedClientPhone"),
      arrive: getFormattedDate("dateFrom"),
      depart: getFormattedDate("dateTo"),
      nights: moment(getFormattedDate("dateTo"), 'DD.MM.YYYY').diff(moment(getFormattedDate("dateFrom"), 'DD.MM.YYYY'), 'days'),
      guests: form.guests,
      bedroom: form.bedroom,
      bathroom: localStorage.getItem("bathrooms") || 1,
      children: localStorage.getItem("children") || 0, 
      propertyType: form.propertyType,
      collections: form.collections,
      priceRange: localStorage.getItem("searchedPriceRange"),
      offers: [],
    };
    // setFlagModel(false);
    console.log("wishlist:",submitPaylod)
    AuthService.addWishListAPi(submitPaylod)
      .then((response) => {
        console.log(response)
        swal({
          show: true,
          title: "Success",
          text: response.message,
          icon: "success",
        }).then(() => {
          setsubmit(true);
          localStorage.setItem("selectedClientName", ``);
          localStorage.setItem("selectedClientEmail", ``);
          localStorage.removeItem("selectedClientPhone");
          localStorage.removeItem("selectedClientid");
          cancleClickButton();
          history.push('/wishlist');
        });
      })
      .catch((e) => {
        console.log(e);
        swal({
          show: true,
          title: "error",
          text: e.response.data.message,
          icon: "error",
        });
        console.log(e);
        setsubmit(false);
      });
  };

  const addClient = () => {
    const NEW_CLIENT = {
      id: "-1",
      firstName: "",
      lastName: "",
      email: "",
      state: "",
      phone: "",
    };
    setSelectedClientToEdit(NEW_CLIENT)
  }

  const handleClientsModalClosed = () => {
    localStorage.setItem("selectedClientName", ``);
    localStorage.setItem("selectedClientEmail", ``);
    localStorage.removeItem("selectedClientPhone");
    localStorage.removeItem("selectedClientid");
    setSelectedClientToEdit(null);
  };

  const returnAddedClient = (client) => {
    localStorage.setItem("selectedClientName", `${client.firstName} ${client.lastName}`);
    localStorage.setItem("selectedClientEmail", `${client.email}`);
    localStorage.setItem("selectedClientPhone", `${client.phone}`)
    localStorage.setItem("selectedClientid", `${client.client_id}`)
    setSelectedClientToEdit(null);
  }

  const divStyle =
    isCollectionPage && !isCollection
      ? {
        // height: "220px",
        backgroundColor: bgColor,
      }
      : {
        maxHeight: searchOpen ? (mobile ? "600px" : "255px") : "100px",
        backgroundColor: bgColor,
      };
      const divStyle2 = {height: '160px'};
  return (
    <>
    {
      selectedClientToEdit && (
        <EditClient
          singleClientData={[]}
          token={token}
          agency={agency}
          agent={agent}
          client={selectedClientToEdit}             
          onClose={handleClientsModalClosed}
          returnAddedClient={returnAddedClient}
        />
      )
    }
      {flagModel && arrivalDate && departDate && !modalDismissed && !links && !selectedClientToEdit && (
        <>
          <div className="popup-wrapper">
            <Modal
              flagModel={flagModel}
              cancleClickButton={cancleClickButton}
              submitHandler={submitHandler}
              form={form}
              error={error}
              onchangeHandler={onchangeHandler}
              addClient={addClient}
            />
          </div>
        </>
      )}
      {/* style={URL === "/intouch" ? divStyle : (mobile ? divStyle2 : divStyle)} */}
      <div className="page-header-container" style={divStyle} >
        {!links && showAdvancedSearch && (
          <AdvancedSearch
            mustHaveItems={mustHaveItems}
            amenitiesItems={amenitiesItems}
            typeItems={typeItems}
            priceItems={priceItems}
            updateAmenities={updateAmenities}
            updateMusthave={updateMusthave}
            updateTypes={updateTypes}
            updatePrices={updatePrices}
            resetUpdateAmenities={resetUpdateAmenities}
            resetUpdateMustHave={resetUpdateMustHave}
            resetUpdateTypes={resetUpdateTypes}
            resetUpdatePrices={resetUpdatePrices}
            selectedAmenities={selectedAmenities}
            selectedMusthave={selectedMusthave}
            selectedTypes={selectedTypes}
            selectedPrices={selectedPrices}
            renderSelectedItem={renderSelectedItem}
            onClose={handleClosedAdvanceSearchModal}
            onSearchAdvance={onSearchAdvance}
            handleSearchButton={handleSearchButton}
          />
        )}
          <PageHeaderTopRow
            bgColor={topBgColor}
            searchOpen={searchOpen}
            onToggleSearch={toggleSearch}
            agent={agent}
            agency={agency}
          />
        {/* { !links && (<PageHeaderTopRow
            bgColor={topBgColor}
            searchOpen={searchOpen}
            onToggleSearch={toggleSearch}
            agent={agent}
            agency={agency}
          />)
          
        } */}
        {/* {console.log('URL === "/collections" && !isCollection', !isCollection)} */}
        {URL === "/admin" ? (
          <>
            <div className="agencies-search-container" style={{backgroundColor:'rgba(19, 59, 113, 0.8)'}}>
              <div
                className="navigation-bar"
                style={{ position: "absolute", marginBottom: "110px" }}
              ></div>
              <div className="row col-12">
                <div className="col-md-2 px-1">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Agency ID"
                    onChange={(e) =>
                      handleSearchFuntionality(e.target.value, "agencyId")
                    }
                  />
                </div>
                <div className="mb-2 col-12 col-md-2 px-1">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Agency Name"
                    onChange={(e) =>
                      handleSearchFuntionality(e.target.value, "agencyName")
                    }
                  />
                </div>

                <div className="mb-2 col-12 col-md-2 px-1">
                  <Button
                    onClick={() => handlSearchButtonAdmin()}
                    style={{ height: "42px", fontSize: "25px" }}
                    icon={<img src={searchLogo} style={{ width: "20px" }} />}
                    fullwidth={true}
                    variant="green"
                    text="Search"
                  />
                </div>
                <div className="mb-2 col-12 col-md-3 px-1 ">
                  <div
                    className="agencies-search-add-client-button"
                    onClick={() => addUser()}
                  >
                    <span className="agencies-search-separator d-none d-sm-block"></span>
                    <i
                      style={{
                        fontSize: "26px",
                        color: "white",
                        fontFamily: "AntDesign",
                        fontWeight: "normal",
                        fontStyle: "normal",
                      }}
                    >
                      
                    </i>
                    <span className="px-2">Add New Agency</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : URL === "/search" ||
          // (URL === "/collections" && isCollection !== true) ? (
          (URL === "/collections") ? (
          <>
            <div className="page-header-property-top">
              <div className="row container-main-home-menu gy-1">
                <div className="row">
                  <div className="col-lg-2 col-md-4 col-sm-6 mb-1 px-2 sm-mr-2 secondary-search">
                    <DestinationsDropDown
                      // formerDestination={getStorageValue("destination")}
                      selectDestination={selectDestination}
                      destination={destination}
                      setIsDestinationNull={setIsDestinationNull}
                    />
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 mb-1 px-2 sm-mr-2">
                    <DatePickerComponent 
                    arrivalDate={arrivalDate}
                    departDate={departDate}
                    onChange={onChange} />
                  </div>
                  <div className=" col-md-4 col-sm-6 mb-1 px-2 sm-mr-2 guestsPicker">
                    <GuestsPicker 
                    setCalPic={setCalPic}
                    />
                  </div>
                  
                  <div className="col-lg-1 col-md-12 col-sm-12 mb-1 px-2 sm-mr-2 search-btn" >
                    <Button
                      onClick={handleSearchButton}
                      style={{ height: "42px", fontSize: "25px" }}
                       //icon={<img src={searchLogo} style={{ width: "20px" }} />}
                      fullwidth={true}
                      variant="green"
                      text="Search"
                    />
                  </div>
                  <div className="col-lg-1 advanceSearch secondary-search tooltip-container px-2">
                    <img
                      src={advancedSearch}
                      style={{ width: "42px", cursor: "pointer", borderRadius: "6px" }}
                      alt=""
                      onClick={handleAdvanceSearchModal}
                    />
                    <span className="tooltip-text">
                      <span className="arrow-up"></span>Advanced Search
                    </span>
                  </div>
                  
                </div>
              </div>
              {/* <div className="page-header-top-row2 row">
            <div className="col-md-2 col-12 px-1">
              <DestinationsDropDown formerDestination={getStorageValue("destination")} selectDestination={selectDestination} />
            </div>
            <div className=" col-sm-4 col-12 px-1">
              <DatePickerComponent />
            </div>
            <div className="col-sm-3 col-12 px-1">
              <GuestsPicker />
            </div>
            <div className="col-sm-2 px-1">
              <Button
                onClick={handleSearchButton}
                style={{ height: "42px", fontSize: "25px" }}
                
                fullwidth={true}
                variant="green"
                text="Search"
              />
            </div>
            <div className="col-sm-1 px-1">
              <img
                src={advancedSearch}
                style={{ width: "42px", cursor: "pointer" }}
                alt=""
                onClick={() => setShowAdvancedSearch(true)}
              />
            </div>
          </div> */}
              <div className="page-header-top-row3 mb-4">
                <div className="checkbox-container form-check" style={{marginRight: '5px'}}>
                  <input
                    id="chkOnlyWithPrice"
                    type="checkbox"
                    className="form-check-input"
                    checked={chkOnlyWithPrice}
                    onChange={() => toggleWithPrice()}
                  />
                  <label
                    className="form-check-label m-1"
                    style={{ marginRight: "10px", color: "#fff" }}
                    htmlFor="chkOnlyWithPrice"
                  >
                    Include only properties with price
                  </label>
                </div>
                <div className="checkbox-container form-check" style={{marginRight: '5px'}}>
                  <input
                    id="chkOnlyOnDemand"
                    type="checkbox"
                    className="form-check-input"
                    checked={chkOnlyOnDemand}
                    onChange={() => toggleOnDemand()}
                  />
                  <label
                    className="form-check-label m-1"
                    style={{ marginRight: "10px", color: "#fff" }}
                    htmlFor="chkOnlyOnDemand"
                  >
                    Include only 'On Demand' properties
                  </label>
                </div>
                <div className="checkbox-container form-check" style={{marginRight: '5px'}}>
                  <input
                    id="ShowMapInSearch"
                    type="checkbox"
                    className="form-check-input"
                    checked={ShowMapInSearch}
                    onChange={() => {dispatch(toggleMapInSearch(ShowMapInSearch))}}
                  />
                  <label
                    className="form-check-label m-1"
                    style={{ marginRight: "10px", color: "#fff" }}
                    htmlFor="ShowMapInSearch"
                  >
                    Show Results in Map
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : URL === "/profile" ? (
          <>
            <div
              className="navigation-bar"
              style={{
                position: "absolute",
                marginTop: "70px",
              }}
            ></div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default PageHeader;
