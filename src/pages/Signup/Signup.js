import React, { useEffect, useState } from "react";
import SignupForm from "../../components/Forms/SignupForm/SignupForm.jsx";
import { PWD_RULES, validateEmail } from "../../Util/ValidationUtil.js";
import Logo from "../../components/Icons/Logo/Logo";
import { useDispatch } from "react-redux";
import * as userActions from "../../store/redux/User/actions";
import TermsFooter from "../../components/TermsFooter/TermsFooter";

import { useHistory } from "react-router-dom";

import LeftImage from "../../assets/SigninPic.jpeg";
import Checkbox from "../../components/Checkbox";

import Alert from "../../components/Alert/Alert";
import countryList from "../../Util/data/countries.json";
import { error } from "loglevel";

const Signup = (props) => {
  const history = useHistory();
  const [chkRememberMe, setChkRememberMe] = useState(false);
  const [chkAgreeToTerms, setChkAgreeToTerms] = useState(false);
  const [showAgreeToTerms, setShowAgreeToTerms] = useState(false);
  const [state, setState] = useState({
    signup: false,
    inputStage: props.stage,
    pwdRules: PWD_RULES,
    agency_name: "",
    agency_type: "",
    web_site: "",
    first_name: "",
    last_name: "",
    country: "",
    countryCode: "",
    address: "",
    stateProvince: "",
    city: "",
    zipCode: "",
    currency: "",
    username: "",
    email: "",
    phone: "",
    organization: "",
    password: "",
    confirmPassword: "",
    loading: false,
    emailConsent: true,
    error: {},
    verification_resend_status: "none",
    userData: {},
  });
  console.log('state---------->', state);

  const [smallScreen, setSmallScreen] = useState(false);
  const [screenSize, setScreenSize] = useState(null);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const countryCode = (countryName) => {
    const ccIndex = countryList.findIndex((i) => i.name === countryName);
    const cc = ccIndex ? countryList[ccIndex]?.code : "";
    console.log("countryCode=", cc);
    return cc;
  };
  useEffect(() => {
    setState({ ...state, countryCode: countryCode(state.country) });
  }, [state.country]);

  useEffect(() => {
    if (screenSize < 768) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  }, [screenSize]);

  useEffect(() => {
    if (screenSize < 768) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  }, [screenSize]);

  const dispatch = useDispatch();

  const setError = (field, msg) => {
    //console.log(field, msg, "000000000");
    setState({
      ...state,
      error: {
        msg,
        placement: field,
      },
      loading: false,
    });
  };

  const validateSignup = () => {
    if (state.agency_name.length < 1) {
      setError("agencyname", "Field is required");
      return true;
    }
    if (state.agency_type.length < 1) {
      setError("agencyType", "Field is required");
      return true;
    }

    if (state.first_name.length < 1) {
      setError("fname", "Field is required");
      return true;
    }

    if (state.last_name.length < 1) {
      setError("lname", "Field is required");
      return true;
    }
    if (state.email.length < 1) {
      setError("email", "Field is required");
      return true;
    }
    if (!validateEmail(state.email)) {
      setError("email", "Looks like you forgot something");
      return true;
    }
    if (state.address.length < 1) {
      setError("address", "Field is required");
      return true;
    }
    if (state.country.length < 1) {
      setError("countryname", "Field is required");
      return true;
    }
    if (state.stateProvince.length < 1) {
      setError("stateProvince", "Field is required");
      return true;
    }
    if (state.city.length < 1) {
      setError("city", "Field is required");
      return true;
    }
    if (state.zipCode.length < 1) {
      setError("zipCode", "Field is required");
      return true;
    }
    if (state.phone.length < 1) {
      setError("phone", "Field is required");
      return true;
    }
    if (state.currency.length < 1) {
      setError("currency", "Field is required");
      return true;
    }

    return false;
  };
  const signupCallback = (result) => {
    if (result === "ok") {
      history.push("/signupthanks");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({
      ...state,
      loading: false,
      error: {},
    });
    const regexp = /^\S*$/;
    const signupErrors = validateSignup();
    if (signupErrors > 0) {
      return;
    }
    if (state.email.length === 0) {
      setState({
        ...state,
        error: {
          msg: "Please enter an email",
          placement: "email",
        },
        loading: false,
      });
      return;
    } else if (!validateEmail(state.email)) {
      setState({
        ...state,
        error: {
          msg: "Looks like you forgot something",
          placement: "email",
        },
        loading: false,
      });
      return;
    } else if (!regexp.test(state.password) || !regexp.test(state.password)) {
      setState({
        ...state,
        error: {
          msg: "White or empty space is not allowed",
          placement: "password",
        },
        loading: false,
      });
    } else if (state.password.length < 6) {
      setState({
        ...state,
        error: {
          msg: "Password should match and contain minimum 6 letters",
          placement: "password",
        },
        loading: false,
      });
      return;
    }

    if (state.password !== state.confirmPassword) {
      setState({
        ...state,
        error: {
          msg: "Password should match and contain minimum 6 letters or numbers : 0-9 a-z A-Z",
          placement: "password",
        },
        loading: false,
      });
      return;
    }

    if (!chkAgreeToTerms) {
      setShowAgreeToTerms(true);
      return;
    }

    let agent = {
      agencyName: state.agency_name,
      agencyType: state.agency_type,
      website: state.web_site,
      firstName: state.first_name,
      lastName: state.last_name,
      email: state.email,
      address: state.address,
      country: state.country,
      countryCode: state.countryCode,
      stateProvince: state.stateProvince,
      city: state.city,
      zipCode: state.zipCode,
      phone: state.phone,
      currency: state.currency,
      organization: state.organization,
      password: state.password,
      status: "pending",
    };
    console.log(agent, "agent");
    dispatch(userActions.signUp(agent, signupCallback));
  };

  const handleChangePassword = (value) => {
    const pwdRules = state.pwdRules.map((rule) => {
      rule.valid = rule.regexp.test(value);
      return rule;
    });

    setState({
      ...state,
      pwdRules: pwdRules,
      password: value,
    });
  };

  const handleConfirmPassword = (value) => {
    const pwdRules = state.pwdRules.map((rule) => {
      rule.valid = rule.regexp.test(value);
      return rule;
    });

    setState({
      ...state,
      pwdRules: pwdRules,
      confirmPassword: value,
    });
  };

  return (
    <>
      <section>
        <div className="row">
          {/* Left Image */}
          <div
            className="col-md-5 d-none d-md-block hero-left-col pic-width"
            style={{ height: "100vh", "overflow-y": "auto" }}
          ></div>
          {/* Right Content */}
          <div className="col-md-7 test-cls custom-width">
            <div className="container text-center p-4  mt-3 col-8 signup-container-mobile">
              <div className="m-2 d-flex justify-content-center">
                <div style={{ width: "146px" }}>
                  <Logo />
                </div>
              </div>
              <h3 className="sign-in-title">Sign up</h3>
              <SignupForm
                onSubmit={handleSubmit}
                error={state.error}
                agencyName={state.agency_name}
                setAgencyName={(value) =>
                  setState({ ...state, agency_name: value })
                }
                agencyType={state.agency_type}
                setAgencyType={(value) =>
                  setState({ ...state, agency_type: value })
                }
                website={state.web_site}
                setWebsite={(value) =>
                  setState({ ...state, web_site: value })
                }
                firstName={state.first_name}
                setFirstName={(value) =>
                  setState({ ...state, first_name: value })
                }
                lastName={state.last_name}
                setLastName={(value) =>
                  setState({ ...state, last_name: value })
                }
                email={state.email}
                setEmail={(value) => setState({ ...state, email: value })}
                address={state.address}
                setAddress={(value) => setState({ ...state, address: value })}
                country={state.country}
                setCountry={(value) => setState({ ...state, country: value })}
                countryCode={state.countryCode}
                setCountryCode={(value) =>
                  setState({ ...state, countryCode: value })
                }
                stateProvince={state.stateProvince}
                setStateProvince={(value) =>
                  setState({ ...state, stateProvince: value })
                }
                city={state.city}
                setCity={(value) => setState({ ...state, city: value })}
                zipCode={state.zipCode}
                setZipCode={(value) => setState({ ...state, zipCode: value })}
                username={state.username}
                setUsername={(value) => setState({ ...state, username: value })}
                phone={state.phone}
                setPhone={(value) => setState({ ...state, phone: value })}
                organization={state.organization}
                setOrganization={(value) =>
                  setState({ ...state, organization: value })
                }
                currency={state.currency}
                setCurrency={(value) => setState({ ...state, currency: value })}
                password={state.password}
                setPassword={handleChangePassword}
                confirmPassword={state.confirmPassword}
                setConfirmPassword={handleConfirmPassword}
              />
              <div className="row mt-4 d-flex justify-content-center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "30px 0 20px",
                  }}
                >
                  <Checkbox
                    uid="talkWithRepresentative"
                    label={
                      <>
                        I have read and agree to the{" "}
                        <a
                          href="https://smilinghouse.ch/terms-and-conditions/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="https://smilinghouse.ch/privacy-policy/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </a>
                        .*
                      </>
                    }
                    checked={chkAgreeToTerms}
                    onChange={(value) => setChkAgreeToTerms(value)}
                  />
                </div>

                {showAgreeToTerms && (
                  <Alert type="warning" msg="Please agree to the terms" />
                )}
                <div className="col-7 mt-5 signup-button-mobile">
                  <button
                    style={{
                      height: " 66px !important",
                      "border-radius": "6px",
                      "font-weight": "100",
                      "font-size": "32px",
                      color: "#fff",
                      "backgroundColor": "#165093",
                      "margin-top": "-50px",
                      "max-width": "70%",
                    }}
                    className="btn btn-primary col-12"
                    fullwidth={true}
                    loading={state.loading}
                    text="Sign Up"
                    onClick={(e) => {
                      setState({ ...state, error: undefined });
                      handleSubmit(e);
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h6>
                  Already have an account?
                  <span
                    className="text-decoration-underline text-primary cst-cursor"
                    onClick={() => history.push("/login")}
                  >
                    {" "}
                    Log in
                  </span>
                </h6>
              </div>
            </div>

            <div className="col-12 model-footer mb-2 cst-footer-add-css2">
              <div className="container text-center">
                <hr className="pb-3" />
                <TermsFooter isMobile={smallScreen} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
 