import React from "react";
import styles from "./NameInput.module.scss";
import {nameLooksLikeEmail} from "../../../../Util/ValidationUtil";
import DangerExclamation from "../../../Icons/DangerExlamation/DangerExclamation.jsx";

function NameInput({
	                   onSubmit,
	                   value,
	                   setValue,
	                   label,
	                   type,
	                   inputName,
	                   placeholder,
	                   error,
                   }) {
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			onSubmit(event);
		}
	};
	const errorState = () => {
		return (
			nameLooksLikeEmail(value) ||
			(error !== undefined && error.placement === inputName)
		);
	};

	return (
		<div className={styles.input_wrapper + " -fif_wrp"}>

			{
				label != null &&
				<div className={styles.label_wrapper + " -fif_label_wrp"}>
					<label htmlFor={inputName}>{label}</label>
				</div>
			}

			<div
				className={
					styles.input_field_wrapper +
					" -fif_input_wrp " +
					(error !== undefined ? styles.error : ``)
				}
			>
				<input
					className={
						'form-control' +
						" " +
						(errorState() ? styles.invalid : styles.valid)
					}
					onSubmit={onSubmit}
					onKeyPress={handleKeyDown}
					type={type ? type : "text"}
					name={inputName}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder={placeholder ? placeholder : ""}
					id={"form_" + inputName}
					autoCapitalize="none"
					autoCorrect="false"
				/>
				{
					error && error.placement === inputName &&
					<span className={styles.input_error}><DangerExclamation size={16} fill="red" />&nbsp;{error.msg}</span>
				}
			</div>
		</div>
	);
}
export default NameInput;
