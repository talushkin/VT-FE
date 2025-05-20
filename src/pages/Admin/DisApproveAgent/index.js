import React, {useEffect, useState} from "react";
import Button from "../../../components/Buttons/Button/Button";
import InputField from "../../../components/InputField";
import TextAreaField from "../../../components/TextAreaField";

import './ApproveAgent.scss';

const ApproveAgent = props => {
	const { onClose } = props;
	const [holdersName, setHoldersName] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [country, setCoutnry] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [iban, setIban] = useState('');
	const [bankName, setBankName] = useState('');
	const [swift, setSwift] = useState('');
	const [details, setDetails] = useState('');

	useEffect(() => {
		const load = async () => {

		};
		load();
	}, []);

	return (
		<div className="approve-agent-container">

			<div className="approve-agent-header">
				<div className="approve-agent-title">Approving by Admin:</div>
				<div className="approve-agent-sub-header">
					<div>Main Agent : <b>Moriya Rockman</b></div>
					<div className="approve-agent-sub-header-separator" />
					<div>Agency: <b>SmilingHouse</b></div>
				</div>
			</div>

			<div className="approve-agent-main">

				<InputField label="Emails will be sent to agent at :" labelStyle={{fontWeight: 500, fontSize: '20px', color: '#707070'}} value={holdersName} onChange={setHoldersName} placeholder={"Enter email address"} style={{width: '740px'}} />
				<InputField label="Internal CC to:" labelStyle={{fontWeight: 500, fontSize: '20px', color: '#707070'}} value={address} onChange={setAddress} placeholder={"Enter email address"} style={{width: '740px', marginTop: '20px'}} />
			</div>

			<div className="approve-agent-footer">
				<Button
					style={{fontSize: '18px', marginRight: '30px'}}
					variant="link"
					text="Cancel"
					onClick={onClose}
				/>
				<Button
					style={{fontSize: '18px'}}
					text="Confirm"
					onClick={onClose}
				/>
			</div>
		</div>
	)
};

export default ApproveAgent;