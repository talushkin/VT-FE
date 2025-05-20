import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Logo from "../../components/Icons/Logo/Logo";
import bottomLogos from "../../assets/desktop/welcome/welcome-bottom-logos.png";
import "./Welcome.scss";
import Button from "../../components/Buttons/Button/Button";

const Welcome = (props) => {
  const history = useHistory();

  const jtoken = localStorage.getItem("jToken");
  const agent_id = localStorage.getItem("agent_id");
  const agency_id = localStorage.getItem("agency_id");
  if(jtoken && agent_id && agency_id) {
    window.open("/search", "_self");
  }
  return (



    <section className="welcome-bg">
      
       <div className="text-center welcome-middle-bg pt-5">
        <div className="d-flex " style={{ height: "160px", marginTop: "55px" }}>
          <Logo />
        </div>
        <div className="welcome-middle container">
          <h3 className="sign-in-title" style={{ color: "#1E3E5D", fontSize: '40px' }}>
            Hello, Travel Professionals!
          </h3>
          <p
            className="my-4"
            style={{ color: "#1E3E5D", fontSize: "25px", lineHeight: '1.2', fontWeight: '500' }}
          >
            You’re invited to explore thousands of
            <br />
            vacation rentals across the world’s most
            <br />
            desirable destinations.
          </p>
          <div className="col-sm-8 col-12 mobile-height-welcome">
            <button
              className="btn btn-primary col-12"
              style={{
                "backgroundColor": "#165093",
                "font-size": "26px",
                borderColor: "#165093",
                marginTop: "10px"
              }}
              onClick={() => history.push("/login")}
            >
              Log in
            </button>
          </div>

          <div className="col-sm-8 col-12 mobile-height-welcome">
            <button
              className="btn btn-primary col-12"
              style={{
                "backgroundColor": "#165093",
                "font-size": "26px",
                borderColor: "#165093",
                marginTop: "5px",
                marginBottom: "10px",
              }}
              onClick={() => history.push("/signup")}
            >
              Sign up
            </button>
          </div>

        </div>
        <img src={bottomLogos} alt="bottam logo" className="img-fluid b-5" />
      </div> 
    </section>
  );
};

export default Welcome;
