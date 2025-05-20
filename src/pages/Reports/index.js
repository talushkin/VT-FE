import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader";
import pageBg from '../../assets/SigninPicNew_resize.png';
import Button from "../../components/Buttons/Button/Button";
import Icon from 'react-web-vector-icons';
import DatePickerArrival from "../../components/Forms/Fields/DatePickerArrival/DatePickerArrival";
import DatePickerDeparture from "../../components/Forms/Fields/DatePickerDeparture/DatePickerDeparture";
import searchLogo from '../../assets/icons/search.png';
import React, { useEffect, useState } from "react";
import * as propertyActions from '../../store/redux/Property/actions';
import { useLocation } from "react-router-dom";
import PropertyBox from "../SearchProperty/PropertyBox";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const Reports = props => {
	const { agency, agent } = props;
	const dispatch = useDispatch();
	const user = useSelector(state => state.user.user);
	// console.log('Pra agentagency',agent, agency)
	useEffect(() => {
		const load = async () => { };
		load();
	}, []);

	const [pageNumber, setPageNumber] = useState(0);
	const location = useLocation();
	const isLoading = useSelector(state => state.property.isLoading);
	const reservationReports = useSelector(state => state.property.reservationReports)
	const favorites = useSelector(state => state.property.favorites);
	const selectedProperties = useSelector(state => state.property.selectedProperties);
	const myparam = location.state && location.state.params;
	console.log("favorites", favorites);
	useEffect(() => {
		const load = async () => {
			dispatch(propertyActions.getreservationreport({agent_id: agent.agent_id, agency_id: agent.agency_id}));
		};
		load();
	}, []);
	useEffect(() => {
		console.log(reservationReports)
	}, [reservationReports]);

	const headerSearchRow = () => {
		return (
			<>
				<div className="m-4 row mx-2">
					<div className="col-lg-12 my-4 search-top-bar2 " style={{ display: "flex" }}>
						<div className="col-lg-1 mx-1">
							<TextField
								type="text"
								className="reservations-search-input form-control form-control-lg"
								placeholder="Week"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<CalendarMonthIcon />
										</InputAdornment>
									),
								}}
							/>
						</div>
						<div className="col-lg-2 mx-1">
							<DatePickerArrival />
						</div>
						<div className="col-lg-2 mx-1">
							<TextField
								type="text"
								className="reservations-search-input form-control form-control-lg"
								placeholder="New Reservation"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<AppRegistrationIcon />
										</InputAdornment>
									),
								}}
							/>
						</div>
						<div className="col-sm-1 mx-2">
							<Button
								style={{ height: '60px', fontSize: '20px' }}
								icon={<img src={searchLogo} style={{ width: '22px', marginRight: '5px' }} alt="" />}
								fullwidth={true}
								variant="green"
								text="Search"
							/>
						</div>
					</div>
				</div>
			</>
		)
	};

	const onToggleProperty = property => {
		dispatch(propertyActions.toggleProperty(property));
	};

	return (
		<>
			<div className="clients-container">
				<div style={{ backgroundImage: `url(${pageBg})`, backgroundSize: 'cover' }} >
					<div
						style={{ "backgroundColor": "rgba(19, 59, 113, 0.8)" }}
					>
						<PageHeader agent={agent} agency={agency} searchOpen={null} topBgColor="#16395C"></PageHeader>
						{headerSearchRow()}
					</div>
				</div>
			</div>
			
			<div className="p-4">
				<h3 className="mt-4 mb-4 page-title" style={{ fontSize: '40px', fontWeight: '500' }}>Reservation Report</h3>
				<div className="table-responsive cst-table-reservation other-cst-bg" style={{ marginBottom: '60px' }}>
					<table class="table text-center reservation-report" style={{ marginBottom: '0px' }}>
						<thead>
							<tr>
								<th scope="col" className="text-dark-blue text-color bg-color p-3" style={{ width: "185px" }}>By Period</th>
								<th scope="col" className="text-dark-blue text-color bg-dif-color p-3 ">New</th>
								<th scope="col" className="text-dark-blue text-color bg-dif-color p-3 ">Average Amt</th>
								<th scope="col" className="text-dark-blue text-color bg-dif-color p-3">Booking Revenue</th>
								<th scope="col" className="text-dark-blue text-color bg-dif-color p-3">Commission</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th scope="row" className="text-primary text-decoration-underline bg-color p-3" style={{ fontSize: '22px' }}>7 days</th>
								<td className="p-3 size-row">
									{
										reservationReports?.last7Days?.length ? reservationReports.last7Days[0].count : 0
									}
								</td>
								<td className="p-3 size-row">
									${
										reservationReports?.last7Days?.length ? reservationReports.last7Days[0].averageAmount.toFixed(0) : 0
									}
								</td>
								<td className="p-3 size-row">
									${
										reservationReports?.last7Days?.length ? reservationReports.last7Days[0].totalAmount.toFixed(0) : 0
									}
								</td>
								<td className="p-3 size-row">
									${
										reservationReports?.last7Days?.length ? reservationReports.last7Days[0].commission.toFixed(0) : 0
									}
								</td>
							</tr>
							<tr>
								<th scope="row" className="text-primary text-decoration-underline bg-color p-3" style={{ fontSize: '22px' }}>30 days</th>
								<td className="p-3 size-row">
									{
										reservationReports?.last30Days?.length ? reservationReports.last30Days[0].count : 0
									}
								</td>
								<td className="p-3 size-row">
									${
										reservationReports?.last30Days?.length ? reservationReports.last30Days[0].averageAmount.toFixed(0) : 0
									}
								</td>
								<td className="p-3 size-row">
									${
										reservationReports?.last30Days?.length ? reservationReports.last30Days[0].totalAmount.toFixed(0) : 0
									}
								</td>
								<td className="p-3 size-row">
									${
										reservationReports?.last30Days?.length ? reservationReports.last30Days[0].commission.toFixed(0) : 0
									}
								</td>
							</tr>
							<tr>
								<th scope="row" className="text-primary text-decoration-underline bg-color p-3" style={{ fontSize: '22px' }}>365 days</th>
								<td className="p-3 size-row">
									{
										reservationReports?.last365Days?.length ? reservationReports.last365Days[0].count : 0
									}
								</td>
								<td className="p-3 size-row">
									${
										reservationReports?.last365Days?.length ? reservationReports.last365Days[0].averageAmount.toFixed(0) : 0
									}
								</td>
								<td className="p-3 size-row">
									${
										reservationReports?.last365Days?.length ? reservationReports.last365Days[0].totalAmount.toFixed(0) : 0
									}
								</td>
								<td className="p-3 size-row">
									${
										reservationReports?.last365Days?.length ? reservationReports.last365Days[0].commission.toFixed(0) : 0
									}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<h3 className="mt-4 page-title" style={{ fontSize: '30px', fontWeight: '500', color: '#165093' }}>Last 30-day Reservations</h3>
				<div className="col-md-12 mt-4 ">
					<div className="row" style={{ marginTop: '-20px', marginLeft: '-20px' }}>
						{favorites &&
							favorites?.listings?.map((property, i) => {
								const selected =
									selectedProperties.findIndex((p) => p._id === property._id) >
									-1;

								return (
									<PropertyBox
										dontSelect={true}
										key={i}
										favorited={true}
										property={property?.listing}
										selected={selected}
										onToggle={() => onToggleProperty(property)}
										onDemand={property?.tags.indexOf("onDemand") > -1}
									/>
								);
							})}
					</div>
				</div>
			</div>
			
			
		</>
	)
};

export default Reports;