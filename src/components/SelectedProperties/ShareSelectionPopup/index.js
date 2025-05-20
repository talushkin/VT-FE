import React, { useEffect, useState } from "react";
import Icon from "react-web-vector-icons";
import link from "../../../assets/icons/link.png";
import editIcon from "../../../assets/icons/editIcon.png";
import Popup from "../../Popup/index";
import Button from "../../Buttons/Button/Button";
import InputField from "../../InputField/index";
import TextAreaField from "../../TextAreaField/index";
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';

import "./ShareSelectionPopup.scss";
import { useSelector } from "react-redux";
import { userRequest } from "../../../api/requestMethods";
import axios from "axios";
import { baseURL } from "../../../core";
import {
  calculateTotalNights,
  countWeekendDays,
  detectCurrency,
  getStorageValue,
  isPercentage,
  isPercentageOrAmount,
} from "../../../Util/general";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import { dummyTaxes } from "../../../pages/Clients/makeData";
import DestinationsDropDown from "../../DestinationsDropDown";
import ClientsDropDown from "../../ClientsDropDown";
import { PATH_CLIENTS } from "../../../Util/constants";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import numeral from "numeral";
import moment from "moment";
import dayjs from "dayjs";
import makeCalculations from "../../../Hooks/makeCalculations";
import ClientsDropDownMulti from "../../ClientsDropDownMulti";
import { templateData } from "../../../Util/templateData";

