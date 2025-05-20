import React, { useState, useEffect } from "react";
import Button from "../../../components/Buttons/Button/Button";
import InputField from "../../../components/InputField";
import TextAreaField from "../../../components/TextAreaField";
import addTitleIcon from "../../../assets/icons/admin/add-title-icon.svg";
import editTitleIcon from "../../../assets/icons/admin/edit-title-icon.svg";
import closeIcon from "../../../assets/icons/closeIcon.png";
import "./EditAgency.scss";
import AuthService from "../../../services/auth.service";
import swal from "sweetalert";
import { log } from "loglevel";
import countryList from "../../../Util/data/countries.json";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import DropdownInput from "../../../components/Forms/Fields/DropdownInput/DropdownInput";
import { set } from "lodash";

const EditAgency = (props) => {
  const { agency, agent, onClose, agencies, editClickedId, editAgencyId, agencyToEdit, getAllAgencies } =
    props;
  useEffect(() => {
    const load = async () => {
      console.log('props editAgency',props)
    };
    load();
  }, []);

  /*
  {
    "_id": "646cc9e3763e9a4e44cbccb7",
    "abbreviation": "srl",
    "address": "Av Infante Santo 58 1 E",
    "agencyName": "Mr Travel",
    "agency_id": 268,
    "lastSignIn": "23/05/2023",
    "approvedAt": "27/03/2023",
    "firstSignIn": "23/05/2023",
    "status": "approved",
    "city": "Lisbon",
    "countryCode": "PT",
    "createdAt": "2023-01-20T17:24:19.491Z",
    "email": "l.sousa@mrtravel.pt",
    "firstName": "Luis Sousa",
    "phone": 351000000000,
    "state_province": "Lisbon",
    "ta_company_markup": 10,
    "updatedAt": "2023-03-29T07:12:06.425Z"
}
  */

  const agencyTypes = [
    { name: 'Travel agency' },
    { name: 'Travel designer' },
    { name: 'Event planer' },
    { name: 'Concierge company' },
    { name: 'VIP company' },
    { name: 'Personal assistant of an executive' },
    { name: 'Retreat facilitator' },
  ];
  // console.log(agencies, "agencies");
  const [filterDataSingle, setfilterDataSingle] = useState(
    agencies.filter((iteam) => iteam._id === agency)
  );
  console.log('agencyToEdit?.',agencyToEdit);
  const [agencyName, setAgencyName] = useState(
    agencyToEdit?.agencyName||''
  );
  const [agencyType, setAgencyType] = useState(
    agencyToEdit?.agencyType||agencyTypes[0].name
  );
  const [agentName, setAgentName] = useState(agencyToEdit?.firstName ||'');
  const [agentFirstName, setAgentFirstName] = useState(agencyToEdit?.firstName ||'');
  const [agentLastName, setAgentLastName] = useState(agencyToEdit?.lastName ||'');
  const [address, setAddress] = useState(agencyToEdit?.address ||'');
  const [email, setEmail] = useState(agencyToEdit?.email ||'');
  const [website, setWebsite] = useState(agencyToEdit?.website ||'');
  const getCountry = (countryCode) => {
    const ccIndex = countryList.findIndex((i) => i.code === countryCode);
    const cc = ccIndex ? countryList[ccIndex]?.name : "";
    console.log("countryName=", cc);
    return cc;
  };

  const [countryCode, setCountryCode] = useState(
    agencyToEdit?.countryCode|| ''
  );
  const [country, setCountry] = useState(agencyToEdit?.country||getCountry(countryCode)||'');
  const [phone, setPhone] = useState(agencyToEdit?.phone||'');
  const [city, setCity] = useState(agencyToEdit?.city||'');
  const [notes, setNotes] = useState(agencyToEdit?.notes||'');
  const [status, setStatus] = useState(agencyToEdit?.status||'');
  const [linkedinProfile, setLinkedinProfile] = useState(agencyToEdit?.linkedinProfile || '');
  const [organization, setOrganization] = useState(agencyToEdit?.organization || '');

  const getCountryCode = (countryName) => {
    const ccIndex = countryList.findIndex((i) => i.name === countryName);
    const cc = ccIndex ? countryList[ccIndex]?.code : "";
    //console.log("countryCode=", cc);
    return cc;
  };

console.log('agency details:', {
  agencyName: agencyName,
  agencyType: agencyType,
  firstName: agentFirstName,
  lastName: agentLastName,
  phone: phone,
  email: email,
  address: address,
  city: city,
  countryCode: countryCode,
  country: country,
  notes: notes,
  organization: organization,
status:status}
)

  const handleCountry = (e) => {
    console.log(getCountryCode(e.target.value))
    setCountry(e.target.value);
    setCountryCode(e.target.value !== "" ? getCountryCode(e.target.value) : '');
  };
  const handleSaveButton = () => {
    if (editClickedId) {
      var UpdatePayLoad = {
        agencyName: agencyName,
        agencyType: agencyType,
        firstName: agentFirstName,
        lastName: agentLastName,
        phone: phone,
        email: email,
        address: address,
        city: city,
        countryCode: countryCode,
        country: country,
        notes: notes,
        linkedinProfile: linkedinProfile,
        website: website,
        organization: organization
        // "firstName": "string",
        // "abbreviation": "string",
        // "website": "string",
        // "state_province": "string",
        // "organization": "string",
        // "userImage": "string",
        // "ta_company_markup": "string"
      };
      AuthService.updateTravelAgency(UpdatePayLoad, editAgencyId)
        .then((response) => {
          console.log(response.message);
          swal({
            show: true,
            icon: "success",
            title: "Success",
            text: response.message,
            timer: 3000,
          });
          if(typeof getAllAgencies !== 'undefined') {
            getAllAgencies();
          }
          setTimeout(() => {
            onClose()();
          }, 1000);
        })
        .catch((e) => {
          swal({
            show: true,
            icon: "error",
            title: "Opps!!",
            text: e.response.data.message,
            timer: 3000,
          });
        });
    } else {
      var addPayLoad = {
        agencyName: agencyName,
        agencyType: agencyType,
        firstName: agentFirstName,
        lastName: agentLastName,
        address: address,
        countryCode: countryCode,
        country: country,
        city: city,
        phone: phone,
        email: email,
        notes: notes,
        linkedinProfile: linkedinProfile,
        website: website,
        organization: organization,
        status: "pending"
        // "firstName": "string",
        // "lastName": "string",
        // "stateProvince": "string",
        // "currency": "string",
        // "organization": "string",
        // "password": "string"
      };
      AuthService.AgentSignup(addPayLoad)
        .then((response) => {
          console.log(response.message);
          swal({
            show: true,
            icon: "success",
            title: "Success",
            text: response.message,
            timer: 3000,
          });
          if(typeof getAllAgencies !== 'undefined') {
            getAllAgencies();
          }
          
          setTimeout(() => {
            onClose()();
          }, 1000);
        })
        .catch((e) => {
          console.log(e, "jsdjsdjsjdk");

          swal({
            show: true,
            icon: "error",
            title: "Opps!!",
            text: e.response.data.message,
            timer: 3000,
          });
        });
    }
  };

  const handleResetButton = () => {
    if (editClickedId) {
      var resetPayLoad = {
        email: email,
      };

      AuthService.AdminReset(resetPayLoad)
        .then((response) => {
          console.log(response.message);
          swal({
            show: true,
            icon: "success",
            title: "Success",
            text: response.message,
            timer: 3000,
          });
          setTimeout(() => {
            onClose()();
          }, 1000);
        })
        .catch((e) => {
          console.log(e, "jsdjsdjsjdk");

          swal({
            show: true,
            icon: "error",
            title: "Opps!!",
            text: e.response.data.message,
            timer: 3000,
          });
        });
    }
  };

  const organizationList = [
    { name: "UNWTO" },
    { name: "PATA" },
    { name: "ATB" },
    { name: "CTO" },
    { name: "ETC" },
    { name: "IATA" },
    { name: "WTCF" },
    { name: "WTTC" },
    { name: "WTCF" },
    { name: "OTHER " },
  ];

  return (
    <>
      <img src={closeIcon} className="popup-close-icon" onClick={onClose} alt='edit icon' />
      <div className="container edit-agency-container">
        <div className="edit-agency-header">
          <img src={agency?.id === "-1" ? addTitleIcon : editTitleIcon} alt="" />
          <div className="edit-agency-title">
            <h3>
              {" "}
              {agency?.id === "-1"
                ? "Add Agency & Manager agent details"
                : "Edit Agency/agent details"}
            </h3>
          </div>
        </div>
        <div className="edit-agency-main" style={{ display: "block" }}>
          <div className="row">
          <div className="col-md-6 col-12">
              <InputField
                label="Agency Name*"
                value={agencyName||''}
                onChange={setAgencyName}
                placeholder={"Enter agency name"}
                style={{ marginTop: "20px" }}
              />
            </div>
            <div className="col-md-6 col-12" style={{ marginTop: "-10px" }}>    
            <DropdownInput
              label="Travel Agency Type*"
              name="agencyType"
              showLoginLink="signup"
              error={null}
              placeholder={"choose Agency Type"}
              dropDownObj={agencyTypes}
              value={agencyType||''}
              setValue={setAgencyType}
            />
            </div>
            <div className="col-md-6 col-12">
              <InputField
                label="Agent Name*"
                value={agentName||''}
                onChange={setAgentName}
                placeholder={"your agent name"}
                style={{ marginTop: "20px" }}
              />
            </div>
            <div className="col-md-6 col-12">
              <InputField
                label="Agent Name*"
                value={agentName||''}
                onChange={setAgentName}
                placeholder={"your agent name"}
                style={{ marginTop: "20px" }}
              />
            </div>
           
            <div className="col-md-6 col-12">
              <InputField
                label="Address"
                value={address||''}
                onChange={setAddress}
                placeholder={"Enter address"}
                style={{ marginTop: "20px" }}
              />
            </div>
            <div className="col-md-6 col-12">
              <InputField
                label="E-mail Address*"
                value={email||''}
                onChange={setEmail}
                placeholder={"Enter email address"}
                style={{ marginTop: "20px" }}
              />
            </div>

            <div className="col-md-6 col-12 mt-3">
              <label
                htmlFor="country"
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#707070",
                }}
              >
                Country
              </label>
              <br />
              <select
                className="form-select form-control"
                id="country"
                defaultValue={country||''}
                //onChange={(e) => handleCountry(e)}
              >
                <option value="">Select a country</option>
                {countryList.map((countryData) => (
                  <option key={countryData.code} value={countryData.name}>
                    {countryData.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-12 mt-3">
              <div class="NameInput_input_wrapper__Pg6NQ -fif_wrp">
                <div class="NameInput_label_wrapper__tE+0L -fif_label_wrp">
                  <label htmlFor="PhoneNo">Phone No*</label>
                </div>
                <div class="NameInput_input_field_wrapper__B1t2f -fif_input_wrp NameInput_error__ctrlq">
                  <PhoneInput
                    name="phone"
                    class="form-control NameInput_input_field__p8DEW"
                    country={"ch"}
                    enableSearch={true}
                    placeholder="Enter phone number"
                    value={phone||''}
                    onChange={setPhone}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <InputField
                label="City"
                value={city}
                onChange={setCity}
                placeholder={"Enter city"}
                style={{ marginTop: "20px" }}
              />{" "}
            </div>
            <div className="col-md-6 col-12 mb-5">
              {/* <TextAreaField
                label="Notes"
                onChange={setNotes}
                placeholder={"Enter notes"}
                style={{ height: "152px", marginTop: "20px" }}
              >
                {notes}
              </TextAreaField> */}
            </div>
          </div>
        </div>
        <div className="edit-agency-footer">
          <Button
            style={{ fontSize: "18px", marginRight: "30px" }}
            variant="link"
            text="Cancel"
            onClick={onClose}
          />
          <Button
            style={{ fontSize: "18px" }}
            text="Save"
            onClick={handleSaveButton}
          />
        </div>
      </div>

      <div className="popup-wrapper">
        <div class="modal" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered modal-lg ">
            <div class="modal-content">
              <div class="modal-header">
                <h3
                  className="text-center page-title"
                  style={{ marginLeft: "auto", marginBottom: "-10px" }}
                >
                  <img alt=''
                    src={agency?.id === "-1" ? addTitleIcon : editTitleIcon}
                  />
                  {agency?.id === "-1"
                    ? " Add Agency & Manager"
                    : " Edit Agency  & Manager"}
                </h3>
                <button
                  type="button"
                  style={{ marginTop: "-32px", padding: "unset" }}
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={props.onClose}
                ></button>
              </div>
              <hr></hr>

              <div class="modal-body" style={{ marginTop: "-30px" }}>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <InputField
                      label="Agency Name*"
                      value={agencyName}
                      onChange={setAgencyName}
                      placeholder={"Enter agency name"}
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                  <div className="col-md-6 col-12" style={{ marginTop: "10px" }}>    
            <DropdownInput
              label="Travel Agency Type*"
              name="agencyType"
              showLoginLink="signup"
              error={null}
              placeholder={"choose Agency Type"}
              dropDownObj={agencyTypes}
              value={agencyType}
              setValue={setAgencyType}
            />
            </div>
                  {/* <div className="col-md-6 col-12">
                    <InputField
                      label="Agent Name*"
                      value={agentName}
                      onChange={setAgentName}
                      placeholder={"select"}
                      style={{ marginTop: "20px" }}
                    />
                  </div> */}
                   <div className="col-md-6 col-12">
                    <InputField
                      label="Agent Firstname*"
                      value={agentFirstName||''}
                      onChange={setAgentFirstName}
                      placeholder={"your agent name"}
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    <InputField
                      label="Agent Lastname"
                      value={agentLastName||''}
                      onChange={setAgentLastName}
                      placeholder={"your agent name"}
                      style={{ marginTop: "20px" }}
                    />
                  </div>

                  <div className="col-md-6 col-12">
                    <InputField
                      label="Address"
                      value={address}
                      onChange={setAddress}
                      placeholder={"Enter address"}
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    <InputField
                      label="E-mail Address*"
                      value={email}
                      onChange={setEmail}
                      placeholder={"Enter email address"}
                      style={{ marginTop: "20px" }}
                    />
                  </div>

                  <div className="col-md-6 col-12" >
                    <div className="input-field-container" style={{ marginTop: "20px" }}>
                      <div className="input-field-label fw-bolder" style={{}}>
                        Country
                      </div>
                
                      <select
                        className="form-select form-control"
                        id="country"
                        defaultValue={country}
                        onChange={(e) => handleCountry(e)/*setCountry(e.target.value)*/}
                        style={{ marginTop: "0px" }}
                      >
                        <option value="">Select a country</option>
                        {countryList.map((countryData) => (
                          <option key={countryData.code} value={countryData.name}>
                            {countryData.name}
                          </option>
                        ))}
                      </select>
                      
                    </div>
                    
                  </div>
                  <div className="col-md-6 col-12 mt-1">
                    <div className="input-field-container" style={{ marginTop: "15px" }}>
                      <div className="input-field-label fw-bolder" style={{}}>
                        Phone No*
                      </div>
                      <PhoneInput
                          name="phone"
                          class="form-control NameInput_input_field__p8DEW"
                          country={countryCode !== "" ? countryCode.toLowerCase() : 'ch'}
                          enableSearch={true}
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={setPhone}
                        />
                    </div>
                    {/* <div class="NameInput_input_wrapper__Pg6NQ -fif_wrp">
                      <div class="NameInput_label_wrapper__tE+0L -fif_label_wrp">
                        <label htmlFor="PhoneNo">Phone No*</label>
                      </div>
                      <div class="NameInput_input_field_wrapper__B1t2f -fif_input_wrp NameInput_error__ctrlq">
                        <PhoneInput
                          name="phone"
                          class="form-control NameInput_input_field__p8DEW"
                          country={countryCode !== "" ? countryCode.toLowerCase() : 'ch'}
                          enableSearch={true}
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={setPhone}
                        />
                      </div>
                    </div> */}
                  </div>

                  <div className="col-md-6 col-12">
                    <InputField
                      label="City"
                      value={city}
                      onChange={setCity}
                      placeholder={"Enter city"}
                      style={{ marginTop: "20px" }}
                    />{" "}
                  </div>
                  <div className="col-md-6 col-12 ">
                    {/* <TextAreaField
                      label="Notes"
                      onChange={setNotes}
                      value={notes}
                      placeholder={"Enter notes"}
                      style={{ height: "152px", marginTop: "20px" }}
                    >
                    </TextAreaField> */}
                    <InputField
                      label="LinkedIn"
                      value={linkedinProfile}
                      onChange={setLinkedinProfile}
                      placeholder={"Profile Url"}
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                  <div className="col-md-6 col-12 mb-5">
                    {/* <TextAreaField
                      label="Notes"
                      onChange={setNotes}
                      value={notes}
                      placeholder={"Enter notes"}
                      style={{ height: "152px", marginTop: "20px" }}
                    >
                    </TextAreaField> */}
                    <InputField
                      label="Website"
                      value={website}
                      onChange={setWebsite}
                      placeholder={"Website"}
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                  <div className="col-md-6 col-12 mb-5">
                      <div style={{marginTop: '12px'}}>
                        <DropdownInput
                          label="Travel Organization Membership"
                          inputName="organizationname"
                          showLoginLink="signup"
                          placeholder={"Select an Organization"}
                          dropDownObj={organizationList}
                          value={organization}
                          setValue={setOrganization}
                          
                        />
                      </div>
                      
                    
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <hr></hr>
                {agency?.id !== "-1" &&
                  status !== "pending" && (
                    <Button
                      style={{ fontSize: "18px", marginRight: "30px" }}
                      variant="green"
                      text="Reset password to 'VT2024'"
                      onClick={handleResetButton}
                    />
                  )}
                <Button
                  style={{ fontSize: "18px", marginRight: "30px" }}
                  variant="link"
                  text="Cancel"
                  onClick={onClose}
                />
                <Button
                  style={{ fontSize: "18px" }}
                  text="Save"
                  onClick={handleSaveButton}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAgency;
