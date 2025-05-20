import React, { useEffect, useState } from "react";
import EmailInput from "../Fields/EmailInput/EmailInput";
import PasswordInput from "../Fields/PasswordInput/PasswordInput";
import NameInput from "../Fields/NameInput/NameInput";
import DropdownInput from "../Fields/DropdownInput/DropdownInput";
import countryList from "../../../Util/data/countries.json";
import DangerExclamation from "../../Icons/DangerExlamation/DangerExclamation.jsx";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";


function SignupForm({
  onSubmit,
  onToggleSignup,
  error,
  agencyName,
  setAgencyName,
  agencyType,
  setAgencyType,
  website,
  setWebsite,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  address,
  setAddress,
  country,
  setCountry,
  countryCode,
  setCountryCode,
  stateProvince,
  setStateProvince,
  city,
  setCity,
  zipCode,
  setZipCode,
  phone,
  setPhone,
  organization,
  setOrganization,
  currency,
  setCurrency,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) {

  //console.log("email is here ", email);
  //console.log("error is here ", error);
  const [notice, setNotice] = useState("");
  const [passwordNotMatch, setPasswordNotMatch] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [phonecodecountry, setPhoneCodeCountry] = useState('ch');


  useEffect(() => {
    if (error && error.msg === "Password should match and contain minimum 6 letters or numbers : 0-9 a-z A-Z") {
      setPasswordNotMatch(error);
      setPasswordError(null);
    } else {
      setPasswordError(error);
      setPasswordNotMatch(null);
    }
  }, [error]);

  function updateEmail(value) {
    if (/[A-Z]/.test(value)) {
      setNotice(
        "That looked like uppercase; we switched to lowercase instead."
      );
    }

    const lowercased = value.toLowerCase();

    setEmail(lowercased);
  }

  // const countryList = [
  //   { name: "Albania" },
  //   { name: "Algeria" },
  //   { name: "America" },
  //   { name: "Israel" },
  // ];
  const organizationList = [
    { name: "UNWTO" },
    { name: "PATA" },
    { name: "ATB" },
    { name: "CTO" },
    { name: "ETC" },
    { name: "IATA" },
    { name: "WTCF" },
    { name: "WTTC" },
    { name: "WTCF" },
    { name: "OTHER " },
  ];

  const agencyTypes = [
    { name: 'Travel agency' },
    { name: 'Travel designer' },
    { name: 'Event planer' },
    { name: 'Concierge company' },
    { name: 'VIP company' },
    { name: 'Personal assistant of an executive' },
    { name: 'Retreat facilitator' },
  ];

  const currencies = countryList?.map((country) => {
    return {
      value: country.currency.code,
      name:
        country.currency.code +
        " " +
        country.currency.symbol +
        "(" +
        country.currency.name +
        ") ",
    };
  });
  //console.log("currencies",currencies);

  return (
    <form onSubmit={onSubmit} className="px-5">
      <div className="row">
        <div className="col-md-6 col-12">
          <NameInput
            label="Travel Agency Name*"
            inputName="agencyname"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"Enter Agency Name"}
            value={agencyName}
            setValue={setAgencyName}
          />
        </div>
        <div className="col-md-6 col-12">
          <DropdownInput
            label="Travel Agency Type*"
            inputName="agencyType"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"please select one"}
            dropDownObj={agencyTypes}
            value={agencyType}
            setValue={setAgencyType}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-12">
          <NameInput
            label="Website"
            inputName="website"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"your Website"}
            value={website}
            setValue={setWebsite}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-12">
          <NameInput
            label="First Name*"
            inputName="fname"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"Enter First Name"}
            value={firstName}
            setValue={setFirstName}
          />
        </div>
        <div className="col-md-6 col-12">
          <NameInput
            label="Last Name*"
            inputName="lname"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"Enter Last Name"}
            value={lastName}
            setValue={setLastName}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-12">
          <EmailInput
            label="E-Mail*"
            inputName="email"
            showLoginLink="signup"
            onToggleSignup={onToggleSignup}
            error={error}
            notice={notice}
            onSubmit={onSubmit}
            value={email}
            setValue={setEmail}
            placeholder={"E-mail address"}
          />
        </div>

        <div className="col-md-6 col-12">
          <NameInput
            label="Address"
            inputName="address"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"Enter Address"}
            value={address}
            setValue={setAddress}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-12">
          <DropdownInput
            label="Country*"
            inputName="countryname"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"Select a country"}
            dropDownObj={countryList}
            value={country}
            setValue={(value) => {
              // console.log(value, countryList)
              // Find the country object where the name matches the selected value
              const selectedCountry = countryList.find(item => item.name === value);
              if (selectedCountry) {
                const countryCode = selectedCountry.code;
                // Now you can use countryCode as needed, for example:
                setCountryCode(countryCode);
                setPhoneCodeCountry(countryCode.toLowerCase())
              }
              setCountry(value)
            }}
          />
        </div>
        <div className="col-md-6 col-12">
          <NameInput
            label="State / Province"
            inputName="stateProvince"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"Enter State"}
            value={stateProvince}
            setValue={setStateProvince}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-12">
          <NameInput
            label="City*"
            inputName="city"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"Enter city name"}
            value={city}
            setValue={setCity}
          />
        </div>

        <div className="col-md-6 col-12">
          <NameInput
            label="Zip / Postal Code"
            inputName="zipCode"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"Enter Postal Code"}
            value={zipCode}
            setValue={setZipCode}
          />
        </div>
      </div>

      <div className="row">
        <div class="col-md-6 col-12">
          <div className="">
            <div class="mt-2 d-flex justify-content-start phone-input-title">
              <label for="city">Phone No*</label>
            </div>
            <div class="">
              <PhoneInput
                name="phone"
                class="form-control"
                country={phonecodecountry}
                enableSearch={true}
                placeholder="Enter phone number"
                value={phone}
                onChange={(value, country, e, formattedValue) => {
                  
                  setPhone(value)
                }}
                inputStyle={{ width: "258px" }}
                inputClass="sign-up-phone-control"
              />
              {error && error.placement === "phone" && (
                <span className="NameInput_input_error__h+26L">
                  <DangerExclamation size={16} fill="red" />
                  &nbsp;{error.msg}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <DropdownInput
            label="Currency*"
            inputName="currency"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"Select Currency"}
            dropDownObj={currencies}
            value={currency}
            setValue={setCurrency}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-12">
          <DropdownInput
            label="Travel Organization Membership"
            inputName="organizationname"
            showLoginLink="signup"
            error={error}
            onSubmit={onSubmit}
            placeholder={"Select an Organization"}
            dropDownObj={organizationList}
            value={organization}
            setValue={setOrganization}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-12 px-1">
          <PasswordInput
            onSubmit={onSubmit}
            error={passwordError}
            confirmError={passwordNotMatch ? passwordNotMatch : null}
            label="Password*"
            inputName="new-password"
            placeholder={"Password"}
            value={password}
            setValue={setPassword}
          />
        </div>

        <div className="col-md-6 col-12 px-1">
          <PasswordInput
            onSubmit={onSubmit}
            error={passwordNotMatch ? null : passwordError}
            confirmError={passwordNotMatch}
            label="Confirm Password*"
            inputName="confirm-password"
            placeholder={"Password (again)"}
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