const ShareSelectionPopup = (props) => {
  const selectedPropertiesItems = JSON.parse(
    localStorage.getItem("selectedPropertiesItem")
  );
  
  const { title, icon, onClose, agent, agency, showShareAsPdf, link,selectedPrices,
    selectedCurrency,endDate, startDate, addClient
   } = props;
  const [chkIncludePrice, setChkIncludePrice] = useState(false);
  const [noDates, setNoDates] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [clientId, setClientId] = useState();
  const [clientIds, setClientIds] = useState("");
  const [clientPhones, setClientPhones] = useState("");
  const [subject, setSubject] = useState("");
  const [clientName, setClientName] = useState("");
  const [clients, setClients] = useState(
    JSON.parse(getStorageValue("selectedClients"))
  );
  const [client, setClient] = useState(
    getStorageValue("selectedClient")
      ? JSON.parse(getStorageValue("selectedClient"))
      : {}
  );
  
  const [message, setMe] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfArray, setPdfArray] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const selectedProperties = useSelector(
    (state) => state.property.selectedProperties
  );
  const [clientsList, setClientsList] = useState(null);
  const [propertyId, setPropertyId] = useState([]);
  const [savedEmail, setSavedEmail] = useState("");
  const [clientPhone, setClientphone] = useState("");

  const agent_id = localStorage.getItem("agent_id");
  const history = useHistory();
  const checkInDate =
    localStorage.getItem("dateFrom") !== null &&
      localStorage.getItem("dateFrom") !== undefined
      ? dayjs(localStorage.getItem("dateFrom")).format("DD.MM.YYYY")
      : "";
  const checkOutDate =
    localStorage.getItem("dateTo") !== null &&
      localStorage.getItem("dateTo") !== undefined
      ? dayjs(localStorage.getItem("dateTo")).format("DD.MM.YYYY")
      : "";
  const totalSelectedPropertiesItem = localStorage.getItem(
    "totalSelectedPropertiesItem"
  );
  const storedClientId = client.client_id;
  const userToken = localStorage.getItem('jToken') || undefined;

  const replacePlaceholders = (template, values = false) => {
    if(agent?.emailFormat?.emailText) {
      const emailTemplateData = {
        "Client's Name": values["Client's Name"] || clientName,
        'Your Company Name': values["Your Company Name"] || agency?.agencyName,
        'Your Name': values["Your Name"] || agent?.firstName + " " + (agent?.lastName !== "undefined" && agent?.lastName) ? agent?.lastName : "",
        'Links' : values["Links"] || `[Links]`,
        'Website': values["Website"] || agency?.website,
        'Email': values["Email"] || agency?.email,
        'Phone Number': values["Phone Number"] || agency?.phone,
      }
      return template.replace(/\[([^\]]+)\]/g, (match, key) => emailTemplateData[key] || match);

    }
    return template;
  }
 
  useEffect(() => {
    console.log(clientId);
    console.log('selectedPrices',selectedPrices)
    const load = async () => { };
    let mailTemplate = ''
    if(agent?.emailFormat?.emailText) {
      mailTemplate = replacePlaceholders(agent?.emailFormat?.emailText);
    }
    setMe(link? "Please find attached the brochure for the property recommended for you by our agent: " +
      (agent?.firstName || "") +
      " " +
      (agent?.lastName || "") :
      agent?.emailFormat?.emailText ? mailTemplate/* "Please find attached the brochure for the property recommended for you by our agent: " */: 
      "Please find attached the brochure for the property recommended for you by our agent: " +
      (agent?.firstName || "") +
      " " +
      (agent?.lastName || "")
    );
    const agencyN =
      agency?.agencyName !== "undefined" && agency?.agencyName
        ? " / " + agency?.agencyName
        : "";
    const agentN =
      agent?.firstName + " " + (agent?.lastName !== "undefined" && agent?.lastName)
        ? agent?.lastName
        : "";
    //console.log(agentN);
    setSubject(link?
      "Dear client, here are " +
      totalSelectedPropertiesItem +
      ` offers as LINKS ` +
      " for you sent by " +
      agency?.agencyName
       :
      agent?.emailFormat?.title ? agent?.emailFormat?.title  /*"Dear client, here are " +
      totalSelectedPropertiesItem +
      ` offers as PDF ` +
      " for you sent by " +
      agency?.agencyName*/ :
      "Dear client, here are " +
      totalSelectedPropertiesItem +
      ` offers as PDF ` +
      " for you sent by " +
      agency?.agencyName
    );
    if (client) {
      selectClient(client);
    } else {
      setClientName("please choose client");
      setClientEmail("");
    }
    if (
      moment(localStorage.getItem("dateFrom"))._isValid &&
      moment(localStorage.getItem("dateTo"))._isValid
    ) {
      setNoDates(false);
    } else {
      setChkIncludePrice(false);
      setNoDates(true);
    }

    const savedEmail = localStorage.getItem("clientEmail");
    if (savedEmail) {
      setSavedEmail(savedEmail);
    }

  }, []);

  const renderAdditionalFee = (name, price, symbol) => {
    return {
      [name]: `${price} ${symbol}`,
    };
  };

  const setMessage = (text) => {
    setMe(text);
  };

  useEffect(() => {
    const getAllClients = async () => {
      const clientResponse = await userRequest.get(
        `/client/get-clients?agent_id=${agent_id}`,
        {
          params: { limit: "300", skip: "0", agent_id: 1 },
        }
      );
      setClientsList(clientResponse);
    };
    getAllClients();
  }, []);


  const calculateTotalPrice = (property) => {
    const  price  = makeCalculations({
      property:property?.listing,
      fullCalendar:property?.fullCalendar,
      activeRatePlan:property?.activeRatePlan,
      dateFrom: startDate,
      dateTo: endDate,
      adults: parseInt(localStorage.getItem("adults") || "1"),
      children: parseInt(localStorage.getItem("children") || "0"),
      currency: selectedCurrency || "USD"
    });
    console.log('taxes:',price.taxesArray)
    let additionalFee=price.taxesArray.map (tax => {
      const fee={}
      fee[tax.description] = parseInt(tax.amount);
      return fee
    } )
    console.log('fees for PDF:',additionalFee)
    return {
      totalPrice: parseInt(price?.totalAmount),
      additionalFee ,
    };
  };

  
  const handlePDFs = async () => {
    setLoading(true);
    setIsProcessing(true);
    console.log("handlePDFs called");
    try {
      let PropertyIdArray = [];
      let generatedPdfUrls = [];
      for (const property of selectedPropertiesItems) {
        selectedPropertiesItems?.map((property_id) =>
          PropertyIdArray.push(property_id._id)
        );
  
        const refreshPrice = Number(
          localStorage.getItem(`refreshPrice_${property?.listing?._id}`)
        );
        const propertyPriceEstimation = calculateTotalPrice(property); // need to take from useCalculation
        console.log('price:',propertyPriceEstimation);
        if (showShareAsPdf) {
          console.log('clients data', clientEmail, clientName)
          const payload = {
            propertyId: property?.listing?._id,
            title: property?.listing?.title,
            dateFrom: dayjs(localStorage.getItem("dateFrom")).format("DD-MM-YYYY"),
            dateTo: dayjs(localStorage.getItem("dateTo")).format("DD-MM-YYYY"),
            destination: localStorage.getItem("destination"),
            adults: localStorage.getItem("adults"),
            children: localStorage.getItem("children"),
            accomodates: property?.listing?.accommodates,
            bedrooms: property?.listing?.bedrooms,
            bathrooms: property?.listing?.bathrooms,
            overview: property?.listing?.publicDescription?.summary,
            amenities: property?.listing?.amenities,
            thumbnail: property?.picture?.thumbnail,
            propertyPictures: property?.listing?.pictures?.map((pic) => {
              return {
                thumbnail: `https://${pic?.thumbnail?.split("//")[1]}`,
                original: `https://${pic?.original?.split("//")[1]}`,
              };
            }),
            address: property?.listing?.address,
            logo: JSON.parse(localStorage.getItem("agent")).userImage,
            travelAgency: JSON.parse(localStorage.getItem("travelAgency")),
            clientEmail,
            clientName,
            clientSubject: subject,
            includePricing: true ,
            totalPrice: propertyPriceEstimation?.totalPrice,
            totalNights: calculateTotalNights(),
            propertyType: property?.listing?.propertyType,
            minNights: property?.listing?.terms?.minNights,
            checkIn: `${checkInDate} Time: ${property?.listing?.defaultCheckInTime} (24-hour)`,
            checkOut: `${checkOutDate} Time: ${property?.listing?.defaultCheckOutTime} (24-hour)`,
            currency: detectCurrency(property?.listing?.prices?.currency),
            additionalFee: propertyPriceEstimation?.additionalFee,
          };
          console.log("payload:", payload);
          // let pdf = await axios.post(`${baseURL}/pdf/generate-compressed`, payload);
          let pdf = await axios.post(`${baseURL}/pdf/generate`, payload);
          generatedPdfUrls.push(pdf?.data);  // Store the generated PDF URL
          console.log("pdf response:", pdf);
        } else {
          // Non-PDF email sending logic here
        }
      }
      console.log('generated pdfurls', generatedPdfUrls)
      // Now call sendPdfEmail with the generated PDF URLs
      await sendEmail(generatedPdfUrls);
      localStorage.setItem("clientEmail", '');
      toast.success("PDF generation completed", {
        position: "top-right",
        toastClassName: "custom-toast",
      });
      setTimeout(() => {
        onClose();
      }, 2000);
  
    } catch (error) {
      console.error("API Error:", error);
      toast.error("An error occurred", {
        position: "top-right",
        toastClassName: "custom-toast",
      });
    } finally {
      clientLog();
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const handleLinks = async () => {
    try {

      const sendData = {
        to: clientEmail,//savedEmail?.email,
        from: "adminer@villatracker.com",
        dateFrom: dayjs(localStorage.getItem("dateFrom")).format("DD-MM-YYYY"),
        dateTo: dayjs(localStorage.getItem("dateTo")).format("DD-MM-YYYY"),
        destination: localStorage.getItem("destination"),
        adults: localStorage.getItem("adults"),
        children: localStorage.getItem("children"),
        properties: selectedPropertiesItems,
        jtoken: localStorage.getItem("jToken"),
        subject,
        clientname: clientName,
        clientEmail: clientEmail,
        clientPhone: clientPhone,
        agentname: `${agent?.firstName || ""} ${agent?.lastName || ""}`,
        logo: JSON.parse(localStorage.getItem("agent")).userImage,
        phone: agent?.phone || "",
        address: agency?.address || "",
        country: agency?.country || "",
        agencyname: agency?.agencyName || "",
        agentemail: agent?.email || "",
        agent_id:agent?.agent_id,
        agency_id:agency?.agency_id,
        message,
      };

      if (link) {
        console.log('links email data:', sendData)
        await axios.post(`${baseURL}/pdf/send-links-email`, sendData);
        localStorage.setItem("clientEmail", '');
      }
      clientLog()
      toast.success("Email sent successfully", {
        position: "top-right",
        toastClassName: "custom-toast",
      });
      clientLog();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Email Error:", error);
      toast.error("Failed to send email", {
        position: "top-right",
        toastClassName: "custom-toast",
      });
    }
  };
  const formattedFilename = (string) => {
    const pathnameParts = string.split("/");
    const filename = pathnameParts[pathnameParts.length - 1];
    const sanitizedFilename = filename.replace(/ /g, "_");
    return sanitizedFilename;
  };
  const sendEmail = async (pdfUrls) => {
    console.log('mail subject and links(pdfs)',message, pdfUrls)
    let values = null;
    let newMessage = null;
    if(pdfUrls.length > 0) {
      const valuesdata = `<ol>` +
        pdfUrls.map(url => {
          const pathnameParts = url.split("/");
          const linkFilename = pathnameParts[pathnameParts.length - 1];
          const filename = formattedFilename(linkFilename)
          return (`<div><a href="${url}" class="property-title">${filename}</a></div>`)
        }).join('')
      + `<ol>`;
      values = {"Links" : valuesdata}
      newMessage = replacePlaceholders(message, values)
    }


    
    try {
      const sendEmailPayload = {
        attachments: pdfUrls,  
        to: clientEmail,
        from: "adminer@villatracker.com",
        subject,
        clientname: clientName,
        agentname: `${agent?.firstName || ""} ${agent?.lastName || ""}`,
        logo: JSON.parse(localStorage.getItem("agent")).userImage,
        phone: agent?.phone || "",
        address: agency?.address || "",
        country: agency?.country || "",
        agencyname: agency?.agencyName || "",
        agentemail: agent?.email || "",
        message: newMessage || message,
      };
  
      console.log("sendEmailPayload:", sendEmailPayload);
      //
      await axios.post(`${baseURL}/pdf/send-email`, sendEmailPayload);
      toast.success("Email sent successfully", {
        position: "top-right",
        toastClassName: "custom-toast",
      });
      // clientLog()
    } catch (error) {
      console.error("Email Error:", error);
      toast.error("Failed to send email", {
        position: "top-right",
        toastClassName: "custom-toast",
      });
    }
  };

  const clientLog = async () => {
    const dateFrom = checkInDate;
    const dateTo = checkOutDate;
    const adults = localStorage.getItem("adults");
    const children = localStorage.getItem("children");
    const PriceFilter = JSON.parse(getStorageValue("selectedPrices"));
    const PropertyType = JSON.parse(getStorageValue("selectedTypes"));
    const MustHaves = JSON.parse(getStorageValue("selectedMustHave"));
    const bedrooms = getStorageValue("bedrooms");
    const bathrooms = getStorageValue("bathrooms");
    const Amenities = JSON.parse(getStorageValue("selectedAmenities"));
    const destination = localStorage.getItem("destination");
    const TOKEN = localStorage.getItem("jToken");

    for (const property of selectedPropertiesItems) {
      const payloadData = {
        log_id: 0,
        clientName: `${clientName}`,
        clientPhone: `${clientPhones}`,
        clientEmail: `${clientEmail}`,
        property_id: property?.listing?._id,
        PropertyType: PropertyType,
        savedSearch_id: "string",
        destination: destination,
        dateFrom: dateFrom,
        dateTo: dateTo,
        guests: adults,
        children: children,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        PriceFilter: PriceFilter,
        MustHaves: MustHaves,
        Amenities: Amenities,
        brochure: showShareAsPdf ? true : false,
        links: showShareAsPdf ? false : true,
        savedSearch: false,
        booked: false,
        dateAction: dayjs().format("DD.MM.YYYY"),
        listings: [{
          propertyId: property?.listing?._id,
          title: property?.listing?.title,
          nickname: property?.listing?.nickname,
          tags: property?.listing?.tags,
        }]
      };
      console.log("client-log: (CLIENT_ID)", clientIds,payloadData);
      const client_log = await axios.post(
        `${baseURL}/client-log/add-client-log?client_id=${clientIds}`,
        payloadData,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
    }
    onClose();
  };

  const [modalSize, setModalSize] = useState("modal-xl");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1366) {
        setModalSize("modal-xl");
      } else {
        setModalSize("modal-lg");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const selectClient = (client) => {
    const clientFullName = `${client?.firstName} ${client?.lastName}`;
    const clientEmail = `${client?.email}`;
    const clientphone = `${client?.phone};`
    setClient(client);
    setClientName(clientFullName);
   
    setClientEmail(clientEmail);
    setClientphone(clientphone);
    setClients(client);
    setClientId(client.client_id);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const selectedMultiClients = (clientData) => {
    console.log(clientData)
    setClientName(clientData?.ClientNames);
    setClientEmail(clientData?.ClientEmails);
    setClientIds(clientData?.ClientIds);
    setClientPhones(clientData?.ClientPhone)
    if(!link) {
      let values = clientData?.ClientNames !== "" ? {"Client's Name" : clientData?.ClientNames} : {"Client's Name" : "[Client's Name]"}
    
      let updatedmessage = agent?.emailFormat?.emailText
      console.log(values, updatedmessage)
      updatedmessage = replacePlaceholders(updatedmessage, values)
      setMessage(updatedmessage);
    }
    
  }

  const handleAddEmailTemplate = () => {
      
      if(templateData[agency.agencyType.toLowerCase()]) {
        const agentN =
      agent?.firstName + " " + (agent?.lastName !== "undefined" && agent?.lastName)
        ? agent?.lastName
        : "";
        const agencyN =
      agency?.agencyName !== "undefined" && agency?.agencyName
        ? " / " + agency?.agencyName
        : "";
        // setSubject(templateData[agency.agencyType.toLowerCase()].emailTitle);
      console.log(templateData[agency.agencyType.toLowerCase()].emailText)
      console.log(getStorageValue("selectedClientName"), clientName)
      const mailText = replacePlaceholders(templateData[agency.agencyType.toLowerCase()].emailText)
      setMessage(mailText);
      }
      
  }

  return (
    <>
      {loading && (
        <Loader
          loading={loading}
          title={"Pdf generation in progress, emails will be send shortly!"}
        />
      )}
      <div className="popup-wrapper">
        <div class="modal" tabindex="-1">
          <div class={`modal-dialog modal-dialog-centered ${modalSize}`}>
            <div
              class="modal-content px-4 mobile-size-link"
              style={{ height: "auto", width: "957px", marginLeft: "110px" }}
            >
              <div class="modal-header py-0 m-0 px-0">
                <div
                  style={{
                    display: "flex",
                    marginLeft: "auto",
                    marginTop: "16px",
                  }}
                >
                  <img
                    src={icon}
                    alt="pdf"
                    className="mobile-pdf"
                    style={{ width: "26px", marginRight: "15px" }}
                  />
                  <h4
                    className="text-center pt-2"
                    style={{ color: "#284866", fontWeight: "bold" }}
                  >
                    {title}{" "}
                  </h4>
                </div>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ marginRight: "-22px", marginTop: "-31px" }}
                  onClick={props.onClose}
                ></button>
              </div>
              <hr></hr>

              <div class="w-auto" style={{ marginTop: "35px" }}>
                <div className="row">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div className="col-md-6 col-sm-12 col-12 mb-2">
                      <div style={{ cursor: "pointer" }} onClick={addClient}>
                        <label className="fw-bolder" htmlFor="country">
                          Add Client Email:
                        </label>
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
                      {/* <br /> */}
                      {/* {clientEmail && ( */}
                        <div className="email-dropdown">
                          <div
                            style={{ flex: "0 0 98%" }}
                            // onClick={toggleDropdown}
                          >
                            {/* <ClientsDropDown
                              formerClient={savedEmail}
                              selectClient={setSavedEmail}
                              errorMsg={`No customer with this email <a className="text-primary" href=${PATH_CLIENTS}> add new customer</a>`}
                            /> */}
                            <ClientsDropDownMulti selectClient={selectedMultiClients} />
                          </div>
                          {/* <div
                            className="arrow-icon"
                            onClick={toggleDropdown}
                            style={{ flex: "0 0 2%", cursor: "pointer" }}
                          >
                            {dropdownOpen ? <BsChevronUp /> : <BsChevronDown />}
                          </div> */}
                        </div>
                      {/* )} */}
                    </div>

                    <div className="col-md-5 col-sm-12 col-12 px-2 mt-4 ml-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <a
                          href="#"
                          className="text-primary link-text"
                          style={{
                            fontSize: "18px",
                            fontWeight: "500",
                            marginLeft: "-60px",
                          }}
                        >
                          Add Personal Message Format for your client
                        </a>
                        <img src={editIcon} alt="editI" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mt-2">
                    <InputField
                      label="Email Subject:"
                      value={subject}
                      onChange={setSubject}
                      placeholder="Your Vacation Rental Brochure"
                      style={{ marginTop: "20px", width: "100%" }}
                      showTemplateButton={true}
                      handleAddEmailTemplate={handleAddEmailTemplate}
                      link={link}
                    />
                  </div>
                  <br></br>

                  <div className="mt-2">
                    <TextAreaField
                      label="Email Message:"
                      value={message}
                      onChange={setMessage}
                      style={{ height: "150px" }}
                      placeholder="Please write your message"
                    ></TextAreaField>
                  </div>
                </div>
              </div>
              <div className="mt-2 mb-3">
                <hr className="mt-5" />
                {!noDates && (
                  <div className="float-start">
                    <input
                      type="checkbox"
                      checked={chkIncludePrice}
                      //onChange={() => setChkIncludePrice(!chkIncludePrice)}
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    &nbsp;
                    <label
                      className="link18-no-line"
                      style={{ fontSize: "20px" }}
                    >
                      {" "}
                      Do not include pricing in brochure{" "}
                    </label>
                  </div>
                )}
                <div
                  className="float-end"
                  style={{ marginRight: "-10px", marginBottom: "-4px" }}
                >
                  <Button
                    style={{ fontSize: "18px", marginRight: "30px" }}
                    variant="link"
                    text="Cancel"
                    onClick={onClose}
                  />
                  <Button
                    style={{ fontSize: "18px" }}
                    text="Send"
                    disabled={loading}
                    onClick={link? handleLinks : handlePDFs }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareSelectionPopup;
