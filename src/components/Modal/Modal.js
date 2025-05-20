import React, { useEffect, useState } from "react";
import "./Modal.scss";
import Icon from "react-web-vector-icons";
import editIcon from "../../assets/icons/editIcon.png";
import ClientsDropDown from "../ClientsDropDown";
import { getStorageValue } from "../../Util/general";
import { PATH_CLIENTS } from "../../Util/constants";
import { userRequest } from "../../api/requestMethods";
import Button from "../Buttons/Button/Button";
import { useLocation } from "react-router-dom";
import { BsChevronUp, BsChevronDown } from "react-icons/bs"; // Import the icons

const Modal = (props) => {
  const {
    title,
    property,
    cancleClickButton,
    form,
    onchangeHandler,
    submitHandler,
    addClient
  } = props;

  const agent_id = localStorage.getItem("agent_id");
  const [filteredClients, setFilteredClients] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

  useEffect(() => {
    const getAllClients = async () => {
      const clientResponse = await userRequest.get(
        `/client/get-clients?agent_id=${agent_id}`,
        {
          params: { limit: "300", skip: "0", agent_id: 1 },
        }
      );
      if (
        clientResponse?.data?.clients !== null &&
        clientResponse?.data?.clients !== undefined
      ) {
        console.log(clientResponse?.data?.clients)
        setFilteredClients(clientResponse?.data?.clients);
      }
    };

    getAllClients();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown state
  };

  const selectClient = (client) => {
    localStorage.setItem("selectedClientName", `${client?.firstName} ${client?.lastName}`);
    localStorage.setItem("selectedClientEmail", `${client?.email}`);
    localStorage.setItem("selectedClientid", `${client?.client_id}`);
  };

  const location = useLocation();
  const URL = location.pathname;

  const buttonStyles =
    URL === '/search'
      ? { position: 'absolute', top: '10px', right: '0px', margin: '-24px 0px 12%' }
      : URL === '/collections'
        ? { position: 'absolute', top: '17px', right: '0px', margin: '-24px 5px 12%' }
        : {}; 

  return (
    <>
      <div
        className="modal gap-2"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        style={{overflow: 'unset'}}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content w-auto">
            <h4 style={{ marginTop: '-37px', color: '#ffffff', fontSize: '25px' }}></h4>
            <div className="modal-header" style={{ marginLeft: '27px', marginBottom: '-37px' }}>
              <div className="offer-heading header-test">
                <h1 className="text-center">
                  <b style={{ color: 'black' }}>{title ? title : 'Request an Alternative Offer'}</b>
                </h1>
                <h3 className="text-center" style={{ fontSize: 'revert' }}>
                 We can't seem to find any results online...
                  We got all the details just waiting for you to add your client
                  name and <br /> your comment so we can send you alternative
                  offer
                </h3>
              </div>
              <button
                type="button"
                className="btn-close float-end"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={buttonStyles}
                onClick={cancleClickButton}
              ></button>
            </div>
            <hr />

            <div className="modal-body my-3 mx-3 offer-container">
              <div className="container px-2">
                <div className="row client-offer">
                  <div className="form-group col-md-5">
                    
                    {/* <span>Add New Client</span> */}
                    <div
                      style={{ cursor: "pointer" }}
                      className="d-flex align-items-center text-center"
                      onClick={addClient}
                    >
                      <label htmlFor="clientFullName">
                        <b>Client email</b>
                      </label>
                      <span className="vertical-separator"></span>
                      <Icon
                        name="pluscircle"
                        font="AntDesign"
                        color="#165093"
                        size={20}
                        style={{ cursor: "pointer" }}
                      />
                      <p
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
                      </p>
                    </div>
                    <div className="d-flex align-items-center">
                      <div style={{ flex: "1 1 auto" }}  onClick={toggleDropdown} >
                        <ClientsDropDown
                          displayType=""
                          formerClient={getStorageValue("selectedClientEmail")}
                          selectClient={selectClient}
                          onFocus={toggleDropdown}
                        />
                      </div>
                      <div
                        className="arrow-icon"
                        onClick={toggleDropdown}
                        style={{ cursor: "pointer", marginRight: "20px" }}
                      >
                        {dropdownOpen ? <BsChevronUp /> : <BsChevronDown />}
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-md-5">
                    <label htmlFor="extraDetails">
                      <b>
                        Extra Details - Add your personal note{" "}
                        <img src={editIcon} className="img-fluid" />
                      </b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="extraDetails"
                      name="extraDetails"
                      value={form?.extraDetails}
                      onChange={onchangeHandler}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div className="container px-2">
                <div className="row client-research d-flx justify-content-between gaps">
                  <div className="col-md-2 form-group gaps">
                    <label htmlFor="propertyId">
                      <b>Property Id</b>
                    </label>
                    <input
                      type="text"
                      className="form-control offer-inputs"
                      id="propertyId"
                      name="propertyId"
                      defaultValue={property?._id}
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-2 form-group">
                    <label htmlFor="propertyName">
                      <b>Property name</b>
                    </label>
                    <input
                      type="text"
                      className="form-control offer-inputs"
                      id="propertyName"
                      name="propertyName"
                      defaultValue={property?.title}
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-2 form-group">
                    <label htmlFor="destination">
                      <b>Destination</b>
                    </label>
                    <input
                      type="text"
                      className="form-control offer-inputs"
                      id="destination"
                      name="destination"
                      placeholder="Enter destination"
                      defaultValue={form?.destination}
                      disabled={false}
                    />
                  </div>

                  <div className="col-md-2 form-group">
                    <label htmlFor="arrive">
                      <b>Arrive</b>
                    </label>
                    <input
                      type="text"
                      className="form-control offer-inputs"
                      id="arrive"
                      name="arrive"
                      defaultValue={form?.arrive}
                      disabled={false}
                    />
                  </div>

                  <div className="col-md-2 form-group">
                    <label htmlFor="deport">
                      <b>Depart</b>
                    </label>
                    <input
                      type="text"
                      className="form-control offer-inputs"
                      id="depart"
                      name="depart"
                      defaultValue={form?.depart}
                      disabled={false}
                    />
                  </div>

                  <div className="col-md-2 form-group">
                    <label htmlFor="guests">
                      <b>Guests</b>
                    </label>
                    <input
                      type="text"
                      className="form-control offer-inputs"
                      id="guests"
                      name="guests"
                      defaultValue={form?.guests}
                      disabled={false}
                    />
                  </div>

                  <div className="col-md-2 form-group">
                    <label htmlFor="bedroom">
                      <b>Bedroom</b>
                    </label>
                    <input
                      type="text"
                      className="form-control offer-inputs"
                      id="bedroom"
                      name="bedroom"
                      defaultValue={form?.bedroom}
                      disabled={false}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div className="container px-2">
                <div className="row client-research d-flx justify-content-between">
                  <div className="col-md-3 form-group">
                    <label htmlFor="destination">
                      <b>Price Range</b>
                    </label>
                    <input
                      type="text"
                      className="form-control search-inputs"
                      id="priceRange"
                      name="priceRange"
                      defaultValue={form?.priceRange}
                      placeholder="Price Range"
                      disabled={false}
                    />
                  </div>

                  <div className="col-md-3 form-group">
                    <label htmlFor="propertyType">
                      <b>Collections</b>
                    </label>
                    <input
                      type="text"
                      className="form-control search-inputs"
                      id="collections"
                      name="collections"
                      defaultValue={form?.collections}
                      placeholder="Collections"
                      disabled={false}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label htmlFor="propertyType">
                      <b>Property Type</b>
                    </label>
                    <input
                      type="text"
                      className="form-control search-inputs"
                      id="propertyType"
                      name="propertyType"
                      defaultValue={form?.propertyType}
                      placeholder="Property Type"
                      disabled={false}
                    />
                  </div>

                  <div className="col-md-3 form-group">
                    <label htmlFor="mustHave">
                      <b>Must Have</b>
                    </label>
                    <input
                      type="text"
                      className="form-control search-inputs"
                      id="mustHave"
                      name="mustHave"
                      defaultValue={form?.mustHave}
                      placeholder="Must Have"
                      disabled={false}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label htmlFor="amenities">
                      <b>Amenities</b>
                    </label>
                    <input
                      type="text"
                      className="form-control search-inputs"
                      id="amenities"
                      name="amenities"
                      defaultValue={form?.amenities}
                      placeholder="Amenities"
                      disabled={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="float-end mt-4">
                <Button
                  style={{ fontSize: "18px", marginRight: "30px" }}
                  variant="link"
                  text="Close"
                  onClick={cancleClickButton}
                />
                <Button
                  style={{ fontSize: "18px" }}
                  text="Send to Villa Tracker Team"
                  onClick={submitHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
