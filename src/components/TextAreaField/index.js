import React, { useEffect } from "react";
import editIcon from "../../assets/icons/editIcon.png";

import "./TextAreaField.scss";

const TextAreaField = (props) => {
  const { placeholder, onChange, label, style, children, fieldId, value } = props;

  useEffect(() => {
    const load = async () => {};
    load();
  }, []);

  const updateChange = (val) => {
		if(typeof fieldId !== 'undefined') {
			onChange(val, fieldId)
		} else {
			onChange(val)
		}
	}

  return (
    <div className="text-area-field-container" style={style}>
      <div className="text-item-wrapper d-flex">
        <div className="text-lable text-muted fw-bolder">{label}</div>
        <img
          src={editIcon}
          className="img-fluid txt-edit-icon"
          alt="editIcon"
        />
      </div>
      {/* <div className="text-area-field-label" style={{marginBottom:'0.5rem'}}> {label} <img src={editIcon} className="img-fluid" alt="editIcon" /></div> */}
      <textarea
        className="text-area-field-input"
        onChange={(e) => updateChange(e.target.value)}
        placeholder={placeholder}
        value={typeof value!== 'undefined' ? value : ''}
      >
        {typeof children !== 'undefined' && children}
      </textarea>
    </div>
  );
};

export default TextAreaField;
