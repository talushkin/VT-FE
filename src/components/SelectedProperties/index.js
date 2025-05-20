import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import pageBg from '../../assets/SigninPic.jpeg';
import PropertyBox from '../../pages/SearchProperty/PropertyBox';
import BlueWhiteButton from '../Buttons/BlueWhiteButton';
import shareSelection from '../../assets/icons/share-selection-on.svg';
import shareSelectionOn from '../../assets/icons/share-selection.png';
import link from '../../assets/icons/link-on.svg';
import linkOn from '../../assets/icons/link.png';
import saveSearch from '../../assets/icons/save-search-on.png';
import saveSearchOn from '../../assets/icons/save-search.png';
import ShareSelectionPopup from './ShareSelectionPopup';
import SaveSearchPopup from './SaveSearchPopup';
import goBack from '../../assets/go-back.svg';
import './SelectedProperties.scss';
import { PATH_SEARCH, PATH_RESERVE } from '../../Util/constants';
import EditClient from "../../pages/Clients/EditClient";

const SelectedProperties = (props) => {
  const [showShareAsLink, setShowShareAsLink] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [showShareAsPdf, setShowShareAsPdf] = useState(false);
  const [showSaveSearchButton, setShowSaveSearchButton] = useState(true);
  const [selectedClientToEdit, setSelectedClientToEdit] = useState(null);
  const token = localStorage.getItem('jToken');
  const { type, 
    onBack, 
    doSearch,
     agent, 
     agency, 
     selectedPropertiesItem,
     selectedCurrency,
     exchangeRate, 
     departDate, 
     arrivalDate } = props;
  const history = useHistory();
  const doBack = (params) => {
    const { pathname } = window.location;
    window.location.pathname = `${PATH_SEARCH}`;
  };
  const dateFrom = localStorage.getItem('dateFrom');
  const dateTo = localStorage.getItem('dateTo');

  const links = true
  console.log("selectedPropertiesItem >", selectedPropertiesItem);
  console.log('showShareAsPdf-----------', showShareAsPdf);
  let boxes = selectedPropertiesItem?.properties;
  console.log('boxes:', boxes)

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
    setSelectedClientToEdit(null);
  };

  const returnAddedClient = (client) => {
    // localStorage.setItem("SelectedClientNameFullName", `${client.firstName} ${client.lastName}`);
    localStorage.setItem("clientEmail", `${client.email}`);
    setSelectedClientToEdit(null);
  }
  return (
    <div className='selected-properties-container mobile-search' style={{ backgroundColor: 'white' }}>
      {/* <div className='link18-bold-no-line px-3' style={{ display: 'flex' }} onClick={doBack}>
        <img onClick={doBack} src={goBack} alt='' />
        &nbsp;&nbsp;Back
      </div> */}
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
      {showShareAsLink && !selectedClientToEdit && (
        <ShareSelectionPopup
          title="Share selection as a link for the client"
          icon={link}
          agent={agent}
          agency={agency}
          selectedProperties={selectedPropertiesItem.properties}
          showShareAsPdf={showShareAsPdf}
          link={true}
          onClose={() => {localStorage.setItem("clientEmail", ``); setShowShareAsLink(false)}}
          addClient={addClient}
        />
      )}
      {showShareAsPdf && !selectedClientToEdit && (
        <ShareSelectionPopup
        startDate={arrivalDate}
        endDate={departDate}
        selectedCurrency={selectedCurrency}
          title="Share selection as PDFs for the client"
          icon={shareSelection}
          agent={agent}
          agency={agency}
          selectedProperties={selectedPropertiesItem.properties}
          selectedPrices={selectedPrices}
          showShareAsPdf={showShareAsPdf}
          onClose={() => {localStorage.setItem("clientEmail", ``); setShowShareAsPdf(false)}}
          addClient={addClient}
        />
      )}
      {showSaveSearch && !selectedClientToEdit && (
        <SaveSearchPopup
          onClose={() => {localStorage.setItem("clientEmail", ``); setShowSaveSearch(false)}}
          addClient={addClient}
        />
      )}

      <div className='selected-properties-results'>
        {/* <div className='selected-properties-title'>Your Properties Selection</div> */}
        <div className='selected-properties-boxes row'>
          {boxes?.map((property, i) => {
            return property?.listing._id ?
            <PropertyBox
            selectedProps={true}
            selectedPrices={selectedPrices}
            setSelectedPrices={setSelectedPrices}
            exchangeRate={exchangeRate}
            onDemand={false}
            agency={agency}
            agent={agent}
            arrive={arrivalDate}
            depart={departDate}
            key={i}
            property={property?.listing}
            fullCalendar={property?.fullCalendar}
            xdata={property?.xdata}
            selectedCurrency={selectedCurrency}
            arrivalDate={arrivalDate}
            departDate={departDate}
          />
              : <div key={i}>{property}</div>;
          })}
        </div>
        <div className='selected-properties-sub-title'>
          Action Needed:
          <div className='selected-properties-results-buttons mt-3'>
            {links && dateFrom && dateTo && <BlueWhiteButton
              style={{ textalign: 'center' }}
              icon={link}
              iconOn={linkOn}
              onClick={() => setShowShareAsLink(true)}
              label='Share as link for the client'
            />}
            <BlueWhiteButton
              // style={{ width: "100%" }}
              icon={shareSelection}
              iconOn={shareSelectionOn}
              onClick={() => setShowShareAsPdf(true)}
              label='Share as PDFs for the client'
            />
            {showSaveSearchButton && dateFrom && dateTo && (
              <BlueWhiteButton
                icon={saveSearch}
                iconOn={saveSearchOn}
                onClick={() => setShowSaveSearch(true)}
                label='Save search for the client'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedProperties;
