import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import InputField from '../components/InputField'
import Button from '../components/Buttons/Button/Button'
import closeIcon from '../assets/icons/closeIcon.png';
import UplodIMg from '../assets/uplod.png'
import editIcon from '../assets/icons/editIcon.png';
import AuthService from "../services/auth.service";
import swal from "sweetalert";

const PersonalizeLogoModel = (props) => {
    const {agency,agent}=props
    const fileInputRef = useRef(null);
    $(document).ready(function () {
        if ($('.popup-container').length > 0) {
            $('body').addClass('cst-overflow-class');
        }else{
          $('body').removeClass('cst-overflow-class');
        }
      });
    const inputFileds = {
        userImage: "",
    }
    const [formData, setformData] = useState(inputFileds)
    const [file, setFile] = useState();

    const handleButtonClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    }
    const handleInputField = (e) => {
        const { name, value } = e.target
        console.log(value, "value")
        console.log(e.target.files)

        setformData({ ...formData, [name]: value })
        if (e.target.name === "userImage") {
            setformData({ ...formData, [name]: e.target.files[0] })
            setFile(URL.createObjectURL(e.target.files[0]));
        }

    }
    const handalsubmit = () => {
        const UpdateProfileApiPayload = {
            agency_id: agency?.agency_id !== undefined ? parseInt(agency?.agency_id) : null,
            agent_id: agent?.agent_id !== undefined ? parseInt(agent?.agent_id) : null,
            userImage: formData.userImage,

        }
        AuthService.updateProfileApi(UpdateProfileApiPayload).then((response) => {
            console.log(response.message, "-")
            if (response) {
                swal({
                    show: true,
                    title: 'Success',
                    text: 'Successfully Form Submitted',
                    icon: "success"
                })
            }
        }).catch((e) => {
            console.log(e)
        })
    }
    return (
        <>
            <div className="popup-wrapper" >
                <div className="popup-container" style={{ width: "800px" }} >
                    <img src={closeIcon} className="popup-close-icon" onClick={props.handleCloseModel} />
                    <div className="container edit-client-container p-4">
                        <div className="d-flex flex-column edit-client-header text-center">
                            <div className="edit-client-title">Just before we start</div>
                            <h4>Please add your personalize logo and message</h4>

                        </div>
                        <div className="row mt-4">
                            <div className="col-sm-8 ">
                                <div className="text-center pt-2">
                                    <input type="file"
                                        className="form-control d-none"
                                        id="userImage"
                                        name="userImage"
                                        placeholder="Upload Image"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        onChange={handleInputField}
                                        ref={fileInputRef}
                                    />
                                    <button className="file-uplod-cst p-2 " type="button" onClick={handleButtonClick}>Upload your logo</button><br></br>
                                    <span> Recommended size 299X299 px</span><br></br>
                                    <span>500 kb max size</span><br></br>
                                    <span>Format PNG or JPG</span><br></br>
                                </div>
                            </div>
                            <div className="col-sm-4 text-center ">
                                {file !== undefined ? <>
                                    <div className="fluid-container">
                                        <img src={file} className="rounded-circle" style={{ "width": "50%" }} />
                                    </div>
                                </> : <img src={UplodIMg} className="rounded-circle" style={{ "width": "50%" }} />}

                            </div>
                        </div>
                        <div class="row">
                            <div class=" col-md-12 form-group mt-4">
                                <div class="card">
                                    <div class="card-body" style={{ "background": "#f8f8f8" }}>
                                        <div className="d-flex justify-content-between ">

                                            <h5 class="card-title">Add Personal Email Format for your Client</h5>

                                            <span className="justify-content-end cst-class-edit"><img src={editIcon} className="img-fluid" /></span>
                                        </div>
                                        <div class="form-group mb-3">
                                            <input type="text" class="form-control" id="Subject" name="title" placeholder="Subject" />
                                        </div>
                                        <div class="form-group mb-3">
                                            <textarea class="form-control" id="title" name="title" placeholder="Email Text Format" cols="10" rows="4" style={{ "resize": "none" }}></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="row mb-3">
                        <div className="col-6"></div>
                        <div className="col-6 col-md-6">
                            <Button style={{ fontSize: '18px', marginRight: '30px' }} variant="secondary" text="Cancle" onClick={props.handleCloseModel} />
                            <Button style={{ fontSize: '18px', marginRight: '30px' }} variant="primary" text=" Save " onClick={handalsubmit} />
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PersonalizeLogoModel