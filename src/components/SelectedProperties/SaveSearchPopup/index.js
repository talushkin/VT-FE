import React, { useEffect, useState } from 'react';
import Icon from "react-web-vector-icons";
import Button from '../../Buttons/Button/Button';
import InputField from '../../InputField/index';
import SaveSearchBig from '../../../assets/special-collection/icons/save-search-big.svg';
import editIcon from '../../../assets/icons/editIcon.png';
import './SaveSearchPopup.scss';
import { userRequest } from '../../../api/requestMethods';
import axios from 'axios';
import { baseURL } from '../../../core';
import { useSelector } from 'react-redux';
import swal from 'sweetalert';
import moment from 'moment';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const SaveSearchPopup = (props) => {
  const { onClose, addClient } = props;
  const arrivalDate = localStorage.getItem('dateFrom');
  const departDate = localStorage.getItem('dateTo');
  const initialPriceRange = localStorage.getItem('selectedPrices');
  const [priceRange, setPriceRange] = useState(initialPriceRange ? JSON.parse(initialPriceRange).map((x) => x.label) : '');
  const initialPropertyType = localStorage.getItem('selectedTypes');
  const [propertyType, setPropertyType] = useState(initialPropertyType ? JSON.parse(initialPropertyType).map((x) => x.label) : '');
  const initialMustHave = localStorage.getItem('selectedMusthave');
  const [mustHave, setMustHave] = useState(initialMustHave ? JSON.parse(initialMustHave).map((x) => x.label) : '');
  const storedAmenities = localStorage.getItem('selectedAmenities');
  const [amenities, setAmenities] = useState(storedAmenities ? JSON.parse(storedAmenities).map((x) => x.label) : '');
  const [notes, setNotes] = useState('notes');
  const [destination, setDestination] = useState(localStorage.getItem('destination'));
  const [arrive, setArrive] = useState(null);
  const [depart, setDepart] = useState(null);
  const [guests, setGuests] = useState(localStorage.getItem('adults'));
  const [children, setChildren] = useState(localStorage.getItem('children'));
  const [clientsList, setClientsList] = useState(null);
  const [fullName, setFullName] = useState(localStorage.getItem('clientEmail') || '');
  const [clientId, setClientId] = useState(null);
  const [propertyId, setPropertyId] = useState([]);
  const [listingData, setListingData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const selectedProperties = useSelector((state) => state.property.selectedProperties);
  const agent_id = localStorage.getItem('agent_id');
  const history = useHistory();
  const selectedPropertiesItems = JSON.parse(localStorage.getItem('selectedPropertiesItem'));
  const [selClient, setSelClient] = useState({})

  // New states for Bedrooms and Bathrooms
  const bedrooms = localStorage.getItem('bedrooms');
  const bathrooms = localStorage.getItem('bathrooms');

  useEffect(() => {
    const extractedListings = selectedPropertiesItems?.map((item) => ({
      propertyId: item?.listing?._id,
      title: item?.listing?.title,
      nickname: item?.listing?.nickname,
      tags: item?.listing?.tags,
    }));
  
    console.log("Extracted Listings:", extractedListings);
    setListingData(extractedListings);
  }, [])


  console.log("select items is here --------------", listingData)
  
  console.log("property ID ", propertyId)

  useEffect(() => {
    if (arrivalDate && departDate) {
      const updatedArrivDate = moment.isMoment(arrivalDate) ? arrivalDate : moment(arrivalDate);
      const updatedDepartDate = moment.isMoment(departDate) ? departDate : moment(departDate);

      const formattedArrivalDate = updatedArrivDate.isValid() ? updatedArrivDate.format('DD.MM.YYYY') : null;
      const formattedDepartDate = updatedDepartDate.isValid() ? updatedDepartDate.format('DD.MM.YYYY') : null;

      setArrive(formattedArrivalDate);
      setDepart(formattedDepartDate);
    }
  }, [arrivalDate, departDate]);

  useEffect(() => {
    const load = async () => { };
    load();
  }, []);

  useEffect(() => {
    const getAllClients = async () => {
      const clientResponse = await userRequest.get(`/client/get-clients?agent_id=${agent_id}`, {
        params: { limit: '300', skip: '0', agent_id: 1 },
      });
      const Client =  clientResponse?.data?.clients.find((client) => client.email === fullName);
      setClientsList(clientResponse);
      setSelClient(Client)
    };
    getAllClients();
  }, [fullName]);

  useEffect(() => {
    const selectedClient = clientsList?.data?.clients.find((client) => client.email === fullName);
    setClientId(selectedClient?.client_id);
  }, [clientsList]);

  const saveLog = () => {
    if (!fullName) {
      setErrorMessage('Please select client name');
      return;
    }
    let propertyIdArray = [];
    selectedPropertiesItems && selectedPropertiesItems?.map(({ listing }) => {
      if (listing?._id) {
        propertyIdArray.push(listing?._id)
      }
    })
    setPropertyId(propertyIdArray);

    const adults = localStorage.getItem('adults');
    const TOKEN = localStorage.getItem('jToken');
    // const selectedClient = clientsList?.data?.clients.find((client) => client.email === fullName);
    const payloadData = {
      log_id: 0,
      clientName: `${selClient.firstName} ${selClient.lastName}`,
      clientPhone: selClient.phone,
      clientEmail: selClient.email,
      property_id: JSON.stringify(propertyIdArray),
      PropertyType: JSON.stringify(propertyType),
      savedSearch_id: 'string',
      destination: destination,
      dateFrom: arrive,
      dateTo: depart,
      adults: adults,
      children: children,
      beds: bedrooms,  // Adding bedrooms to the payload
      baths: bathrooms,  // Adding bathrooms to the payload
      PriceFilter: JSON.stringify(priceRange),
      MustHaves: JSON.stringify(mustHave),
      Amenities: JSON.stringify(amenities),
      brochure: false,
      links: false,
      savedSearch: true,
      booked: false,
      dateAction: new Date(),// change it to today
      listings : listingData
    };
    console.log(payloadData)
    // ${baseURL}
    const client_log = axios
      .post(`${baseURL}/client-log/add-client-log?client_id=${clientId}`, payloadData, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          history.push("./clients")
          swal({
            icon: 'success',
            show: true,
            title: 'Success!!',
            text: res.data.message,
            timer: 3000,
          });
        } else {
          swal({
            icon: 'error',
            show: true,
            title: 'Opps!!',
            text: res.data.message,
            timer: 3000,
          });
        }
        onClose();
      });
  };
  console.log("PropertyIdArray", propertyId)

  useEffect(() => {
    
  }, [propertyId]);

  const [modalSize, setModalSize] = useState('modal-xl');

  useEffect(() => {
    console.log(window.innerWidth, 'window.innerWidth');
    const handleResize = () => {
      if (window.innerWidth > 1366) {
        setModalSize('modal-xl');
      } else {
        setModalSize('modal-lg');
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className='popup-wrapper'>
        <div class='modal' tabindex='-1'>
          <div class={`modal-dialog modal-dialog-centered ${modalSize}`}>
            <div class='modal-content'>
              <div class='modal-header' style={{ padding: '0px 10px 0px 10px' }}>
                <h4 className='text-center pt-2' style={{ color: '#284866', fontWeight: 'bold', marginLeft: 'auto', marginTop: '15px' }}>
                  <img style={{ width: '36px', marginBottom: '0px' }} src={SaveSearchBig} alt='' />
                  &nbsp;Save search for the client
                </h4>
                <button
                  type='button'
                  class='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                  style={{ marginBottom: '15px', marginRight: '-6px' }}
                  onClick={props.onClose}
                ></button>
              </div>
              <hr></hr>

              <div class='modal-body'>
                <div className='row'>
                  <div className='col-md-12 col-12 px-2 mb-2'>
                    <div style={{ cursor: "pointer" }} onClick={addClient}>
                      <label htmlFor='country'>Client Full Name*: </label>
                      <span className="vertical-separator"></span>
                        <Icon
                          name="pluscircle"
                          font="AntDesign"
                          color="#165093"
                          size={20}
                          style={{ cursor: "pointer" }}
                        />
                        <span
                          style={{
                            paddingLeft: "10px",
                            color: "#165093",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            // marginTop: "10px",
                            marginBottom: 'unset'
                          }}
                          data-bs-toggle="modal"
                          href="#exampleModalToggle"
                        >
                          Add New Client
                        </span>
                    </div>
                    <div>
                      <select
                        className='form-select'
                        name='Select Client Email:'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      >
                        <option value=''>Select Client</option>
                        {clientsList &&
                          clientsList.data &&
                          clientsList.data.clients.map((client) => (
                            <option key={client.id} value={client.email}>
                              {`${client.firstName} ${client.lastName}`}
                            </option>
                          ))}
                      </select>
                      {errorMessage && (
                        <p style={{ color: 'red' }}>{errorMessage}</p>
                      )}
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <h5 style={{ color: '#284866', marginLeft: '15px', fontWeight: 'bold', marginTop: '1rem' }}>
                      Search Description:
                    </h5>
                    <div className='col-md-6 px-2 mb-2 w-100'>
                      <InputField
                        label='Destination'
                        value={destination}
                        onChange={setDestination}
                        placeholder={'Enter destination'}
                        disabled={true}
                      />
                    </div>
                    <div className='d-flex w-auto'>
                      <div className='col-md-6 px-2 col-sm-6 mb-2'>
                        <InputField
                          label='Arrive'
                          value={arrive}
                          onChange={setArrive}
                          placeholder={'arrive date'}
                          disabled={true}
                        />
                      </div>
                      <div className='col-md-6 px-2 col-sm-6 mb-2'>
                        <InputField
                          label='Depart'
                          value={depart}
                          onChange={setDepart}
                          placeholder={'depart date'}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className='col-md-6  px-2 mb-2 w-100'>
                      <InputField
                        label='Guests'
                        value={`${guests} Guests, ${children} children`}
                        onChange={setGuests}
                        disabled={true}
                      />
                    </div>
                    {bedrooms && (
                      <div className='col-md-6 px-2 mb-2 w-100'>
                        <InputField
                          label='Bedrooms'
                          value={bedrooms}
                          onChange={() => {}}
                          disabled={true}
                        />
                      </div>
                    )}
                    {bathrooms && (
                      <div className='col-md-6 px-2 mb-2 w-100'>
                        <InputField
                          label='Bathrooms'
                          value={bathrooms}
                          onChange={() => {}}
                          disabled={true}
                        />
                      </div>
                    )}
                  </div>
                  <div className='col-md-6'>
                    <h5 style={{ color: '#284866', marginLeft: '15px', fontWeight: 'bold', marginTop: '1rem' }}>
                      Advanced Search:
                    </h5>
                    <div className='col-md-6 px-2 mb-2 w-100'>
                      <InputField
                        label='Price Range'
                        value={priceRange ? priceRange : ''}
                        onChange={setPriceRange}
                        disabled={true}
                      />
                    </div>
                    <div className='col-md-6 px-2 mb-2 w-100'>
                      <InputField
                        label='Property Type'
                        value={propertyType ? propertyType : ''}
                        onChange={setPropertyType}
                        disabled={true}
                      />
                    </div>
                    <div className='col-md-6 px-2 mb-2 w-100'>
                      <InputField
                        label='Must Have'
                        value={mustHave ? mustHave : ''}
                        onChange={setMustHave}
                        disabled={true}
                      />
                    </div>
                    <div className='col-md-6 px-2 mb-2 w-100'>
                      <InputField
                        label='Amenities'
                        value={amenities ? amenities : ''}
                        onChange={setAmenities}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 px-2 mb-2 mb-4 w-100'>
                    <p>
                      Notes <img src={editIcon} alt='editI' />
                    </p>
                    <InputField onChange={setNotes} />
                  </div>
                </div>
                <div className='float-end' style={{ marginRight: '-32px', marginBottom: '-4px' }}>
                  <Button
                    style={{ fontSize: '18px', marginRight: '30px' }}
                    variant='link'
                    text='Cancel'
                    onClick={onClose}
                  />
                  <Button style={{ fontSize: '18px', marginRight: '30px' }} text='Save' onClick={saveLog} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaveSearchPopup;
