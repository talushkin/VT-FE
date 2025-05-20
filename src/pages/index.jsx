import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import Auth from "./Auth/Auth";
import ResetPasswordPage from "./ResetPasswordPage/ResetPasswordPage";
import SignupThanks from "./SignupThanks";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";
import Profile from "./Profile/Profile";
import Clients from "./Clients";
import Reservations from "./Reservations";
import Admin from "./Admin";
import Welcome from "./Welcome";
import Sidebar from "../components/Sidebar";
import SearchProperty from "./SearchProperty";
import ShubPanel from "./ShubPanel";
import Map from "./Map";
import Reports from "./Reports";
import Touch from "./Touch";
import Faq from "./Faq";
import HotDestinations from "./HotDestinations";
import Collections from "./Collections";
import WishList from "./WishList";
import Favorites from "./Favorites";
import Property from "./Property";
import Calendar from "./Calendar";
import Link from "./Link";
import CalendarId from "./CalendarId";
import PropertyId from "./PropertyId";
import PropertyEdit from "./PropertyEdit";
import PropertyReservePage from "./PropertyReserve";
import TermsConditions from "./termsConditions";
import {
  PATH_ADMIN,
  PATH_CLIENTS,
  PATH_COLLECTIONS,
  PATH_FAQ,
  PATH_FAVORITES,
  PATH_FORGOT_PASSWORD,
  PATH_HOME,
  PATH_HOT_DESTINATIONS,
  PATH_LOGIN,
  PATH_MAP,
  PATH_PROFILE,
  PATH_LINK,
  PATH_PROPERTY_EDIT,
  PATH_RESERVE,
  PATH_RETURN_FLYWIRE,
  PATH_REPORTS,
  PATH_RESERVATIONS,
  PATH_SEARCH,
  PATH_SHUB,
  PATH_SIGNUP_THANKS,
  PATH_WISH_LIST,
  PATH_INTOUCH,
  PATH_Welcome,
  PATH_SIGNUP,
  PATH_PROPERTY,
  PATH_PROPERTY_ID,
  PATH_CALENDAR,
  PATH_CALENDAR_ID,
  VILLA_PATH_SEARCH,
  PATH_TERMS_CONDITIONS,
  PATH_SEARCH_NEW, //By Jaison
} from "../Util/constants";
import { baseURL } from "../core";
import axios from "axios";
import Signup from "./Signup/Signup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyCodePage from "./ResetPasswordPage/VerifyCodePage";
import ResetChangePasswordPage from "./ResetPasswordPage/ResetChangePasswordPage";
import AuthService from "../services/auth.service";
import { AiOutlineClose } from "react-icons/ai";
import ReactGA from 'react-ga4';
import constants from "../Util/constants";
ReactGA.initialize('G-ERC3BXEZ3P');


export const drawerWidth = 240;

