import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { BsEnvelope } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import axios from "axios";
import { baseURL } from "../../core/index.js";
import "./Touch.scss";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { HiOutlineLocationMarker } from "react-icons/hi";
import AuthService from "../../services/auth.service";
import swal from "sweetalert";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const Touch = (props) => {
  const { setProfile, token, agent, agency } = props;
  console.log("agency", agency);
  
  const [form, setForm] = useState({
    name: agent?.firstName || '',
    to: agent?.email || '',
    message: `Hello, this is agent ${agent?.firstName ?? ""}, ${
      agent?.lastName||'' ?"from agency "+agency?.agencyName: ""
    }. I would like some clarification on this issue:`,
    email: agent?.email || '',
    phone: agent?.phone || '',
    subject: `VillaTracker agent ${agent?.firstName ?? ""} ${agent?.lastName} from agency ${agency?.agencyName} needs some clarification.`
  });

  const [error, setError] = useState({});
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const load = async () => {
      const storedAgent = JSON.parse(localStorage.getItem("agent"));
      const storedAgency = JSON.parse(localStorage.getItem("travelAgency"));
      if (storedAgent && storedAgency) {
        setForm({
          ...form,
          name: storedAgent?.firstName,
          to: storedAgent?.email,
          email: storedAgent?.email,
          phone: storedAgent?.phone,
          website: storedAgency?.website,
          message: `Hello, this is agent ${storedAgent?.firstName}, from agency ${storedAgency?.agencyName}. I would like some clarification on :`,
        });
      }
    };
    load();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError({ ...error, [name]: '' }); // Clear the error for the field
  };

  const validateForm = () => {
    const newError = {};
    if (!form.email || !emailRegex.test(form.email)) {
      newError.email = "Enter a valid email *";
    }
    if (!form.name) {
      newError.name = "Enter your name *";
    }
    if (!form.message) {
      newError.message = "Enter a message *";
    }
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const sendMessage = () => {
    if (!validateForm()) {
      return;
    }
    setSubmit(true);
    const payload = {
      firstName: form.name,
      lastName: agent?.lastName || '',
      template: 'inquiry.html',
      email: form.email,
      phone: form.phone,
      website: form.website,
      message: form.message,
      to: form.to,
    };
    AuthService.sendEmailApi(payload)
      .then((response) => {
        swal({
          title: "Success!",
          text: "Email sent successfully!",
          icon: "success",
        });
        setSubmit(false);
      })
      .catch((error) => {
        console.error("Email send error: ", error);
        swal({
          title: "Error!",
          text: "Failed to send email. Please try again.",
          icon: "error",
        });
        setSubmit(false);
      });
  };

  return (
    <div className="get-in-touch-container">
      <PageHeader agent={agent} agency={agency} searchOpen={null} />
      <div className="get-in-touch-section py-5 px-5">
        <div
          className="get-in-touch-header mobile-ui-touch"
          style={{
            paddingTop: "8rem",
            paddingLeft: "9rem",
            paddingBottom: "3rem",
            marginBottom: '2rem'
          }}
        >
          <div className="row">
            <div className="col-md-12">
              <div className="social-icons">
                <a href="https://www.youtube.com/@VillaTracker" className="text-white" target="_blank" rel="noopener noreferrer"> <YouTubeIcon /> </a> 
                <a href="https://www.linkedin.com/company/villa-tracker" className="text-white" target="_blank" rel="noopener noreferrer"> <LinkedInIcon /> </a> 
                <a href="https://www.instagram.com/villatracker/" className="text-white" target="_blank" rel="noopener noreferrer"> <InstagramIcon /> </a> 
                <a href="https://www.facebook.com/villatracker" className="text-white" target="_blank" rel="noopener noreferrer"> <FacebookIcon /> </a>   
              </div>
            </div>
          </div>
          <h3 className="get-in-touch-lable text-white" style={{fontSize:'40px'}}>Get In Touch</h3>
          <h3 className="get-in-touch-txt text-white" style={{fontSize:'35px'}}>
            We're happy to hear from you!
          </h3>
          <h6 className="get-in-touch-desc text-white my-3" style={{fontSize:'20px'}}>
            We're based in Gstaad, Switzerland <br /> Where we also have plenty
            of luxury chalets for sale!
          </h6>
        </div>
        <div className="get-in-touch-items row mobile-row-intouch" style={{paddingLeft: '8rem'}}>
          <div className="col-sm-5">
            <div className="get-in-touch-info d-flex mb-3">
              <HiOutlineEnvelope className="text-white icons_details" />
              <div>
                <h6 className="text-white">E-Mail</h6>
                <h6 className="text-white" style={{ fontWeight: 300 }}>
                  info@villatracker.com
                </h6>
              </div>
            </div>
            <div className="get-in-touch-info d-flex mb-3">
              <FiPhoneCall className="text-white icons_details" />
              <div>
                <h6 className="text-white">Customer Support</h6>
                <h6 className="text-white" style={{ fontWeight: 300 }}>
                  +41 79 489 70 21
                </h6>
              </div>
            </div>
            <div className="get-in-touch-info d-flex mb-3">
              <HiOutlineLocationMarker className="text-white icons_details" />
              <div>
                <h6 className="text-white">Office Address</h6>
                <h6 className="text-white" style={{ fontWeight: 300 }}>
                  Mettlenstr. 16, CH-3780 Gstaad, Switzerland
                </h6>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="get-in-touch-info px-3 d-flex">
              <div className="col-md-12 col-12 px-2 mb-2">
                <label className="text-white my-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  className="form-control form-control-sm"
                  id="coloredInput"
                  name="name"
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
            <div className="get-in-touch-info px-3 d-flex" style={{paddingTop: '10px'}}>
              <div className="col-md-12 col-12 px-2 mb-2">
                <label className="text-white my-1">Email</label>
                <input
                  type="text"
                  value={form.email}
                  id="coloredInput"
                  className="form-control form-control-sm"
                  name="email"
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
            <div className="get-in-touch-info px-3 d-flex" style={{paddingTop: '10px'}}>
            <div className="col-md-12 col-12 px-2 mb-2">
                <label className="text-white my-1">Phone</label>
                <input
                  country={"ch"}
                  className="form-control form-control-sm"
                  enableSearch={true}
                  id="coloredInput"
                  name="phone"
                  value={`+${form.phone}`}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="col px-2">
              <label className="text-white my-1">Message (Enter your message here)</label>
              <textarea
                name="message"
                value={form.message}
                className="form-control form-control-sm"
                id="coloredInput"
                style={{ resize: "none", height: "135px" }}
                onChange={handleInputChange}
              ></textarea>
              {error.message && <div className="text-danger">{error.message}</div>}
            </div>
            <div className="my-4" style={{paddingRight: '24px', paddingLeft: '6px'}}>
              <button
                type="button"
                className="btn btn-success col-12 text-center px-3"
                style={{
                  background: "#165093",
                  color: "white",
                  border: "#165093",
                  width: "93% !important",
                  margin: "10px",
                  height: "50px",
                }}
                onClick={sendMessage}
                disabled={submit}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
        <div className="get-in-touch-footer">
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <div className="msg-icons mb-3 d-flex justify-content-end">
              <svg
                className="Path_3269"
                viewBox="1 2 49.4 46.107"
                style={{ width: "40px" }}
              >
                <path
                  id="Path_3269"
                  d="M 45.46035385131836 2 L 5.940039157867432 2 C 3.2164306640625 2 1 4.2164306640625 1 6.940039157867432 L 1 33.28691482543945 C 1 36.01052093505859 3.2164306640625 38.22695541381836 5.940039157867432 38.22695541381836 L 10.88007831573486 38.22695541381836 L 10.88007831573486 46.46035385131836 C 10.88007831573486 47.09432601928711 11.24399471282959 47.66901779174805 11.81209945678711 47.94401168823242 C 12.04098796844482 48.05269622802734 12.28469562530518 48.10703659057617 12.52675819396973 48.10703659057617 C 12.89396667480469 48.10703659057617 13.25788402557373 47.98518371582031 13.55593299865723 47.74641418457031 L 25.4548397064209 38.22695541381836 L 45.46035385131836 38.22695541381836 C 48.1839599609375 38.22695541381836 50.400390625 36.01052474975586 50.400390625 33.28691864013672 L 50.400390625 6.940042495727539 C 50.400390625 4.216434001922607 48.1839599609375 2.000003099441528 45.46035385131836 2.000003099441528 Z M 25.7001953125 25.05351638793945 L 12.52675819396973 25.05351638793945 C 11.61614513397217 25.05351638793945 10.88007831573486 24.31580352783203 10.88007831573486 23.40683746337891 C 10.88007831573486 22.49786949157715 11.61614513397217 21.76015663146973 12.52675819396973 21.76015663146973 L 25.7001953125 21.76015663146973 C 26.61080932617188 21.76015663146973 27.34687614440918 22.49786949157715 27.34687614440918 23.40683746337891 C 27.34687614440918 24.31580352783203 26.61080932617188 25.05351638793945 25.7001953125 25.05351638793945 Z M 38.87363433837891 18.466796875 L 12.52675819396973 18.466796875 C 11.61614513397217 18.466796875 10.88007831573486 17.72908401489258 10.88007831573486 16.82011604309082 C 10.88007831573486 15.9111499786377 11.61614513397217 15.17343711853027 12.52675819396973 15.17343711853027 L 38.87363433837891 15.17343711853027 C 39.78424835205078 15.17343711853027 40.52031326293945 15.9111499786377 40.52031326293945 16.82011604309082 C 40.52031326293945 17.72908401489258 39.78424835205078 18.466796875 38.87363433837891 18.466796875 Z"
                ></path>
              </svg>
            </div>
            <div className="get-in-touch-line">
              <hr
                className="text-white get-in-touch-line"
                style={{
                  borderColor: "#dfdfdf",
                  borderWidth: "3px",
                  borderStyle: 'solid'
                }}
              />
            </div>
          </div>
        </div>
        <div className="text-white text-center">
          © 2023 VillaTracker. All rights reserved. Privacy and
          Terms.
        </div>
      </div>
    </div>
  );
};

export default Touch;
