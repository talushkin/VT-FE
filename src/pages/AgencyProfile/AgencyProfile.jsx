import React, { useEffect, useState } from "react";
import InputField from "../../components/ProfileComp/InputField/InputField";
import DropdownField from "../../components/ProfileComp/DropdownField/DropdownField";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetProfile,
  handleUploadPic,
} from "../../store/redux-apis/apiCalls";
import countryList from "../../Util/data/countries.json";
import timeZoneList from "../../Util/data/timezones..json";
import "./AgencyProfile.css";
import TermsFooter from "../../components/TermsFooter/TermsFooter";
import { baseURL } from "../../core";
import axios from "axios";

const AgencyProfile = ({
  agency,
  profile,
  setUser,
  setAgency,
  token,
  setToken,
}) => {
  // const [profile, setProfile] = useState(user);
  //console.log("AgencyProfile", profile);
  const avatar = agency && agency?.userImage;
  const [picture, setPicture] = useState([]);
  const [imgData, setImgData] = useState(null);

  const dispatch = useDispatch();
  const userId = localStorage.getItem("id");
  // //console.log("userId", userId);

  const onChangePicture = async (e) => {
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
    formData.append("agency_image", picture);
    formData.append("id", agency?._id);

    const response = await userRequest.post(
      `/travel-agency/update-profile-picture`,
      formData
    );

    // //console.log("response handle Submit  upload pic : ", response);
    if (response.status === 200) {
      //console.log("success");
      setAgency(response.data?.doc);
    } else {
      // //console.log("not success");
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
                  label={"Legal Name"}
                  type="text"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder={profile?.agencyName}
                  defaultValue={profile?.agencyName}
                />
                <InputField
                  label={"Email Address"}
                  type="email"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder={profile?.email}
                  defaultValue={profile?.email}
                />
                <InputField
                  label={"Phone*"}
                  type="number"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder={profile?.phone}
                  defaultValue={profile?.phone}
                />
                <InputField
                  label={"Address"}
                  type="text"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder={profile?.address}
                  defaultValue={profile?.address}
                />
                <InputField
                  label={"City"}
                  type="text"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder="NYK"
                />
              </div>
            </div>
            {/* <hr className="my-4" /> */}
            <div className="col-md-4 border-end">
              <div className="g-3">
                <InputField
                  label={"State/Province"}
                  type="text"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder={profile?.country}
                />
                <InputField
                  label={"Zip/Postal Code"}
                  type="text"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder="CH-3780"
                />
                <DropdownField
                  label={"Country"}
                  id="Country"
                  value={""}
                  //   setValue={(e) => e}
                  dropDownObj={countryList}
                  placeholder={profile?.country}
                />
                <DropdownField
                  label={"TimeZone"}
                  id="TimeZone"
                  value={""}
                  //   setValue={(e) => e}
                  dropDownObj={timeZoneList}
                  placeholder="Europe/Paris"
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
            </div>
            {/* <hr className="my-4" /> */}
            <div className="col-md-4">
              <div className="g-3 h-100">
                <div className="col-sm-8 mx-auto">
                  <div className="d-flex justify-content-between w-100">
                    <div className="image-input image-input-outline">
                      <div
                        className="image-input-wrapper w-125px h-125px"
                        style={{
                          backgroundImage: imgData
                            ? `url(${imgData})`
                            : avatar
                            ? `url(${avatar})`
                            : "url(/icons/dummyuser.jpg)",
                        }}
                      />
                    </div>
                    <div className="d-flex flex-column ps-4">
                      <div>
                        <div className="label-image w-100 mt-5">
                          <label className="btn btn-icon shadow label-extra">
                            <a className="btn btn-custom-sec text-small">
                              Upload
                            </a>
                            {/*begin::Inputs*/}
                            <input
                              type="file"
                              name="avatar"
                              accept=".png, .jpg, .jpeg"
                              onChange={(e) => onChangePicture(e)}
                            />
                            <input type="hidden" name="avatar_remove" />
                            {/*end::Inputs*/}
                          </label>
                        </div>
                      </div>
                      <div className="mt-auto ">
                        <div className="form-text mt-3">500 kb max size</div>
                        <div className="form-text">
                          recommended size 299x65 px.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-8 mx-auto pt-5 pb-3">
                  <h4>Password</h4>
                </div>
                <InputField
                  label={"Password"}
                  type="password"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder="Password"
                />
                <InputField
                  label={"Confirm password"}
                  type="password"
                  value={""}
                  //   setValue={(e) => e}
                  placeholder="Confirm password"
                />
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
          </div>
        </form>
      </div>
      {/* <TermsFooter /> */}
    </div>
  );
};

export default AgencyProfile;