const MainPage = React.memo(function MainPage(props) {
  const loggedRef = useRef(false);
  const hasRedirectedRef = useRef(false); // Track if the redirection has happened

  if (!loggedRef.current) {
    loggedRef.current = true;
  }
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [token, setToken] = useState(localStorage.getItem("jToken"));
  const [agent, setAgent] = useState(() => {
    const savedAgent = localStorage.getItem("agent");
    return savedAgent ? JSON.parse(savedAgent) : null;
  });

  const [agency, setAgency] = useState(localStorage.getItem("agency"));
  const [currencies, setCurrencies] = useState(localStorage.getItem("currencies"));
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || 'USD');
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [propertyId, setPropertyId] = useState("");
  // const links=localStorage.getItem("noMenu")?true:false;
  const links = location.pathname?.split("/").includes('link');
  const calendars = location.pathname?.split("/").includes('calendar');
  const [noMenu, setNoMenu] = useState(links||calendars);

  useEffect(() => {

    const fetchCurrencies = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(constants.SHUB_URL+"/xchange");
        const data = response.data;
        localStorage.setItem("currency", 'USD');
        localStorage.setItem("exchange", JSON.stringify(data));
        setCurrencies(data);
      }
      catch (error) {
        console.error("Error fetching currencies:", error);
      }
    }
    if (!currencies) {
      fetchCurrencies();
    }
    const agentInfo = JSON.parse(localStorage.getItem("agent") || "{}");
    const agentCurrency = agentInfo.currency || "USD";
    setCurrency(currency || agentCurrency || 'USD')
    localStorage.setItem("currency", currency || agentCurrency || 'USD');
    console.log('selected currency:', currency || agentCurrency || 'USD')
    console.log('fetchCurrencies()')
  }, [])

  const logintoken = localStorage.getItem("jToken");
  const storedProperty = localStorage.getItem("property") && isValidJSON(localStorage.getItem("property")) ? JSON.parse(localStorage.getItem("property")) : {};

  useEffect(() => {
    getProfile();
    AuthService.DestinationsOptions();

  }, []);

  function isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  useEffect(() => {
    let urls = location.pathname ? location.pathname?.split("/") : [];
    ReactGA.send({ hitType: "pageview", page: location.pathname });

    //console.log(urls)
    if (storedProperty) {
      const { listing, xdata, fullCalendar } = storedProperty;
    }
    if (!links) {
      if (
        location.pathname !== "/signup" &&
        location.pathname !== "/login" &&
        location.pathname !== "/forgotPassword" &&
        location.pathname !== "/faq" &&
        location.pathname !== "/intouch" &&
        location.pathname !== "/signupthanks"
      ) {

        if (location.pathname === `/reservations`) {
          history.push({
            pathname: `/reservations`,
            state: {
              property: storedProperty?.listing,
              xdata: storedProperty?.xdata,
              fullCalendar: storedProperty?.fullCalendar,
            },
          });
        }
        if (location.pathname === `/verifycode/${urls[2]}`) {
          history.push(`/verifycode/${urls[2]}`);
        }
        if (location.pathname === `/resetpassword/${urls[2]}`) {
          history.push(`/resetpassword/${urls[2]}`);
        }
        if (agent && agency && urls[1] === "property") {
          setPropertyId(urls[2]);
          // localStorage.setItem("propertyId", urls[2]);
          history.push(`/property`);
        }
      }
      if (location.pathname === "/") {
        setTimeout(() => { //reset data and move to the login

          localStorage.removeItem("formerDestination");
          localStorage.removeItem("destination");
          localStorage.setItem("destination", "");
          localStorage.removeItem("dateFrom");
          localStorage.removeItem("dateTo");
          localStorage.removeItem("adults");
          localStorage.removeItem("children");
          localStorage.removeItem("bedrooms");
          localStorage.removeItem("bathrooms");
          localStorage.removeItem("propertyType");
          localStorage.removeItem("selectedTypes");
          localStorage.removeItem("selectedPrices");
          localStorage.removeItem("selectedMusthave");
          localStorage.removeItem("selectedAmenities");
          localStorage.removeItem("searchedAmenities");
          localStorage.removeItem("selectedPropertiesItem");
          localStorage.removeItem("searchedPriceRange");
          localStorage.removeItem("searchedTypes");
          localStorage.removeItem("searchedMustHave");
          localStorage.removeItem("sortBy");
          localStorage.removeItem("collections");
          localStorage.removeItem("clientEmail");
          // localStorage.removeItem("activeRatePlan");
          history.push("/welcome");

        }, 200);
      }
      if (logintoken === null) {
        history.push("/welcome");
      }
    }

  }, []);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, [window.location.pathname]);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize); // Cleanup listener
  }, []);

  useEffect(() => {
    if (screenSize < 800) {
      setActiveMenu(false);
      localStorage.setItem("screen", activeMenu);
      localStorage.setItem("screenSize", screenSize);
    } else {
      setActiveMenu(true);
      localStorage.setItem("screen", activeMenu);
      localStorage.setItem("screenSize", screenSize);
    }
  }, [screenSize]);

  useEffect(() => {
    if (location.pathname === "/request-to-book-flywire" && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true; // Set to true to avoid infinite loop
      history.replace(PATH_RESERVE);
    }
  }, [location.pathname, history]);

  const handleToggleMenu = () => {
    if (screenSize < 900) {
      setActiveMenu((preValue) => !preValue);
    } else {
      setActiveMenu(false);
    }
    setIsMenuOpen(true);
  };

  const handleClosedMenu = () => {
    if (screenSize < 900) {
      setActiveMenu((preValue) => !preValue);
    } else {
      setActiveMenu(false);
    }
    setIsMenuOpen(false);
  };

  const userRequest = axios.create({
    baseURL: baseURL,
    headers: {
      token: `Bearer ${localStorage.getItem("jToken")}`,
    },
  });

  const getProfile = async () => {
    if (localStorage.getItem("agent_id")) {
      const agentId = localStorage.getItem("agent_id");
      const res = await userRequest.get(`/agent/get-profile`, {
        params: {
          agent_id: agentId,
        },
      });
      if (res.data?.agent) {
        localStorage.setItem("agent", JSON.stringify(res.data.agent));
        localStorage.setItem(
          "agent_id",
          JSON.stringify(res.data.agent.agent_id)
        );
        localStorage.setItem(
          "agency_id",
          JSON.stringify(res.data.agent.agency_id)
        );
        setAgent(res.data.agent);
        const agencyID = parseInt(res.data.agent.agency_id);

        const TAres = await userRequest.get(
          `travel-agency/get-travel-agencies`,
          {
            params: {
              agency_id: agencyID,
            },
          }
        );
        if (TAres.data?.agencies.length > 0) {
          localStorage.setItem(
            "travelAgency",
            JSON.stringify(TAres.data?.agencies[0]?.agencyDetails[0])
          );
          setAgency(TAres.data?.agencies[0]?.agencyDetails[0]);
        } else {
          console.log(
            "could not read the agency data? agency_id=",
            agent.agency_id
          );
        }
      } else {
        console.log(
          "could not read the agent data? agent_id=",
          agent.agency_id
        );
      }
    }
  };

  return (
    <>
      <Switch>
        <Route exact path={[PATH_LOGIN]}>
          <Auth stage="login" signup={true} setToken={setToken} />
        </Route>
        <Route exact path={"/verifycode/:id"}>
          <VerifyCodePage />
        </Route>
        <Route exact path={"/resetpassword/:id"}>
          <ResetChangePasswordPage />
        </Route>
        <Route exact path={[PATH_FORGOT_PASSWORD]}>
          <ResetPasswordPage />
        </Route>
        <Route exact path={[PATH_SIGNUP_THANKS]}>
          <SignupThanks />
        </Route>
        <Route path={[PATH_Welcome]}>
          <Welcome signup={true} />
        </Route>
        <Route path={[PATH_SIGNUP]}>
          <Signup />
        </Route>
        <div className={`page-container ${activeMenu ? "active-menu" : ""}`}>
          {          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
            className="page-header"
          >
            {activeMenu && isMenuOpen && !noMenu && (
              <div
                style={{ display: "flex", flex: "2", cursor: "pointer" }}
                onClick={handleClosedMenu}
                className="closed-icon h-100"
              >
                <AiOutlineClose color="#fff" size={30} style={{ top: "2px" }} />
              </div>
            )}

            {!noMenu &&(<span
              style={
                activeMenu && isMenuOpen
                  ? { display: "flex", flex: "4", alignItems: "center", fontSize: "18px" }
                  : { display: "flex", justifyContentL: "center", fontSize: "18px" }
              }
            >
              What's New on Villatracker?
            </span>)}
          </div>}
          {logintoken !== null && !noMenu && (<div className="sidebar">
            <Sidebar
              agent={agent}
              agency={agency}
              screenSize={screenSize}
              activeMenu={activeMenu}
              handleToggleMenu={handleToggleMenu}
            />
          </div>)}

          <div
            className={activeMenu && !noMenu ? `${"page-body"}` : "page-body-sm"}
            onClick={() =>
              screenSize < 768 && setActiveMenu((preValue) => false)
            }
          >
            <Route exact path={[PATH_SEARCH]}>
              <SearchProperty agency={agency} agent={agent} token={token} noMenu={noMenu} />
            </Route>
            <Route exact path={[VILLA_PATH_SEARCH]}>
              <SearchProperty token={token} agent={agent} agency={agency} />
            </Route>
            <Route exact path={[PATH_SHUB]}>
              <ShubPanel token={token} agent={agent} agency={agency} />
            </Route>
            <Route exact path={[PATH_MAP]}>
              <Map token={token} agent={agent} agency={agency} />
            </Route>
            <Route exact path={[PATH_CLIENTS]}>
              <Clients token={token} agent={agent} agency={agency} />
            </Route>
            <Route exact path={[PATH_COLLECTIONS]}>
              <Collections
                signup={false}
                token={token}
                agent={agent}
                agency={agency}
              />
            </Route>
            <Route exact path={[PATH_HOT_DESTINATIONS]}>
              <HotDestinations token={token} agent={agent} agency={agency} />
            </Route>
            <Route exact path={[PATH_FAVORITES]}>
              <Favorites token={token} agent={agent} agency={agency} />
            </Route>
            <Route exact path={[PATH_RESERVATIONS]}>
              <Reservations token={token} agent={agent} agency={agency} />
            </Route>
            <Route exact path={[PATH_REPORTS]}>
              <Reports token={token} agent={agent} agency={agency} />
            </Route>
            <Route exact path={[PATH_PROFILE]}>
              <Profile
                agency={agency}
                agent={agent}
                token={token}
                setAgent={setAgent}
                setAgency={setAgency}
              />
            </Route>
            <Route exact path={[PATH_WISH_LIST]}>
              <WishList agency={agency} agent={agent} token={token} />
            </Route>
            <Route exact path={[PATH_INTOUCH]}>
              <Touch token={token} agent={agent} agency={agency} />
            </Route>
            <Route path={PATH_CALENDAR_ID}>
              <CalendarId currency={currency} agency={agency} agent={agent} token={token} noMenu={noMenu} />
            </Route>
            <Route path={PATH_PROPERTY}>
              <Property currency={currency} agency={agency} agent={agent} token={token} noMenu={noMenu} />
            </Route>
            <Route path={PATH_LINK}>
              <Link
                noMenu={noMenu}
                currency={currency}
                agency={agency}
                agent={agent}
                getProfile={getProfile}
                token={token} />
            </Route>
            <Route exact path={PATH_PROPERTY_ID}>
              <PropertyId
                currency={currency}
                agency={agency}
                agent={agent}
                token={token}
                id={propertyId}
                noMenu={noMenu}
              />
              </Route>
              <Route exact path={PATH_CALENDAR}>
              <Calendar
                currency={currency}
                agency={agency}
                agent={agent}
                token={token}
                id={propertyId}
                noMenu={noMenu}
              />
            </Route>
            <Route exact path={[PATH_PROPERTY_EDIT]}>
              <PropertyEdit
                propertyId={propertyId}
                agency={agency}
                agent={agent}
                token={token}
              />
            </Route>
            <Route exact path={[PATH_FAQ]}>
              <Faq />
            </Route>
            <Route exact path={[PATH_ADMIN]}>
              {agent && agent.role === "admin" ? (
                <Admin agency={agency} agent={agent} token={token} />
              ) : (
                <Redirect to="/search" />
              )}
            </Route>
            <Route exact path={[PATH_RESERVE]}>
              <PropertyReservePage
                agency={agency}
                agent={agent}
                token={token}
              />
            </Route>
            <Route exact path={[PATH_RETURN_FLYWIRE]}>
              <PropertyReservePage
                agency={agency}
                agent={agent}
                token={token}
              />
            </Route>
            <Route exact path={[PATH_TERMS_CONDITIONS]}>
              <TermsConditions
                agency={agency}
                agent={agent}
                token={token}
              />
            </Route>
            <Route exact path={[PATH_SEARCH_NEW]}>
              <SearchProperty agency={agency} agent={agent} token={token} noMenu={noMenu} />
            </Route>            
          </div>
        </div>
      </Switch>
      <ToastContainer />
    </>
  );
})
export default MainPage;
