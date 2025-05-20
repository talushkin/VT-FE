import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import locationIcon from '../../../../assets/icons/location.png';

import './CountryRegionSelect.scss';
import AuthService from '../../../../services/auth.service';
import { useEffect } from 'react';

export default function CountryRegionSelect({ destination }) {
	const [value, setValue] = React.useState(null);
	const [data, setdata] = useState('')
	if (value) {
		destination = value.label;
		//console.log(destination);
		localStorage.setItem("destination", destination);
	}
	useEffect(() => {
		AuthService.DestinationsOptions().then((response) => {
			setdata(response.destinations)
		}).catch((e) => {
			console.log(e)
		})
	}, [])

	const countries = Object.entries(data).map(([countryCode, countryData]) => {
		const code = countryCode.slice(0, 2).toUpperCase();
		return {
			code,
			label: countryCode,
			category: "country"
		};
	});

	return (
		<>
			<Autocomplete
				placeholder='where to ?'
				freeSolo
				inputValue={destination}
				onChange={(event, newValue) => {
					setValue(newValue);
					destination = value.label;
				}}
				className="where-to-form-field"
				//sx={{ width: 150 }}
				options={countries}
				autoHighlight
				popupIcon={<img src={locationIcon} />}
				getOptionLabel={(option) => option.label}
				renderOption={(props, option) => (
					<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
						<img
							loading="lazy"
							width="30"
							src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
							srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
							alt=""
						/>
						{option.label} ({option.category})
					</Box>
				)}
				renderInput={(params) => (
					<div >
						<img src={locationIcon} style={{ position: 'absolute', transform: 'translateY(50%)', "margin-left": "12px" }} />
						<TextField
							placeholder={destination}
							{...params}
							inputProps={{
								...params.inputProps,
								autoComplete: 'new-password', // disable autocomplete and autofill
							}}

						/>
					</div>
				)}
			/>
		</>
	);
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
// const countries = [{
// 	"code": "AW",
// 	"label": "Aruba",
// 	"category": "country"
// }, {
// 	"code": "AT",
// 	"label": "Austria",
// 	"category": "country"
// }, {
// 	"code": "BB",
// 	"label": "Barbados",
// 	"category": "country"
// }, {
// 	"code": "CA",
// 	"label": "Canada",
// 	"category": "country"
// }, {
// 	"code": "KY",
// 	"label": "Cayman Islands",
// 	"category": "country"
// }, {
// 	"code": "CR",
// 	"label": "Costa Rica",
// 	"category": "country"
// }, {
// 	"code": "HR",
// 	"label": "Croatia",
// 	"category": "country"
// }, {
// 	"code": "CY",
// 	"label": "Cyprus",
// 	"category": "country"
// }, {
// 	"code": "CZ",
// 	"label": "Czechia",
// 	"category": "country"
// }, {
// 	"code": "DK",
// 	"label": "Denmark",
// 	"category": "country"
// }, {
// 	"code": "DO",
// 	"label": "Dominican Republic",
// 	"category": "country"
// }, {
// 	"code": "FI",
// 	"label": "Finland",
// 	"category": "country"
// }, {
// 	"code": "FR",
// 	"label": "France",
// 	"category": "country"
// }, {
// 	"code": "DE",
// 	"label": "Germany",
// 	"category": "country"
// }, {
// 	"code": "GR",
// 	"label": "Greece",
// 	"category": "country"
// }, {
// 	"code": "ID",
// 	"label": "Indonesia",
// 	"category": "country"
// }, {
// 	"code": "IL",
// 	"label": "Israel",
// 	"category": "country"
// }, {
// 	"code": "IT",
// 	"label": "Italy",
// 	"category": "country"
// }, {
// 	"code": "KE",
// 	"label": "Kenya",
// 	"category": "country"
// }, {
// 	"code": "MV",
// 	"label": "Maldives",
// 	"category": "country"
// }, {
// 	"code": "MX",
// 	"label": "Mexico",
// 	"category": "country"
// }, {
// 	"code": "MC",
// 	"label": "Monaco",
// 	"category": "country"
// }, {
// 	"code": "ME",
// 	"label": "Montenegro",
// 	"category": "country"
// }, {
// 	"code": "MA",
// 	"label": "Morocco",
// 	"category": "country"
// }, {
// 	"code": "NZ",
// 	"label": "New Zealand",
// 	"category": "country"
// }, {
// 	"code": "PA",
// 	"label": "Panama",
// 	"category": "country"
// }, {
// 	"code": "PH",
// 	"label": "Philippines",
// 	"category": "country"
// }, {
// 	"code": "PT",
// 	"label": "Portugal",
// 	"category": "country"
// }, {
// 	"code": "PR",
// 	"label": "Puerto Rico",
// 	"category": "country"
// }, {
// 	"code": "RO",
// 	"label": "Romania",
// 	"category": "country"
// }, {
// 	"code": "MF",
// 	"label": "SAINT MARTIN",
// 	"category": "country"
// }, {
// 	"code": "SC",
// 	"label": "Seychelles",
// 	"category": "country"
// }, {
// 	"code": "SI",
// 	"label": "Slovenia",
// 	"category": "country"
// }, {
// 	"code": "ZA",
// 	"label": "South Africa",
// 	"category": "country"
// }, {
// 	"code": "ES",
// 	"label": "Spain",
// 	"category": "country"
// }, {
// 	"code": "LK",
// 	"label": "Sri Lanka",
// 	"category": "country"
// }, {
// 	"code": "CH",
// 	"label": "Switzerland",
// 	"category": "country"
// }, {
// 	"code": "TH",
// 	"label": "Thailand",
// 	"category": "country"
// }, {
// 	"code": "BL",
// 	"label": "The Caribbeans",
// 	"category": "country"
// }, {
// 	"code": "GD",
// 	"label": "The Carribean",
// 	"category": "country"
// }, {
// 	"code": "TR",
// 	"label": "Turkey",
// 	"category": "country"
// }, {
// 	"code": "AE",
// 	"label": "United Arab Emirates",
// 	"category": "country"
// }, {
// 	"code": "GB",
// 	"label": "United Kingdom",
// 	"category": "country"
// }, {
// 	"code": "US",
// 	"label": "United States",
// 	"category": "country"
// }, {
// 	"code": "VG",
// 	"label": "Virgin Islands",
// 	"category": "country"
// }, {
// 	"code": "PT",
// 	"label": "Alentejo",
// 	"category": "region"
// }, {
// 	"code": "PT",
// 	"label": "Algarve Region",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Alx-En-Provence",
// 	"category": "region"
// }, {
// 	"code": "ES",
// 	"label": "Andalusia",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Andros",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Antibes",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Apulia",
// 	"category": "region"
// }, {
// 	"code": "US",
// 	"label": "Arizona",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Athens",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Attica",
// 	"category": "region"
// }, {
// 	"code": "ES",
// 	"label": "Balearic Islands",
// 	"category": "region"
// }, {
// 	"code": "ID",
// 	"label": "Bali",
// 	"category": "region"
// }, {
// 	"code": "ES",
// 	"label": "Benahavís",
// 	"category": "region"
// }, {
// 	"code": "AT",
// 	"label": "Bludenz",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Brac",
// 	"category": "region"
// }, {
// 	"code": "VG",
// 	"label": "British Virgin Islands",
// 	"category": "region"
// }, {
// 	"code": "MX",
// 	"label": "Cabo San Lucas",
// 	"category": "region"
// }, {
// 	"code": "US",
// 	"label": "California",
// 	"category": "region"
// }, {
// 	"code": "MX",
// 	"label": "California Sur",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Campania",
// 	"category": "region"
// }, {
// 	"code": "ZA",
// 	"label": "Camps Bay",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Cannes",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Chamonix",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Čiovo Island",
// 	"category": "region"
// }, {
// 	"code": "IL",
// 	"label": "Coast Line",
// 	"category": "region"
// }, {
// 	"code": "US",
// 	"label": "Colorado",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Combloux",
// 	"category": "region"
// }, {
// 	"code": "PT",
// 	"label": "Comporta",
// 	"category": "region"
// }, {
// 	"code": "DK",
// 	"label": "Copenhagen",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Corfu",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Corsica",
// 	"category": "region"
// }, {
// 	"code": "ES",
// 	"label": "Costa Brava",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Courchevel",
// 	"category": "region"
// }, {
// 	"code": "CH",
// 	"label": "Crans Montana",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Crete",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Croatia",
// 	"category": "region"
// }, {
// 	"code": "MX",
// 	"label": "Cruz de Huanacaxtle",
// 	"category": "region"
// }, {
// 	"code": "CY",
// 	"label": "Cyprus",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Dalmatia",
// 	"category": "region"
// }, {
// 	"code": "AE",
// 	"label": "Dubai",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Dubrovnik",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Dubrovnik-Neretva",
// 	"category": "region"
// }, {
// 	"code": "IL",
// 	"label": "Eilat",
// 	"category": "region"
// }, {
// 	"code": "GB",
// 	"label": "England",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Epirus",
// 	"category": "region"
// }, {
// 	"code": "US",
// 	"label": "Florida",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "France",
// 	"category": "region"
// }, {
// 	"code": "DE",
// 	"label": "Germany",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Greece",
// 	"category": "region"
// }, {
// 	"code": "CH",
// 	"label": "Gstaad Region",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Halkidiki",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Hvar",
// 	"category": "region"
// }, {
// 	"code": "ES",
// 	"label": "Ibiza",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Ionian Islands",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Istria",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Italy",
// 	"category": "region"
// }, {
// 	"code": "MX",
// 	"label": "Jalisco",
// 	"category": "region"
// }, {
// 	"code": "IL",
// 	"label": "Jerusalem",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Kea",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Kefalonia",
// 	"category": "region"
// }, {
// 	"code": "TH",
// 	"label": "Koh Samui",
// 	"category": "region"
// }, {
// 	"code": "DO",
// 	"label": "La Romana",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Lake Como",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Lazio",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Le Marche",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Lefkada",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Liguria",
// 	"category": "region"
// }, {
// 	"code": "PT",
// 	"label": "Lisbon",
// 	"category": "region"
// }, {
// 	"code": "GB",
// 	"label": "Llangennith",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Lombardy",
// 	"category": "region"
// }, {
// 	"code": "CH",
// 	"label": "Luzern and Lakes",
// 	"category": "region"
// }, {
// 	"code": "ES",
// 	"label": "Mallorca",
// 	"category": "region"
// }, {
// 	"code": "ES",
// 	"label": "Marbella",
// 	"category": "region"
// }, {
// 	"code": "MA",
// 	"label": "Marrakech",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Megeve",
// 	"category": "region"
// }, {
// 	"code": "ID",
// 	"label": "Mengwi",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Meribel",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Milos",
// 	"category": "region"
// }, {
// 	"code": "CA",
// 	"label": "Montreal",
// 	"category": "region"
// }, {
// 	"code": "TR",
// 	"label": "Mugla",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Mykonos",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Naxos",
// 	"category": "region"
// }, {
// 	"code": "MX",
// 	"label": "Nayarit",
// 	"category": "region"
// }, {
// 	"code": "US",
// 	"label": "New York",
// 	"category": "region"
// }, {
// 	"code": "ID",
// 	"label": "North Kuta",
// 	"category": "region"
// }, {
// 	"code": "PT",
// 	"label": "Northern Portugal",
// 	"category": "region"
// }, {
// 	"code": "MX",
// 	"label": "Nuevo Vallarta",
// 	"category": "region"
// }, {
// 	"code": "CA",
// 	"label": "Ontario",
// 	"category": "region"
// }, {
// 	"code": "PA",
// 	"label": "Panama City",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Paros",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Paxos",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Peloponese",
// 	"category": "region"
// }, {
// 	"code": "TH",
// 	"label": "Phuket",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Piedmont",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Porto Cheli",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Primorje-Gorski Kotar",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Provence",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "ProvenceAlpesCote dAzur",
// 	"category": "region"
// }, {
// 	"code": "PR",
// 	"label": "Puerto Rico",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Puglia",
// 	"category": "region"
// }, {
// 	"code": "DO",
// 	"label": "Punta Cana",
// 	"category": "region"
// }, {
// 	"code": "MX",
// 	"label": "Punta Mita",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Rhodes",
// 	"category": "region"
// }, {
// 	"code": "BB",
// 	"label": "Saint James",
// 	"category": "region"
// }, {
// 	"code": "BB",
// 	"label": "Saint Peter",
// 	"category": "region"
// }, {
// 	"code": "MX",
// 	"label": "San Jose del Cabo",
// 	"category": "region"
// }, {
// 	"code": "ES",
// 	"label": "Sant Antoni de Portmany",
// 	"category": "region"
// }, {
// 	"code": "ES",
// 	"label": "Sant Rafel",
// 	"category": "region"
// }, {
// 	"code": "ES",
// 	"label": "Santa Gertrudis de Fruitera",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Santorini",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Sardinia",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Saronic Island",
// 	"category": "region"
// }, {
// 	"code": "MX",
// 	"label": "Sayulita",
// 	"category": "region"
// }, {
// 	"code": "GB",
// 	"label": "Scotland",
// 	"category": "region"
// }, {
// 	"code": "IL",
// 	"label": "Sea of Galilee",
// 	"category": "region"
// }, {
// 	"code": "SC",
// 	"label": "Seychelles",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Sibenik-Knin",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Sicily",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Sifnos",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "South Aegean",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Spetses",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Split",
// 	"category": "region"
// }, {
// 	"code": "HR",
// 	"label": "Split-Dalmatia",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Sporades",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "St Tropez",
// 	"category": "region"
// }, {
// 	"code": "BL",
// 	"label": "St. Barts",
// 	"category": "region"
// }, {
// 	"code": "TH",
// 	"label": "Surat Thani",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Syros",
// 	"category": "region"
// }, {
// 	"code": "IL",
// 	"label": "Tel Aviv",
// 	"category": "region"
// }, {
// 	"code": "GB",
// 	"label": "Tenby",
// 	"category": "region"
// }, {
// 	"code": "US",
// 	"label": "Tennessee",
// 	"category": "region"
// }, {
// 	"code": "US",
// 	"label": "Texas",
// 	"category": "region"
// }, {
// 	"code": "BL",
// 	"label": "The Caribbeans",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "TrentinoAlto Adige",
// 	"category": "region"
// }, {
// 	"code": "MX",
// 	"label": "Tulum",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Tuscany",
// 	"category": "region"
// }, {
// 	"code": "IT",
// 	"label": "Umbria",
// 	"category": "region"
// }, {
// 	"code": "US",
// 	"label": "Utah",
// 	"category": "region"
// }, {
// 	"code": "FR",
// 	"label": "Val d-isere",
// 	"category": "region"
// }, {
// 	"code": "CH",
// 	"label": "Verbier Region",
// 	"category": "region"
// }, {
// 	"code": "CH",
// 	"label": "Villars",
// 	"category": "region"
// }, {
// 	"code": "GB",
// 	"label": "Wales",
// 	"category": "region"
// }, {
// 	"code": "ZA",
// 	"label": "Western Cape",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Zakynthos",
// 	"category": "region"
// }, {
// 	"code": "CH",
// 	"label": "Zermatt",
// 	"category": "region"
// }, {
// 	"code": "GR",
// 	"label": "Agios Ioannis Diakoftis",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Aix-en-Provence",
// 	"category": "city"
// }, {
// 	"code": "PT",
// 	"label": "Almancil",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Ampelas",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Andros",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Ano Mera",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Antibes",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Arezzo",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Athenian Riviera",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Athens center",
// 	"category": "city"
// }, {
// 	"code": "US",
// 	"label": "Austin",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Bagnes",
// 	"category": "city"
// }, {
// 	"code": "ID",
// 	"label": "Bali",
// 	"category": "city"
// }, {
// 	"code": "IL",
// 	"label": "Ben Ami",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Benahavis",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Bevagna",
// 	"category": "city"
// }, {
// 	"code": "US",
// 	"label": "Beverly Hills",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Bol",
// 	"category": "city"
// }, {
// 	"code": "PT",
// 	"label": "Boliqueime",
// 	"category": "city"
// }, {
// 	"code": "MX",
// 	"label": "Cabo San Lucas",
// 	"category": "city"
// }, {
// 	"code": "IL",
// 	"label": "Caesarea",
// 	"category": "city"
// }, {
// 	"code": "ZA",
// 	"label": "Camps Bay",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Can Negre",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Cannes",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Capannori",
// 	"category": "city"
// }, {
// 	"code": "ZA",
// 	"label": "Cape Town",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Capo Coda Cavallo",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Castiglion Fiorentino",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Cavalese",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Cefalu",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Chamonix-Mont-Blanc",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Chania",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Chateau-doex",
// 	"category": "city"
// }, {
// 	"code": "BL",
// 	"label": "Colombier",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Combloux",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Como",
// 	"category": "city"
// }, {
// 	"code": "PT",
// 	"label": "Comporta",
// 	"category": "city"
// }, {
// 	"code": "DK",
// 	"label": "Copenhagen",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Corfu",
// 	"category": "city"
// }, {
// 	"code": "BL",
// 	"label": "Corossol",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Courchevel",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Courtabœuf Cedex",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Crans-Montana",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Crete",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Crete-rethymnon",
// 	"category": "city"
// }, {
// 	"code": "MX",
// 	"label": "Cruz de Huanacaxtle",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Demi-Quartier",
// 	"category": "city"
// }, {
// 	"code": "PR",
// 	"label": "Dorado",
// 	"category": "city"
// }, {
// 	"code": "AE",
// 	"label": "Dubai",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Dubrovnik",
// 	"category": "city"
// }, {
// 	"code": "IL",
// 	"label": "Eilat",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Eivissa",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Elia",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Estepona",
// 	"category": "city"
// }, {
// 	"code": "PT",
// 	"label": "Faro",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Faros Armenistis",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Ftelia",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Gassin",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Gryon",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Gstaad",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Gsteig",
// 	"category": "city"
// }, {
// 	"code": "BL",
// 	"label": "Gustavia",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Halkidiki",
// 	"category": "city"
// }, {
// 	"code": "IL",
// 	"label": "Herzliya",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Hvar",
// 	"category": "city"
// }, {
// 	"code": "IL",
// 	"label": "Jerusalem",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Kalafati",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Kea",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Kefalonia",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Kerkira",
// 	"category": "city"
// }, {
// 	"code": "TH",
// 	"label": "Ko Samui",
// 	"category": "city"
// }, {
// 	"code": "TH",
// 	"label": "Koh Samui",
// 	"category": "city"
// }, {
// 	"code": "ID",
// 	"label": "Kuta Utara",
// 	"category": "city"
// }, {
// 	"code": "MX",
// 	"label": "La Cruz de Huanacaxtle",
// 	"category": "city"
// }, {
// 	"code": "DO",
// 	"label": "La Romana",
// 	"category": "city"
// }, {
// 	"code": "US",
// 	"label": "Lake Havasu City",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Lauenen",
// 	"category": "city"
// }, {
// 	"code": "AT",
// 	"label": "Lech",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Lefkada",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Lefkas",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Les Allues",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Les Houches",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Lesa",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Liscia di Vacca",
// 	"category": "city"
// }, {
// 	"code": "GB",
// 	"label": "Llangennith",
// 	"category": "city"
// }, {
// 	"code": "US",
// 	"label": "Los Angeles",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Lucca",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Marbella",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Marina",
// 	"category": "city"
// }, {
// 	"code": "MA",
// 	"label": "Marrakech",
// 	"category": "city"
// }, {
// 	"code": "MA",
// 	"label": "Marrakesh",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Megeve",
// 	"category": "city"
// }, {
// 	"code": "ID",
// 	"label": "Mengwi",
// 	"category": "city"
// }, {
// 	"code": "US",
// 	"label": "Miami",
// 	"category": "city"
// }, {
// 	"code": "US",
// 	"label": "Miami Beach",
// 	"category": "city"
// }, {
// 	"code": "IL",
// 	"label": "Migdal",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Mikonos",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Milna",
// 	"category": "city"
// }, {
// 	"code": "US",
// 	"label": "Moab",
// 	"category": "city"
// }, {
// 	"code": "CA",
// 	"label": "Montreal",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Mougins",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Mykonos",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Mykonos-Elia",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Mykonos-Kalafati",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Mykonos-Ornos",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Mykonos-Platis Gialos",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Naousa",
// 	"category": "city"
// }, {
// 	"code": "US",
// 	"label": "Nashville",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Naxos",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Nerja",
// 	"category": "city"
// }, {
// 	"code": "ID",
// 	"label": "North Kuta",
// 	"category": "city"
// }, {
// 	"code": "MX",
// 	"label": "Nuevo Vallarta",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Ollon",
// 	"category": "city"
// }, {
// 	"code": "US",
// 	"label": "Orlando",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Ornos",
// 	"category": "city"
// }, {
// 	"code": "PA",
// 	"label": "Panama City",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Paros",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Patmos",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Paxos",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Peloponnese",
// 	"category": "city"
// }, {
// 	"code": "ID",
// 	"label": "Pererenan",
// 	"category": "city"
// }, {
// 	"code": "BL",
// 	"label": "Petit Cul-de-Sac",
// 	"category": "city"
// }, {
// 	"code": "CY",
// 	"label": "Peyia",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Platis Gialos",
// 	"category": "city"
// }, {
// 	"code": "BL",
// 	"label": "Pointe Milou",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Porto Cervo",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Porto Cheli",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Primosten",
// 	"category": "city"
// }, {
// 	"code": "CY",
// 	"label": "Protaras",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Psarrou",
// 	"category": "city"
// }, {
// 	"code": "MX",
// 	"label": "Puerto Vallarta",
// 	"category": "city"
// }, {
// 	"code": "DO",
// 	"label": "Punta Cana",
// 	"category": "city"
// }, {
// 	"code": "MX",
// 	"label": "Punta de Mita",
// 	"category": "city"
// }, {
// 	"code": "MX",
// 	"label": "Punta Mita",
// 	"category": "city"
// }, {
// 	"code": "PT",
// 	"label": "Quarteira",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Ragusa",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Ramatuelle",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Rethymno",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Rhodes",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Rodos",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Rougemont",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Saanen",
// 	"category": "city"
// }, {
// 	"code": "IL",
// 	"label": "Safed",
// 	"category": "city"
// }, {
// 	"code": "BL",
// 	"label": "Saint Barthelemy",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Saint-Bon-Tarentaise",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Saint-Gervais-les-Bains",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Saint-Tropez",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "San Jose",
// 	"category": "city"
// }, {
// 	"code": "MX",
// 	"label": "San Jose del Cabo",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Sankt Niklaus",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Sant Antoni de Portmany",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Sant Joan de Labritja",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Sant Josep de sa Talaia",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Sant Rafel",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Santa Eulalia del Rio",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Santa Gertrudis de Fruitera",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Santorini",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Sarzana",
// 	"category": "city"
// }, {
// 	"code": "GB",
// 	"label": "Saundersfoot",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Savoie",
// 	"category": "city"
// }, {
// 	"code": "MX",
// 	"label": "Sayulita",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Schisma Elountas",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Schonried",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Selca",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Sifnos",
// 	"category": "city"
// }, {
// 	"code": "IT",
// 	"label": "Siracusa",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Skiathos",
// 	"category": "city"
// }, {
// 	"code": "VG",
// 	"label": "Spanish Town",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Spetses",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Split",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Sporades",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Sumartin",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Supetar",
// 	"category": "city"
// }, {
// 	"code": "TH",
// 	"label": "Surat Thani",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Sutivan",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Syros",
// 	"category": "city"
// }, {
// 	"code": "ES",
// 	"label": "Tamariu",
// 	"category": "city"
// }, {
// 	"code": "TH",
// 	"label": "Tambon Wichit",
// 	"category": "city"
// }, {
// 	"code": "IL",
// 	"label": "Tel Aviv-Yafo",
// 	"category": "city"
// }, {
// 	"code": "GB",
// 	"label": "Tenby",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Thira",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Tinos",
// 	"category": "city"
// }, {
// 	"code": "CA",
// 	"label": "Toronto",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Tourlos",
// 	"category": "city"
// }, {
// 	"code": "MX",
// 	"label": "Tulum",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Vabriga",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Val de Bagnes",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Val-dIsere",
// 	"category": "city"
// }, {
// 	"code": "FR",
// 	"label": "Vallauris",
// 	"category": "city"
// }, {
// 	"code": "SC",
// 	"label": "Vista Do Mar",
// 	"category": "city"
// }, {
// 	"code": "BL",
// 	"label": "Vitet",
// 	"category": "city"
// }, {
// 	"code": "US",
// 	"label": "Wading River",
// 	"category": "city"
// }, {
// 	"code": "GR",
// 	"label": "Zakynthos",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Zaton",
// 	"category": "city"
// }, {
// 	"code": "CH",
// 	"label": "Zermatt",
// 	"category": "city"
// }, {
// 	"code": "HR",
// 	"label": "Zrnovo",
// 	"category": "city"
// }];
