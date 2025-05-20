import { useEffect, useState } from 'react';
import { calculateTotalNights, isPercentage } from '../Util/general';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';

import taxesNames from "../Util/data/taxesNames.json";
//import moment from "moment/moment";
import constants from '../Util/constants';

function makeCalculations(props) {
  const { property, activeRatePlan, fullCalendar, dateFrom, dateTo, adults = 1, children = 0, currency = 'USD', reservation_id = 'xxxx' } = props

  const client = localStorage.getItem("selectedClient") ? JSON.parse(localStorage.getItem("selectedClient")) : {}
  let calculated = false;

  let totalAF = 0;
  let totalAFRES = 0;
  let totalAmount = 0
  let security = 0
  let totalAmountRES = 0
  let totalTaxes = 0
  let totalTaxesRES = 0
  let exchangeRate = 1
  let externalPrice = null
  let propertyExchangeRate = 1
  let agencyCommission = 0
  let agencyCommissionRES = 0
  let taxesArray = [];
  let resPayload = {}
  let dailyRatesRES = [];
  let taxesArrayRES = [];
  let getPrices = {};
  let exchangeRates = JSON.parse(localStorage.getItem("exchange") || "[]")
  let accommodates = adults + children || 1;
  let accountId = property?.accountId;
  let RatePlanCode = activeRatePlan
  let propertyId = property?._id
  let isSH = propertyId ? propertyId.substring(0, 2) === 'sh' : false
  let propertyTitle = property?.title
  let todayDate = new Date()
  let propertyCurrency = property?.prices?.currency
  let divider = (accountId === '585a39dbe43900100017e9e8') ? 0.86 : 0.78;
  let nights = calculateTotalNights(dateFrom, dateTo);
  let error = []
  let loadingPrice = isSH && dateFrom && dateTo && !localStorage.getItem("totalExPrice")

  function getExchangeRate(cur) {
    return exchangeRates.find(
      (rate) => rate.currency_code === cur
    )?.conversion_rates || 1;
  }

  function getTaxPerType(taxType) {
    return taxesNames.find(
      (tax) => tax.type === taxType
    ) || {};
  }

  function getEXprice() {
    if (!isSH || !loadingPrice) {
      console.log('waiting...')
    } else {
      console.log('getting Xprices:', propertyId)
      localStorage.removeItem("totalExPrice")
      // localStorage.setItem('expriceloading', true)
      let data = JSON.stringify({
        "dateFrom": dateFrom,
        "dateTo": dateTo,
        "currency": currency,
        "adults": adults,
        "children": 0
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: constants.SHUB_URL+'/qoute/' + propertyId,
        headers: {
          'Authorization': 'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImlzc3VlZCI6IjE2NzUxMTI3NDYxMzYiLCJleHAiOjE2NzUxMTI4MDYsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6ImVmNzY1MDIyLTZhNzctNGZkMy04Njg1LTFhZTFhZmEzOTJhZSIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.N9MIeiLyrT3hBUtMJsTvwbYW5Z_o7ZSBuZmir2ytrb8DiE4MoXcmh8C6KriWhmnRqUnSMBRtuLcauVbqjFTorOcWMOd2RQGmisPgXBm1tHT30Hl0i57rQuLZHAVW201ot-TdQwW9oEZ3n2HTGu_A6tRhTizVmG6NRAd5KhOB2_c',
          'Account-Id': '640625ea0620e40031b8597d',
          'Content-Type': 'application/json',
        },
        data: data
      };
      console.log('qoute:', config)
      axios.request(config)
        .then((response) => {
          console.log('exPrice:', response.data, JSON.stringify(response.data));
          externalPrice = response?.data?.qouteResult
          loadingPrice = false;
          const resSuccess = externalPrice?.qouteResult?.available
          if (externalPrice) {
            console.log('get XPrices: success, USD', externalPrice.qouteResult?.success, externalPrice.qouteResult.prices?.priceInUSD)
            if (externalPrice.qouteResult?.success) {
              totalAmount = parseInt(externalPrice.qouteResult.prices?.priceInUSD)
              totalTaxes = 0
              taxesArray = externalPrice?.qouteResult?.taxes
              console.log('total,success:', totalAmount, resSuccess)
              localStorage.setItem('totalExPrice', totalAmount)
              localStorage.setItem('EXtaxesArray', JSON.stringify(taxesArray))
              localStorage.removeItem('EXPriceError')
              if(typeof props.setTotalExPrice !== 'undefined') {
                props.setTotalExPrice(totalAmount)
              }
            }
            if (externalPrice?.qouteResult?.error) {
              error.push(externalPrice?.qouteResult?.error[0])
              localStorage.setItem('totalExPrice', 0)
              localStorage.setItem('EXtaxesArray', JSON.stringify([]))
              localStorage.setItem('EXPriceError', externalPrice?.qouteResult?.error[0] || '')
              if(typeof props.setTotalExPrice !== 'undefined') {
                props.setTotalExPrice(0)
              }
              
            }
          }
          agencyCommission = totalAmount / 10;
          agencyCommissionRES = totalAmountRES / 10;
        
          const price = {
            loadingPrice,
            currency,
            exchangeRate,
            propertyExchangeRate,
            //reservation_id,
            totalAmount,
            totalTaxes,
            taxesArray,
            agencyCommission,
          }
        
          const success = (!error)
          console.log('price return:', price)
          return {
            loadingPrice,
            error,
            calculated,
            success,
            reservation_id,
            totalAmount,
            security,
            totalTaxes,
            taxesArray,
            agencyCommission,
            totalAmountRES,
            totalTaxesRES,
            taxesArrayRES,
            agencyCommissionRES,
            exchangeRate,
            propertyExchangeRate,
            resPayload
          }
        })
        .catch((errorRes) => {
          console.log('API error:', errorRes);
          error = errorRes[0]
        });
    }

    // return ('some error fetching')

  }


  const addToDailyRates = (day) => {
    //console.log(tax,taxesArray)
    dailyRatesRES.push(day)
  }
  const addToTaxes = (tax) => {
    //console.log(tax,taxesArray)
    taxesArray.push(tax)
  }
  const addToTaxesRES = (taxRES) => {
    //console.log(taxRES,taxesArrayRES)
    taxesArrayRES.push(taxRES)
    //setTaxesArrayRES([...taxesArrayRES,taxRES])
  }


  // start calculation

  exchangeRate = getExchangeRate(currency);

  propertyExchangeRate = getExchangeRate(property?.prices?.currency); //set property exchange rate

  const multiplier = (exchangeRate / propertyExchangeRate) / divider; //main multiplier = for selected currency
  // console.log('currency:', currency, selectedCurrencyRate, divider)
  if (property && (!dateFrom || !dateTo)) { // means return PRICE PER NIGHT only from base price.
    totalAmount = property?.prices?.basePrice * multiplier;
    localStorage.removeItem('SH_PROP') //remove from local.
    localStorage.removeItem('totalExPrice')
  } else if (property && dateFrom && dateTo && fullCalendar && !isSH) {
    let notAvail = false
    let sum = 0;
    let currentDate = dayjs(dateFrom);
    const toDate = dayjs(dateTo);

    while (currentDate.isBefore(toDate, 'day')) {
      const formattedDate = currentDate.format('YYYY-MM-DD');
      const formattedNextDate = currentDate.add(1, 'day').format('YYYY-MM-DD');
      const selectedDay = fullCalendar ? fullCalendar
        .filter((period) => dayjs(period?.date).isSame(formattedDate, 'day')) : null

      // console.log('day or res:', formattedDate, selectedDay)
      if (!selectedDay) {
        error.push({ error: 'could not find day in the fullCalendar: ' + formattedDate + ' id:' + property._id })
        return { error }
      }
      if (selectedDay && Array.isArray(selectedDay)) {
        //  console.log('sel:',selectedDay)

        // if (Object.prototype.hasOwnProperty.call(selectedDay[0], 'allotment')) {
        if (!selectedDay[0]?.allotment) {
          error.push({ error: 'day is not available: ' + formattedDate + ' id:' + property._id })
          notAvail = true
        }
      } else {
        //console.log('sel:',selectedDay)
        error.push({ error: 'could not find day allotment in the fullCalendar: ' + formattedDate })
        notAvail = true
      }

      const selectedPrice = selectedDay.map((period) => period.price);
      if (selectedPrice) {
        sum += selectedPrice[0];
        addToDailyRates({
          price: selectedPrice[0],
          EffectiveDate: formattedDate,
          ExpireDate: formattedNextDate
        }
        );
        ;
      } else {
        error.push({ error: 'day price is not available: ' + formattedDate })
        return { error }
      }
      currentDate = currentDate.add(1, 'day');
    }

    let extraGuests = accommodates - (property?.prices?.guestsIncludedInRegularFee || 0);
    if (extraGuests < 0) extraGuests = 0;
    const extraPersonFee = property?.prices?.extraPersonFee || 0;
    const extraGuestsTotalFee = extraGuests * extraPersonFee * nights;

    sum += extraGuestsTotalFee;

    if (nights >= 28 && property?.prices?.monthlyPriceFactor) {
      sum *= property?.prices?.monthlyPriceFactor;
    } else if (nights >= 7 && property?.prices?.weeklyPriceFactor) {
      sum *= property?.prices?.weeklyPriceFactor;
    }

    let totalTaxPrice = 0;
    let taxes = property?.taxes?.length > 0 ? property?.taxes : [];
    taxesArrayRES.length = 0
    taxesArray.length = 0
    // CF
    addToTaxes(
      {
        amount: sum * multiplier,
        description: "Accomodation Fare",
        initial: "AF"
      }
    )
    if (property?.prices?.cleaningFee) {
      //setTaxesArray(prev => ({ ...prev, 'Cleaning Fee': property?.prices?.cleaningFee * multiplier }));
      totalTaxPrice = property?.prices?.cleaningFee
      addToTaxes(
        {
          amount: property?.prices?.cleaningFee * multiplier,
          description: "Cleaning Fee",
          initial: "CF"
        }
      )
      // on res
      addToTaxesRES(
        {
          amount: property?.prices?.cleaningFee,
          description: "Cleaning Fee",
          initial: "CF"
        }
      )
    }
    //console.log('accomodates:', accommodates)
    taxes.forEach((item) => {
      let taxAmount = 0;
      //console.log(item)
      if (isPercentage(item?.units)) {
        taxAmount = (sum * item?.amount) / 100;
      } else {
        switch (item.quantifier) {
          case 'PER_STAY':
            taxAmount = item.amount;
            break;
          case 'PER_GUEST':

            taxAmount = item.amount * accommodates;
            break;
          case 'PER_NIGHT':
            taxAmount = item.amount * nights;
            break;
          case 'PER_GUEST_PER_NIGHT':
            taxAmount = item.amount * accommodates * nights;
            break;
          default:
            break;
        }
      }
      //setTaxesArray(prev => ({ ...prev, [item.type]: taxAmount * multiplier }));
      addToTaxesRES(
        {
          amount: taxAmount * multiplier,
          description: getTaxPerType(item.type).description,
          initial: getTaxPerType(item.type).initial
        }
      )
      addToTaxes(
        {
          amount: taxAmount,
          description: getTaxPerType(item.type).description,
          initial: getTaxPerType(item.type).initial
        }
      );
      totalTaxPrice += taxAmount
    });
    if (property?.prices?.securityDepositFee) {
      const deposit = property?.prices?.securityDepositFee
      security = deposit * multiplier
      localStorage.setItem('security', deposit * multiplier)
      console.log('security:', deposit, property?.prices?.currency, 'in ', currency, deposit * multiplier)

      // addToTaxes(
      //   {
      //     amount: deposit * multiplier,
      //     description: "Security deposit (returned to client at end of stay)",
      //     initial: "SE"
      //   }
      // )
    }
    totalAF = sum * multiplier;
    totalAFRES = sum;
    totalAmountRES = sum + totalTaxPrice;
    totalTaxes = totalTaxPrice * multiplier;
    totalAmount = (sum + totalTaxPrice) * multiplier;
    totalTaxesRES = totalTaxPrice;
    // totalAF = notAvail ? 0 : sum * multiplier;
    // totalAFRES = notAvail ? 0 : sum;
    // totalAmountRES = notAvail ? 0 : sum + totalTaxPrice;
    // totalTaxes = notAvail ? 0 : totalTaxPrice * multiplier;
    // totalAmount = notAvail ? 0 : (sum + totalTaxPrice) * multiplier;
    // totalTaxesRES = notAvail ? 0 : totalTaxPrice;

    addToTaxesRES(
      {
        amount: -(sum + totalTaxPrice) / 10,
        description: "Prededucted Host Channel Fee",
        initial: "PCM"
      }
    )
  };

  calculated = true
 

  //resPayload = buildRESPayload()
  if (isSH && dateFrom && dateTo && localStorage.getItem("totalExPrice")) {
    totalAmount = localStorage.getItem("totalExPrice") ?
      parseInt(localStorage.getItem("totalExPrice")) * multiplier : 0
    totalTaxes = 0
    loadingPrice=false
    console.log('return exPrice!', loadingPrice, totalAmount)
  } else
  if (isSH && !externalPrice && dateFrom && dateTo&& !localStorage.getItem("totalExPrice")) { // if dates selected and SH and did not get price from API yet...
    if (!externalPrice) {
      loadingPrice=true
      getEXprice()
    } else {loadingPrice=false

    }
  } 

  
  

  agencyCommission = totalAmount / 10;
  agencyCommissionRES = totalAmountRES / 10;

  const price = {
    loadingPrice,
    currency,
    exchangeRate,
    propertyExchangeRate,
    //reservation_id,
    totalAmount,
    totalTaxes,
    taxesArray,
    agencyCommission,
  }

  const success = (!error)
  console.log('price return:', price)
  return {
    loadingPrice,
    error,
    calculated,
    success,
    reservation_id,
    totalAmount,
    security,
    totalTaxes,
    taxesArray,
    agencyCommission,
    totalAmountRES,
    totalTaxesRES,
    taxesArrayRES,
    agencyCommissionRES,
    exchangeRate,
    propertyExchangeRate,
    resPayload
  }
}

export default makeCalculations;
   