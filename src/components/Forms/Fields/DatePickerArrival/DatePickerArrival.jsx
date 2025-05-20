import * as React from 'react';
import { useState } from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import './DatePickerArrival.scss';

export default function DatePickerArrival({date}) {
	const [value, setValue] = React.useState(dayjs(date).format("YYYY-MM-DD"));
	//const [value, setValue] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleMonthChange = (newDate) => {
    setCurrentMonth(newDate);
  };
  

  const shouldDisableDate = (day) => {
	const today = dayjs(); // Get the current date
  
	// Check if the date is in the past and within the current month
	if (day.isBefore(today, 'day')) {
	  return true;
	}
  
	return false;
  };
		return (
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Stack spacing={3}>
					<DatePicker
					  					sx={{
						// zoom: 2,
					  }}
						className="search-form-field"
						views={['day']}
						onMonthChange={handleMonthChange}
						shouldDisableDate={shouldDisableDate}
						showDaysOutsideCurrentMonth
						clearable
						value={value}
						onChange={(newValue) => {
							setValue(newValue);
							// //console.log("dateTo:",newValue.format("YYYY-MM-DD"));
							localStorage.setItem("dateFrom",newValue?.format("YYYY-MM-DD"));
						}}						 
						InputProps={{ sx: { "& .MuiSvgIcon-root": { color: "#546b7f" } } }}
						PopperProps={{
							
							sx: {
								transform: 'translate(-50%, 0)', 
								left: '25px !important',
								width: '330px',
								"& .MuiPaper-root": {
								  backgroundColor: "white"
								},
								"& .MuiCalendarPicker-root": {
									backgroundColor: "white",
									width: '350px', 
									height: '320px', 
									paddingRight:"20px;"
								  },
								  "& .MuiPickersDay-dayWithMargin": {
									fontSize: "18px",
									backgroundColor: "white",
									border: "1px solid rgba(0, 0, 0, 0.2)",
									borderRadius: 0,
									'&:hover': {
										backgroundColor: '#2C4861',
										color: "black !important"
									},
									'&.Mui-selected': {
										backgroundColor: '#2C4861',
										color: "white !important"
									}
								},	
								"& .MuiTabs-root": { backgroundColor: "rgba(120, 120, 120, 0.4)" ,color:"black !important" }
								//"& .MuiTabs-root": { backgroundColor: "yellow" }
							  },
							  
						  }}
						inputFormat="DD.MM.YYYY"
						renderInput={(params) => <TextField {...params} helperText={null}
						sx={{
							'& fieldset': {
							  borderStyle:'hidden',
							},
						  }} />}
					/>
				</Stack>
			</LocalizationProvider>
		);
	}