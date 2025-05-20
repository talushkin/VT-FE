import React, { useEffect, useState } from "react";
import Button from "../../../components/Buttons/Button/Button";
import InputField from "../../../components/InputField";
import TextAreaField from "../../../components/TextAreaField";
import editTitleIcon from "../../../assets/icons/admin/edit-title-icon.svg";
import closeIcon from "../../../assets/icons/closeIcon.png";
import "./EditReservation.scss";
import dayjs from 'dayjs'
import { PATH_PROPERTY } from "../../../Util/constants";
import { useHistory, useLocation } from "react-router-dom";
import Modal from "react-modal";
import AuthService from '../../../services/auth.service.js';
import swal from 'sweetalert';
import axios from "axios";
import constants from "../../../Util/constants";

const EditReservation = (props) => {
  const { reservationJSON, onClose, agent, agency } = props;
  // console.log('selected reservation',reservationJSON);
  const [res, setRes] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const property = location?.state?.property;
  const fullCalendar = location?.state?.fullCalendar;
  const activeRatePlan = location?.state?.activeRatePlan;
  const agentProp = JSON.parse(localStorage.getItem("agent"));
  useEffect(() => {
    const load = async () => {
      
      try {
        console.log("reservation details:", JSON.parse(reservationJSON));
        setRes(JSON.parse(reservationJSON));
      } catch (error) {
        console.error("Failed to parse reservation JSON:", error);
        setRes(null);
      }
    };
    console.log('resdata here')
    load();
  }, [reservationJSON]);


  const handleResConfirmation = async () => {
    console.log('res', res)
    let data = JSON.stringify({
      "client": {
        "firstName": res?.guestFirstName,
        "lastName": res?.guestLastName,
        "phone": res?.guestPhoneNumbers,
        "email": res?.guestEmail
      },
      "dateFrom": dayjs(res?.startDate).format("MM.DD.YYYY"),
      "dateTo": dayjs(res?.endDate).format("MM.DD.YYYY"),
      "currency": res?.currency,
      "adults": res?.adults,
      "children": res?.children,
      "resChannel": "VT",
      "reservationId": "Villatracker_" + res?.reservationID,
      "ResStatus": "Commit"

    });

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: constants.SHUB_URL+'/reserve/' + res?.propertyId,
      headers: {
        'Authorization': 'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImlzc3VlZCI6IjE2NzUxMTI3NDYxMzYiLCJleHAiOjE2NzUxMTI4MDYsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6ImVmNzY1MDIyLTZhNzctNGZkMy04Njg1LTFhZTFhZmEzOTJhZSIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.N9MIeiLyrT3hBUtMJsTvwbYW5Z_o7ZSBuZmir2ytrb8DiE4MoXcmh8C6KriWhmnRqUnSMBRtuLcauVbqjFTorOcWMOd2RQGmisPgXBm1tHT30Hl0i57rQuLZHAVW201ot-TdQwW9oEZ3n2HTGu_A6tRhTizVmG6NRAd5KhOB2_c',
        'Account-Id': '640625ea0620e40031b8597d',
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log('res RES:', response.data, JSON.stringify(response.data));
        if (response.data.success) { console.log('SUCCESS!') }

      })
      .catch((error) => {
        console.log('error RES:', error);
      });

    const response = await AuthService.updateReservationStatus(res.reservationID, 'approved');
    console.log(response);
    swal("Success", "Reservation is approved", "success");
    // } catch (error) {
    //   console.error("Error confirming reservation:", error);
    //   swal("Error", "Failed to approve reservation", "error");
    // }
    onClose();
  }

  const handleDecline = async () => {
    let successChannel=false
    let data = JSON.stringify({
      "client": {
        "firstName": res?.guestFirstName,
        "lastName": res?.guestLastName,
        "phone": res?.guestPhoneNumbers,
        "email": res?.guestEmail
      },
      "dateFrom": dayjs(res?.startDate).format("MM.DD.YYYY"),
      "dateTo": dayjs(res?.endDate).format("MM.DD.YYYY"),
      "currency": res?.currency,
      "adults": res?.adults,
      "children": res?.children,
      "resChannel": "VT",
      "reservationId": "Villatracker_" + res?.reservationID,
      "ResStatus": "Cancel"

    });

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: constants.SHUB_URL+'/reserve-cancel/' + res?.propertyId,
      headers: {
        'Authorization': 'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImlzc3VlZCI6IjE2NzUxMTI3NDYxMzYiLCJleHAiOjE2NzUxMTI4MDYsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6ImVmNzY1MDIyLTZhNzctNGZkMy04Njg1LTFhZTFhZmEzOTJhZSIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.N9MIeiLyrT3hBUtMJsTvwbYW5Z_o7ZSBuZmir2ytrb8DiE4MoXcmh8C6KriWhmnRqUnSMBRtuLcauVbqjFTorOcWMOd2RQGmisPgXBm1tHT30Hl0i57rQuLZHAVW201ot-TdQwW9oEZ3n2HTGu_A6tRhTizVmG6NRAd5KhOB2_c',
        'Account-Id': '640625ea0620e40031b8597d',
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log('res CANCEL RES:', response.data, JSON.stringify(response.data));
        if (response?.data?.success) { 
          successChannel=true
          console.log('CANCELLED SUCCESS!') 
          swal("Success", "Reservation is Cancelled on the VT reservations!", "success");
        }
      })
      .catch((error) => {
        console.log('error RES:', error);
        swal("Error", "Failed to CANCEL reservation on channel!", "error");
      });
      if (successChannel) {
        const responseUpdate = await AuthService.updateReservationStatus(res.reservationID, 'declined');
        console.log(responseUpdate);
        if (responseUpdate.success) {
          swal("Success", "Reservation is Cancelled on the VT reservations!", "success");
        } else {
          swal("Error", "Failed to CANCEL reservation on Villatracker!", "error");
        }
      }
 

    onClose();
  }

  const goToProp = (id) => {
    console.log("going to ", id);
    history.push(PATH_PROPERTY + '/' + id);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d)) {
      return new Date().toISOString().split("T")[0];
    }
    return d.toISOString().split("T")[0];
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // const renderGSPriceAndRes = () => {
  //   if (!res?.resPayloadGS) return null;

  //   const { POS, HotelReservations, EchoToken, ResStatus, TimeStamp } = res.resPayloadGS;
  //   console.log(JSON.stringify(res.resPayloadGS));
  //   return (
  //     <div>
  //       <h3>POS</h3>
  //       <pre>{JSON.stringify(POS, null, 2)}</pre>
  //       <h3>Hotel Reservations</h3>
  //       <pre>{JSON.stringify(HotelReservations, null, 2)}</pre>
  //       <h3>Echo Token</h3>
  //       <pre>{EchoToken}</pre>
  //       <h3>Reservation Status</h3>
  //       <pre>{ResStatus}</pre>
  //       <h3>Timestamp</h3>
  //       <pre>{TimeStamp}</pre>
  //     </div>
  //   );

  // };
  //console.log('agentProp?.role', agentProp);
  console.log('reservationdata',res)
  return (
    <>
      <img src={closeIcon} className="popup-close-icon" onClick={onClose} />
      <div className="popup-wrapper">
        <div className="modal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg ">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="text-center page-title" style={{ marginLeft: 'auto', marginBottom: '-10px' }}>
                  <img src={editTitleIcon} alt="image" />
                  {" Reservation #" + res?.reservationID}</h3>
                <button type="button" style={{ marginTop: '-32px', padding: 'unset' }} className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={props.onClose}></button>
              </div>
              <hr></hr>
              <h2 className="text-center property-title text-decoration-underline cst-cursor" style={{ marginBottom: '-10px' }} onClick={() => goToProp(res?.propertyId)}>{res?.propertyName}</h2>
              <h3 className="text-center property-title-bottom" style={{ fontSize: '20px', marginTop: '5px' }}>reserved by:{res?.agentName} ({res?.agencyName})</h3>
              <div className="modal-body" style={{ marginTop: '-20px' }}>
                <div className="row">
                  {
                    !res?.isgrouppayment && (
                      <>
                        <div className="col-md-6 col-12">
                          <InputField
                            label="Client Full Name"
                            value={res?.guestFirstName + ' ' + res?.guestLastName}
                            disabled={true}
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <InputField
                            label="Email"
                            value={res?.guestEmail}
                            disabled={true}
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <InputField
                            label="Phone"
                            value={res?.guestPhoneNumbers}
                            disabled={true}
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <InputField
                            label="Guest client ID"
                            value={res?.client_id}
                            disabled={true}
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <InputField
                            label="FLYWIRE Payment Status"
                            value={res?.flywire?.data?.status}
                            disabled={true}
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <InputField
                            label="Status"
                            value={res?.status}
                            disabled={true}
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                      </>
                    )
                  }
                  
                  {
                    res?.isgrouppayment ? res?.grouppaymentdetails.length ? res?.grouppaymentdetails.map((detail, indx) => (
                      <>
                        <div className="col-md-4 col-12">
                          <InputField
                            label="Client Name"
                            showLabel={indx === 0 ? true : false}
                            value={detail?.client_name}
                            disabled={true}
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                        <div className="col-md-4 col-12">
                          <InputField
                            label="Email"
                            showLabel={indx === 0 ? true : false}
                            value={detail?.client_email}
                            disabled={true}
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                        <div className="col-md-2 col-12">
                          <InputField
                            label="Amount"
                            showLabel={indx === 0 ? true : false}
                            value={`${detail?.client_share_amount?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} USD`}
                            disabled={true}
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                        <div className="col-md-2 col-12">
                          <InputField
                            label="Status"
                            showLabel={indx === 0 ? true : false}
                            value={`${detail?.client_payment_status?.charAt(0).toUpperCase() || "P"}${detail?.client_payment_status?.slice(1).toLowerCase() || 'ending'}`}
                            disabled={true}
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                      </>
                    )) : ('') : ('')
                  }
                  { res?.isgrouppayment && (
                    <>
                      <div className="col-md-12 col-12" style={{marginTop: 15}}>
                        <span><a href={`${res?.group_link}`} target="_blank"><span>Click to make a payment</span></a></span>
                      </div>
                      <div className="col-md-6 col-12">
                        <InputField
                          label="Total Captured Amount"
                          value={`${res?.group_amount_paid?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0} USD`}
                          disabled={true}
                          style={{ marginTop: "20px" }}
                        />
                      </div>
                      <div className="col-md-6 col-12">
                        <InputField
                          label="Status"
                          value={`${res?.status.charAt(0).toUpperCase()}${res?.status.slice(1).toLowerCase()}`}
                          disabled={true}
                          style={{ marginTop: "20px" }}
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="col-md-6 col-12">
                    <InputField
                      label="Destination"
                      value={res?.destination}
                      disabled={true}
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    <InputField
                      label="Nightly rate"
                      value={(res?.nightlyBasePrice * 2).toFixed(2)}
                      disabled={true}
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    <InputField
                      label="Arrive"
                      value={dayjs(res?.startDate).format("MM.DD.YYYY")}
                      disabled={true}
                      style={{ marginTop: "20px" }}
                    />{" "}
                  </div>
                  <div className="col-md-6 col-12">
                    <InputField
                      label="Depart"
                      value={dayjs(res?.endDate).format("MM.DD.YYYY")}
                      disabled={true}
                      style={{ marginTop: "20px" }}
                    />{" "}
                  </div>
                  <div className="col-md-6 col-12">
                    <InputField
                      label="Nights"
                      value={res?.nights}
                      disabled={true}
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    <InputField
                      label="Guests"
                      value={res?.numberOfGuests}
                      disabled={true}
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    <InputField
                      label="Total"
                      value={
                        res?.isgrouppayment? res?.totalInUSD?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' + 'USD' :
                        res?.total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' + res?.currency
                      }
                      disabled={true}
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                  <div className="col-md-6 col-12 mb-5">
                    <TextAreaField
                      label="Notes"
                      value={res?.notes}
                      placeholder={"Enter notes"}
                      style={{ height: "60px", marginTop: "20px" }}
                    >
                    </TextAreaField>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <hr></hr>
                {agentProp?.role !== 'admin' && res?.status === 'pending' && (
                  <Button
                    style={{
                      fontSize: '18px',
                      backgroundColor: 'red',
                      marginRight: '50px',
                      width: '200px',
                    }}
                    text="Cancel reservation"
                    onClick={handleDecline}
                  />
                )}

                {agentProp?.role === 'admin' ? (
                  <>
                    <div className="d-flex justify-content-center mt-1">
                      {/* <button onKeyDown={''} onClick={openModal}>RRR</button> */}
                    </div>
                    {res?.status === 'pending' && (
                      <Button
                        style={{
                          fontSize: '18px',
                          backgroundColor: '#1B9C5D',
                          marginRight: '50px',
                          width: '100px',
                        }}
                        text="Approve"
                        onClick={handleResConfirmation}
                      />
                    )}

                    <Button
                      style={{
                        fontSize: '18px',
                        backgroundColor: '#FF0000',
                        marginRight: '50px',
                        width: '100px',
                      }}
                      text="Decline"
                      onClick={handleDecline}
                    />
                  </>
                ) : (
                  <p>Reservation is {res?.status} to be approved by VillaTracker team</p>
                )}
                <Button

                  style={{ fontSize: "18px", marginRight: "30px", marginRight: '50px', width: '100px' }}
                  variant="link"
                  text="Close"
                  onClick={onClose}
                />

              </div>
            </div>
          </div>
        </div>
        {/* {modalIsOpen && (
          <div className="custom-popup open">
            <div className="custom-popup-content">
              <h2>GS Price and Reservation</h2>
              {renderGSPriceAndRes()}
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default EditReservation;
