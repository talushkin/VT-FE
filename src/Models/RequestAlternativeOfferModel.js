import React from 'react'
import InputField from '../components/InputField'
import Button from '../components/Buttons/Button/Button'
import closeIcon from '../assets/icons/closeIcon.png';
const RequestAlternativeOfferModel = () => {
    return (
        <>
            <div className="popup-wrapper" >
                <div className="popup-container p-2" style={{ width: "1600px" }} >
                    <img src={closeIcon} className="popup-close-icon" />
                    <div className="edit-client-container px-5">
                        <div className="edit-client-header" style={{ "display": "block" }}>
                            <div className="edit-client-title text-center">Request an Alternative Offer</div>
                            <h6 className='text-center'>We have all your details and are just waiting for you to add your name and your preferences, <br />
                                so we’re able to give you an alternative oer. </h6>
                        </div>
                        <div className="row mt-4" >
                            <div className="col-sm-6">
                                <InputField label="Client Full Name*" placeholder={"Enter email address"} style={{ marginTop: '20px' }} />
                            </div>
                            <div className="col-sm-6">
                                <InputField label="Extra Details - Add your Personal note*" placeholder={"Enter phone number"} style={{ marginTop: '20px' }} />
                            </div>
                        </div>
                        <hr className='mt-5' />
                        <div className="row" >
                            <div className="col">
                                <InputField label="Desitination" placeholder="London,UK" style={{ marginTop: '20px' }} />
                            </div>
                            <div className="col">
                                <InputField label="Arrive*" placeholder="+41-79-489-7021" style={{ marginTop: '20px' }} />
                            </div>
                            <div className="col">
                                <InputField label="Depart" placeholder="Merrlrmstr 16 ch 3780" style={{ marginTop: '20px' }} />
                            </div>
                            <div className="col">
                                <InputField label="Guest" placeholder="2 Guests , 2 Children" style={{ marginTop: '20px' }} />
                            </div>
                            <div className="col">
                                <InputField label="Bedroom" placeholder="1 Bedroom" style={{ marginTop: '20px' }} />
                            </div>
                        </div>
                        <hr className='mt-5' />
                        <div className="row" >
                            <div className="col-sm-3">
                                <InputField label="Price Range" placeholder="$30,000" style={{ marginTop: '20px' }} />
                            </div>
                            <div className="col-sm-3">
                                <InputField label="Property Type" placeholder="Beach House" style={{ marginTop: '20px' }} />
                            </div>
                            <div className="col-sm-3">
                                <InputField label="Must Have" placeholder="Pool" style={{ marginTop: '20px' }} />
                            </div>
                            <div className="col-sm-3">
                                <InputField label="Amenities" placeholder={"Enter phone number"} style={{ marginTop: '20px' }} />
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="d-flex justify-content-end mb-3">
                        <Button style={{ fontSize: '18px', marginRight: '30px' }} variant="link" text="Cancel" />
                        <Button style={{ fontSize: '18px', marginRight: '30px' }} variant="primary" text="Send to Villa Treacker Team" />
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RequestAlternativeOfferModel