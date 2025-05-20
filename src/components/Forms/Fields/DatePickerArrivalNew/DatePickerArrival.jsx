import * as React from 'react';
import dayjs from 'dayjs';
import NewCalendar from '../../../../assets/calendar/new-calendar.svg';

//import { Grid } from '@mui/material';

import './DatePickerArrival.scss';

const DatePickerArrival = (props) => {
	const [value, setValue] = React.useState(dayjs('2023-09-12').format("YYYY-MM-DD"));
	const {subTitle, date ,title='Feb 2025', max, doAdd}=props
	const month='Febuary'
	const year='2023'
	const days=['sun','mon','tue','wed','thu','fri','sat']
	const startDay='tue'

		return (
			<div className="search-form-field">
			<div>
				<div style={{fontSize: '25px'}}>{title}</div>
				{ subTitle && <div style={{fontSize: '20px', color: '#B4B4B4'}}>{subTitle}</div> }
			</div>
			<div style={{display: 'flex', alignItems: 'top'}}>
				<span style={{fontSize: '25px', color: '#707070', cursor: 'default', width: '50px', textAlign: 'center'}}>{value}</span>
				<img month={month} year={year} src={NewCalendar} style={{cursor: value < max ? 'pointer' : 'default',width:'400px'}} onClick={doAdd} />
			</div>
		</div>
			
		);
	}

	export default DatePickerArrival