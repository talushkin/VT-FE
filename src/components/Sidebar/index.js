import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as userActions from "../../store/redux/User/actions";
import Logo from "../../components/Icons/Logo/Logo";
import searchIcon from "../../assets/icons/menu/search.png";
import mapIcon from "../../assets/icons/menu/map.png";
import customersIcon from "../../assets/icons/menu/customers.png";
import reservationsIcon from "../../assets/icons/menu/reservations.png";
import reportsIcon from "../../assets/icons/menu/reports.png";
import profileIcon from "../../assets/icons/menu/profile.png";
import getInTouchIcon from "../../assets/icons/menu/get-in-touch.png";
import faqIcon from "../../assets/icons/menu/faq.png";
import adminIcon from "../../assets/icons/menu/admin.png";
import { AiOutlineMenu } from "react-icons/ai";
import comingSoon from "../../assets/special-collection/icons/label-coming-soon.svg";
import "./sidebar.scss";
import {
  PATH_LOGIN,
  PATH_SIGNOUT,
  PATH_ADMIN,
  PATH_CLIENTS,
  PATH_FAQ,
  PATH_HOME,
  PATH_INTOUCH,
  PATH_MAP,
  PATH_PROFILE,
  PATH_REPORTS,
  PATH_RESERVATIONS,
  PATH_SEARCH,
  PATH_SHUB,
  PATH_RESERVE,
  PATH_COLLECTIONS,
  PATH_WISH_LIST,
  PATH_FAVORITES,
  PATH_HOT_DESTINATIONS,
} from "../../Util/constants";
import ReactGA from 'react-ga4';

const Sidebar = ({ activeMenu, setActiveMenu, handleToggleMenu }) => {
  const [hoverItem, setHoverItem] = useState(null);
  const [sidebarMinHeight, setSidebarMinHeight] = useState("100%");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const history = useHistory();
  const location = useLocation();
  const screenSize = localStorage.getItem("screenSize");
  const agent = JSON.parse(localStorage.getItem("agent"));

  const contentHeight = document.querySelector(".page-body")?.scrollHeight || 0;
  const windowHeight = window.innerHeight;

  useEffect(() => {
    const updateSidebarHeight = () => {
      const newMinHeight = Math.max(contentHeight, windowHeight);
      setSidebarMinHeight(`${newMinHeight}px`);
    };
    updateSidebarHeight();
    window.addEventListener("resize", updateSidebarHeight);

    return () => {
      window.removeEventListener("resize", updateSidebarHeight);
    };
  }, [contentHeight]);

  useEffect(() => {
    const load = async () => {};
    load();
    console.log(agent?.role, "=agent.role");
  }, []);
  const signOut = () => {
    localStorage.clear();

    dispatch(userActions.signOut());
    history.push(PATH_LOGIN);
  };
  const renderItem = (text, path, icon, tooltip) => {
    const doPress = () => {
      console.log(screenSize);
      if (screenSize < 800) {
        handleToggleMenu(false);
      }
      if (path === PATH_SIGNOUT) {
        signOut();
      } else if (path === PATH_MAP) {
        console.log("map pressed");
      } else {
        history.push(path);
      }
      if (path === PATH_SEARCH) {
        ReactGA.event({
          category: 'User',
          action: 'Clicked SEARCH'
        });
      }
    };
    if (activeMenu) {
      return (
        <div
          className="sidebar-item"
          onClick={() => doPress()}
          onMouseOver={() => setHoverItem(text)}
          onMouseOut={() => setHoverItem(null)}
        >
          <div className="sidebar-icon mx-1">
            <img
              src={icon}
              className="sidebar-icon"
              style={{
                opacity:
                  hoverItem === text || location.pathname === path ? 1 : 0,
              }}
            />
          </div>
          {text}
          {hoverItem === "Interactive Map" && (
            <div>
              <img
                src={tooltip}
                alt=""
                style={{ marginTop: "55px", marginLeft: "-150px" }}
              />
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div
      className={
        activeMenu ? `${"sidebar-container"}` : `${"sidebar-container-sm"}`
      }
      style={activeMenu ? {} : { height:'37px' , width: '41px', left: '10px', top: '40px' }}
      id="sidebar"
    >
      {!activeMenu && (
        <div onClick={handleToggleMenu} className="h-100">
          <button
            className="p-2 rounded text-white center-btn"
            style={{ background: "none", border: "none", cursor: "pointer"}}
          >
            <AiOutlineMenu color="#000" size={25} style={{ top: "2px" }} />
          </button>
        </div>
      )}

      {activeMenu && (
        <div
          className="sidebar-logo-container"
          onClick={() => history.push(PATH_SEARCH)}
        >
          <div style={{ width: "150px", cursor: "pointer" }}>
            <Logo />
          </div>
        </div>
      )}
      {agent?.role === "admin"
        ? renderItem("Admin", PATH_ADMIN, adminIcon)
        : ""}
      {renderItem("Search", PATH_SEARCH, searchIcon)}
      {renderItem("Interactive Map", PATH_MAP, mapIcon, comingSoon)}
      {renderItem(agent?.role === "admin" ? "Users" : "Clients", PATH_CLIENTS, customersIcon)}
      {renderItem("Reservations", PATH_RESERVATIONS, reservationsIcon)}
      {renderItem("Reports", PATH_REPORTS, reportsIcon)}
      {renderItem("Profile", PATH_PROFILE, profileIcon)}
      {renderItem("Get In Touch", PATH_INTOUCH, getInTouchIcon)}
      {renderItem("FAQs", PATH_FAQ, faqIcon)}
      {screenSize < 800 && renderItem("Collections", PATH_COLLECTIONS, adminIcon)}
      {screenSize < 800 && renderItem("Wish-List", PATH_WISH_LIST, adminIcon)}
      {screenSize < 800 && renderItem("Favorites", PATH_FAVORITES, adminIcon)}
      {screenSize < 800 &&
        renderItem("Hot Destinations", PATH_HOT_DESTINATIONS, adminIcon)} 

      {agent?.role === "tal"
        ? renderItem("Shub Panel", PATH_SHUB, adminIcon)
        : ""}
      {renderItem("Sign Out", PATH_SIGNOUT, adminIcon)}
    </div>
  );
};

export default Sidebar;
