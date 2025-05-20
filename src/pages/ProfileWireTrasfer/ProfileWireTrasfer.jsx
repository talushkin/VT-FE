import React, { useEffect, useState } from "react";
import InputField from "../../components/ProfileComp/InputField/InputField";
import DropdownField from "../../components/ProfileComp/DropdownField/DropdownField";
import { useDispatch, useSelector } from "react-redux";
import countryList from "../../Util/data/countries.json";
import "./ProfileWireTrasfer.css";
import TermsFooter from "../../components/TermsFooter/TermsFooter";
import { baseURL } from "../../core";
import axios from "axios";
import { drawerWidth } from "../index.jsx";

const ProfileWireTrasfer = ({ profile, setUser, token, setToken }) => {
  // const [profile, setProfile] = useState(user);
  //console.log("ProfileWireTrasfer", ProfileWireTrasfer);
  const avatar = profile && profile?.userImage;
  const [picture, setPicture] = useState([]);
  const [imgData, setImgData] = useState(null);

  const dispatch = useDispatch();
  const userId = localStorage.getItem("id");
  // //console.log("userId", userId);

  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      //console.log("AgencyPicture:  >>>", e.target.files);
      setPicture(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const userRequest = axios.create({
    baseURL: baseURL,
    headers: {
      token: `Bearer ${token}`,
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("userImage", picture);
    formData.append("id", userId);
    // const response = await handleUploadPic(dispatch, formData);
    const response = await userRequest.post(`/agent/update-profile`, formData);
    //console.log("response handle Submit  upload pic : ", response);
    if (response.status === 200) {
      //console.log("success");
      setUser(response.data?.doc);
    } else {
      //console.log("not success");
    }
  };

  const curruncyData = countryList?.map((country) => {
    return country.currency;
  });
  // //console.log(curruncyData);
  // //console.log("timeZoneList >>", timeZoneList);

  return (
    
    <div>
      <div className="container pt-5">
        <form className="needs-validation" noValidate>
          <div className="row ">
            <div className="col-md-4 border-end">
              
              <div className="g-3">
                <InputField
                  label={"Account Holders Name"}
                  type="text"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder={profile?.accountHolderName}
                  defaultValue={profile?.accountHolderName}
                />
                <InputField
                  label={"Street Address"}
                  type="email"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder={profile?.email}
                  defaultValue={profile?.accountAdress}
                />
                <InputField
                  label={"City*"}
                  type="number"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder={profile?.accountCity}
                  defaultValue={profile?.accountCity}
                />
                <DropdownField
                  label={"Account Holder`s Country"}
                  id="Country"
                  value={""}
                  //   setValue={(e) => e}
                  dropDownObj={countryList}
                  placeholder={profile?.accountCountry}
                />
                <InputField
                  label={"Bank Name"}
                  type="text"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder={profile?.accountBank}
                />
              </div>
            </div>
            {/* <hr className="my-4" /> */}
            <div className="col-md-4 border-end">
              <div className="g-3">
                <InputField
                  label={"SWIFT"}
                  type="text"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder={profile?.accountSwift}
                />
                <InputField
                  label={"IBAN / Account Number"}
                  type="text"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder="IBAN30940392"
                  placeholder={profile?.accountIBAN}
                />
                <DropdownField
                  label={"Curruncy"}
                  type="Curruncy"
                  value={""}
                  //   setValue={(e) => e}
                  dropDownObj={curruncyData}
                  placeholder="United States dollar"
                />
              </div>
           
                <div className="d-flex justify-content-end align-items-end h-25">
                  <button
                    className="btn btn-primary btn-custom"
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
        </form>
      </div>
      {/* <TermsFooter /> */}
    </div>
  );
};

export default ProfileWireTrasfer;
