import React, {useEffect} from "react";

import './InputField.scss';
import EmailTemplateButton from "../emailtemplatebutton";

const InputField = props => {
	const {value, placeholder, onChange, label, labelStyle, style, disabled, fieldId, error, showTemplateButton, handleAddEmailTemplate, link, showLabel } = props;

	useEffect(() => {
		const load = async () => {

		};
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
		<div className="input-field-container" style={style || {}}>
			<div className="input-field-label fw-bolder" style={labelStyle || {}}>
				{typeof showLabel !== 'undefined' && showLabel === false ? '' : label}&nbsp;
				{ !link && showTemplateButton && <EmailTemplateButton handleAddEmailTemplate={handleAddEmailTemplate} /> }
			</div>

			<input type="text"
			       className={`form-control ${typeof error !== 'undefined' && error ? 'error' : ''}`}
			       value={value}
			    //    onChange={(e) => onChange(e.target.value)}
			       onChange={(e) => updateChange(e.target.value)}
			       placeholder={placeholder}
				   disabled={disabled}
			/>
			{
				typeof error !== 'undefined' && error && (
					<div className="invalid-feedback" style={{display: 'block'}}>
						{ error }
					</div>
				)
			}
			
		</div>
	)
};

export default InputField;