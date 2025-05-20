import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import "./Link.scss";
import LoadingBox from "../../components/LoadingBox/index.js";
import { baseURL } from "../../core/index.js";
import axios from "axios";
import countryList from "../../Util/data/countries.json";
import { PATH_PROPERTY } from "../../Util/constants";
import dayjs from 'dayjs'

const Link = (props) => {
  const loggedRef = useRef(false); // Initialize the useRef hook

  if (!loggedRef.current) {
    loggedRef.current = true; // Set ref to true after logging
  }

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const property = location?.state && location?.state?.property;
  const ref = React.createRef();
  const currencySymbol = countryList.find(({ currency }) => {
    return currency.code === property?.prices?.currency;
  });

  const searchParams = new URLSearchParams(location.search);


  useEffect(() => {
    const fetchLinkData = async () => {
      setLoading(true);

      try {
        const pathSegments = location.pathname.split("/");
        const linkId = pathSegments[pathSegments.length - 1];

        const response = await axios.get(`${baseURL}/pdf/get-links-email/${linkId}`);
        setLoading(false);
        if (response.data && response.data.propertyId) {
          const { propertyId, children, dateTo, dateFrom, adults, property, agencyId, agentId } = response.data
          console.log('link data:', response.data)
          localStorage.setItem("agent_id", agentId);
          localStorage.setItem("agency_id", agencyId);
          localStorage.setItem("propertyId", propertyId);
          localStorage.setItem("children", children);
          localStorage.setItem("noMenu",true)
                    // Check if the date is in the past and within the current month
          const dayIs = dayjs(); //today
          const currentDate = dayIs.format("YYYY-MM-DD");
          console.log('today:', currentDate,dateFrom, dateTo)
          const dayFrom = dayjs(dateFrom)
          const dayTo = dayjs(dateTo)

          if (dayIs.isBefore(dayFrom, 'day')) {
            localStorage.setItem("dateFrom", dateFrom);
            console.log('setting date', dateFrom)
          } else {
            console.log('link dateFrom is for past date, reseting dates')
          }

          if (dayIs.isBefore(dayTo, 'day')) {
            localStorage.setItem("dateTo", dateTo);
            console.log('setting date', dayTo)
          } else {
            console.log('link dateTo is for past date, reseting dates')
          }


          localStorage.setItem("adults", adults);
          localStorage.setItem("property", JSON.stringify(property));
          history.push({
            pathname: `${PATH_PROPERTY}/${propertyId}`,
            state: {
              noMenu: true,
              isLoading: true,
            },
          });
        }
      } catch (error) {
        console.error("Email Error:", error);
      } finally {
        setLoading(false);

      }
    };

    fetchLinkData();
  }, [location, history]);


  return (
    <>
            <LoadingBox visible={loading} />
    </>
  );
};

export default Link;
