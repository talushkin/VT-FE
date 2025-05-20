import axios from "axios";
import { toast } from "react-toastify";
import swal from "sweetalert";
import AuthService from "../../services/auth.service";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import pageBg from "../../assets/SigninPicNew_resize.png";
import creditCardIcon from "../../assets/icons/creditcard.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "./Profile.scss";
import BankDetails from "./BankDetails";
import { IoMdAddCircle} from "react-icons/io";
import eyeOn from "../../assets/icons/eye.png";
import eyeOff from "../../assets/icons/eye-slash.png";
import Loader from "../../components/Loader/Loader";
import AddSubAgentModel from "./BankDetails/AddSubAgentModel"; // Import the component
import editIcon from "../../assets/icons/editIcon.png"; // Import the icon
import { PATH_SEARCH } from "../../Util/constants";
import countryList from "../../Util/data/countries.json"; // Imported JSON containing country and currency data
import DropdownInput from "../../components/Forms/Fields/DropdownInput/DropdownInput";
import { templateData } from "../../Util/templateData";
import EmailTemplateButton from "../../components/emailtemplatebutton";
import { IoMdCopy, IoIosInformation  } from "react-icons/io";
import { MdTranslate } from 'react-icons/md';
import TranslationPopup from "./TranslationPopup";

