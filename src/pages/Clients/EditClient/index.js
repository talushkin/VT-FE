import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../../components/Buttons/Button/Button";
import "./EditClient.scss";
import InputField from "../../../components/InputField";
import TextAreaField from "../../../components/TextAreaField";
import axios from "axios";
import { baseURL } from "../../../core/index.js";
import swal from "sweetalert";
import AuthService from "../../../services/auth.service";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

const EditClient = (props) => {
  const { agency, client, token, onClose, singleClientData, agent, getAllClients } = props;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const history = useHistory(); // Import useHistory hook

  useMemo(() => {
    if (client.id !== "-1") {
      setFirstName(singleClientData?.firstName);
      setLastName(singleClientData?.lastName);
      setNickName(singleClientData?.nickName);
      setEmail(singleClientData?.email);
      setPhone(singleClientData?.phone);
      setNotes(singleClientData?.notes);
    }
  }, [singleClientData, client]);

  const userRequest = axios.create({
    baseURL: baseURL,
    headers: {
      token: `Bearer ${token}`,
    },
  });

  const agentId = localStorage.getItem("agent_id");

  const onSave = () => {
    const Payload = {
      agency_id: agent?.agency_id,
      agent_id: agentId,
      agencyName: agency?.agencyName,
      firstName: firstName,
      lastName: lastName,
      notes: notes,
      nickName: nickName,
      email: email,
      phone: phone,
    };
    // console.log(Payload)
    // return;

    if (singleClientData?.client_id !== undefined && singleClientData?.client_id !== null) {
      const client_id = singleClientData?.client_id;
      AuthService.UpdateClientApi(client_id, Payload)
        .then((response) => {
          if (response) {
            swal({
              show: true,
              icon: "success",
              title: "Success",
              text: "Successfully Updated",
              timer: 3000,
            }).then(() => {
              onClose();
              getAllClients();
            });
          }
        })
        .catch((e) => {
          swal({
            show: true,
            icon: "error",
            title: "Error",
            text: e?.response?.data?.message || "Something went wrong",
          });
        });
      onClose();
    } else {
      if(!firstNameError && !lastNameError && !emailError) {
        AuthService.AddNewClientApi(Payload)
        .then((response) => {
          if (response) {
            Payload.client_id = response?.client?.client_id;
            swal({
              show: true,
              icon: "success",
              title: "Success",
              text: "Successfully created",
            }).then(() => {
              
              if(typeof props.returnAddedClient !== 'undefined') {
                props.returnAddedClient(Payload);
                onClose();
              } else {
                history.push({
                  pathname: "/clients",
                  state: { openModal: true }
                }); // Navigate to /clients and pass state to open modal
                onClose();
                getAllClients();
              }
              
            });
          }
        })
        .catch((e) => {
          swal({
            show: true,
            icon: "error",
            title: "Error",
            text: e?.response?.data?.message || "Something went wrong",
          });
        });
      } else {
        swal({
          show: true,
          icon: "error",
          title: "Error",
          text: "Something went wrong"
        });
      }
      
    }
  };
  const validateRequired = (value, required = false) => {
    if(required) {
      if(value !== '') {
        return true;
      } else {
        return false
      }
    } else {
      return true;
    }
  }
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
    
  }
  const onChangeFormHandle = (val, field) => {
    if(field === 'firstName') {
      if(!validateRequired(val, true)) {
        setFirstNameError('First name is required');
        setFirstName(val)
      } else {
        setFirstNameError(false);
        setFirstName(val)
      }
    } else if(field === 'lastName') {
      if(!validateRequired(val, true)) {
        setLastNameError('Last name is required');
        setLastName(val)
      } else {
        setLastNameError(false);
        setLastName(val)
      }
    } else if(field === 'email') {
      if(!validateRequired(val, true)) {
        setEmailError('Email is required');
        setEmail(val)
      } else {
        if(validateEmail(val)) {
          setEmailError(false);
          setEmail(val)
        } else {
          setEmailError('Invalid email');
          setEmail(val)
        }
        
      }
    } else if(field === 'nickName'){
      setNickName(val)
    } else if(field === 'phone'){
      setPhone(val)
    } else if(field === 'notes'){
      setNotes(val)
    }
  }

  return (
    <>
      <div className="popup-wrapper">
        <div className="modal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content w-auto">
              <div className="modal-header px-2 py-0">
                <h3 className="text-center page-title" style={{ marginLeft: 'auto', padding: '12px 0px' }}>
                  {client.id === "-1" ? "Add New Client" : "Edit Client Profile"}
                </h3>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ marginTop: '-40px', padding: 'revert-layer' }}
                  onClick={props.onClose}
                ></button>
              </div>

              <hr className="text-light-muted m-0" />
              <div className="d-flex justify-content-center align-items-center m-3">
                <div className="row">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12 col-12 p-2">
                        <InputField
                          label="First Name*"
                          fieldId='firstName'
                          value={firstName}
                          onChange={onChangeFormHandle}
                          placeholder={"Enter first name"}
                          error={firstNameError}
                        />
                      </div>
                      <div className="col-md-12 col-12 p-2">
                        <InputField
                          label="Nick Name"
                          fieldId='nickName'
                          value={nickName}
                          onChange={onChangeFormHandle}
                          placeholder={"Enter nick name"}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 col-12 p-2">
                        <InputField
                          onSubmit={onSave}
                          label="Email Address*"
                          fieldId='email'
                          value={email}
                          onChange={onChangeFormHandle}
                          placeholder={"Enter email address"}
                          error={emailError}
                        />
                      </div>
                      <div className="col-md-12 col-12 p-2">
                        <label>Phone No</label>
                        <PhoneInput
                          country={"ch"}
                          enableSearch={true}
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(val) => {

                            onChangeFormHandle(val, 'phone')
                          }}
                          inputClass="w-100"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12 col-12 p-2">
                        <InputField
                          label="Last Name*"
                          fieldId='lastName'
                          value={lastName}
                          onChange={onChangeFormHandle}
                          placeholder={"Enter last name"}
                          error={lastNameError}
                        />
                      </div>
                      <div className="col-md-12 col-12 p-2">
                        <TextAreaField
                          label="Notes"
                          fieldId='notes'
                          onChange={onChangeFormHandle}
                          placeholder={"Enter notes"}
                          style={{ height: "250px" }}
                          value={notes}
                        >
                          {notes}
                        </TextAreaField>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer mt-5">
                <hr></hr>
                <div className="float-end">
                  <Button
                    variant="link"
                    text="Cancel"
                    style={{ marginRight: "10px" }}
                    onClick={onClose}
                  />
                  <Button text="Save" onClick={onSave} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditClient;
