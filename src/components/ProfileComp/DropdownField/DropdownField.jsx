import React from "react";
import "./DropdownField.css";

const DropdownField = ({
  label,
  id,
  value,
  setValue,
  defaultValue,
  placeholder,
  dropDownObj,
}) => {
  return (
    <div className="col-sm-8 mx-auto pt-2">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <select className="form-select form-rounded" id={id} required>
        <option value={placeholder ? placeholder : ""}>
          {placeholder ? placeholder : "Choose..."}
        </option>
        {dropDownObj?.map((item, i) => (
          <option value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <div className="invalid-feedback">Please select a valid {label}.</div>
    </div>
  );
};

export default DropdownField;
