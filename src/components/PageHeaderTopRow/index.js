  import React, { useState, useEffect } from "react";
  import { useDispatch } from "react-redux";
  import { useHistory, useLocation } from "react-router-dom";
  import headerSearch from "../../assets/icons/header-search.png";
  import favorite from "../../assets/icons/favorite.png";
  import likeFull from "../../assets/icons/like-full.png";
  import guests from "../../assets/icons/guests.png";
  import {
    PATH_COLLECTIONS,
    PATH_FAVORITES,
    PATH_HOT_DESTINATIONS,
    PATH_LOGIN,
    PATH_WISH_LIST,
  } from "../../Util/constants";
  import * as userActions from "../../store/redux/User/actions";
  import { getStorageValue } from "../../Util/general";
  import "./PageHeaderTopRow.scss";

  const PageHeaderTopRow = (props) => {
    const { style, onToggleSearch, bgColor } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const isFavorite = location.pathname === "/favorites";
    const token = localStorage.getItem("jToken");
    const screenSize = localStorage.getItem("screenSize");
    const [logo, setLogo] = useState([]);
    const signOut = () => {
      localStorage.clear();

      dispatch(userActions.signOut());
      history.push(PATH_LOGIN);
    };
    const toggleSearch = () => {
      // 👇️ passed function to setState
      onToggleSearch((current) => !current);
      //console.log("switch!");
    };
    
    const innerStyle = style || {
      backgroundColor: bgColor || "transparent",
    };
    const agency = getStorageValue('travelAgency')?JSON.parse(localStorage.getItem('travelAgency')):{};
    const agent = getStorageValue('agent')?JSON.parse(localStorage.getItem('agent')):{};
    
    //console.log(agency, "agency")
    const user_image = agency?.userImage;
    const userImage = localStorage.getItem("user_image");
    useEffect(() => {
      setLogo(userImage !== null ? userImage : agent?.userImage);
    }, []);
    return (
      <div className="search-header-top-row row-sm-7">
          <div className="search-header-top-row-logo-container">
        <img style={{ maxHeight: "35px" }} src={logo || guests} alt="Logo" />
        <span>
          Hello,{" "}
          {token !== null
            ? `${agent?.firstName || ""} ${
                !agent?.agencyName ? "" : "(" + agent?.agencyName + ")"
              }`
            : "Guest!"}
        </span>
      </div>
        {screenSize > 1000 ? (
          <div className="search-header-top-row-buttons gap-3">
            {/* <div
              className="search-header-top-row-button col mb-2"
              style={{ color: "#89FE89" }}
            >
              <img
                src={headerSearch}
                onClick={toggleSearch}
                style={{ width: "22px" }}
                alt=""
              />
              &nbsp;Search
            </div> */}
            <span
              className="search-header-top-row-button colpage-header-top-row2-button mb-2 "
              onClick={() => history.push(PATH_COLLECTIONS)}
            >
              Collections
            </span>

            <span className="separator"></span>

            <span
              className="search-header-top-row-button colpage-header-top-row2-button mb-2 "
              onClick={() => history.push(PATH_HOT_DESTINATIONS)}
            >
              Hot Destinations
            </span>

            <span className="separator"></span>

            <span
              className="search-header-top-row-button colpage-header-top-row2-button mb-2"
              onClick={() => history.push(PATH_WISH_LIST)}
            >
              Wish List
            </span>

            <span className="separator"></span>
            
            <span
              className="search-header-top-row-button colpage-header-top-row2-button mb-2"
              onClick={() => history.push(PATH_FAVORITES)}
            >
              <img
                src={isFavorite ? likeFull : favorite}
                style={{ height: "20px" }}
              />
              &nbsp; Favorite
            </span>

            <span className="separator"></span>

            <span
              className="search-header-top-row-button colpage-header-top-row2-button mb-2"
              onClick={signOut}
            >
              Log Out
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  export default PageHeaderTopRow;
