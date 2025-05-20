import React, { useEffect, useState } from "react";
import Button from "../../../components/Buttons/Button/Button";
import './BankDetails.scss';
import swal from "sweetalert";

const BankDetails = ({ formData, agent, handleInputField, onClose }) => {
	const [modalSize, setModalSize] = useState('modal-xl');

	useEffect(() => {
		console.log(window.innerWidth, "window.innerWidth")
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

	const handleSave = () => {
		// Perform save action here

		// Show SweetAlert success message
		swal({
			show: true,
			icon: "success",
			title: "Success",
			text: "Bank details updated successfully!", // Replace with your response message
		}).then(() => {
			// Close modal or perform any other action after user confirms the success message
			onClose();
		});
	};
	return (
		<>
			<div className="popup-wrapper">
				<div class="modal" tabindex="-1">
					<div class={`modal-dialog modal-dialog-centered ${modalSize}`}>
						<div class="modal-content mobile-bank-width" style={{width: '55%', marginLeft: '20%'}}>
							<div class="modal-header py-0 px-3">
								<h5 class="modal-title text-center"> </h5>
							</div>
							<div className="modal-header py-0 text-center mobile-bank" style={{paddingLeft:'11.5rem'}}>
							<h2 class="text-center" style={{color:'#304B64',fontWeight:'bold', marginTop: '15px'}}>My Bank Details</h2>
								<button type="button" style={{marginRight: '-12px', marginTop: '-10px'}} class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
							</div>
							<hr></hr>
							<div class="modal-body" style={{padding:'0rem'}}>
								<div className="row">
									<div className="col-md-6" >
										<div className="col-md-6 col-12 mb-3 px-4 w-100 fw-bolder ">
											<label for="holderFirstName">Holders Name*</label>
											<input className="form-control" onChange={handleInputField} value={formData?.holderFirstName} name="holderFirstName" placeholder={"Enter holders name"} disabled={agent?.role === "agent" ? true : false} />
										</div>
										<div className="col-md-6 col-12 mb-3 px-4 w-100 fw-bolder">
											<label for="holderAdress">Address*</label>
											<input className="form-control" onChange={handleInputField} value={formData?.holderAdress} name="holderAdress" placeholder={"Enter address"} disabled={agent?.role === "agent" ? true : false} />
										</div>

										<div className="col-md-6 col-12 mb-3 px-4 w-100 fw-bolder">
											<label for="holderCity">City*</label>
											<input className="form-control" onChange={handleInputField} value={formData?.holderCity} name="holderCity" placeholder={"Enter city"} disabled={agent?.role === "agent" ? true : false} />
										</div>
										<div className="col-md-6 col-12 mb-3 px-4 w-100 fw-bolder">
											<label for="holderCountry">Country*</label>
											<input className="form-control" onChange={handleInputField} value={formData?.holderCountry} name="holderCountry" placeholder={"Enter country"} disabled={agent?.role === "agent" ? true : false} />
										</div>
										<div className="col-md-6 col-12 mb-3 px-4 w-100 fw-bolder">

											<label for="holderPostalCode">Postal Code*</label>
											<input className="form-control" onChange={handleInputField} value={formData?.holderPostalCode} name="holderPostalCode" placeholder={"Enter country"} disabled={agent?.role === "agent" ? true : false} />
										</div>

									</div>
									<div className="col-md-6" >
										<div className="col-md-6 col-12 mb-3 px-4 w-100 fw-bolder">
											<label for="IBAN">IBAN / Account Number*</label>
											<input className="form-control" onChange={handleInputField} value={formData?.IBAN} name="IBAN" placeholder={"Enter IBAN / Account Number"} disabled={agent?.role === "agent" ? true : false} />
										</div>
										<div className="col-md-6 col-12 mb-3 px-4 w-100 fw-bolder">
											<label for="bankName">Bank Name*</label>
											<input className="form-control" onChange={handleInputField} value={formData?.bankName} name="bankName" placeholder={"Enter bank name"} disabled={agent?.role === "agent" ? true : false} />
										</div>
										<div className="col-md-6 col-12 mb-3 px-4 w-100 fw-bolder">
											<label for="swift">SWIFT / BIC*</label>
											<input className="form-control" onChange={handleInputField} value={formData?.swiftNumber} name="swiftNumber" placeholder={"Enter SWIFT / BIC"} disabled={agent?.role === "agent" ? true : false} />
										</div>
										<div className="col-md-6 col-12 mb-3 px-4 w-100 fw-bolder">
											<label for="swift">Extra Details</label>
											<textarea className="form-control" name="extraDetails" onChange={handleInputField} value={formData?.extraDetails} rows={5} disabled={agent?.role === "agent" ? true : false}></textarea>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<hr></hr>
								<div className="float-end ">
									<Button style={{ fontSize: '18px', marginRight: '30px' }} variant="link" text="Cancel" onClick={onClose} />
									{agent?.role === "agent" ? "" : <Button style={{ fontSize: '18px' }} text="Save" onClick={handleSave} />}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
};

export default BankDetails;