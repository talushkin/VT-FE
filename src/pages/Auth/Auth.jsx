import React, { useEffect, useState } from "react";
import { validateEmail } from "../../Util/ValidationUtil.js";
import Logo from "../../components/Icons/Logo/Logo";
import "./Auth.css";
import styles from "./Auth.module.scss";
import { useDispatch } from "react-redux";
import * as userActions from "../../store/redux/User/actions";
import TermsFooter from "../../components/TermsFooter/TermsFooter";
import Alert from "../../components/Alert/Alert";
import { useHistory } from "react-router-dom";
import Checkbox from "../../components/Checkbox";
import LeftImage from "../../assets/SigninPic.jpeg";
import EmailInput from "../../components/Forms/Fields/EmailInput/EmailInput";
import PasswordInput from "../../components/Forms/Fields/PasswordInput/PasswordInput";
import NameInput from "../../components/Forms/Fields/NameInput/NameInput";
import { toast } from "react-toastify";

const Auth = (props) => {
  return (
    <>
      <SignIn />
    </>
  );
};
export default Auth;

export const SignIn = () => {
  const dispatch = useDispatch();

  const history = useHistory();
  const [smallScreen, setSmallScreen] = useState(false);
  const [screenSize, setScreenSize] = useState(null);
  const [chkRememberMe, setChkRememberMe] = useState(false);
  const [chkAgreeToTerms, setChkAgreeToTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [twoFA, setTwoFA] = useState("");
  // const [codeSent, setCodeSent] = useState(false);

  const [state, setState] = useState({
    loading: false,
  });

  const signupCallback = (result) => {
    console.log("result");
    if (result === "ok") {
      window.open("/search", "_self");
    }
  };

  // const twoFACallback = (result) => {
  //   if (result === "ok") {
  //     setCodeSent(true);
  //   }
  // }

  const loginCallback = (result) => {
    // //console.log(result);
    if (result === "failed") {
      setState({
        ...state,
        error: {
          msg: "That email and password combination is incorrect.",
          placement: "email",
        },
        loading: false,
      });
    } else {
      history.push("/search");
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
    if (email.length === 0) {
      setState({
        ...state,
        error: {
          msg: "Looks like you forgot something",
          placement: "email",
        },
        loading: false,
      });
    } else if (!validateEmail(email)) {
      setState({
        ...state,
        error: {
          msg: "Please enter with a correct email format",
          placement: "email",
        },
        loading: false,
      });
    } else if (password.length === 0) {
      setState({
        ...state,
        error: {
          msg: "Please enter your password",
          placement: "password",
          color: "yellow",
        },
        loading: false,
      });
    } else if (!regexp.test(password) || !regexp.test(password)) {
      setState({
        ...state,
        error: {
          msg: "White or empty space is not allowed",
          placement: "password",
        },
        loading: false,
      });
    } else if (password.length < 6) {
      setState({
        ...state,
        error: {
          msg: "Password must be at least 6 characters long",
          placement: "password",
        },
        loading: false,
      });
    } 
    // else if(twoFA.length === 0 && codeSent) {
    //   setState({
    //     ...state,
    //     error: {
    //       msg: "Please enter the 2fa code sent to your email",
    //       placement: "2FA CODE",
    //       color: "yellow",
    //     },
    //     loading: false,
    //   });
    // } else if(twoFA.length !== 4 && codeSent) {
    //   setState({
    //     ...state,
    //     error: {
    //       msg: "Please enter a valid code",
    //       placement: "2FA CODE",
    //       color: "yellow",
    //     },
    //     loading: false,
    //   });
    // }
    else {
      
      // if(!codeSent) {
      //   const user = {
      //     email: email,
      //     password: password.trim(),
      //   };
      //   // console.log(user, "user")
      //   dispatch(userActions.sendtwoFAcode(user, twoFACallback));
      // } else {
        const user = {
          email: email,
          password: password.trim(),
          // twofa: twoFA
        };
        console.log(user, "user")
        dispatch(userActions.signIn(user, chkRememberMe, signupCallback));
      // }
      
    }
  };

  useEffect(() => {
    const jtoken = localStorage.getItem("jToken");
    const agent_id = localStorage.getItem("agent_id");
    const agency_id = localStorage.getItem("agency_id");
    if(jtoken && agent_id && agency_id) {
      window.open("/search", "_self");
    }
  }, []);

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
      <section className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="row row col-12 col-md-12 d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-7 sign-up-contianer" style={{width:'60%'}}>
            <div className="container text-center login-form">
              <div className="d-flex justify-content-center">
                <div className="main-logo" style={{ width: "146px" }}>
                  <Logo />
                </div>
              </div>
              <h3 className="sign-in-title" style={{fontSize:'36px'}}>Log In</h3>

              <div className="row justify-content-center">
                <div className="col-12 col-md-8">
                  <EmailInput
                    onSubmit={handleSubmit}
                    value={email}
                    setValue={setEmail}
                    label={<label style={{ fontSize: '18px' }}>E-Mail*</label>}
                    inputName="email"
                    showLoginLink="none"
                    placeholder="E-mail address"
                    error={state.error}
                  />
                </div>
                <div className="col-12 col-md-8 ">
                  <PasswordInput
                    onSubmit={handleSubmit}
                    value={password}
                    setValue={setPassword}
                    label={<label style={{ fontSize: '18px' }}>Password*</label>}
                    inputName="password"
                    placeholder="Password"
                    error={state?.error}
                    showLoginLink="none"
                  />
                </div>
                {/* {codeSent &&(<div className="col-12 col-md-8 ">
                 
                  <NameInput
                    onSubmit={handleSubmit}
                    value={twoFA}
                    setValue={setTwoFA}
                    label={<label style={{ fontSize: '18px' }}>2FA Code*</label>}
                    inputName="2FA CODE"
                    placeholder="2FA CODE"
                    error={state?.error}
                    showLoginLink="none"
                  />
                </div>)} */}
                <div className="col-12 col-md-8">
                  <div className="row d-flex justify-content-between align-items-center">
                    <div className="col-6">
                      <Checkbox
                        uid="chkRememberMe"
                        label="Remember Me"
                        checked={chkRememberMe}
                        onChange={(value) => setChkRememberMe(value)}
                      />
                    </div>
                    <div className="col-6">
                      <h6 className="mt-3 text-end">
                        <span
                          onClick={() =>
                            history.push(`/forgotPassword?email=${email}`)
                          }
                          className="txt-forgot-password text-decoration-underline text-primary cst-cursor"
                        >
                          Forgot password?
                        </span>
                      </h6>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-8 mt-4 ">
                  <button
                    style={{
                      borderRadius: "6px",
                      fontWeight: "500",
                      fontSize: "22px",
                      color: "#fff",
                      backgroundColor: "#165093",
                    }}
                    className="btn btn-primary col-12"
                    fullwidth={true}
                    loading={state.loading}
                    text="Sign Up!"
                    onClick={(e) => {
                      setState({ ...state, error: undefined });
                      handleSubmit(e);
                    }}
                  >
                    Log In
                    {/* {codeSent?(''):('Send 2FA Code')} */}
                  </button>
                </div>
              </div>

              <div className={styles.return_to_login_wrapper}>
                <h6 className="mt-3">
                  Don't have an account yet?
                  <span
                    className="text-decoration-underline text-primary cst-cursor"
                    onClick={() => history.push("/signup")}
                  >
                    Join us!
                  </span>
                </h6>
              </div>
            </div>
            <div className="col-md-7 col-12 model-footer cst-footer-add-css ">
              <hr className=""></hr>
              <TermsFooter isMobile={smallScreen} />
            </div>
          </div>
          <div
            className="col-md-5 d-none d-md-block hero-left-col"
            style={{ height: "100vh", "overflow-y": "auto", width:'40%' }}
          ></div>
         
        </div>
      </section>
    </>
  );
};
