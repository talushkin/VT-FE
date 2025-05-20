import React, {useState, useEffect} from "react";
import PageHeaderTopRow from "../../components/PageHeaderTopRow";
import CountryRegionSelect from "../../components/Forms/Fields/CountryRegionAutocomplete/CountryRegionSelect";
import DatePickerArrival from "../../components/Forms/Fields/DatePickerArrival/DatePicker";
import DatePickerDeparture from "../../components/Forms/Fields/DatePickerDeparture/DatePicker";
import advancedSearch from '../../assets/btn-advanced-search.png';
import searchLogo from '../../assets/icons/search.png';
import GuestsPicker from "../../components/GuestsPicker";
import Button from "../Buttons/Button/Button";
import AdvancedSearch from "../../pages/SearchProperty/AdvancedSearch";

import './PageHeader.scss';
import Checkbox from "../Checkbox";

const NavbarTouch = props => {
	const [searchOpen, setSearchOpen] = useState(false);
	const {bgColor, topBgColor, doSearch, agent ,agency} = props;
	const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
	const [chkOnlyOnDemand, setChkOnlyOnDemand] = useState(false);
	const [chkOnlyWithPrice, setChkOnlyWithPrice] = useState(false);

	const toggleSearch = () => {
		setSearchOpen(!searchOpen);
	};

	useEffect(() => {
		const load = async () => {

		};
		load();
	}, []);

	return (
		<div className="page-header-container" style={{maxHeight: '255px', backgroundColor: bgColor, height: searchOpen ? '100%' : '100px'}}>

			{ showAdvancedSearch && <AdvancedSearch onClose={() => setShowAdvancedSearch(false)} /> }

			<PageHeaderTopRow agent={agent} agency={agency}  bgColor={topBgColor} searchOpen={searchOpen} onToggleSearch={toggleSearch} />

			<div className="page-header-property-top">
				<div className="page-header-top-row2">
					<div className="page-header-top-row2-button">
						<CountryRegionSelect />
					</div>
					<div className="page-header-top-row2-button">
						<DatePickerArrival/>
					</div>
					<div className="page-header-top-row2-button">
						<DatePickerDeparture/>
					</div>
					<div className="page-header-top-row2-button">
						<GuestsPicker />
					</div>
					<div className="page-header-top-row2-button">
						<Button
							onClick={() => doSearch(1, {params: 'a'})}
							style={{height: '60px', fontSize: '20px'}}
							icon={<img src={searchLogo} style={{width: '22px', marginRight: '5px'}} alt="" /> }
							fullwidth={true}
							variant="green"
							text="Search"
						/>
					</div>
					<div className="page-header-top-row2-button">
						<img src={advancedSearch} className="page-header-top-row2-button-advanced" alt="" onClick={() => setShowAdvancedSearch(true)} />
					</div>
				</div>
				<div className="page-header-top-row3">
					<Checkbox uid="chkOnlyWithPrice" checked={chkOnlyWithPrice} onChange={() => setChkOnlyWithPrice(!chkOnlyWithPrice)} label="Include only properties with price" />
					&nbsp;&nbsp;&nbsp;&nbsp;
					<Checkbox uid="chkOnlyOnDemand" checked={chkOnlyOnDemand} onChange={() => setChkOnlyOnDemand(!chkOnlyOnDemand)} label="Include only 'On Demand' properties" />
				</div>
			</div>
		</div>
	)
};

export default NavbarTouch;