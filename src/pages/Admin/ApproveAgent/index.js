import React, { useEffect, useState } from "react";
import Button from "../../../components/Buttons/Button/Button";
import InputField from "../../../components/InputField";
import TextAreaField from "../../../components/TextAreaField";

import './ApproveAgent.scss';
import swal from "sweetalert";
import AuthService from "../../../services/auth.service";
import { timers } from "jquery";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ApproveAgent = (agency, props) => {
	const { onClose } = props;
	const history = useHistory();
	const [Email, setEmail] = useState(agency?.agency?.agencyDetails[0]?.email);
	const [address, setAddress] = useState('adminer@villatracker.com');
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
		console.log("AGENCY", agency.agency);

	}, []);

	const onclickSubmit = () => {
		const agent = JSON.parse(localStorage.getItem("agent"));
		var submitPayload = {
			approvedAgent: Email,
			cc: address,
			adminAgent:agent,
			approving_agent_name:agent.firstName+' '+agent.lastName||'',
			approving_agent_id:agent.agent_id

		}
		console.log(submitPayload, "approve agency")
		AuthService.travelAgencyApproval(submitPayload, agency?.agency?.agencyDetails[0]?.agency_id).then((response) => {
			console.log(response, "response")
			swal({
				icon: "success",
				show: true,
				title: 'Success',
				text: response?.message,
				timer:3000
			})
			// history.push('/admin');
			agency.getAllAgencies();
			setTimeout(() => {
			// 	// if (response?.message == "Allready new travel partner approved") {
			// 		window.location.reload();
				agency.onClose()
			// 	// }
			}, 1000);

			 agency.onClose()

		}).catch((e) => {
			swal({
				icon: "error",
				show: true,
				title: 'Opps!!',
				text: e.message,
				timer:3000,
			})
		})
		document.body.style.overflow = 'hidden';
	}

	const deleteAgency = () => {
		try {
			AuthService.deleteAgency(agency?.agency?.agencyDetails[0]?.agency_id).then((response) => {
				console.log(response, "response")
				swal({
					icon: "success",
					show: true,
					title: 'Success',
					text: response?.message,
					timer:3000
				})
				agency.getAllAgencies();
				setTimeout(() => {
					agency.onClose()
				}, 1000);
			}).catch((e) => {
				throw new Error(e?.message)
			})
		} catch (error) {
			console.error("Error deleting agency:", error);
			swal({
				icon: "error",
				show: true,
				title: 'Opps!!',
				text: error.message,
				timer:3000,
			})
			setTimeout(() => {
				agency.onClose()
			}, 1000);
		}
	}
	return (
		<div className="approve-agent-container">
			<div className="approve-agent-header">
				<div className="approve-agent-title">Approving by Admin:</div>
				<div className="approve-agent-sub-header">
					<div>Main Agent : <b>{agency?.agency?.agencyDetails[0]?.firstName }</b></div>
					<div className="approve-agent-sub-header-separator" />
					<div>Agency: <b>{agency?.agency?.agencyDetails[0]?.agencyName}</b></div>
				</div>
			</div>

			<div className="approve-agent-main">

				<InputField label="Emails will be sent to agent at :" labelStyle={{ fontWeight: 500, fontSize: '20px', color: '#707070' }} value={Email} onChange={setEmail} placeholder={"Enter email address"} />
				<InputField label="Internal CC to:" labelStyle={{ fontWeight: 500, fontSize: '20px', color: '#707070' }} value={address} onChange={setAddress} placeholder={"Enter email address"} style={{ marginTop: '20px' }} />
			</div>

			<div className="float-end" style={{padding: '14px 11px 10px 0px'}}>
				<Button
					style={{ fontSize: '18px', marginRight: '30px' }}
					variant="link"
					text="Cancel"
					onClick={agency.onClose}
				/>
				<Button
					style={{ fontSize: '18px', backgroundColor: '#d40000', color: '#ffffff',  marginRight: '3px' }}
					text="Delete"
					onClick={deleteAgency}
				/>
				<Button
					style={{ fontSize: '18px' }}
					text="Confirm"
					onClick={onclickSubmit}
					disabled={agency?.agency?.agencyDetails[0]?.status === 'approved'}
				/>
			</div>
		</div>
	)
};

export default ApproveAgent;