import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { PATH_PROPERTY } from "../../Util/constants";
import * as propertyActions from "../../store/redux/Property/actions";

const PropertyClient = () => {
  const { id } = useParams(); // Get the property ID from the URL
  const dispatch = useDispatch();
  const history = useHistory();

/*   const loadClient = () => { //load client per agentId and customerEmail
    AuthService.GetClientCstApi(
      '',
      searchInputes.customerEmail,
      agentId
    )
      .then((response) => {
        if (response) {
          setClients(response.clients);
          setSortedClients(response.clients);
          setTotalClients(response.totalClient); // Set total clients
          if (response.clients.length === 0) {
            swal({
              show: true,
              icon: "error",
              title: "Oops!!",
              text: "No Data Found",
            });
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }; */

  useEffect(() => {
    const loadAndNavigate = async () => {
      console.log("Loading property with ID:", id);
      await dispatch(propertyActions.loadProperty(id)); // Fetch property data and save to localStorage

      const storedProperty =localStorage.getItem("property")? JSON.parse(localStorage.getItem("property")):{};
      console.log(storedProperty);
      if (storedProperty) {
        const { listing, xdata, fullCalendar } = storedProperty;

        if (listing && xdata && fullCalendar) {
          console.log("Property loaded:", listing, xdata, fullCalendar);
          localStorage.setItem("propertyId", id);
          localStorage.setItem("minNights", listing.terms.minNights);

          history.replace({
            pathname: `propertyClient/${id}`,
            state: {
              property: listing,
              xdata,
              fullCalendar,
              noMenu:true,
            },
          });
        } else {
          console.error("Incomplete property data");
        }
      } else {
        console.error("Property not found in localStorage");
      }
    };

    loadAndNavigate();
  }, [id, dispatch, history]);

  return null; // This component does not render anything
};

export default PropertyClient;
