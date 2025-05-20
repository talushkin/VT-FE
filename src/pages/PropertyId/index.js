import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import constants, { PATH_PROPERTY } from "../../Util/constants";
import axios from 'axios';
import LoadingBox from "../../components/LoadingBox";

const PropertyId = (props) => {
  const token = localStorage.getItem("jToken");
  const { noMenu, dateFrom, dateTo, 
    adults, children,currency, agent, agency}=props
  const { id } = useParams(); // Get the property ID from the URL
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [loadedProperty, setLoadedProperty] = useState(null);

  const loadProp = async (propertyId) => {
    try {
      console.log("Fetching property data for ID:", propertyId);

      const token2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

      const reqInstance = axios.create({
        headers: { Authorization: `Bearer ${token2}` }
      });

      const filter_ids = `[{"field":"ids", "operator":"$in", "value": ["${propertyId}"]}]`;
      const params = { filters: filter_ids, limit: 1, skip: 0 };
      const queryString = new URLSearchParams(params).toString();
      const shubSearch = constants.SHUB_URL+'/local/listings?';

      const response = await reqInstance.get(`${shubSearch}${queryString}`);
      const res = response.data;

      if (res?.listings?.length > 0) {
        const storedProperty = res.listings[0];
        setLoadedProperty(storedProperty);
        setLoading(false);
        console.log('should go to property page',propertyId,storedProperty)
        const { 
          xdata, fullCalendar, activeRatePlan, channelSource,   currency
        }=storedProperty
        const property=storedProperty.listing
          history.push({
            pathname: `${PATH_PROPERTY}`,
            state: {
              property,
              xdata,
              agent,
              agency,
              currency,
              fullCalendar,
              activeRatePlan: activeRatePlan.id?activeRatePlan.id:'',
              channelSource,
              noMenu:true,
              isLoading:false
            },
          })
      } else {
        console.log("Property not found.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadedProperty) {
      loadProp(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  return (
    <>
      {loading ? <LoadingBox visible={true} /> : <div>Property Loaded Successfully</div>}
    </>
  );
};

export default PropertyId;
