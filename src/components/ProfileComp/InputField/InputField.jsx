import React from "react";
import "./InputField.css";

const InputField = ({
  label,
  type,
  value,
  setValue,
  defaultValue,
  placeholder,
}) => {
  return (
    <div className="col-sm-8 mx-auto pt-2">
      <label htmlFor="firstName" className="form-label">
        {label}
      </label>
      <input
        type={type ? type : "text"}
        className="form-control form-rounded"
        placeholder={placeholder}
        defaultValue={defaultValue ? defaultValue : null}
        required
      />
      <div className="invalid-feedback">Valid {label} is required.</div>
    </div>
  );
};

export default InputField;
