  import React, { useState } from "react";
  import { toast } from "react-toastify";
  import { useHistory, useLocation } from "react-router-dom";
  import axios from "axios";
  import { v4 as uuidv4 } from 'uuid';
  import { detectCurrency, calculateTotalNights } from "../../Util/general";
  import DropdownInput from "../../components/Forms/Fields/DropdownInput/DropdownInput.jsx";
  import numeral from "numeral";
  import countryList from "../../Util/data/countries.json";
  import taxesNames from "../../Util/data/taxesNames.json";
  import moment from "moment";
  import { userRequest } from "../../api/requestMethods";
  import getHouseRules from "../../Hooks/getHouseRules.jsx";

  const CheckoutForm = ({
    amount,
    currency,
    security,
    client,
    property,
    formData,
    setFormData,
    getAllClients,
    paymentMethod,
  }) => {
    const [processing, setProcessing] = useState(false);
    const [bookingUUID,setBookingUUID]=useState(null)
    const [onDemand, setonDemand] = useState(property?.tags?.indexOf("onDemand")>-1);
    const location = useLocation();
    const history = useHistory();

    const formatDate = (date) => {
      const d = new Date(date);
      if (isNaN(d)) {
        return new Date().toISOString().split("T")[0];
      }
      return d.toISOString().split("T")[0];
    };

    const handleFlywirePayment = (bookingData) => {
      const selectedCountry = countryList.find(
        (country) => country.name === formData.country
      );
      const selectedCountryPhoneCode= CountriesPhones.find(
        (country) => country.iso === selectedCountry.code
      );
      console.log('phonePrefix:',selectedCountryPhoneCode)
      const countryCode = selectedCountry ? selectedCountry.code : "";
      const currency = localStorage.getItem('currency');
      // const totalPrice = Number(localStorage.getItem(`refreshPrice_${property?._id}`));
      const exchangeRates = JSON.parse(localStorage.getItem("exchange"));
  
      let recipientCode = 'UXH';
      let amount = totalPrice;
  
      if (currency === 'CHF') {
        recipientCode = 'RXH';
        const exchangeRate = exchangeRates.find(item => item.currency_code === 'CHF');
        // if (exchangeRate) {
        //   amount = Number(totalPrice) * Number(exchangeRate.conversion_rates);
        //   console.log(totalPrice, exchangeRate);
        // }
      } else if (currency === 'EUR') {
        recipientCode = 'YXH';
        // const exchangeRate = exchangeRates.find(item => item.currency_code === 'EUR');
        // if (exchangeRate) {
        //   amount = totalPrice * exchangeRate.conversion_rates;
        // }
      }
  console.log('callback at:', `${window.location.origin}/request-to-book-flywire`)
      if (window.FlywirePayment) {
        const config = {
          env: "DEMO",
          recipientCode: 'SHE', //recipientCode,
          paymentAuthorization: {
            type: "pre_auth"
        },
          //amount: amount,
          amount: 100,
          requestPayerInfo: true,
          requestRecipientInfo: true,
          firstName: client.firstName,
          lastName: client.lastName||'',
          email: client.email,
          phone: '+'+selectedCountryPhoneCode?.phonecode+' '+client.phone,
          address: formData.address,
          city: formData.city,
          //state: formData.state,
          zip: formData.postalCode,
          country: countryCode,
           // should the country prefix code like IL: +972
          recipientFields: {
            booking_reference: `VT_${bookingUUID}`,
          },
          nonce: `VT_${bookingUUID}`,
          returnUrl: `${window.location.origin}/request-to-book-flywire`,
          callbackId: uuidv4(),
          callbackUrl: "https://smilinghouse.ch/flywire/response-villatracker.php",
          callbackVersion: "2",
          onSuccess: (data) => {
            console.log('Flywire Data:', data);
            setFlywireData(data);
            updateReservationPayload(data);
          },
        };
  
        ReactGA.event({
          category: 'User',
          action: 'Clicked: Hold 48Hrs'
        });
        console.log('config',config)
        var modal = window.FlywirePayment.initiate(config);
        modal.render();
      } else {
        console.error(
          "FlywirePayment is not defined. Ensure the SDK is loaded properly."
        );
      }
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      setProcessing(true);
      setBookingUUID(uuidv4())
      try {
        handleFlywirePayment();
        
        const response = await userRequest.post("/general/flywire-log", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          currency,
          amount
        });

        if (response.status === 200)
          toast.success("Payment Successful!", {
            position: "top-right",
            toastClassName: "custom-toast",
          });
          await makeReservation();
        } else {
          toast.error("Payment Failed!", {
            position: "top-right",
            toastClassName: "custom-toast",
          });
        }
      } catch (error) {
        console.error("Payment Error:", error);
        toast.error("Payment Failed!", {
          position: "top-right",
          toastClassName: "custom-toast",
        });
      } finally {
        setProcessing(false);
      }
    };

    const guestyResPayload = getHouseRules({
      property,
      adults: parseInt(localStorage.getItem("adults") || "0"),
      children: parseInt(localStorage.getItem("children") || "0"),
      activeRatePlan: null, 
      dateFrom: formatDate(localStorage.getItem("dateFrom") || "2023-05-19"),
      dateTo: formatDate(localStorage.getItem("dateTo") || "2023-05-20"),
      fullCalendar: null, 
      client: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
      },
      formData
    });

    const makeReservation = async () => {
      /*
          const requiredFields = [
      'agent_id', 'agency_id', 'client_id', 'agencyName', 'bookedAt', 
      'bookingId', 'cancellationPolicyCategory', 'client_id', 'confirmationCode', 
      'currency', 'endDate', 'fees', 'guestEmail', 'guestFirstName', 
      'guestLastName', 'guestPhoneNumbers', 'guestPreferredLocale', 
      'nightlyBasePrice', 'nights', 'numberOfGuests', 'payment_type', 
      'propertyId', 'startDate', 'status', 'total'
    ];
      */ 
      const payload = {
        total: parseInt(amount),
        propertyName: property?.title,
        listing: property,
        propertyId: property?._id,
        agencyName: JSON.parse(localStorage.getItem("travelAgency"))?.agencyName,
        agency_id: JSON.parse(localStorage.getItem("travelAgency"))?.agency_id,
        agent_id: JSON.parse(localStorage.getItem("agent"))?.agent_id,
        agentName: JSON.parse(localStorage.getItem("agent"))?.firstName,
        bookedAt: new Date(),
        destination: property?.address?.country ?? "",
        bookingId: uuidv4(),
        cancellationFee: "0",
        cancellationPolicyCategory: "string",
        guests: `${localStorage.getItem("adults")} adults, ${localStorage.getItem("children")} children`,
        children: parseInt(localStorage.getItem("children") || "0"),
        adults: parseInt(localStorage.getItem("adults") || "0"),
        client_id: parseInt(client?.client_id),
        confirmationCode: uuidv4(),
        currency: detectCurrency(property?.prices?.currency),
        startDate: localStorage.getItem("dateFrom") !== null && localStorage.getItem("dateFrom") !== undefined ? moment(localStorage.getItem("dateFrom")).format("MM.DD.YYYY") : '',
        endDate: localStorage.getItem("dateTo") !== null && localStorage.getItem("dateTo") !== undefined ? moment(localStorage.getItem("dateTo")).format("MM.DD.YYYY") : '',
        fees: "0",
        guestBookingStatus: "pending",
        guestEmail: client?.email,
        guestFirstName: client?.firstName,
        guestLastName: client?.lastName,
        guestPhoneNumberCode: "0",
        guestPhoneNumbers: client?.phone,
        guestPreferredLocale: "en",
        nightlyBasePrice: property?.prices?.basePrice,
        nights: calculateTotalNights(),
        payment_type: paymentMethod,
        status: "pending",
        taxAmount: "0",
      };
      console.log('add reservation:',payload )
      const response = await userRequest.post("/reservation/add-reservation", payload);

      if (response.status === 200) {
        toast.success("Reservation Completed!", {
          position: "top-right",
          toastClassName: "custom-toast",
        });
        getAllClients();

        const { Reservation } = response.data;

        const agent = JSON.parse(localStorage.getItem("agent"));
        const emailPayload = {
          template: location.search.includes("confirmed") ? "reservation-confirmation.html" : "reservation-hold48.html",
          from: "adminer@villatracker.com",
          to: client?.email,
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
          checkInDate: localStorage.getItem("dateFrom") !== null && localStorage.getItem("dateFrom") !== undefined ? moment(localStorage.getItem("dateFrom")).format("MM.DD.YYYY") : '',
          checkOutDate: localStorage.getItem("dateTo") !== null && localStorage.getItem("dateTo") !== undefined ? moment(localStorage.getItem("dateTo")).format("MM.DD.YYYY") : '',
          nights: calculateTotalNights(),
          guests: localStorage.getItem("adults"),
          requestDate: Reservation?.bookedAt !== null && Reservation?.bookedAt !== undefined ? moment(Reservation?.bookedAt).format("YYYY-DD-MM") : '',
          currency: detectCurrency(property?.prices?.currency),
          totalAmount: amount,
        };
        console.log('email res:',emailPayload )
        await userRequest.post("email/send-email", emailPayload);
        history.push('/reservations');
        console.log("Reservation Completed", response);
      } else {
        toast.error("Reservation Faile on the VT channel!", {
          position: "top-right",
          toastClassName: "custom-toast",
        });
      }
    };

    const countries = countryList.map((country) => ({
      value: country.name,
      name: `${country.name} (${country.currency.code})`
    }));

    return (
      <form className="row g-3 d-flex flex-column align-items-start mx-auto" onSubmit={handleSubmit}>
        <div className="row py-2">
          <div className="col-md-6 px-4">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control border"
              style={{ padding: "10px" }}
              name="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="col-md-6 px-4">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control border"
              style={{ padding: "10px" }}
              name="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>
        <div className="row gap-3 py-2 px-4">
          <div className="col-md-4">
            <label className="form-label">Address</label>
            <input
              type="address"
              className="form-control border"
              style={{ padding: "10px" }}
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control border"
              style={{ padding: "10px" }}
              name="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Country</label>
            <DropdownInput
              placeholder={"Select a country"}
              dropDownObj={countries}
              onChange={(field, value) => setFormData({ ...formData, country: value })}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Postal Code</label>
            <input
              type="text"
              className="form-control border"
              style={{ padding: "10px" }}
              name="postalCode"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
          </div>
        </div>
        <div className="w-100 pt-3 m-0">
          <div className="form-check p-0 ps-4 h4 d-flex align-items-start mx-auto">
            <input
              className="form-check-input h4 mt-1 ms-1 border"
              type="checkbox"
              id="invalidCheck"
              required
            />
            <label className="form-check-label px-2" htmlFor="invalidCheck">
              I have read and agree with the <a href="#">Privacy Policy</a> and{" "}
              <a href="#">Terms & Conditions</a> <br />
              of the site Certain policy restrictions may apply.
            </label>
          </div>
        </div>
        {!onDemand&&
        (<>
        <div className="container-fluid px-3">
          <hr style={{ color: "#E7E7E7" }} />
          <div className="d-flex justify-content-end">
            <div className="p-4 text-head-color booking-amount">
              <div className="h1 py-3">
                <h2>Total Booking Amount</h2>
              </div>
              <div className="d-flex justify-content-start gap-3 align-items-center">
                <div className="py-3 fw-bold">
                  <h1>{detectCurrency(currency)}{numeral(amount+security).format("0,0")}</h1>
                </div>
                <h3 className="h1 fw-bold">For {calculateTotalNights()} Nights</h3>
              </div>
            </div>
          </div>
        </div>
        <div>
          <hr />
          <div className="d-flex justify-content-end" style={{ gap: "16px" }}>
            <button className="btn bg-light p-2 px-4"> Cancel </button>
            <button type="submit" className="btn btn-success">
              {processing ? "Processing..." : "Submit Booking"}
            </button>
          </div>
        </div>
        </>)}
      </form>
    );
  };

  export default CheckoutForm;
