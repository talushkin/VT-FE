import React, { useEffect, useState } from "react";
import Button from "../../../components/Buttons/Button/Button";
import InputField from "../../../components/InputField";
import TextAreaField from "../../../components/TextAreaField";

import './EditDetails.scss';

const EditPropDetails = ({ pict,formData,property, handleInputField, onClose,onSave }) => {

	const agent = JSON.parse(localStorage.getItem("agent"));
	const agency = JSON.parse(localStorage.getItem("travelAgency"));
	 console.log(" property>>>", property);
	console.log("form data >>>", formData);




	useEffect((e) => {
		const load = async (e) => {

		};
		load(e);
	}, []);

	return (
		<div className="edit-details-container">
			<div className="model-body p-3">
				<div className="edit-details-header text-center mt-5 mb-5" style={{ fontSize: '40px' }}>{property?.listing?.title}</div>

				<div className="row">
					<div className="col-6 mb-3">
						<label for="status">Status</label>
						<input className="form-control" onChange={handleInputField} value={formData?.status} name="holderAdress" placeholder={"Enter address"} />
					</div>

					<div className="col-6 mb-3">
						<label for="city">City</label>
						<input className="form-control" onChange={handleInputField} value={formData?.city} name="holderCity" placeholder={"Enter city"} />

					</div>

					<div className="col-6 mb-3">

						<label for="country">Country</label>
						<input className="form-control" onChange={handleInputField} value={property?.xdata?.country} name="holderCountry" placeholder={"Enter country"} />
					</div>

					<div className="col-6 mb-3">
						<label for="Region">Region</label>
						<input className="form-control" onChange={handleInputField} value={property?.xdata?.state} name="Region" placeholder={"Region"} />
					</div>

					<div className="col-6 mb-3">
						<label for="agentName">Agent name</label>
						<input className="form-control" onChange={handleInputField} value={property?.xdata?.agentName||agent?.firstName+' '+agent?.lastName} name="agentName" placeholder={"Agent name"} />
					</div>

					<div className="col-6 mb-3">
						<label for="declineReason">Decline reason</label>
						<input className="form-control" onChange={handleInputField} value={property?.xdata.declineReason} name="declineReason" placeholder={"Enter Decline reason"} />
					</div>
					<div className="col-6 mb-3">
						<label for="GuestyTags">Guesty-Tags </label>
						<input className="form-control" name="guestyTags" readonly />
					</div>
					<div className="col-6 mb-3">
						<label for="x-Tags">extra Tags </label>
						<textarea className="form-control" name="extraTags" onChange={handleInputField} value={property?.xdata?.xtags} rows={2}></textarea>
					</div>

				</div>
				<img            
				className="property-main-picture text-center"
	               src={ property?.listing?.picture?.thumbnail }
            />
				<div className="row mb-5 mt-5">
					<div className="text-center">
						<Button style={{ fontSize: '25px', marginRight: '30px' }} variant="link" text="Cancel" onClick={onClose} />
						<Button style={{ fontSize: '25px' }} text="Save" onClick={onSave(property)} />
					</div>

				</div>
			</div>


		</div>
	)
};

export default EditPropDetails;