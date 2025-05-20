import React from "react";
import Logo from "../../components/Icons/Logo/Logo";
import TermsFooter from "../../components/TermsFooter/TermsFooter";
import { useHistory } from "react-router-dom";
import LeftImage from "../../assets/SigninPic.jpeg";
import styles from "../Auth/Auth.module.scss";
import bottomLogos from "../../assets/desktop/welcome/welcome-bottom-logos.png";

import "./SignupThanks.css";
import { useState } from "react";
import { useEffect } from "react";

const SignupThanks = () => {
  const history = useHistory();
  const [smallScreen, setSmallScreen] = useState(false);
  const [screenSize, setScreenSize] = useState(null);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize < 768) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  }, [screenSize]);
  return (
    <>
      <section>
        <div className="row" style={{ height: "100vh" }}>
          <div className="col-md-5 pic-width">
            <img
              src={LeftImage}
              className="img-fluid"
              alt="Left Image"
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-7 d-flex flex-column justify-content-center custom-width">
            <div className="text-center mb-4">
              <div className="mt-5 mb-5 w-100 d-flex justify-content-center">
                <div style={{ width: "130px", height: "130px" }}>
                  <Logo />
                </div>
              </div>
              <h2 className="mt-5" style={{ color: "#165093", fontSize:'45px', fontWeight:'400' }}>
                Thank You
              </h2>
              <h2 className="mb-4 fw-bolder" style={{ color: "#165093", fontSize:'40px' }}>
                Your request has been sent.  
              </h2>
              <p
                className={`${styles.instructions} mt-5 mb-5`}
                style={{ color: "#284866", fontSize:'24px',fontWeight: '500' }}
              >
                We’ve received your details and will begin our reviewing
                process.{<br />}
                <span style={{ fontWeight: 'bolder', color: '#284866' }}>Please</span> expect an email from us shortly after this is done.
              </p>

              <div
                className="mt-5"
                style={{
                  paddingBottom: "70px",
                }}
              >
                <img
                  src={bottomLogos}
                  alt="bottomLogos"
                  className="img-fluid mt-5"
                />
              </div>
            </div>
            <div className="col-md-7 col-12 model-footer cst-footer-add-css ">
              {/* <hr className=""></hr> */}
              <TermsFooter isMobile={smallScreen} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignupThanks;
