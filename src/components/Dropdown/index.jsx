import React from "react";

import './Dropdown.scss';

function Dropdown({
	                  onSubmit,
	                  value,
	                  setValue,
	                  label,
	                  inputName,
	                  placeholder,
	                  options,
	                  style
                  }) {
	return (
		<div className="dropdown-container" style={style || {}}>
			<div className="dropdown-field-label">{label}</div>

			<select
				className="dropdown-field"
				name={label}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			>
				<option>{placeholder}</option>
				{
					options.map((item, i) => (
						<option key={i} value={item.name}>
							{item.name}
						</option>
					))
				}
			</select>
		</div>
	)
}
export default Dropdown;
