import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as userActions from "../../store/redux/User/actions";
import styles from "./ResetPasswordPage.module.scss";
import Button from "../../components/Buttons/Button/Button";
import Logo from "../../components/Icons/Logo/Logo";
import TermsFooter from "../../components/TermsFooter/TermsFooter";
import { useHistory } from "react-router-dom";
import PoolImg from "../../assets/bk_pool.png";
import "./ResetPassword.css";
import { validateEmail } from "../../Util/ValidationUtil";
import EmailInput from "../../components/Forms/Fields/EmailInput/EmailInput";
import LeftImage from "../../assets/SigninPic.jpeg";
import AuthService from "../../services/auth.service";
import swal from "sweetalert";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const ResetPasswordPage = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryEmail = queryParams.get("email");

  const [email, setEmail] = useState(queryEmail ?? "");
  const [sent, setSent] = useState(false);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    loading: false,
  });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({
      ...state,
      loading: false,
      error: {},
    });

    if (email.length === 0) {
      setState({
        ...state,
        error: {
          msg: "Please enter an email",
          placement: "email",
        },
        loading: false,
      });
    } else if (!validateEmail(email)) {
      setState({
        ...state,
        error: {
          msg: "Looks like you forgot something",
          placement: "email",
        },
        loading: false,
      });
    } else {
      // await dispatch(userActions.forgotPassword(email));
      var paylod = { email: email };
      AuthService.ForgotPasswordApi(paylod)
        .then((response) => {
          console.log(response?.status);
          if (response?.status) {
            setEmail("");

            swal({
              show: true,
              icon: "success",
              title: "Success",
              text: `Please check email inbox`,
              timer: 3000,
            });
            history.push("/login");
          } else {
            swal({
              show: true,
              icon: "error",
              title: "Opps!!",
              text: `${response.message}`,
              timer: 3000,
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
      setSent(true);
    }
  };

  return (
    <>
      <section>
        <div className="row">
          <div
            className="col-md-5 d-none d-md-block hero-left-col pic-width"
            style={{ height: "100vh", "overflow-y": "auto"}}
          ></div>
          <div className="col-md-7 custom-width">
            <div className="container text-center p-4 px-5 reset-password-form">
              <div className="w-100 d-flex justify-content-center">
                <div style={{ width: "146px" }}>
                  <Logo />
                </div>
              </div>
              <h3 className="sign-in-title" style={{fontSize:'36px'}}>Reset your password</h3>
              <h6 className={styles.instructionsData} style={{ fontWeight: "500", fontSize:'18px' }}>
                Enter the email address you usually log in with and we’ll <br />
                send you instructions to reset your password.
              </h6>
              <div className="row justify-content-center">
                <div className="col-md-7 col-10">
                  {/* Email Input */}
                  <EmailInput
                    onSubmit={handleSubmit}
                    value={email}
                    setValue={setEmail}
                    label={<label style={{ fontSize: '18px' }}>E-Mail*</label>}
                    inputName="email"
                    showLoginLink="none"
                    error={state.error}
                    placeholder={"E-mail address"}
                  />
                </div>
              </div>
              <div className="row mt-4 justify-content-center mt-4">
                <div className="col-md-7 col-10">
                  {/* Reset Password Button */}
                  <Button
                    fullwidth={true}
                    variant="primary"
                    loading={state.loading}
                    // text="Reset password"
                    onClick={(e) => {
                      setState({ ...state, error: undefined });
                      handleSubmit(e);
                    }}
                  >
                    <span style={{font:'normal normal normal 23px/29px Quicksand', color:'#FFFFFF'}}>Reset password</span>
                  </Button>
                </div>
              </div>
              <div className={styles.return_to_login_wrapper}>
                <h6
                  className="txt-return-sign-in"
                  style={{ fontWeight: "500" }}
                >
                  Return to{" "}
                  <a
                    href=""
                    onClick={() => history.push("/login")}
                    style={{ fontWeight: "500" }}
                  >
                    Log in
                  </a>
                </h6>
              </div>
              <div className={styles.return_to_login_wrapper}>
                <p
                  className="txt-reset-password-contact fw-bolder"
                  style={{ fontWeight: "500" }}
                >
                  Please contact us if you have any trouble resetting your
                  password.
                </p>
              </div>
            </div>
            <div className="col-md-7 col-12 model-footer pt-5 mb-2 cst-footer-add-css">
              <hr className="pb-3"></hr>
              <TermsFooter isMobile={smallScreen} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPasswordPage;
