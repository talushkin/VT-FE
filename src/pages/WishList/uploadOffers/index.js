import React, { useEffect, useState, useRef } from "react";
import "./uploadOffers.scss";
import { CgFileDocument } from "react-icons/cg";
import Icon from "react-web-vector-icons";
import Button from "../../../components/Buttons/Button/Button";
import { baseURL } from "../../../core";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import LoadingBox from "../../../components/LoadingBox";
import loadingImage from '../../../assets/icons/loading_ajax.gif'

const UploadOffers = (props) => {

    const fileInputRef = useRef(null);
    const token = localStorage.getItem('jToken');
    const { title, wishlist, agent, agency } = props;
    console.log(wishlist, agent, agency)
    const[sortedOffers, setSortedOffers] = useState(typeof wishlist.offers !== 'undefined' ? wishlist.offers.sort((a, b) => moment(b.uploadedat).diff(moment(a.uploadedat))) : []);
    const [modalSize, setModalSize] = useState("modal-xl");
    const [pdfName, setPdfName] = useState('')
    const [fileError, setFileError] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setPdfName(file.name)
          const fileType = file.type
        //   const fileSize = file.size
        //   const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

          if (fileType !== 'application/pdf') {
            setFileError('Please upload a valid PDF file.');
            return;
          }
        //   if (fileSize > maxSize) {
        //     setFileError('File size should not exceed 5 MB.');
        //     return;
        //   }
            setFileError('');
            setFile(file)

        }
    };

    const handleIconClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
    };

    const userRequest = axios.create({
      baseURL: baseURL,//baseURL,
      headers: {
        token: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    const uploadOfferpdf = async () => {
        setLoading(true)
        let formData = new FormData();
        formData.append("offer", file);
        // const agentname = `${agent.firstName} ${agent.lastName}`
        const agent_id = agent.agent_id
        const agency_id = agent.agency_id
        // const agencyname = agent.agencyName
        const agent_role = agent.role
        const response = await userRequest.post(`/wishlist/upload-offers?wishlistid=${wishlist.wishlistId}&agent_id=${agent_id}&agency_id=${agency_id}&agent_role=${agent_role}`, formData);
        if(response.data?.status) {
          
          setSortedOffers(typeof response.data?.offers !== 'undefined' ?  response.data?.offers.sort((a,b) => moment(b.uploadedat).diff(moment(a.uploadedat))) : [])
          setLoading(false)
          swal({
            show: true,
            title: "Success",
            text: response.data?.message,
            icon: "success",
          }).then(() => {
            // props.onClose()
          })
        } else {
          swal({
            show: true,
            title: "error",
            text: response.data?.message,
            icon: "error",
          });
        }
        console.log(response)

    }
    const sendOffer = async (path) => {
        console.log(path)
        setLoading(true)
        if(path) {
          const offersendreq = axios.create({
            baseURL: baseURL,//baseURL,
            headers: {
              token: `Bearer ${token}`
            },
          });
          const agent_id = agent.agent_id
          const agency_id = agent.agency_id
          const agent_role = agent.role
          const data = {
            path
          }
          const response = await offersendreq.post(`/wishlist/send-offers?wishlistid=${wishlist.wishlistId}&agent_id=${agent_id}&agency_id=${agency_id}&agent_role=${agent_role}`, data);

          if(response.data?.status) {
            setSortedOffers(typeof response.data?.wishlist?.offers !== 'undefined' ?  response.data.wishlist.offers.sort((a,b) => moment(b.uploadedat).diff(moment(a.uploadedat))) : [])
            setLoading(false)
            swal({
              show: true,
              title: "Success",
              text: response.data?.message,
              icon: "success",
            })
          } else {
            swal({
              show: true,
              title: "error",
              text: response.data?.message,
              icon: "error",
            });
          }
        } else {
          setLoading(false)
          swal({
            show: true,
            title: "error",
            text: 'Offer not found',
            icon: "error",
          });
        }

    }
    
    return(
        <div className="popup-wrapper">
        <div class="modal" tabindex="-1">
          <div class={`modal-dialog modal-dialog-centered ${modalSize}`}>
            <div
              class="modal-content px-4 mobile-size-link"
              style={{ height: "auto", width: "957px", marginLeft: "110px" }}
            >
              <div class="modal-header py-0 m-0 px-0">
                <div
                  style={{
                    display: "flex",
                    // marginLeft: "auto",
                    marginTop: "16px",
                  }}
                >
                  {/* <imgs
                    src={icon}
                    alt="pdf"
                    className="mobile-pdf"
                    style={{ width: "26px", marginRight: "15px" }}
                  /> */}
                  <CgFileDocument style={{ color: "#707070", fontSize: "26px", marginTop: '10px', marginRight: '10px' }} />
                  <h4
                    className="text-left pt-2"
                    style={{ color: "#284866", fontWeight: "bold" }}
                  >
                    {title}{` (#${wishlist.wishlistNumber} ${wishlist.wishlistId})`}
                  </h4>
                </div>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ marginRight: "-22px", marginTop: "-31px" }}
                  onClick={props.onClose}
                ></button>
              </div>
              
              <hr className="customhr"></hr>
              <div className="row border-bottom mt-3" style={{alignItems: 'center'}}>
                {/* <LoadingBox visible={loading} /> */}
                {
                  loading && <span style={{position:'absolute', top: '35%', left: '42%'}}><img className="loading-image" src={loadingImage} alt="Loading" /></span>
                }
                 
                <div className="col-md-6 col-sm-6 col-6 mb-3 mt-2 text-center">
                  <b>Offer</b>
                </div>
                
                <div className="col-md-2 col-sm-2 col-2 mb-3 mt-2 text-center">
                  <b>Last Send</b>
                </div>
                <div className="col-md-4 col-sm-4 col-4 mb-3 mt-2 text-center">
                <b>Send Offers</b>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-sm-12 col-12 mb-12" style={{maxHeight: '400px', overflow: 'auto'}}>
                {
                  sortedOffers.map((offer,i) => {
                    return (
                      <div className="row border-bottom mt-2" style={{alignItems: 'center'}}>
                        <div className="col-md-6 col-sm-6 col-6 text-center">
                          <a href={`${offer.path && offer.path}`} target="_blank">{offer.path && offer.path.split('/').pop()}</a>
                        </div>
                        
                        <div className="col-md-2 col-sm-2 col-2 text-center pl-25">
                          {offer.lastsendat && moment(offer.lastsendat).format('DD-MM-YYYY')}
                        </div>
                        <div className="col-md-4 col-sm-4 col-4 mb-2 text-center pl-25">
                          <Button
                            style={{ fontSize: "18px", backgroundColor: offer.lastsendat ? '#1B9C5D' : '#9C1B35' }}
                            text={<Icon name="send" font="Feather" color="#ffffff" size={20} style={{ cursor: "pointer", marginLeft: '5%' }} />}
                            disabled={''}
                            onClick={() => sendOffer(offer.path)}
                          />
                        </div>
                      </div>
                    )
                  })
                }
                </div>
              </div>
              
              <div class="w-auto" style={{ marginTop: "35px" }}>
                <div className="row">
                  <div className="d-flex justify-content-between flex-wrap">
                    
                    <div className="col-md-12 col-sm-12 col-12 mb-12">
                      <div>
                        <label className="fw-bolder" htmlFor="country">
                          Upload Offer Pdf
                        </label>
                        <span onClick={handleIconClick}>
                            <Icon
                                name="pluscircle"
                                font="AntDesign"
                                color="#165093"
                                size={20}
                                style={{ cursor: "pointer", marginLeft: '5%' }}
                            />
                        </span>
                        <span style={{marginLeft: '5%'}}>
                            { pdfName }
                        </span>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="application/pdf"
                            onChange={handleFileChange}
                        />
                      </div>
                      {/* <br /> */}
                      {fileError && <p style={{ color: 'red', marginTop: '10px' }}>{fileError}</p>}
                    </div>

                   
                  </div>
                </div>
                
              </div>
              <div className="mt-2 mb-3">
                <hr className="mt-5" />
                
                <div
                  className="float-end"
                  style={{ marginRight: "-10px", marginBottom: "-4px" }}
                >
                  <Button
                    style={{ fontSize: "18px", marginRight: "30px" }}
                    variant="link"
                    text="Cancel"
                    onClick={props.onClose}
                  />
                  <Button
                    style={{ fontSize: "18px" }}
                    text="Upload"
                    disabled={''}
                    onClick={uploadOfferpdf}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default UploadOffers