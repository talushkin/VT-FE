import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { Marker } from "@react-google-maps/api";
//const ScriptLoaded = require("../../docs/ScriptLoaded").default;
import InputField from "../../components/InputField";
import picLeft from "../../assets/property/pic-left-dark.png";
import picLeftOn from "../../assets/property/pic-left-on-dark.png";
import picRight from "../../assets/property/pic-right-dark.png";
import picRightOn from "../../assets/property/pic-right-on-dark.png";

import iconLike from "../../assets/property/pic-icons/like.png";
import iconSave from "../../assets/property/pic-icons/save.png";
import iconShareLink from "../../assets/property/pic-icons/share-link.png";
import iconSharePdf from "../../assets/property/pic-icons/share-pdf.png";
import pencil from '../../assets/icons/pencil.png';

import bath from "../../assets/property/baths.png";

import eventsIcon from "../../assets/collections/icons/events.png";
import familyIcon from "../../assets/collections/icons/family.png";
import petsIcon from "../../assets/collections/icons/pets.png";
import sustainIcon from "../../assets/collections/icons/sustainable.png";

import ReactToPdf from "react-to-pdf";
import DatePickerArrival from "../../components/Forms/Fields/DatePickerArrival/DatePickerArrival";
import DatePickerDeparture from "../../components/Forms/Fields/DatePickerDeparture/DatePickerDeparture";
import PageHeader from "../../components/PageHeader";
import ImageWithHover from "../../components/ImageWithHover";
import {
  getStorageValue, isNullOrEmptyArray,
  calculateTotalNights,
  countWeekendDays,
  detectCurrency,
  isPercentage,
  isPercentageOrAmount
} from "../../Util/general";
import { PATH_SHUB, PATH_RESERVE } from "../../Util/constants";

import "./PropertyEdit.scss";
import Button from "../../components/Buttons/Button/Button";
import Row from "../../components/Row";
import {UseCreateObject} from "../../Hooks/UseCreateObject.jsx";
import goBack from "../../assets/go-back.svg";
import { baseURL } from "../../core";
import axios from "axios";
import EditPropDetails from "./EditDetails";
import Popup from "../../components/Popup";
import { toast } from "react-toastify";
import constants from "../../Util/constants";

const google = window.google;

const PropertyEdit = (props, propertyId) => {
  const [editDetails, setEditDetails] = useState(null);
  const [picIndex, setPicIndex] = useState(0);
  const dispatch = useDispatch();
  const { agent,agency, type, onBack } = props;
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const property = location.state && location.state.property;
  const ref = React.createRef();
  let prop = props;
  const [formData, setformData] = useState(InputField)
	const [error, seterror] = useState({ ...formData })
	const [submit, setsubmit] = useState(false)
  const links=localStorage.getItem("noMenu")?true:false;
  const AnyReactComponent = ({ text }) => <div>{text}</div>;
  useEffect(() => {
    const load = async () => { };

    load();
  }, []);
  console.log("please read property=", propertyId);

  console.log("current property:", property?.listing);
  const handleSend = async () => {
    try {
      setLoading(true);
      if (property?.listing) {
        setLoading(true);
        const payload = {
          title: property?.listing.title,
          guests: property?.listing.accommodates,
          bedrooms: property?.listing.bedrooms,
          bathrooms: property?.listing.bathrooms,
          overview: property?.listing.publicDescription?.summary,
          amenities: property?.listing.amenities,
          thumbnail: property?.listing.picture?.thumbnail,
          propertyPictures: property?.listing.pictures?.map((pic) => {
            return {
              thumbnail: `https://${pic?.thumbnail?.split("//")[1]}`,
              original: `https://${pic?.original?.split("//")[1]}`,
            };
          }),
          address: property?.listing?.address,
          logo: JSON.parse(localStorage.getItem("agent")).userImage,
          travelAgency: JSON.parse(localStorage.getItem("travelAgency")),
        };
        console.log("/pdf/generate:",payload)
        const pdf = await axios.post(`${baseURL}/pdf/generate-compressed`, payload, {
          responseType: "blob",
        });
        const blob = new Blob([pdf.data], { type: "application/pdf" });

        // Create a download link for the file
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${payload?.title}`;
        document.body.appendChild(link);
        link.click();

        // Clean up the object URL after the download is complete
        URL.revokeObjectURL(url);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  
	const handleInputField = (e) => {
		const { name, value } = e.target
		console.log(value, "value")

		setformData({ ...formData, [name]: value })}

  const updateXdata = async () => {
    //  const data = onSubmit(event);
    const payload = property?.xdata;
    payload.agentName="tal Arono";
      const token2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';
      const guestyId=property?.listing?._id;
      const reqInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token2}`
        }
      });
    
        const shubXdata=constants.SHUB_URL+'/local/xdata/';
      console.log("API FAVORITES REQUEST=",`${shubXdata}${guestyId}`,"payload:",payload);
    const response = await reqInstance.post(`${shubXdata}${guestyId}`,
      payload
    );

    // alert("Reservation Completed");
    toast.success("Update XDATA Completed!", {
      position: "top-right",
      toastClassName: "custom-toast",
    });
    console.log("updated xdata Completed", response);
  };

  const setNextPic = () => {
    setPicIndex(picIndex + 1);
  };

  const setPrevPic = () => {
    let p = picIndex - 1;
    if (p < 0) {
      p += property?.listing?.pictures?.length;
    }
    setPicIndex(p);
  };

  const doSearch = (params) => {
    history.push(PATH_SHUB);
  };

  const doHold = (params) => {
    //console.log("go reserve!");
    history.push(PATH_RESERVE, { property });
  };

  if (property == null) {
    history.push(PATH_SHUB);
  }

  if (property) {
    //console.log("propertyData:", property);
    let searchPropertiesArray = [];
    let prop = UseCreateObject(property?.listing);
    //console.log("prop >>>: ", prop);
  }
  let pic = null;
  let picPosition = 0;

  if (!isNullOrEmptyArray(property?.listing?.pictures) && picIndex != null) {

    pic = property?.listing?.pictures[picIndex % property?.listing?.pictures?.length].original;
    picPosition = picIndex % property?.listing?.pictures?.length;
    //console.log(property?.listing?.pictures?.length, picIndex,pic);
  }

  const bullet = (index) => {
    return (
      <span
        key={index}
        style={{
          fontSize: "26px",
          color: index === picPosition ? "#44C8F5" : "#D1D1D1",
          padding: "0 3px",
        }}
      >
        &bull;
      </span>
    );
  };

  const renderAmenities = (text, i) => {
    return (
      <div key={i} className="property-page-body-top-left-info-amenity">
        {text}
      </div>
    );
  };

  const renderAmount = (title, pic, amount) => {
    return (
      <div className="property-page-body-top-left-info-amount">
        <img src={pic} alt="" style={{ width: "40px" }} />
        <span>{title}</span>
        {amount ? (
          <span style={{ fontSize: "20px" }}>{amount}</span>
        ) : (
          <span style={{ fontSize: "20px" }}>&nbsp;</span>
        )}
      </div>
    );
  };

  const amenities = property?.listing?.amenities;
  const summary = property?.listing?.publicDescription?.summary;
  prop = UseCreateObject(property?.listing);
  const mapContainerStyle = {
    height: "400px",
    width: "800px",
  };

  const center = {
    lat: prop.lat,
    lng: prop.lng,
  };

  const position = {
    lat: prop.lat,
    lng: prop.lng,
  };

  const onLoad = (marker) => {
    //console.log("position: ", position);
    //console.log("marker: ", marker);
  };

  return (
    <div className="property-page-wrapper">
      <PageHeader agent={agent} agency={agency}  bgColor="#16395C" doSearch={doSearch} searchOpen={true} />
      <div
        className="link18-bold-no-line px-3"
        style={{ display: "flex" }}
        onClick={doSearch}
      >
        <img src={goBack} alt="" />
        &nbsp;&nbsp;Back
      </div>
      {
   /*     editDetails &&
         <Popup width={950} onClose={() => setEditDetails(null)}>
          <EditPropDetails pict={pic} formData={formData} property={property} onSave={() => updateXdata()} onChange={handleInputField} onClose={() => setEditDetails(null)} />
        </Popup> */
      }
      <div ref={ref} className="edit-property-page-container">
        <div className="property-main-top">

          <div className="property-main-picture-container">
          <div />
              <ImageWithHover
                path={picLeft}
                pathOver={picLeftOn}
                className="property-page-prev-next-pic"
                style={{ left: "10px" }}
                onClick={setPrevPic}
              />
              <div
                className="property-main-picture"
                style={{
                  backgroundImage: pic ? `url(${pic})` : "transparent",
                  backgroundSize: "cover",
                }}
              />
              <ImageWithHover
                path={picRight}
                pathOver={picRightOn}
                className="property-page-prev-next-pic"
                style={{ right: "10px" }}
                onClick={setNextPic}
              />
              <div />

            <div className="property-main-picture-icons">
              <img
                className="property-main-picture-icon"
                src={pencil}
                onClick={() => setEditDetails(true)}
                alt="EDIT PROPERTY"
              />
              <img
                className="property-main-picture-icon"
                src={iconShareLink}
                alt=""
              />
              {/*
              <ReactToPdf
                targetRef={ref}
                scale={0.65}
                filename="villa-tracker.pdf"
              >
                {({ toPdf }) => (
                  <img
                    onClick={toPdf}
                    className="property-main-picture-icon"
                    src={iconSharePdf}
                    alt=""
                  />
                )}
              </ReactToPdf>
                */}
              <img
                className="property-main-picture-icon"
                src={iconSharePdf}
                alt=""
                disabled={loading}
                onClick={handleSend}
              />
              <img
                className="property-main-picture-icon"
                src={iconLike}
                alt=""
              />

            </div>
          </div>
          <div className="property-main-picture-bullets">
            {property?.listing &&
              property?.listing?.pictures &&
              !isNullOrEmptyArray(property?.listing?.pictures) &&
              property?.listing?.pictures.map((pic, i) => bullet(i))}
          </div>
        </div>
        <div className="property-page-body-top">   
          <div className="property-page-body-top-left">
            <div className="property-page-body-top-title">{property?.listing?.title}</div>
            <div className="property-page-body-top-subtitle">
              {prop.fullAddress}
            </div>

            <div className="property-page-body-top-left-info">
              <hr style={{ color: "#E7E7E7" }} />

              <Row>
                {renderAmount("Guests", bath, prop.accommodates)}
                {renderAmount("Bedrooms", bath, prop.bedrooms)}
                {renderAmount("Bathrooms", bath, prop.bathrooms)}

                {prop.tags.indexOf("eventCollection") > -1
                  ? renderAmount("Event Places", eventsIcon)
                  : ""}
                {prop.tags.indexOf("familyCollection") > -1
                  ? renderAmount("For Families", familyIcon)
                  : ""}
                {prop.tags.indexOf("petsCollection") > -1
                  ? renderAmount("Pets Welcome", petsIcon)
                  : ""}
                {prop.tags.indexOf("sustainCollection") > -1
                  ? renderAmount("Sustainable", sustainIcon)
                  : ""}
              </Row>

              <hr style={{ color: "#E7E7E7" }} />

              <div style={{ fontSize: "25px", fontWeight: "bold" }}>
                Overview
              </div>
              <ul>
                <li style={{ paddingTop: "10px" }}>{summary}</li>
              </ul>

              <hr style={{ color: "#E7E7E7" }} />

              <div style={{ fontSize: "25px", fontWeight: "bold" }}>
                Amenities
              </div>

              <div className="property-page-body-top-left-info-amenities">
                {amenities.map((a, i) => renderAmenities(a, i))}
              </div>

              <hr style={{ color: "#E7E7E7" }} />

              <div
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                  paddingBottom: "5px",
                }}
              >
                Check-in and Check-out
              </div>
              <div style={{ fontSize: "20px", color: "#707070" }}>
                Check-in time is 03:00 PM
              </div>
              <div style={{ fontSize: "20px", color: "#707070" }}>
                Check-out time is 10:00 AM
              </div>

              <hr style={{ color: "#E7E7E7" }} />

              <div
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                  paddingBottom: "5px",
                }}
              >
                House rules and a cancellation policy
              </div>
              <div style={{ fontSize: "20px", color: "#707070" }}>
                {prop.houseRules}
                <br />
                we'll make every effort to work with property management to find
                options if your
                <br />
                plans change but refunds cannot be guaranteed and and on a
                best-effort basis.
                <br />
                <br />
                <div className="link18-bold">
                  Click here to view complete property terms & conditions
                </div>
              </div>

              <hr style={{ color: "#E7E7E7" }} />
            </div>
          </div>


            <Row style={{ alignItems: "flex-start" }}>
              <div className="property-page-body-top-price">{prop.basePrice}</div>
              <div className="property-page-body-top-night">/ Night</div>
            </Row>

            <Row style={{ padding: "20px 0" }}>
              <div className="property-page-body-top-commission-price">
              {prop.basePrice/10}
              </div>
              <div className="property-page-body-top-commission-title">
                &nbsp;&nbsp;Agency Commission
              </div>
            </Row>
        </div>

        <div style={{ padding: "0 40px" }}>
          <div
            style={{
              color: "#284768",
              fontSize: "25px",
              fontWeight: "bold",
              paddingBottom: "5px",
            }}
          >
            Location
          </div>

          <div style={{ height: "100vh", width: "100%" }}>
            <LoadScript googleMapsApiKey="AIzaSyA6TmWVrRTP93bEIGqQG9e_1qvVwcwNJ2k">
              <GoogleMap
                id="marker-example"
                mapContainerStyle={{ width: "100%", height: "400px" }}
                // zoom={12}
                center={center}
              >
                <Marker onLoad={onLoad} position={position} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyEdit;