const Profile = (props) => {
  let { setProfile, token, agent, agency } = props;
  const [bankDetailsToShow, setBankDetailsToShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ShowsubAgent, setSubAgent] = useState(false);
  const [file, setFile] = useState(null);
  const [setLogo, setSetLogo] = useState([]);
  const [logoImage, setLogoImage] = useState([]);
  const [counter, setCounter] = useState(0);
  const history = useHistory();
  const [showUploadLogo, setShowUploadLogo] = useState(false); // Define the state
  const [showPwd, setShowPwd] = useState({
    password: false,
    confirmPassword: false,
  });
  const agencyTypes = [
    { name: "Travel agency" },
    { name: "Travel designer" },
    { name: "Event planer" },
    { name: "Concierge company" },
    { name: "VIP company" },
    { name: "Personal assistant of an executive" },
    { name: "Retreat facilitator" },
  ];
  const inputFileds = {
    agentName: "",
    managerLastName: "",
    lastName: "",
    agencyName: "",
    agentName: "",
    agentPhone: "",
    email: "",
    phone: "",
    address: "",
    zipcode: "",
    city: "",
    country: "",
    currency: "",
    password: "",
    confirmPassword: "",
    userImage: "",
    IBAN: "",
    bankName: "",
    extraDetails: "",
    holderAdress: "",
    holderCity: "",
    holderCountry: "",
    holderFirstName: "",
    holderzipcode: "",
    swiftNumber: "",
    addPaylodDyanmic: "",
    emailTitle: "",
    emailText: "",
    postalCode: "",
  };

  const [formData, setformData] = useState(inputFileds);
  const [error, seterror] = useState({ ...formData });
  const [submit, setsubmit] = useState(false);
  const fileInputRef = useRef(null);
  const userImage = localStorage.getItem("user_image");

  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [translation, setTranslation] = useState(false);

  useEffect(() => {
    setLogoImage(userImage !== null ? userImage : agent?.userImage);

    if (agency) {
      const UpdatedData = {
        agencyId: agent?.agency_id || "",
        agentName: agent?.firstName || "",
        agentPhone: agent?.phone || "",
        email: agent?.email || "",
        phone: agent?.phone || "",
        managerFirstName: agency?.firstName || "",
        managerLastName: agency?.lastName || "",
        agencyEmail: agency?.email || "",
        agencyPhone: agency?.phone || "",
        agencyName: agency?.agencyName || "",
        agencyType: agency?.agencyType || "",
        address: agency?.address || "",
        zipcode: agency?.zipcode || "",
        city: agency?.city || "",
        country: agency?.country || "",
        currency: agency?.currency || "", // Directly set currency here
        userImage: agency?.userImage || "",
        IBAN: agency?.bankAccount?.IBAN || "",
        bankName: agency?.bankAccount?.bankName || "",
        extraDetails: agency?.bankAccount?.extraDetails || "",
        holderAdress: agency?.bankAccount?.holderAdress || "",
        holderCity: agency?.bankAccount?.holderCity || "",
        holderCountry: agency?.bankAccount?.holderCountry || "",
        holderFirstName: agency?.bankAccount?.holderFirstName || "",
        holderzipcode: agency?.bankAccount?.holderzipcode || "",
        swiftNumber: agency?.bankAccount?.swiftNumber || "",
        emailTitle: agent?.emailFormat?.title || "",
        emailText: agent?.emailFormat?.emailText || "",
      };
      setformData(UpdatedData);
      localStorage.setItem("formData", JSON.stringify(UpdatedData));
    }
  }, [userImage, agent, agency]);

  useEffect(() => {
    const agentInfo = JSON.parse(localStorage.getItem("agent") || "{}");
    const agentCurrency = agentInfo.currency || "";

    if (agentCurrency) {
      setSelectedCurrency(agentCurrency);
      setformData((prevFormData) => ({
        ...prevFormData,
        currency: agentCurrency,
      }));
    }
  }, []);

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCurrencyChange = (event) => {
    const selectedCurrencyCode = event.target.value;
    const selectedCurrency = countryList.find(
      (country) => country.currency.code === selectedCurrencyCode
    );

    if (selectedCurrency) {
      console.log('change cur:',selectedCurrency)
      setSelectedCurrency(selectedCurrency.currency.code);
      setformData({ ...formData, currency: selectedCurrencyCode });

      const agentInfo = JSON.parse(localStorage.getItem("agent") || "{}");
      agentInfo.currency = selectedCurrencyCode;
      localStorage.setItem("agent", JSON.stringify(agentInfo));
    }
  };

  const getCurrencyDisplayName = (currencyCode) => {
    const country = countryList.find(
      (country) => country.currency.code === currencyCode
    );
    if (country) {
      const { code, symbol, name } = country.currency;
      return `${code} ${symbol ? symbol : ""} (${name})`;
    }
    return currencyCode;
  };

  const getCurrencyDisplaySymbol = (currencyCode) => {
    const country = countryList.find(
      (country) => country.currency.code === currencyCode
    );
    if (country) {
      const { symbol } = country.currency;
      return symbol ? `${symbol} ` : "";
    }
    return currencyCode;
  };

  const handleAgencyType = (e) => {
    console.log(e);
    const updatedFormData = { ...formData }
    // const updatedFormData = { ...formData, agencyType: e };
    if(formData.agencyType.toLowerCase() !== e.toLowerCase()) {
      updatedFormData.emailTitle = "";
      updatedFormData.emailText = "";
      updatedFormData.agencyType = e;
    }

    setformData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  };

  const handleInputField = (e) => {
    const { name, value, files } = e.target;
    console.log(name, value);
    const updatedFormData = { ...formData, [name]: value };

    setformData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));

    if (name === "userImage" && files && files[0]) {
      const file = files[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        setformData({ ...formData, [name]: file });
        setFile(URL.createObjectURL(file));
        const submitPayload = {
          user_image: file,
        };

        setLoading(true);

        AuthService.updateProfilePicture(submitPayload)
          .then((response) => {
            console.log(response, "-response");
            localStorage.setItem("user_image", response?.doc?.userImage);
            setLoading(false);
            if (response.message === "Profile Updated") {
              swal({
                icon: "success",
                show: true,
                title: "Success",
                text: "Logo Uploaded successfully",
              }).then(() => {
                window.location.reload();
              });
            }
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
          });
      };
    }

    if (value) var regexp = /^\S*$/;
    switch (name) {
      case "agentName":
        error.agentName = value.length > 0 ? "" : "Enter Name";
        break;
      case "email":
        error.email = value.length > 0 ? "" : "Enter email";
        break;
      case "agentPhone":
        error.phone = value.length > 0 ? "" : "Enter phone";
        break;
      case "password":
        if (!value) {
          error.password = "Enter password";
        } else if (!regexp.test(value) || !regexp.test(value)) {
          error.password = "White or empty space is not allowed";
        } else if (formData.confirmPassword !== value) {
          error.confirmPassword = "Passwords do not match";
        } else {
          error.password = "";
          error.confirmPassword = "";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error.confirmPassword = "Enter confirm password";
        } else if (!regexp.test(value) || !regexp.test(value)) {
          error.confirmPassword = "White or empty space is not allowed";
        } else if (formData.password !== value) {
          error.confirmPassword = "Passwords do not match";
        } else {
          error.password = "";
          error.confirmPassword = "";
        }
        break;

      default:
        break;
    }
    seterror(error);
  };

  useEffect(() => {
    if (agent?.role === "agent") {
      setShowUploadLogo(false);
    } else {
      setShowUploadLogo(true);
    }

    const UpdatedData = {
      agencyId: agent?.agency_id !== undefined ? agent?.agency_id : "",
      agentName: agent?.firstName !== undefined ? agent?.firstName : "",
      agentPhone: agent?.phone !== undefined ? agent?.phone : "",
      email: agent?.email !== undefined ? agent?.email : "",
      phone: agent?.phone !== undefined ? agent?.phone : "",
      managerFirstName:
        agency && agency?.firstName !== undefined ? agency?.firstName : "",
      managerLastName:
        agency && agency?.lastName !== undefined ? agency?.lastName : "",
      agencyEmail: agency && agency?.email !== undefined ? agency?.email : "",
      agencyPhone: agency && agency?.phone !== undefined ? agency?.phone : "",
      agencyName: agency?.agencyName,
      agencyType:
        agency && agency?.agencyType !== undefined ? agency?.agencyType : "",
      address: agency?.address,
      zipcode: agency?.zipcode,
      city: agency?.city,
      country: agency?.country,
      currency: agency?.currency,
      userImage: agency?.userImage,
      IBAN: agency && agency?.bankAccount?.IBAN,
      bankName: agency && agency?.bankAccount?.bankName,
      extraDetails: agency && agency?.bankAccount?.extraDetails,
      holderAdress: agency && agency?.bankAccount?.holderAdress,
      holderCity: agency && agency?.bankAccount?.holderCity,
      holderCountry: agency && agency?.bankAccount?.holderCountry,
      holderFirstName: agency && agency?.bankAccount?.holderFirstName,
      holderzipcode: agency && agency?.bankAccount?.holderzipcode,
      swiftNumber: agency && agency?.bankAccount?.swiftNumber,
      emailTitle:
        agent?.emailFormat?.title !== undefined
          ? agent?.emailFormat?.title
          : "",
      emailText:
        agent?.emailFormat?.emailText !== undefined
          ? agent?.emailFormat?.emailText
          : "",
    };
    setformData(UpdatedData);
    console.log("formData:", UpdatedData);
  }, []);

  const handleform = (e) => {
    e.preventDefault();
    setsubmit(true);
    const UpdateAgentPayload = {
      firstName: formData.agentName !== undefined ? formData.agentName : "",
      agencyName: formData.agencyName !== undefined ? formData.agencyName : "",
      phone: formData.agentPhone !== undefined ? formData.agentPhone : "",
      email: formData.email !== undefined ? formData.email : "",
      userImage: formData.userImage !== undefined ? formData.userImage : "",
      emailFormat: {
        title: formData?.emailTitle,
        emailText: formData?.emailText,
      },
      ta_company_markup: formData.userImag !== undefined && formData.userImag,
      currency: formData.currency !== undefined ? formData.currency : "USD",
    };

    const UpdateAgencyPayload = {
      firstName:
        formData.managerFirstName !== undefined && formData.managerFirstName,
      lastName:
        formData.managerLastName !== undefined ? formData.managerLastName : "",
      agencyName: formData.agencyName !== undefined ? formData.agencyName : "",
      agencyType: formData.agencyType !== undefined ? formData.agencyType : "",
      phone: formData.agencyPhone !== undefined ? formData.agencyPhone : "",
      email: formData.agencyEmail !== undefined ? formData.agencyEmail : "",
      abbreviation:
        formData.abbreviation !== undefined ? formData.abbreviation : "",
      website: formData.website !== undefined ? formData.website : "",
      address: formData.address !== undefined ? formData.address : "",
      city: formData.city !== undefined ? formData.city : "",
      state_province:
        formData.state_province !== undefined ? formData.state_province : "",
      zipcode: formData.zipcode !== undefined ? formData.zipcode : "",
      countryCode:
        formData.countryCode !== undefined ? formData.countryCode : "",
      organization:
        formData.organization !== undefined ? formData.organization : "",
      userImage: formData.userImage !== undefined ? formData.userImage : "",
      ta_company_markup: formData.userImag !== undefined && formData.userImag,
      bankAccount: {
        IBAN: formData?.IBAN,
        bankName: formData?.bankName,
        extraDetails: formData?.extraDetails,
        holderAdress: formData?.holderAdress,
        holderCity: formData?.holderCity,
        holderCountry: formData?.holderCountry,
        holderFirstName: formData?.holderFirstName,
        holderzipcode: formData?.holderzipcode,
        swiftNumber: formData?.swiftNumber,
      },
      currency: formData.currency || "",
    };

    let updateProfilePassword = {};
    if (formData.password) {
      updateProfilePassword = {
        newPass: formData.password,
        ConfirmPass: formData.confirmPassword,
      };
    }
    console.log(UpdateAgentPayload, "UpdateAgentPayload");
    console.log(UpdateAgencyPayload, "UpdateAgencyPayload");
    console.log(updateProfilePassword, "updateProfilePassword");
    if (formData.email !== "" && formData.agencyPhone !== "") {
      if (error.password.length === 0 && error.confirmPassword.length === 0) {
        console.log(UpdateAgentPayload, "UpdateAgentPayload");
        console.log(UpdateAgencyPayload, "UpdateAgencyPayload");
        AuthService.updateProfileApi(
          agent?.agent_id,
          agent?.agency_id,
          UpdateAgentPayload,
          UpdateAgencyPayload,
          Object.keys(updateProfilePassword).length > 0
            ? updateProfilePassword
            : undefined
        )
          .then((response) => {
            console.log(response.message, "-");
            if (response) {
              swal({
                icon: "success",
                show: true,
                title: "Success",
                text: "Successfully Form Submitted",
              }).then(() => {
                window.location.reload();
              });
            }
          })
          .catch((e) => {
            console.log(e);
          });
        swal({
          icon: "success",
          show: true,
          title: "Success",
          text: "Successfully Form Submitted",
          timer: 3000,
        });
      } else {
        swal({
          show: true,
          title: "Please check password to match",
          text: "Please fill correct details",
          icon: "error",
          timer: 3000,
        });
      }
    } else {
      swal({
        show: true,
        title: "Please fill email, and check password to match",
        text: "Please fill correct details",
        icon: "error",
        timer: 3000,
      });
    }
  };

  useEffect(() => {
    AuthService.GetProfile(agent?.agent_id)
      .then((response) => {
        setSetLogo(response?.agent?.userImage);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [agent?.agent_id]);

  const [inputFields, setInputFields] = useState([
    {
      firstName: "",
      email: "",
      SubAgentPhoneNumber: "",
      agentPhone: "",
      agency_id:agent?.agency_id||999
    },
  ]);

  const addInputField = () => {
    if (inputFields.length < 5) {
      setInputFields([
        ...inputFields,
        {
          firstName: "",
          email: "",
          SubAgentPhoneNumber: "",
          agentPhone: "",
          agency_id: agent.agency_id||999,
          approving_agent_name: agent.firstName + " " + agent.lastName||'',
          approving_agent_id: agent.agent_id,
        },
      ]);
      console.log('inputs:',inputFields)
    }
  };

  const removeInputField = (indexToRemove) => {
    const newInputFields = inputFields.filter(
      (_, index) => index !== indexToRemove
    );
    if (inputFields.length > 1) {
      setInputFields(newInputFields);
    }
  };

  const handleInputChange = (index, field, event) => {
    console.log("pressed:", index, field, event);
    const value = event;
    const newInputFields = inputFields.map((item, i) => {
      if (i === index) {
        item[field] = value;
        console.log(value);
        return { ...item };
      }
      return item;
    });
    //console.log('newIn:',newInputFields)
    setInputFields(newInputFields);
  };

  const handleclosesubagent = () => {
    setSubAgent(false);
    document.body.style.overflow = "auto";
  };

  const handleSaveAgentForm = () => {
    console.log('subAgents',inputFields)
    AuthService.AddSubAgentApi(inputFields)
      .then((response) => {
        setSubAgent(false);
        swal({
          show: true,
          icon: "success",
          title: "Profile details updated successfully!",
          text: response.message,
        });
      })
      .catch((e) => {
        console.log(e);
        swal({
          icon: "error",
          show: true,
          title: 'SubAgents data not saved !',
          text: e.message,
          timer:3000,
        })
      })
  };

  const handleSubAgent = () => {
    setSubAgent(true);
    document.body.style.overflow = "hidden";
  };

  const handleAgencyBankDetails = () => {
    setBankDetailsToShow(true);
    document.body.style.overflow = "hidden";
  };

  const handleClosedBankDetails = () => {
    setBankDetailsToShow(false);
    document.body.style.overflow = "auto";
  };

  const handleAddEmailTemplate = () => {
    // console.log(name, value);
    // console.log("agentagencydata",agency, agent, templateData)
    console.log(formData.agencyType)
    const emailFormat = {
      title: '',
      emailText: '',
    }
    if(templateData[formData.agencyType.toLowerCase()]) {
      emailFormat.emailTitle = templateData[formData.agencyType.toLowerCase()].emailTitle;
      emailFormat.emailText = templateData[formData.agencyType.toLowerCase()].emailText;
    }
    
    const updatedFormData = { ...formData, ...emailFormat };
    setformData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  }

  const handleTranslatedEmailTemplate = (title, text) => {
    const emailFormat = {
      emailTitle: title,
      emailText: text,
    }
    const updatedFormData = { ...formData, ...emailFormat };
    setformData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  }

  const handleTranslation = (status) => {
    setTranslation(status)
  }

  return (
    <>
      {loading && (
        <Loader
          loading={loading}
          title={"Logo uploading in progress, logo uploading will be shortly!"}
        />
      )}
      <div
        className="profile-container"
        style={{
          backgroundImage: `url(${pageBg})`,
          backgroundSize: "cover",
          height: "174px",
        }}
      >
        {bankDetailsToShow && (
          <BankDetails
            formData={formData}
            agent={agent}
            client={bankDetailsToShow}
            handleInputField={handleInputField}
            onClose={handleClosedBankDetails}
          />
        )}

        {ShowsubAgent && (
          <AddSubAgentModel
            addInputField={addInputField}
            handleInputChange={handleInputChange}
            inputFields={inputFields}
            removeInputField={removeInputField}
            handleclosesubagent={handleclosesubagent}
            handleSaveAgentForm={handleSaveAgentForm}
          />
        )}

        {
          translation && (
            <TranslationPopup 
              onClose={() => setTranslation(false)} 
              handleTranslatedEmailTemplate={(title, text) => handleTranslatedEmailTemplate(title, text)} 
              emailText={formData?.emailText}
            />
          )
        }
        <div style={{ backgroundColor: "rgba(19, 59, 113, 0.8)" }}>
          <PageHeader
            searchOpen={null}
            style={{ position: "absolute", marginTop: "70px" }}
          />
        </div>
      </div>
      <div
        className={
          ShowsubAgent || bankDetailsToShow ? "content-hidden" : "row m-5"
        }
      >
        <h3 className="page-title">Agent Details</h3>
        <hr className="mt mb-5"></hr>
        <div className="col-md-8 col-12">
          <div className="profile-text profile-inputs row col-12">
            <div className="col-md-3 col-12 px-1 mb-4">
              <label htmlFor="agentName">Agent Name({agent?.role})</label>
              <input
                type="text"
                className="form-control"
                value={formData.agentName}
                id="agentName"
                name="agentName"
                placeholder="Enter agent name"
                onChange={handleInputField}
              />
              <div className="invalid-feedback-error">{error.agentName}</div>
            </div>
            <div className="col-md-3 col-12 px-1 mb-4">
              <label htmlFor="agentPhone">Agent Phone/Mobile</label>
              <PhoneInput
                disabled={agent?.role === "agent" ? true : false}
                country={"ch"}
                enableSearch={true}
                id="agentPhone"
                name="agentPhone"
                placeholder="Enter agent Phone"
                value={formData.agentPhone}
                onChange={handleInputField}
              />
              <div className="invalid-feedback-error">{error.phone}</div>
            </div>
            <div className=" col-md-3 col-12 px-1 mb-4">
              <label htmlFor="email">Agent Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                id="email"
                name="email"
                placeholder="Enter email"
                onChange={handleInputField}
              />
              <div className="invalid-feedback-error">{error.email}</div>
            </div>
            <div className=" col-md-3 col-12 px-1 mb-4">
              <span className="mt-5"></span>
              <div className="mt-4 text-center">
                <h6 className="d-flex">
                  <IoMdAddCircle style={{ fontSize: "34px", color: "green" }} />
                  <span
                    className="link18"
                    style={{ color: "green", "text-decoration": "none" }}
                    onClick={handleSubAgent}
                  >
                    Add sub Agent
                  </span>
                </h6>
              </div>
            </div>
          </div>

          <h3 className="page-title">Agency Details</h3>
          <hr className="mt-5 mb-2"></hr>
          <div className="row mt-4 profile-inputs w-50 ms-0 text-start">
            <div className="col-md-6 col-12 px-1 mb-4">
              <label htmlFor="agencyName">Agency Name</label>
              <input
                type="text"
                className="form-control"
                disabled={agent?.role === "agent" ? true : false}
                value={formData.agencyName}
                id="agencyName"
                name="agencyName"
                placeholder="Enter agency name"
                onChange={handleInputField}
                style={{ maxWidth: "100%" }}
              />
              <div className="invalid-feedback-error">{error.agencyName}</div>
            </div>

            <div
              className="col-md-6 col-12 px-1 mb-4 agency-select"
              style={{ marginTop: "-10px" }}
            >
              <DropdownInput
                label="Travel Agency Type*"
                name="agencyType"
                showLoginLink="signup"
                error={null}
                onSubmit={handleInputField}
                placeholder={"choose Agency Type"}
                dropDownObj={agencyTypes}
                value={formData.agencyType}
                setValue={handleAgencyType}
                style={{ maxWidth: "100%" }}
              />
              <div className="invalid-feedback-error">{error.agencyType}</div>
            </div>

            <div className="col-md-6 col-12 px-1 mb-4">
              <label htmlFor="firstName">Manager First Name</label>
              <input
                type="text"
                className="form-control"
                disabled={agent?.role === "agent" ? true : false}
                value={formData.managerFirstName}
                id="managerFirstName"
                name="managerFirstName"
                placeholder="Enter first name"
                onChange={handleInputField}
                style={{ maxWidth: "100%" }}
              />
              <div className="invalid-feedback-error">{error.firstName}</div>
            </div>

            <div className="col-md-6 col-12 px-1 mb-4">
              <label htmlFor="lastName">Manager Last Name</label>
              <input
                type="text"
                className="form-control"
                disabled={agent?.role === "agent" ? true : false}
                value={formData.managerLastName}
                id="managerLastName"
                name="managerLastName"
                placeholder="Enter last name"
                onChange={handleInputField}
                style={{ maxWidth: "100%" }}
              />
              <div className="invalid-feedback-error">{error.lastName}</div>
            </div>
          </div>

          <div className="row mt-5">
            <div className=" col-md-3 col-12 px-1 mb-4">
              <label htmlFor="email">Agency Email</label>
              <input
                type="email"
                className="form-control"
                disabled={agent?.role === "agent" ? true : false}
                value={formData.agencyEmail}
                id="agencyEmail"
                name="agencyEmail"
                placeholder="Enter agency email"
                onChange={handleInputField}
              />
              <div className="invalid-feedback-error">{error.agencyEmail}</div>
            </div>
            <div className="col-md-3 col-12 px-1 mb-4">
              <label htmlFor="phone">Agency Phone</label>
              <PhoneInput
                disabled={agent?.role === "agent" ? true : false}
                country={"ch"}
                enableSearch={true}
                id="agencyPhone"
                name="agencyPhone"
                placeholder="Enter agency phone"
                value={formData.agencyPhone}
                onChange={handleInputField}
              />
              <div className="invalid-feedback-error">{error.agencyPhone}</div>
            </div>
            <div className=" col-md-3 col-12 px-1 mb-4 pad-5">
              <label htmlFor="address">Agency Address</label>
              <input
                type="text"
                className="form-control"
                disabled={agent?.role === "agent" ? true : false}
                value={formData.address}
                id="address"
                name="address"
                placeholder="Enter address"
                onChange={handleInputField}
              />
              <div className="invalid-feedback-error">{error.address}</div>
            </div>
            <div className=" col-md-3 col-12 px-1 mb-4 pad-5">
              <label htmlFor="zipcode">Agency Postal Code</label>
              <input
                type="text"
                className="form-control"
                disabled={agent?.role === "agent" ? true : false}
                value={formData.zipcode}
                id="zipcode"
                name="zipcode"
                placeholder="Enter postal code"
                onChange={handleInputField}
              />
              <div className="invalid-feedback-error">{error.zipcode}</div>
            </div>
            <div className="row mt-4 profile-inputs">
              <div className=" col-md-3 col-12 px-1 mb-4 pad-5">
                <select
                  className="form-select"
                  aria-label="Currency select"
                  onChange={handleCurrencyChange}
                  value={selectedCurrency || ""}
                >
                  <option value="">Select Currency</option>
                  {countryList.map((country, index) => (
                    <option key={index} value={country.currency.code}>
                      {getCurrencyDisplayName(country.currency.code)}
                    </option>
                  ))}
                </select>
                <div className="mt-4 d-flex" onClick={handleAgencyBankDetails}>
                  <img
                    src={creditCardIcon}
                    alt="creditCardIcon"
                    className="img-fluid"
                  />
                  &nbsp;
                  <span className="link18">
                    <h6>Agency Bank Details</h6>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h3 className="page-title">Change Password</h3>
          <hr />
          <div className="row mt-5">
            <div className=" col-md-4 col-12 px-1 mb-4 pad-5">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPwd.password ? "text" : "password"}
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleInputField}
                  autoComplete="new-password"
                  onFocus={(e) => e.target.removeAttribute("readonly")}
                  readOnly
                />
                <span
                  onClick={() =>
                    setShowPwd((prevState) => ({
                      ...prevState,
                      password: !prevState.password,
                    }))
                  }
                  className="eye-icon"
                >
                  <img
                    src={showPwd.password ? eyeOff : eyeOn}
                    alt="Toggle Password Visibility"
                  />
                </span>
              </div>
              <div className="invalid-feedback-error">{error.password}</div>
            </div>
            <div className=" col-md-8 col-12 px-1 mb-4 pad-5">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showPwd.confirmPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Password (again)"
                  onChange={handleInputField}
                  autoComplete="new-password"
                  onFocus={(e) => e.target.removeAttribute("readonly")}
                  readOnly
                />
                <span
                  onClick={() =>
                    setShowPwd((prevState) => ({
                      ...prevState,
                      confirmPassword: !prevState.confirmPassword,
                    }))
                  }
                  className="eye-icon"
                >
                  <img
                    src={showPwd.confirmPassword ? eyeOff : eyeOn}
                    alt="Toggle Password Visibility"
                  />
                </span>
              </div>
              <div className="invalid-feedback-error">
                {error.confirmPassword}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mt-4">
          <div className="row">
            <div className="d-flex text-center col-md-12 col-sm-12 responsive-div">
              <div className="d-flex justify-content-end">
                <div>
                  <button
                    className="file-uplod-cst p-2"
                    type="button"
                    onClick={handleButtonClick}
                  >
                    Upload your logo
                  </button>
                  <div className="text-center pt-2">
                    <span>500 kb max size</span>
                    <br></br>
                    <span>Format PNG or JPG</span>
                    <br></br>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-sm-6 text-center">
              <input
                type="file"
                className="form-control d-none"
                id="userImage"
                name="userImage"
                placeholder="Upload Image"
                accept="image/x-png,image/gif,image/jpeg"
                onChange={handleInputField}
                // disabled={agent?.role === "agent" ? true : false}
                ref={fileInputRef}
              />
            </div>
            <div
              className=" col-sm-6 cst-cst-img image"
              style={{ marginTop: "-138px" }}
            >
              {file === null ? (
                <>
                  <div
                    className="fluid-container"
                    style={{ width: "150px", height: "140px" }}
                  >
                    <img
                      src={logoImage || ""}
                      className="rounded-circle"
                      style={{ width: "100%", height: "inherit" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="fluid-container"
                    style={{ width: "150px", height: "140px" }}
                  >
                    <img
                      src={file || setLogo}
                      className="rounded-circle"
                      style={{ width: "100%", height: "inherit" }}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="row">
              <div className=" col-md-12  mt-4">
                <div className="card">
                  <div className="card-body" style={{ background: "#f8f8f8" }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title" style={{alignSelf: 'flex-end'}}>
                        Add Personal Email Format for your Client &nbsp;
                        {/* <span className="img-fluid add-template-button" onClick={handleAddEmailTemplate} >
                          <IoMdCopy size={20} /> 
                          <span style={{fontSize: '15px'}}>Add Template</span>
                        </span> */}
                        <EmailTemplateButton handleAddEmailTemplate={handleAddEmailTemplate} />
                        <span className="img-fluid add-template-button" onClick={() => handleTranslation(true)} style={{marginLeft: '15px'}} >
                            <MdTranslate  size={20} /> 
                            <span style={{fontSize: '15px'}}>Translate</span>
                        </span>
                      </h5>
                      <span className="justify-content-end cst-class-edit">
                        <img src={editIcon} className="img-fluid unset-mx-wid" />
                      </span>
                      
                    </div>
                    <div className=" mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="emailTitle"
                        name="emailTitle"
                        placeholder="Title"
                        onChange={handleInputField}
                        value={formData?.emailTitle}
                        disabled={agent?.role === "agent" ? true : false}
                      />
                    </div>
                    <div className=" mb-3">
                      <textarea
                        className="form-control"
                        id="emailText"
                        name="emailText"
                        placeholder="Email Text Format"
                        cols="10"
                        rows="4"
                        onChange={handleInputField}
                        style={{ resize: "none" }}
                        disabled={agent?.role === "agent" ? true : false}
                        value={formData?.emailText}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="d-flex justify-content-end mt-5 "
              style={{ gap: "10px" }}
            >
              <div className=" ">
                <button
                  type="button"
                  className="btn btn-outline cancle-chnages-cst-btn px-4"
                  onClick={() => history.push(PATH_SEARCH)}
                  style={{ border: "1px solid black" }}
                >
                  Cancel
                </button>
              </div>
              <div className=" ">
                <button
                  type="button"
                  className="save-chnages-cst-btn  px-2"
                  onClick={handleform}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr className="mb-5 mt-5"></hr>
        <h5 className="text-center">
          © 2024 VillaTracker. All rights reserved. Cookie Policy,{" "}
          <span className="privase-cst">Privacy</span> and{" "}
          <span className="privase-cst">Terms</span>
        </h5>
      </div>
    </>
  );
};

export default Profile;
