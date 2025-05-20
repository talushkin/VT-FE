import React, { useState, useEffect } from 'react';
import Button from '../../../components/Buttons/Button/Button';
import { IoIosAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

const AddSubAgentModel = ({ addInputField, handleInputChange, inputFields, removeInputField, handleclosesubagent, handleSaveAgentForm }) => {
    const [validationErrors, setValidationErrors] = useState([]);
    const [submit, setSubmit] = useState(false);

    const handleFieldChange = (index, field, value) => {
        handleInputChange(index, field, value);
    };

    const validateFields = () => {
        console.log('inputs:',inputFields)
        const errors = inputFields.map((item) => (
            {
            firstName: !item.firstName ? 'Agent Full Name is required' : '',
            email: !item.email ? 'Email address is required' : '',
            SubAgentPhoneNumber: !item.SubAgentPhoneNumber ? 'Phone Number is required' : '',
        }));

        setValidationErrors(errors)
        return errors;
    };

    const saveForm = () => {
        const errors = validateFields();
        if (errors.every((error) => Object.values(error).every((val) => val === ''))) {
            handleSaveAgentForm();
        } else {
            setSubmit(true); // Set submit to true to display validation errors
        }
    };

    const [modalSize, setModalSize] = useState('modal-xl');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1366) {
                setModalSize('modal-xl');
            } else {
                setModalSize('modal-lg');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const removeLastInputField = () => {
        if (inputFields.length > 0) {
            removeInputField(inputFields.length - 1);
        }
    };

    return (
        <>
            <div className="popup-wrapper">
                <div className="modal" tabIndex="-1">
                    <div className={`modal-dialog modal-dialog-centered ${modalSize}`}>
                        <div className="modal-content">
                            <div className="modal-header py-0 px-2">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleclosesubagent}></button>
                            </div>
                            <div className="d-flex justify-content-center align-items-center">  
                                <button className="btn btn-outline px-0 py-0 ms-2" onClick={addInputField}><IoIosAddCircleOutline style={{ fontSize: "36px", color: '#304B64' }} /></button>
                                <button className="btn btn-outline px-0 py-0 ms-2" onClick={removeLastInputField}><IoMdRemoveCircleOutline style={{ fontSize: "36px", color: '#304B64' }} /></button>
                                <h3 className="m-0 mt-1 text-center" style={{ color: '#304B64', fontWeight: 'bold' }}>Add Sub Agent</h3>
                            </div>
                            <div className="text-center"><h5 style={{ color: '#304B64', fontWeight: 'bold' }}>(Up to 5 Agents)</h5></div>
                            <div className="modal-body px-0">
                                {inputFields?.map((item, index) => (
                                    <div className="row mb-4" key={index}>
                                        <hr className="text-muted"></hr>
                                        <div className="col-md-4 col-sm-6 mb-3 px-4">
                                            <label htmlFor={`firstName_${index}`} className="form-label fw-bolder">Agent Full Name*</label>
                                            <input
                                                className="form-control"
                                                placeholder="Enter agent full name"
                                                value={item.firstName}
                                                onChange={e => handleFieldChange(index, 'firstName', e.target.value)}
                                            />
                                            {validationErrors[index]?.firstName && (
                                                <div className="invalid-feedback-error">{validationErrors[index].firstName}</div>
                                            )}
                                        </div>
                                        <div className="col-md-4 col-sm-6 mb-3 px-4">
                                            <label htmlFor={`email_${index}`} className="form-label fw-bolder">Email address*</label>
                                            <input
                                                className="form-control"
                                                placeholder="Enter email address"
                                                value={item.email}
                                                onChange={e => handleFieldChange(index, 'email', e.target.value)}
                                            />
                                            {validationErrors[index]?.email && (
                                                <div className="invalid-feedback-error">{validationErrors[index].email}</div>
                                            )}
                                        </div>
                                        <div className="col-md-3 col-sm-6 mb-3 px-4">
                                            <label htmlFor={`SubAgentPhoneNumber_${index}`} className="form-label fw-bolder">Phone Number*</label>
                                            <PhoneInput
                                                country={"ch"}
                                                enableSearch={true}
                                                placeholder="Enter phone number"
                                                value={item.SubAgentPhoneNumber}
                                                onChange={value => handleFieldChange(index, 'SubAgentPhoneNumber', value)}
                                            />
                                            {validationErrors[index]?.SubAgentPhoneNumber && (
                                                <div className="invalid-feedback-error">{validationErrors[index].SubAgentPhoneNumber}</div>
                                            )}
                                        </div>
                                        <div className="col-md-1 col-sm-6 col-12 ">
                                            <div className="d-flex justify-content-end">
                                                <div className="d-flex flex-column align-items-center">
                                                    <p className="text-center m-0 px-0 py-0">Edit</p>
                                                    <button className="btn btn-outline" onClick={() => removeInputField(index)}>
                                                        <IoMdRemoveCircleOutline style={{ fontSize: "36px", color: 'lightgray' }} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <hr></hr>
                                <Button style={{ fontSize: '18px', marginRight: '30px' }} variant="link" text="Cancel" onClick={handleclosesubagent} />
                                <Button style={{ fontSize: '18px' }} text="Save" onClick={saveForm} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddSubAgentModel;
