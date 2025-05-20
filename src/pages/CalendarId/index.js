import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { PATH_CALENDAR } from "../../Util/constants";
import * as propertyActions from "../../store/redux/Property/actions";
import axios from 'axios'
import LoadingBox from "../../components/LoadingBox";
import constants from "../../Util/constants";
const CalendarId = (props) => {

  const {
    xdata,
    property,
    fullCalendar,
    noMenu,
    dateFrom,
    dateTo,
    adults,
    children,
    activeRatePlan,
    channelSource,
    agency,
    agent,
    totalPrice,
    agencyCommision,
    currency
  } = props

  const { id } = useParams(); // Get the property ID from the URL
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false)

  const loadProp = async (propertyId) => {
    if (loading) {
      return{}
    }
    const token2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

    const reqInstance = axios.create({
      headers: {
        Authorization: `Bearer ${token2}`
      }
    });

    const filter_ids = '[{"field":"ids", "operator":"$in", "value": ["' + propertyId + '"]}]';

    const params = {
      filters: filter_ids,
      limit: 1,
      skip: 0,

    };
    // q: localStorage.getItem("destination"),
    //available:available,
    console.log('reading from SHUB: ',params)
    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    const shubSearch = constants.SHUB_URL+'/local/listings?';
    return await reqInstance.get(`${shubSearch}${queryString}`)
      .then(async response => {
        const res = response.data;
        setLoading(true)
          //console.log('loaded?', res,response,res?.listings[0])
          let storedProperty=res?.listings[0]
            if (storedProperty) {
              const { listing, xdata, fullCalendar, activeRatePlan, channelSource } = storedProperty;
      
              if (listing?._id === id) { //property Id = the one we want
                console.log('the id is same as on the memory, pushing data to property page')
                if (listing && xdata && fullCalendar && activeRatePlan) {
                  if (noMenu) { localStorage.setItem('noMenu', true) }
                  if (dateFrom) { console.log('dateFrom', dateFrom) }
                  if (dateTo) { console.log('dateTo', dateFrom) }
                  if (adults) { console.log('adults', adults) }
                  if (children) { console.log('children', children) }
                  console.log("Property loaded:", listing, xdata, fullCalendar, activeRatePlan.id, channelSource)
                  // setting local Storaged and pushing to property page!
                  localStorage.setItem("activeRatePlan", activeRatePlan.id);
                  localStorage.setItem("channelSource", channelSource);
                  localStorage.setItem("propertyId", id);
                  localStorage.setItem("currency", currency);
                  localStorage.setItem("minNights", listing.terms.minNights);

                  history.push({
                    pathname: `${PATH_CALENDAR}`,
                    state: {
                      property: listing,
                      xdata,
                      agent,
                      agency,
                      currency,
                      fullCalendar,
                      activeRatePlan: activeRatePlan.id,
                      channelSource,
                      noMenu,
                      isLoading:true
                    },
                  })
                }
              } else { console.log('worng id on memory') }
            } else {
              console.log('did not load prop ... ')
            }
      })
      .catch(response => {
        console.log('error on read prop:',response);
        return {}
      })
  }

  localStorage.setItem("noMenu",true)
  if (noMenu) { console.log('seems as Links:', noMenu, dateFrom, dateTo, children) }
  if (!(property || xdata || loading)) {
    console.log('did not get property data or xdata')
    console.log("Loading calendar of property ID:", id, loading);
    
    if (!loading) {
      //setLoading(true)
      loadProp(id)
    }
    
    }

    if (property?._id === id) { //property Id = the one we want
      console.log('the id is same as on the memory, pushing data to property page')
      if (property && xdata && fullCalendar && activeRatePlan) {
        if (noMenu) { localStorage.setItem('noMenu', true) }
        if (dateFrom) { console.log('dateFrom', dateFrom) }
        if (dateTo) { console.log('dateTo', dateFrom) }
        if (adults) { console.log('adults', adults) }
        if (children) { console.log('children', children) }
        console.log("Property data loaded:", property, xdata, fullCalendar, activeRatePlan.id, channelSource)
        // setting local Storaged and pushing to property page!
        localStorage.setItem("activeRatePlan", activeRatePlan.id);
        localStorage.setItem("channelSource", channelSource);
        localStorage.setItem("propertyId", id);
        localStorage.setItem("currency", currency);
        localStorage.setItem("minNights", property.terms.minNights);
        setLoading(false)
        localStorage.setItem("noMenu",true)
        history.push({
          pathname: `${PATH_CALENDAR}`,
          state: {
            property,
            xdata,
            agent,
            agency,
            currency,
            fullCalendar,
            activeRatePlan: activeRatePlan.id,
            channelSource,
            noMenu:true,
            isLoading:false
          },
        })
      }
    }
    console.log('calendarId page!')
   
    return (
      <>
              <LoadingBox visible={!loading} />
      </>
    
    )
  };


  export default CalendarId