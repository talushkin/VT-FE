import React from "react";
import styles from "./PhoneInput.module.scss";
import { nameLooksLikeEmail, nameValid } from "../../../../Util/ValidationUtil";

function PhoneInput({
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

	const onInputChange = (maxLength, value) => {
		if (value.length > maxLength) value = value.slice(0, maxLength);
	};
	const maxLengthCheck = (object) => {
		if (object.target.value.length > object.target.maxLength) {
			object.target.value = object.target.value.slice(
				0,
				object.target.maxLength
			);
		}
	};

	return (
		<div className={styles.input_wrapper + " -fif_wrp"}>
			<div className={styles.label_wrapper + " -fif_label_wrp"}>
				<label htmlFor={inputName}>{label}</label>
			</div>
			<div
				className={
					styles.input_field_wrapper +
					" -fif_input_wrp " +
					(error !== undefined ? styles.error : ``)
				}
			>				<input
					className={
						styles.input_field +
						" " +
						(errorState() ? styles.invalid : styles.valid)
					}
					onSubmit={onSubmit}
					// onKeyPress={handleKeyDown}
					name={inputName}
					type="number"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					// pattern="/^-?\d+\.?\d*$/"
					maxLength="4"
					onInput={maxLengthCheck}
					// onInput={(e) => onInputChange(4, e.target.value)}
					placeholder={placeholder ? placeholder : ""}
					id={"form_" + inputName}
					autoCapitalize="none"
					autoCorrect="false"
				/>
			</div>
		</div>
	);
}
export default PhoneInput;
