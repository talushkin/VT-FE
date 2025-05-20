import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import goBack from "../../assets/go-back.svg";
import creditCardsIcon from "../../assets/Image_36.png";
import "./PropertyReserve.scss";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import numeral from "numeral";
import countryList from "../../Util/data/countries.json";
import CountriesPhones from "../../Util/data/CountriesPhones.json";
import { IoMdAddCircle } from "react-icons/io";
import AuthService from "../../services/auth.service";
import swal from "sweetalert";
//import moment from "moment/moment";
import { userRequest } from "../../api/requestMethods";
import {
  calculateTotalNights,
  detectCurrency,
  isPercentage,
} from "../../Util/general";
import NameSelect from "../../components/Forms/Fields/NameAutoComplete/NameSelect";
import DropdownInput from "../../components/Forms/Fields/DropdownInput/DropdownInput.jsx";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import ReactGA from "react-ga4";
import makeCalculations from "../../Hooks/makeCalculations.jsx";
import AddSubClientModel from "./AddSubClientModel"; // Import the component
import constants from "../../Util/constants.js";
import Icon from "react-web-vector-icons";
import EditClient from "../Clients/EditClient/index.js";
import GroupPayments from "./grouppaymentmodel/index.js";

const PropertyReservationPage = (props) => {
  const { xdata, exchangeRate } = props
  
  const location = useLocation();
  const history = useHistory();
  
  //const agent = useState(JSON.parse(localStorage.getItem('agent')));
  const agentData = useState(JSON.parse(localStorage.getItem('agent')));
  const agent = agentData[0]?agentData[0]:agentData;

  const noMenu = useState(localStorage.getItem('noMenu'))
  const agentEmail = agent ? agent.email : '';
  const agency = JSON.parse(localStorage.getItem('travelAgency'));
  const startDate = dayjs(localStorage.getItem("dateFrom")).format('YYYY-DD-MM');
  const endDate = dayjs(localStorage.getItem("dateTo")).format('YYYY-DD-MM');
  const [bookingUUID, setBookingUUID] = useState(null)
  const [showsubClients, setShowsubClients] = useState(false)
  const [property, setProperty] = useState(() => {
    const storedProperty = localStorage.getItem("property");
    return location.state && location.state.property
      ? location.state.property
      : storedProperty
        ? JSON.parse(storedProperty).listing
        : {};
  });
  const fullCalendar = location?.state && location?.state?.fullCalendar;
  const activeRatePlan = location?.state && location?.state?.activeRatePlan;
  const blocked = fullCalendar
    ? fullCalendar.filter((element) => element?.allotment === 0)
    : [];
  const blockedDates = blocked.map((x) => x.date.substring(0, 10))
  const [onDemand] = useState(property?.tags?.indexOf("onDemand") > -1)
  const calculatedAmount = location?.state?.price
  const selectedNights = location?.state?.nights
  const searchParams = new URLSearchParams(location.search)
  const isBookConfirmed = searchParams.get("confirmed") ? true : false
  const selectedCurrency = location.state?.selectedCurrency || ''
    const [reservationID, setReservationID] = useState(null);
  let price = useState(makeCalculations({
    property,
    reservation_id: reservationID,
    fullCalendar,
    activeRatePlan,
    dateFrom: localStorage.getItem("dateFrom"),
    dateTo: localStorage.getItem("dateTo"),
    children: parseInt(localStorage.getItem("children") || "0"),
    adults: parseInt(localStorage.getItem("adults") || "1"),
    currency: selectedCurrency || "USD",
  }));
  //console.log(price)
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [formDataError, setFormDataError] = useState({
    firstNameError: "",
    lastNameError: "",
    addressError: "",
    emailError: "",
    phoneError: "",
    cityError: "",
    countryError: "",
  })
  const [smallScreen, setSmallScreen] = useState(false);
  const [screenSize, setScreenSize] = useState(null);
  const [rulesArray, setRulesArray] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(
    isBookConfirmed ? "hold" : "wire"
  );
  const [clients, setClients] = useState(null);
  const [picIndex, setPicIndex] = useState(0);
  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    client_id: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [processing, setProcessing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [flywireData, setFlywireData] = useState(null);
  const [renderedCurrency, setRenderedCurrency] = useState('')
  const [selectedClientToEdit, setSelectedClientToEdit] = useState(null);

  const [showGroupPayments, setShowGroupPayments] = useState(false);
  const [isGrpPayments, setIsGrpPayments] = useState(false)
  const [groupPaymentDetails, setGroupPaymentDetails] = useState([])
  const [group_id, setGroup_id] = useState(null)
  const [group_idempotent, setGroup_idempotent] = useState(null)
  const [group_link, setGroup_link] = useState(null)
  const [group_user_id, setGroup_user_id] = useState(null)

  //By Jaison
  const [guestId, setGuestId] = useState(null);
  useEffect(() => {
    // Check if the path includes the target string
    if (location.pathname.includes('request-to-book-flywire')) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const confirmationCode = urlParams.has('confirmation') ? urlParams.get('confirmation') : null
      const reference = urlParams.has('reference') ? urlParams.get('reference') : null
      const status = urlParams.has('status') ? urlParams.get('status') : null
      const amount = urlParams.has('amount') ? urlParams.get('amount') : null
      const payment_method = urlParams.has('payment_method') ? urlParams.get('payment_method') : null
      const sig = urlParams.has('sig') ? urlParams.get('sig') : null

      let reservationPayload = JSON.parse(localStorage.getItem('48holdreservationPayload'))
      reservationPayload.flywireReference = reference;
      reservationPayload.flywireStatus = status;
      reservationPayload.flywireAmount = amount;
      reservationPayload.flywirePaymentMethod = payment_method;
      reservationPayload.flywireSig = sig;
      console.log(reservationPayload)
      userRequest.post(
        "/reservation/add-reservation",
        reservationPayload
      ).then((response) => {
        if (response.status === 200) {
          // Show success toast
          toast.success("Reservation Completed!", {
            position: "top-right",
            toastClassName: "custom-toast",
          });
          
          // Redirect to the reservations page
          history.push("/reservations");
        } else {
          // Show error toast if the response is not successful
          toast.error("Reservation Failed!", {
            position: "top-right",
            toastClassName: "custom-toast",
          });
        }
      }).catch((error) => {
        // Handle errors and show an error toast
        console.error("Error adding reservation:", error);
        // toast.error("An error occurred while processing your reservation.", {
        //   position: "top-right",
        //   toastClassName: "custom-toast",
        // });
      });
    }
  }, [])



  

  const getCurrencyFromLocalStorage = () => {
    const currencyCode = localStorage.getItem("currency") || 'USD';
    const exchangeRates = JSON.parse(localStorage.getItem("exchange"));
    const selectedCurrency = exchangeRates?.find((currency) => currency.currency_code === currencyCode)
    return (
      selectedCurrency || {
        conversion_rates: 1,
        currency_code: property?.prices?.currency,
      }
    )
  }
  const totalPrice = location.state?.totalPrice || 0; // Access the passed total price
  const security = location.state?.security || 0; // Access the passed total price


  const formatCurrency = (amount) => {
    const { conversion_rates, currency_code } = getCurrencyFromLocalStorage();
    const convertedAmount = amount;
    return `${detectCurrency(currency_code)} ${parseInt(convertedAmount)}`;
  };

  const formatCurrencyInUSD = (amount) => {
    const exchangeRates = JSON.parse(localStorage.getItem("exchange"));
    const usdRate = exchangeRates.find((currency) => currency.currency_code === localStorage.getItem('currency'))||{currency_code:'USD',conversion_rates:1}
    console.log('USD RATE:',usdRate)
    const convertedAmount = amount / usdRate.conversion_rates;
    return parseInt(convertedAmount)
  };
  function json2array(json) {
    var result = [];
    if (!json) return result
    var keys = Object.keys(json);
    keys.forEach(function (key) {
      result.push(json[key]);
    });
    return result;
  }
  function getAdditionalFee() {
    if (!price) return {}
    if (!Array.isArray(price)) return {}
    //console.log('priceA:', price)
    if (Object.prototype.hasOwnProperty.call(price[0], 'taxesArray')) {
      if (!Array.isArray(price[0].taxesArray)) return {}
      const taxes = json2array(price[0].taxesArray)
      //console.log(taxes, 'reservation GS:', localStorage.getItem("resGS") ? JSON.parse(localStorage.getItem("resGS")).resPayload:'')
      if (!taxes) return {}
      if (Array.isArray(taxes)) {
        //console.log('reservation GS:', price[0].resPayload)
        return taxes.map((tax) => renderAdditionalFee(tax))
      }
    }

  }
// console.log('number of guests',localStorage.getItem("adults"), localStorage.getItem("children"))
const reservationPayload= {
  adults: parseInt(localStorage.getItem("adults") || "2"),
  children: parseInt(localStorage.getItem("children") || "0"),
  agencyName: agency?.agencyName,
  agency_id: agency?.agency_id,
  agent_id: agent?.agent_id,
  agentName: agent?.firstName,
  bookedAt: new Date(),
  destination: property?.address?.country ?? "",
  bookingId: `VT ${bookingUUID}`,
  cancellationFee: "0",
  cancellationPolicyCategory: "string",
  client_id: client.client_id,// || 123,
  confirmationCode: `VT ${bookingUUID}`,
  currency: localStorage.getItem("currency"),
  endDate:
    localStorage.getItem("dateTo") !== null &&
      localStorage.getItem("dateTo") !== undefined
      ? dayjs(localStorage.getItem("dateTo")).format("DD.MM.YYYY")
      : "",
  fees: "0",
  guestBookingStatus: "pending",
  guestEmail: client.email,
  guestFirstName: client.firstName,
  guestLastName: client.lastName,
  guestPhoneNumberCode: "0",
  guestPhoneNumbers: client.phone,
  guestPreferredLocale: "en",
  nightlyBasePrice: property?.prices?.basePrice / 0.86,
  nights: calculateTotalNights(),
  numberOfGuests: parseInt(localStorage.getItem("adults") || 2) + parseInt(localStorage.getItem("children") || 0),
  payment_type: paymentMethod,
  propertyId: property?._id,
  startDate:
    localStorage.getItem("dateFrom") !== null &&
      localStorage.getItem("dateFrom") !== undefined
      ? dayjs(localStorage.getItem("dateFrom")).format("DD.MM.YYYY")
      : "",
  status: "pending",
  taxAmount: 0,
  total: totalPrice,
  totalInUSD: formatCurrencyInUSD(totalPrice),
  securityDeposit: security,
  propertyName: property?.title,
  listing: property,
  agentEmail: agentEmail,
  isgrouppayment: isGrpPayments,
  grouppaymentdetails: groupPaymentDetails,
  group_id: group_id,
  group_idempotent: group_idempotent,
  group_link: group_link,
  group_user_id: group_user_id
}
  //console.log("rateplan", activeRatePlan);
console.log('reservationpayload', reservationPayload)
  useEffect(() => {
    const fetchData = async () => {
      const url =
        "https://backend.villatracker.com/reservation/next-reservation";

      try {
        const jToken = localStorage.getItem("jToken");
        if (!jToken) {
          console.error("No token found in localStorage");
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${jToken}`;

        const response = await axios.get(url);

        console.log(response, `next reservation is VillaTracker_${response?.data?.reservationID}`)
        setReservationID(response?.data?.reservationID)

      } catch (error) {
        console.error("API call error of get last reservation ID:", error);
        if (error.response) {
          console.error("Error response:", error.response);
        }
      }
    };
    fetchData()
    setPayloadRes (
       {
        adults: parseInt(localStorage.getItem("adults") || "2"),
        children: parseInt(localStorage.getItem("children") || "0"),
        agencyName: agency?.agencyName,
        agency_id: agency?.agency_id,
        agent_id: agent?.agent_id,
        agentName: agent?.firstName,
        bookedAt: new Date(),
        destination: property?.address?.country ?? "",
        bookingId: `VT ${bookingUUID}`,
        cancellationFee: "0",
        cancellationPolicyCategory: "string",
        client_id: client.client_id,// || 123,
        confirmationCode: `VT ${bookingUUID}`,
        currency: localStorage.getItem("currency"),
        endDate:
          localStorage.getItem("dateTo") !== null &&
            localStorage.getItem("dateTo") !== undefined
            ? dayjs(localStorage.getItem("dateTo")).format("DD.MM.YYYY")
            : "",
        fees: "0",
        guestBookingStatus: "pending",
        guestEmail: client.email,
        guestFirstName: client.firstName,
        guestLastName: client.lastName,
        guestPhoneNumberCode: "0",
        guestPhoneNumbers: client.phone,
        guestPreferredLocale: "en",
        nightlyBasePrice: property?.prices?.basePrice / 0.86,
        nights: calculateTotalNights(),
        numberOfGuests: parseInt(localStorage.getItem("adults") || "2") + parseInt(localStorage.getItem("children") || "0"),
        payment_type: paymentMethod,
        propertyId: property?._id,
        startDate:
          localStorage.getItem("dateFrom") !== null &&
            localStorage.getItem("dateFrom") !== undefined
            ? dayjs(localStorage.getItem("dateFrom")).format("DD.MM.YYYY")
            : "",
        status: "pending",
        taxAmount: 0,
        total: totalPrice,
        totalInUSD: formatCurrencyInUSD(totalPrice),
        securityDeposit: security,
        propertyName: property?.title,
        listing: property,
        agentEmail: agentEmail,
        guestId: guestId, //By Jaison
        isgrouppayment: isGrpPayments,
        grouppaymentdetails: groupPaymentDetails,
        group_id: group_id,
        group_idempotent: group_idempotent,
        group_link: group_link,
        group_user_id: group_user_id
      }
    )
    console.log('res payload:',reservationPayload)
    localStorage.setItem("reservationPayload",reservationPayload);
  }, [client]);

  useEffect(() => {
    countryList.map((el) => {
      if (el.currency.code === selectedCurrency) {
        setRenderedCurrency(el.currency.symbol)
      }
    })
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize < 992) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  }, [screenSize]);

  useEffect(() => {
    const loadFlywireSDK = () => {
      return new Promise((resolve, reject) => {
        if (window.FlywirePayment) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://payment.flywire.com/sdk/v1/flywire.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Error loading Flywire SDK"));
        document.body.appendChild(script);
      });
    };

    loadFlywireSDK()
      .then(() => {
        console.log("Flywire SDK loaded successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d)) {
      return new Date().toISOString().split("T")[0];
    }
    return d.toISOString().split("T")[0];
  };

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   console.log(urlParams);
  //   if (urlParams.get("status") === "success") {
  //     makeReservation();
  //   }
  // }, [location.search]);


  useEffect(() => {
    if (!property) {
      const storedProperty = localStorage.getItem("property");
      if (storedProperty) {
        setProperty(JSON.parse(storedProperty));
      }
    }
  }, [property]);

  const handleFlywirePayment = (bookingData) => {
    const appenv = 'prod'; //prod
    const selectedCountry = countryList.find(
      (country) => country.name === formData.country
    );
    const selectedCountryPhoneCode = CountriesPhones?.find(
      (country) => country.iso === selectedCountry.code
    );
    //console.log('phonePrefix:', selectedCountryPhoneCode)
    const countryCode = selectedCountry ? selectedCountry.code : "";
    const currency = localStorage.getItem('currency');
    // const totalPrice = Number(localStorage.getItem(`refreshPrice_${property?._id}`));
    const exchangeRates = JSON.parse(localStorage.getItem("exchange"));

    let recipientCode = 'UXH';
    let amount = formatCurrencyInUSD(totalPrice);
    if(appenv=='prod'){
      if(currency=='CHF'){
        recipientCode='RXH'; // For Live
      }else if(currency=='EUR'){
        recipientCode='UXH'//'YXH'; // For Live
      }else{
        recipientCode='UXH'; // For Live
      }
    } else if(appenv=='demo') {
      if(currency=='CHF'){
        recipientCode='SHE'; // For Demo
      }else if(currency=='EUR'){
        recipientCode='SHE'; // For Demo
      }else{
        recipientCode='SHE'; // For Demo
      }
    }
    // if (currency === 'CHF') {
    //   recipientCode = 'RXH';
    //   amount = parseInt(totalPrice)
      // const exchangeRate = exchangeRates.find(item => item.currency_code === 'CHF');
      // if (exchangeRate) {
      //   amount = Number(totalPrice) * Number(exchangeRate.conversion_rates);
      //   console.log(totalPrice, exchangeRate);
      // }
    // } else if (currency === 'EUR') {
    //   recipientCode = 'YXH'
    //   amount = parseInt(totalPrice)
      // const exchangeRate = exchangeRates.find(item => item.currency_code === 'EUR');
      // if (exchangeRate) {
      //   amount = totalPrice * exchangeRate.conversion_rates;
      // }
    // }

    if (window.FlywirePayment) {
      /*
      var config = {
  env: "demo",
  recipientCode: "Your Flywire Portal Code",

  // Specify the returnUrl or an onCompleteCallback handler
  returnUrl: "https://httpbin.org/get",

  // Other checkout parameters (e.g. pass some payer info and set requestPayerInfo to true)
  firstName: "John",
  lastName: "Doe",
  requestPayerInfo: true,

  // The amount to be held
  amount: 210.00,

  // Mark this payment as a pre-authorization 
  paymentAuthorization: {
      type: "pre_auth"
  },

  // It is strongly recommended that you process the payment callbacks (esp. the authorized charge callback)
  callbackId: "REF1234",
  callbackUrl: "https://api.yourdomain.com/flywire-notifications",
  callbackVersion: "2"
  http://localhost:3000/request-to-book-flywire/?confirmation=VT0111c722-9053-46dc-80af-59537587ec00&reference=SHE968697391&status=success&amount=46907&payment_method=credit_card&_=VT_0111c722-9053-46dc-80af-59537587ec00&sig=246c0291ea771224557a4734578b1fced2d28e58912b22ccd133400e6094d173
};
      */
    //  console.log('reservationpaylod res', payloadRes)
      const config = {
        env: appenv,
        recipientCode: recipientCode, //recipientCode,
        returnUrl: `${window.location.origin}/request-to-book-flywire/?confirmation=VT${bookingUUID}`,
        firstName: client.firstName,
        lastName: client.lastName,
        requestPayerInfo: true,
        amount: amount, 
        paymentAuthorization: {
          type: "pre_auth"
        },
        payment_method: {
          type: "card"
        },
        callbackId: `VT${bookingUUID}`,
        callbackUrl: "https://backend.villatracker.com/reservation/flywire-response",
        callbackVersion: "2",
        onSuccess: (data) => {
          console.log('Flywire Data:', data);
          localStorage.setItem('flywireData', data)
          setFlywireData(data);
          updateReservationPayload(data);
        },
        requestRecipientInfo: true,
        email: client.email,
        phone: '+' + selectedCountryPhoneCode?.phonecode + ' ' + client.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.postalCode,
        country: countryCode,
        recipientFields: {
          booking_reference: `VT${bookingUUID}`,
        },
        nonce: `VT${bookingUUID}`
      };
        // paymentOptionsConfig: {
        //   // Only allow local card and online payments
        //   filters: {
        //     type: ["bank_transfer", "credit_card", "online"]
        //   }
        // },
        // "payment_method": {
        //   "type": "credit_card"
        // },
        //amount: amount, //live
        // amount: amount, //dev
        // requestPayerInfo: true,
        // requestRecipientInfo: true,
        // firstName: client.firstName,
        // lastName: client.lastName,
        // email: client.email,
        // phone: '+' + selectedCountryPhoneCode?.phonecode + ' ' + client.phone,
        // address: formData.address,
        // city: formData.city,
        // state: formData.state,
        // zip: formData.postalCode,
        // country: countryCode,
        // // should the country prefix code like IL: +972
        // recipientFields: {
        //   booking_reference: `VT_${bookingUUID}`,
        // },
        // booking_reference: `${bookingUUID}`,
        // nonce: `VT_${bookingUUID}`,
        // returnUrl: `${window.location.origin}/request-to-book-flywire`,
        // callbackId: `VT${bookingUUID}`,
        // callbackUrl: "https://smilinghouse.ch/flywire/response.php",
        // callbackVersion: "2",
        // onSuccess: (data) => {
        //   console.log('Flywire Data:', data);
        //   setFlywireData(data);
        //   updateReservationPayload(data);
        // },
      

      ReactGA.event({
        category: 'User',
        action: 'Clicked: Hold 48Hrs'
      });
      console.log('config FLYWIRE:', config)
      var modal = window.FlywirePayment.initiate(config);
      modal.render();
    } else {
      console.error(
        "FlywirePayment is not defined. Ensure the SDK is loaded properly."
      );
    }
  };

  const updateReservationPayload = (data) => {
    const { payerDetails } = data;
    setPayloadRes((prevPayload) => ({
      ...prevPayload,
      guestFirstName: payerDetails.firstName,
      guestLastName: payerDetails.lastName,
      guestEmail: payerDetails.email,
      guestPhoneNumbers: payerDetails.phone,
      address: payerDetails.address,
      city: payerDetails.city,
      state: payerDetails.state,
      postalCode: payerDetails.zip,
      country: payerDetails.country,
    }));
  };

  const validateRequiredFields = () => {
    const errors = {
      firstNameError: !client.firstName ? "Please select a Client" : "",
      lastNameError: !client.lastName ? "Please select a Client" : "",
      addressError: !formData.address ? "Please enter your address" : "",
      emailError: !client.email ? "Please enter your email" : "",
      phoneError: !client.phone ? "Please enter your phone number" : "",
      cityError: !formData.city ? "Please enter your city" : "",
      countryError: !formData.country ? "Please select a country" : "",
    };
    setFormDataError(errors);
    return Object.values(errors).every((error) => error === "");
  };

  const handleSubmit = async (event) => {
    console.log('hold press')
    event.preventDefault();
    setProcessing(true);
    console.log('reservepayload', reservationPayload)
    console.log('formdata', formData)
    const isValid = validateRequiredFields();
    console.log('isValid:', isValid)
    if(!isValid) {
      setProcessing(false);
      return;
    }
    
    // const selectedCountry = countryList.find(
    //   (country) => country.name === formData.country
    // );
    // const selectedCountryPhoneCode = CountriesPhones.find(
    //   (country) => country.iso === selectedCountry.code
    // );
    console.log('price:', price)
    console.log('reservationPayload:', reservationPayload)
    
    localStorage.setItem(
      "reservationPayload",
      JSON.stringify(reservationPayload)
    );

    if (paymentMethod==='wire') { 
      await makeReservation()
    } else {
      setProcessing(false);
      // console.log('make res:', payloadRes)
      localStorage.setItem(
        "48holdreservationPayload",
        JSON.stringify(payloadRes)
      );
      


    try {
      const response = await handleFlywirePayment();

      if (response) {
        toast.success("Payment Successful!", {
          position: "top-right",
          toastClassName: "custom-toast",
        });
        await makeReservation();
      }
    } catch (error) {
      console.error("Payment Error:", error);
    } finally {
      setProcessing(false);
    }
    }
   
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [payloadRes, setPayloadRes] = useState(() => {
  });

  function formattedDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  const makeGroupReservation = async () => {
    console.log('make res:', reservationPayload)
    const response = await userRequest.post(
      "/reservation/add-group-reservation",
      reservationPayload
    );

    if (response.status === 200) {
      toast.success("Reservation Completed!", {
        position: "top-right",
        toastClassName: "custom-toast",
      });
      getAllClients();

      const { Reservation } = response.data;
      setReservationID(Reservation?.reservationID)
      const newTab = window.open(
        Reservation.group_link,
        '_blank',
        'noopener,noreferrer'
      );
      
      // Focus the new tab (optional)
      if (newTab) {
        newTab.focus();
      }
      history.push("/reservations");
    } else {
      toast.error("Reservation Failed!", {
        position: "top-right",
        toastClassName: "custom-toast",
      });
    }
  }
  const makeReservation = async () => {
    console.log('make res:', payloadRes)
    const response = await userRequest.post(
      "/reservation/add-reservation",
      payloadRes
    );
    
    if (response.status === 200) {
      toast.success("Reservation Completed!", {
        position: "top-right",
        toastClassName: "custom-toast",
      });
      getAllClients();

      const { Reservation } = response.data;
      setReservationID(Reservation?.reservationID)
      const agent = JSON.parse(localStorage.getItem("agent"));
      const emailPayload = {
        template: location.search.includes("confirmed")
          ? "reservation-confirmation.html"
          : "reservation-hold48.html",
        from: "adminer@villatracker.com",
        to: client.email,
        subject: "Booking request received!",
        requestId: Reservation?.reservationID,
        clintName: `${client?.firstName ?? ""} ${client?.lastName ?? ""}`,
        agentName: `${agent?.firstName ?? ""} ${agent?.lastName ?? ""}`,
        email: client?.email,
        phone: client?.phone,
        propertyId: property?._id,
        propertyName: property?.title,
        propertyImage: property?.pictures[0]?.original,
        propertyNickname: property?.nickname,
        checkInDate:
          localStorage.getItem("dateFrom") !== null &&
            localStorage.getItem("dateFrom") !== undefined
            ? dayjs(localStorage.getItem("dateFrom")).format("DD.MM.YYYY")
            : "",
        checkOutDate:
          localStorage.getItem("dateTo") !== null &&
            localStorage.getItem("dateTo") !== undefined
            ? dayjs(localStorage.getItem("dateTo")).format("DD.MM.YYYY")
            : "",
        nights: calculateTotalNights(),
        guests: localStorage.getItem("adults"),
        requestDate:
          Reservation?.bookedAt !== null && Reservation?.bookedAt !== undefined
            ? dayjs(Reservation?.bookedAt).format("YYYY-DD-MM")
            : "",
        currency: localStorage.getItem("currency"),
        totalAmount: parseInt(totalPrice), // Total price from localStorage
      };

      await userRequest.post("email/send-email", emailPayload);

      history.push("/reservations");
      console.log("Reservation added", response);
    } else {
      toast.error("Reservation Failed!", {
        position: "top-right",
        toastClassName: "custom-toast",
      });
    }
  };

  useEffect(() => {
    setBookingUUID(uuidv4())
    const storedRules = JSON.parse(localStorage.getItem("rulesArray"));
    if (storedRules) {
      setRulesArray(storedRules);
    }
  }, []);

  useEffect(() => {
    getAllClients();
  }, []);

  const getAllClients = async (agentID) => {
    const clientResponse = await userRequest.get(`/client/get-clients?agent_id=${agent?.agent_id}`, {
      params: { limit: "300", skip: "0" },
    });   
    setClients(clientResponse.data.clients);
  };

  const handleClientChange = (e, name, fromSelect) => {
    console.log('selected client(guest id and details)', e)
    setGuestId(e._id); //By Jaison
    if (fromSelect) {
      console.log('selected client', e)
      setClient({
        firstName: e.firstName || e.value,
        lastName: e.lastName,
        phone: e.phone,
        email: e.email,
        id: e._id,
        client_id: e.client_id,
      });
      setFormData({
        ...formData,
        firstName: e.firstName || e.value,
        lastName: e.lastName,
      });
    } else {
      setClient((prev) => ({ ...prev, [name]: e.target.value }));
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    }
  };
  const [inputFields, setInputFields] = useState([
    {
      firstName: "",
      email: "",
      SubAgentPhoneNumber: "",
      agentPhone: "",
    },
  ]);

  const addInputField = () => {
    if (inputFields.length < 10) {
      setInputFields([
        ...inputFields,
        {
          firstName: "",
          email: "",
          SubAgentPhoneNumber: "",
          agentPhone: "",
          agency_id: agent?.agency_id,
          approving_agent_name: agent.firstName + " " + agent.lastName,
          approving_agent_id: agent.agent_id,
        },
      ]);
    }
  };

  const removeInputField = (indexToRemove) => {
    const newInputFields = inputFields.filter(
      (_, index) => index !== indexToRemove
    );
    if (inputFields.length > 1) {
      setInputFields(newInputFields);
    }
  };

  const handleInputChange = (index, field, event) => {
    console.log("pressed:", index, field, event);
    const value = event;
    const newInputFields = inputFields.map((item, i) => {
      if (i === index) {
        item[field] = value;
        console.log(value);
        return { ...item };
      }
      return item;
    });
    //console.log('newIn:',newInputFields)
    setInputFields(newInputFields);
  };

  const handleclosesubclient = () => {
    setShowsubClients(false);
    document.body.style.overflow = "auto";
  };

  const handleSaveAgentForm = () => {
    AuthService.AddSubAgentApi(inputFields)
      .then((response) => {
        setShowsubClients(false);
        swal({
          show: true,
          icon: "success",
          title: "Profile details updated successfully!",
          text: response.message,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubClient = () => {
    setShowsubClients(true);
    document.body.style.overflow = "hidden";
  };

  const nextPic = () => {
    if (property?.pictures?.length && picIndex < property.pictures.length - 1) {
      setPicIndex(picIndex + 1);
    }
  };

  const prevPic = () => {
    if (picIndex > 0) {
      setPicIndex(picIndex - 1);
    }
  };

  const handleDotClick = (index) => {
    setPicIndex(index);
  };

  const doBack = () => {
    localStorage.setItem("propertyId", property._id);
    localStorage.setItem("minNights", property.terms.minNights);
    history.push(`${constants.PATH_PROPERTY}/${property._id}`, {
      property,
      xdata,
      fullCalendar,
      agency,
      agent,
      totalPrice,
      agencyCommision: totalPrice / 10,
      currency: selectedCurrency,
      exchangeRate
    });
    window.location.reload();
  };

  const renderAmount = (title, pic, amount) => (
    <div className="d-flex flex-column px-3 justifty-content-between align-items-center">
      <img src={pic} alt="" height={40} />
      <span className="px-1">{title}</span>
      {amount ? (
        <span style={{ fontSize: "20px" }}>{amount}</span>
      ) : (
        <span style={{ fontSize: "20px" }}>&nbsp;</span>
      )}
    </div>
  );

  function renderAdditionalFee({ description, amount, initial }) {
    return (amount > 1) ? (
      <div className={(initial === 'SE') ? "d-flex justify-content-between link security" : "d-flex justify-content-between"}>
        <div className="h5">{description}</div>
        <div className="h5">{formatCurrency(amount)}</div>
      </div>
    ) : (<></>)
  };

  const formatTaxName = (tax) => {
    let name =
      tax?.type === "OTHER"
        ? `${tax?.name} tax`
        : tax.type?.split("_").join(" ");
    return name?.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const addSuccessParamToUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("status", "success");
    history.replace({ search: urlParams.toString() });
    makeReservation();
  };

  const { currency_code } = getCurrencyFromLocalStorage();

  const addClient = () => {
    const NEW_CLIENT = {
      id: "-1",
      firstName: "",
      lastName: "",
      email: "",
      state: "",
      phone: "",
    };
    setSelectedClientToEdit(NEW_CLIENT)
  }
  const handleClientsModalClosed = () => {
    setSelectedClientToEdit(null);
  };
  const returnAddedClient = (client) => {
    const Clientdata = {
      firstName: client?.firstName,
      lastName: client?.lastName,
      phone: client?.phone,
      email: client?.email,
      client_id: client?.client_id,
    }
    setClient(Clientdata);
    setSelectedClientToEdit(null);
    getAllClients();
  }

  const managegrouppaymentdetails = (data) => {
    setIsGrpPayments(data.sharedData.length > 0)
    setGroupPaymentDetails(data.sharedData)
    setGroup_id(data.group_id)
    setGroup_idempotent(data.idempotent)
    setGroup_link(data.link)
    setGroup_user_id(data.user_id)
  }

  useEffect(() => {
    if(isGrpPayments && groupPaymentDetails.length && group_id && group_idempotent && group_link && group_user_id) {
      // console.log('make reservation call to vt be for group payments')
      makeGroupReservation()
    }
  },[isGrpPayments, groupPaymentDetails, group_id, group_idempotent, group_link, group_user_id])

  return (
    <>
      <div className="property-page-wrappers">
        <PageHeader agent={agent} agency={agency} bgColor="#16395C" />
        {(showsubClients && !selectedClientToEdit) && (
          <AddSubClientModel
            addInputField={addInputField}
            handleInputChange={handleInputChange}
            inputFields={inputFields}
            removeInputField={removeInputField}
            handleclosesubclient={handleclosesubclient}
            handleSaveAgentForm={handleSaveAgentForm}
          />
        )}
        {(selectedClientToEdit) && (
          <EditClient
            singleClientData={[]}
            token={localStorage.getItem("jToken")}
            agency={agency}
            agent={agent}
            client={selectedClientToEdit}             
            onClose={handleClientsModalClosed}
            returnAddedClient={returnAddedClient}
          />
        )}
        {(showGroupPayments) && (
          <GroupPayments 
            onClose={() => {setShowGroupPayments(false)}}
            totalAmount={parseInt(totalPrice)}
            selectedCurrency={selectedCurrency}
            renderedCurrency={renderedCurrency}
            totalAmountinUSD={formatCurrencyInUSD(totalPrice)}
            managegrouppaymentdetails={managegrouppaymentdetails}
            reservationdata={reservationPayload}
          />
        )}
        <div className="fluid-container p-4">
          <div className="link18-bold-no-line" onClick={doBack}>
            <p className="text-start">
              <img src={goBack} alt="back" />
              &nbsp;Back
            </p>
          </div>
          <h3 className="text-start mt-2 mb-2">Reservation Summary</h3>
          <div className="property-page-container">
            <div
              className="p-3 w-100 px-4"
              style={{ backgroundColor: "#f1f1f1" }}
            >
              <h4>Price Details</h4>
            </div>
            <div className="container-fluid w-100 px-3">
              <div className="reservation-slider-details w-100">
                <div className="row">
                  <div className="col-lg-4 px-2 mb-2">
                    {property?.pictures?.length > 0 && (
                      <>
                        <div className="images-container">
                          <img
                            src={property?.pictures[picIndex]?.original}
                            alt="Property"
                            className="img-fluid"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col-lg-8 px-2 mb-2">
                    <div className="p-3 slider-details">
                      <div className="title">
                        <div className="property-page-body-top-title">
                          <h2>
                            {property?.title +
                              "(" +
                              property?.propertyType +
                              ")"}
                          </h2>
                        </div>
                      </div>
                      <div className="description w-100 py-2">
                        <div className="property py-1 d-flex">
                          <p className="w-25 h4 key mobile-id">PropertyId:</p>
                          <p className="h4 value mobile-id">{property?._id}</p>
                        </div>
                        <div className="type py-1 d-flex">
                          <p className="w-25 h4 key">Type:</p>
                          <p className="h4 value">{property?.propertyType}</p>
                        </div>
                      </div>
                      <hr
                        style={{
                          color: "#D5D5D5",
                          border: "2px solid #D5D5D5",
                        }}
                      />
                      <div className="description w-75 py-3 checkIn-checkOut">
                        <div
                          className="property py-1  d-flex justify-content-start flex-wrap"
                          style={{ gap: "20px" }}
                        >
                          <p className="h4 text-head-color fw-bold">
                            Check-In:
                          </p>
                          <p className="h4">{property?.checkInDate}</p>
                          <p className="h4">
                            Time: {formattedDate(localStorage.getItem("dateFrom"))}, {property?.defaultCheckInTime}
                          </p>
                        </div>
                        <div
                          className="type py-1  d-flex justify-content-start"
                          style={{ gap: "10px" }}
                        >
                          <p className="h4 text-head-color fw-bold">
                            Check-Out:
                          </p>
                          <p className="h4">{property?.checkOutDate}</p>
                          <p className="h4">
                            Time: {formattedDate(localStorage.getItem("dateTo"))} {property?.defaultCheckOutTime}
                          </p>
                        </div>
                      </div>
                      <hr
                        style={{
                          color: "#D5D5D5",
                          border: "2px solid #D5D5D5",
                        }}
                      />
                      <div className="d-flex py-4 icons">
                        {/* Render amount details here */}
                      </div>
                      <hr
                        style={{
                          color: "#D5D5D5",
                          border: "2px solid #D5D5D5",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!onDemand && (
              <>
                <div className="container-fluid reservation-additional-fees w-100 p-3">
                  <div className="px-4 py-3 mx-auto">
                    <h3 className="p-2 text-head-color fw-bolder">
                      Prices and Additional Fees
                    </h3>
                  </div>
                  <div className="px-4 container-fluid w-100">
                    <div className="row w-100 pb-3 bg-light p-2">
                      <div className="col-lg-4 p-2">
                        <div className="p-4">
                          {price && getAdditionalFee()}
                        </div>
                      </div>
                      <div
                        className="col-lg-4 p-2"
                        style={{
                          borderLeft: !smallScreen ? "1px solid #E7E7E7" : "none",
                        }}
                      >
                        <div className="p-4">
                          <div className="h3 py-3 d-flex justify-content-between text-head-color">
                            <div className="gap-3 agency-title">
                              <h3>Agency Commission</h3>
                            </div>
                            <div>{renderedCurrency} {parseInt(totalPrice / 10)}</div>
                          </div>
                          <div className="text-head-color h5">
                            <p>
                              By clicking on this the client card will be charged
                              fully and Villa Tracker will compensate your back with
                              the commission
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-lg-4 p-2"
                        style={{
                          borderLeft: !smallScreen ? "1px solid #E7E7E7" : "none",
                        }}
                      >
                        <div className="p-4">
                          <h3 className="text-start" style={{ fontSize: '25px' }}>Total Booking Amount</h3>
                          <div className="h5" style={{ paddingLeft: '170px' }}>
                            For{" "}
                            {selectedNights
                              ? selectedNights
                              : calculateTotalNights()}{" "}
                            Nights
                          </div>
                          <div className="d-flex justify-content-start">
                            <div className="d-flex flex-column">
                              <div style={{ fontSize: "55px" }} className="fw-bold">
                                <span style={{ fontSize: '25px' }}>
                                  {renderedCurrency} {parseInt(totalPrice)}
                                </span>
                              </div>
                              <div>
                                {currency_code !== "USD" && (
                                  <div
                                    style={{ fontSize: "25px" }}
                                    className="fw-bold"
                                  >
                                    <span style={{ fontSize: '25px' }}>
                                      $ {
                                        formatCurrencyInUSD(totalPrice)
                                      }
                                      <span className="h6">(in USD)</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}


            <div className="container-fluid w-100 px-3">
              <div className="price-details-heading p-3">
                <h3 className="text-start">
                  {" "}
                  House rules and a cancellation policy
                </h3>
                <ul className="px-4">
                  {rulesArray.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="">
                    <p className="text-start">
                      Enjoy a 48-Hours Risk Free Guarantee for bookings placed
                      more than 60 days prior to check-in. Beyond that, we'll
                      make every effort to work with property management to find
                      options if your plans change but refunds cannot be
                      guaranteed and and on a best-effort basis.
                    </p>
                    <a
                      href="/terms-and-conditions"
                      className="h5 py-3 text-primary"
                    >
                      Click here to view complete property terms & conditions
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 mt-4">
              <div className="pt-2 bg-light">
                <h2 className="p-2 px-4 text-start text-head-color fw-bold">
                  Book your Guest Trip!
                </h2>
              </div>
              <div className=" col-md-3 col-12 px-1 mb-4">
                <span className="mt-5"></span>
                <div className="mt-4 text-center">
                  <h6 className="d-flex">
                    <IoMdAddCircle style={{ fontSize: "34px", color: "green" }} />
                    <span
                      className="link18"
                      style={{ color: "green", "text-decoration": "none" }}
                      onClick={handleSubClient}
                    >
                      Add shared Client
                    </span>
                  </h6>
                </div>
              </div>
              
              <form className="container-fluid" >
                <div className="row py-3 ">
                  <div className="col-md-6 px-1 py-3  " style={{ cursor: "pointer" }} >
                    <label className="form-label">Guest First Name*</label>
                    <span className="vertical-separator"></span>
                    <span onClick={addClient}>
                      <Icon
                        name="pluscircle"
                        font="AntDesign"
                        color="#165093"
                        size={20}
                        style={{ cursor: "pointer" }}
                      />
                      <span
                        style={{
                          paddingLeft: "10px",
                          color: "#165093",
                          fontWeight: 500,  
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          // marginTop: "10px",
                          marginBottom: 'unset'
                        }}
                        data-bs-toggle="modal"
                        href="#exampleModalToggle"
                      >
                        Add New Client
                      </span>
                    </span>
                    
                    <NameSelect
                      clients={clients}
                      client={client}
                      setClient={setClient}
                      setClients={setClients}
                      onClientChange={handleClientChange}
                      setFormData={setFormData}
                    />
                    <div>
                      <span className="formDataError">{formDataError.firstNameError}</span>
                    </div>
                  </div>
                  <div className="col-md-6 px-1 py-3  ">
                    <label className="form-label">Guest Last Name*</label>
                    <input
                      type="text"
                      className="form-control p-3 border"
                      value={client?.lastName}
                      name="lastName"
                      onChange={(e) => handleClientChange(e, "lastName")}
                    />
                    <div>
                      <span className="formDataError">{formDataError.lastNameError}</span>
                    </div>
                  </div>
                  <div className="col-md-6 px-1 py-3  ">
                    <label className="form-label">Middle Name</label>
                    <input
                      type="text"
                      className="form-control p-3 border"
                      value={formData?.middleName}
                      name="middleName"
                      onChange={(e) =>
                        setFormData({ ...formData, middleName: e.target.value })
                      }
                    />
                    
                  </div>
                  <div className="col-md-6 px-1 py-3  ">
                    <label className="form-label">Address*</label>
                    <input
                      type="text"
                      className="form-control p-3 border"
                      value={formData?.address}
                      name="address"
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                    <div>
                      <span className="formDataError">{formDataError.addressError}</span>
                    </div>
                  </div>
                  <div className="col-md-4 px-1 py-3 ">
                    <label className="form-label">E-Mail*</label>
                    <div className="input-group ">
                      <input
                        type="email"
                        className="form-control p-3 border"
                        value={client?.email}
                        name="email"
                        onChange={(e) => handleClientChange(e, "email")}
                      />
                    </div>
                    <div>
                      <span className="formDataError">{formDataError.emailError}</span>
                    </div>
                  </div>
                  <div className="col-md-4 px-1 py-3 ">
                    <label className="form-label">Phone*</label>
                    <input
                      type="phone"
                      className="form-control p-3 border"
                      value={client?.phone}
                      name="phone"
                      onChange={(e) => handleClientChange(e, "phone")}
                    />
                    <div>
                      <span className="formDataError">{formDataError.phoneError}</span>
                    </div>
                  </div>
                  <div className="col-md-4 px-1 py-3 ">
                    <label className="form-label">City*</label>
                    <input
                      type="text"
                      className="form-control p-3 border"
                      value={formData?.city}
                      name="city"
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                    <div>
                      <span className="formDataError">{formDataError.cityError}</span>
                    </div>
                  </div>
                  <div className="col-md-4 px-1 py-3 ">
                    <label className="form-label">State/Province/Region</label>
                    <input
                      type="text"
                      className="form-control p-3 border"
                      value={formData?.state}
                      name="state"
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                    
                  </div>
                  <div className="col-md-4 px-1 py-3 ">
                    <label className="form-label">Zip Code/Postal Code</label>
                    <input
                      type="text"
                      className="form-control p-3 border"
                      value={formData?.postalCode}
                      name="postalCode"
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4 px-1 py-3 ">
                    <label className="form-label">Country*</label>
                    <DropdownInput
                      placeholder={"Select a country"}
                      dropDownObj={countryList}
                      value={formData?.country}
                      setValue={(value) =>
                        setFormData({ ...formData, country: value })
                      }
                    />
                    <div>
                      <span className="formDataError">{formDataError.countryError}</span>
                    </div>
                  </div>
                </div>
                {!onDemand && (<>
                  <div className="container-fluid w-100">
                    <div className="pt-2 bg-light">
                      <div className="p-2">
                        <h2 className="ps-2 text-head-color text-start fw-bold">
                          Payment Information
                        </h2>
                      </div>
                    </div>
                    <div className="container-fluid">
                      <div className="mt-2">
                        <h3 className="text-head-color fw-bold pb-3">
                          Payment Schedule
                        </h3>
                        <div className="h4 py-1 w-50 d-flex">
                          <div className="pe-3">Amount Due Today:</div>
                          <div className="text-head-color fw-bold">
                            <span style={{ fontSize: '25px' }}>
                              {renderedCurrency} {parseInt(totalPrice)}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex">
                          <h3>Total Booking Amount:</h3>
                          <div className="text-head-color fw-bold">
                            <span style={{ fontSize: '25px' }}>
                              {renderedCurrency} {parseInt(totalPrice)}
                              {currency_code !== "USD" && (
                                <div
                                  style={{ fontSize: "55px" }}
                                  className=" fw-bold"
                                >

                                  $ {
                                    (formatCurrencyInUSD(totalPrice))
                                  }
                                </div>

                              )}
                              {currency_code !== "USD" && (
                                <div className="h5">(in USD)</div>
                              )}
                            </span>
                          </div>

                        </div>
                        <div className="h4 py-1 w-50 d-flex">
                          <div>Additional Fees due at check-in:</div>
                          <div></div>
                        </div>
                        <div className="py-2 w-75 h4">
                          *Any extra cost will be charged by the host at the
                          property's currency. If people book more than 2 months
                          ahead, we only charge or hold 50% of the booking amount…
                          and rest due 2 months before check-in.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container-fluid">
                    <div className="">
                      <div className="pt-2 bg-light">
                        <h3 className="p-3 text-head-color fw-bold text-start">
                          Book this Property Now
                        </h3>
                      </div>
                    </div>
                  </div>
                  {!isBookConfirmed && (
                    <>
                      <div className="px-4 container-fluid w-100 pt-4">
                        <div className="row ps-4 h3 text-head-color fw-bold">
                          Please select the payment method
                        </div>

                        <div className="row w-100 pb-3">
                          <div
                            className="col-lg-6 p-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setPaymentMethod("wire")}
                          >
                            <div className="p-4">
                              <div className="d-flex align-items-start">
                                <div>
                                  <label>
                                    <input
                                      type="radio"
                                      checked={paymentMethod === "wire"}
                                    />
                                  </label>
                                </div>
                                <div className="d-flex flex-column">
                                  <div className="h3 d-flex justify-content-between  text-head-color fw-bold">
                                    <div> Wire Transfer</div>
                                  </div>
                                  <div className="text-head-color h5">
                                    Your request will be sent to the Villa Tracker
                                    team to review a contract will be sent to you
                                    with payment terms and details
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="col-lg-6 p-2"
                            style={{
                              borderLeft: !smallScreen
                                ? "thick solid #E7E7E7"
                                : "none",
                              borderTop: smallScreen
                                ? "thick solid #E7E7E7"
                                : "none",
                            }}
                          >
                            <div
                              className="p-4"
                              style={{ cursor: "pointer" }}
                              onClick={() => setPaymentMethod("hold")}
                            >
                              <div className="d-flex align-items-start">
                                <div>
                                  {" "}
                                  <label>
                                    <input
                                      type="radio"
                                      checked={paymentMethod === "hold"}
                                    />
                                  </label>
                                </div>
                                <div className="d-flex flex-column">
                                  <div className="h3 d-flex justify-content-between text-head-color fw-bold">
                                    <div> 48 Hours Hold</div>
                                  </div>
                                  <div className="text-head-color h5 ">
                                    By holding this property for 48 hours, your
                                    Credit Card will not be charged, only
                                    authorized.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </>
                  )}

                  {paymentMethod === "hold" && (
                    <div className="container-fluid w-100 px-3">
                      <div className="container-fluid w-100">
                        <div className="d-flex flex-column align-items-start    ">
                          <p>Credit Cards Accepted:</p>
                          <img
                            src={creditCardsIcon}
                            alt="credit cards"
                            className="img-fluid"
                          />
                        </div>

                        <div className="row w-100 pb-3 mx-auto d-flex justify-content-center">
                          <button
                            type="button"
                            disabled={processing}
                            style={{ maxWidth: "300px" }}
                            className="btn btn-primary"
                            onClick={handleSubmit}
                          >
                            Hold for 48 hours
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "wire" && (
                    <div className="row">
                      <div className="col-6 col-xs-12 reserve_pad_lr_10">
                        <button
                          type="button"
                          disabled={processing}
                          className="btn btn-primary w-100"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                      <div className="col-6 col-xs-12 reserve_pad_lr_10">
                        <button
                          type="button"
                          disabled={processing}
                          className="btn btn-primary w-100"
                          onClick={() => setShowGroupPayments(true)}
                        >
                          Group Payments
                        </button>
                      </div>
                    </div>
                    // <div className="container-fluid w-100 px-3">
                    //   <div className="container-fluid w-100">
                    //     <div className="row w-100 pb-3   mx-auto">
                          // <button
                          //   type="submit"
                          //   disabled={processing}
                          //   className="btn btn-primary"
                          // >
                          //   Submit
                          // </button>
                    //     </div>
                    //   </div>
                    // </div>
                  )}
                </>

                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyReservationPage;
