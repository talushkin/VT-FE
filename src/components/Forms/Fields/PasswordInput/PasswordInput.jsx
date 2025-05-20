import React, { useState } from "react";
import eyeOn from '../../../../assets/icons/eye.png';
import eyeOff from '../../../../assets/icons/eye-slash.png';
import styles from "./PasswordInput.module.scss";
import DangerExclamation from "../../../Icons/DangerExlamation/DangerExclamation.jsx";

function PasswordInput({
	onSubmit,
	value,
	setValue,
	label,
	inputName,
	error,
	confirmError,
	placeholder,
	}) {
	const [showPwd, setShowPwd] = useState(false);
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			onSubmit(event);
		}
	};

	const style = (error && error.placement === 'password') ? { border: '1px solid #FCF5C4' } : {};

	return (
		<div className={styles.input_wrapper + " -fif_wrp"}>
			<div className={styles.label_wrapper + " -fif_label_wrp"}>
				<label htmlFor={inputName}>{label}</label>
			</div>

			<div className={"-fif_input_wrp"} style={{ position: 'relative' }}>

				<input
					onSubmit={onSubmit}
					onKeyPress={handleKeyDown}
					style={style}
					className={
						'form-control' +
						" " +
						(error && error.placement === "password"
							? styles.invalid
							: styles.valid)
					}
					name={inputName}
					type={showPwd ? "text" : "password"}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder={placeholder}
					id={inputName}
				/>
				{
					showPwd ?
						<span onClick={() => setShowPwd(!showPwd)} className={styles.show_pwd_btn + styles.hide} style={{ position: 'absolute', top: '8px', right: '25px' }}>
							<img src={eyeOff} />
						</span>
						:
						<span onClick={() => setShowPwd(!showPwd)} className={styles.show_pwd_btn} style={{ position: 'absolute', top: '8px', right: '25px' }}>
							<img src={eyeOn} />
						</span>
				}
			</div>

			{error && error.placement === "password" ? (
				<div className="d-flex justify-content-start">
					<span className={styles.pwd_error}>
						<DangerExclamation  size={16} fill="black" />&nbsp;{error.msg}
			  		</span>
				</div>
			) : null}

			{/* {error && inputName === "new-password" ? (
				<div className="d-flex justify-content-start">
					<span className={"EmailInput_email_error__LdWw-"} style={{color: "#EF4040", display: 'flex', alignItems: 'center', backgroundColor: '#FEE7E7',width:'100%',padding:'5px' }}>
						<DangerExclamation  size={16} fill="black" />&nbsp;{error.msg}
			  		</span>
				</div>
			) : null} */}

			{confirmError && inputName === "confirm-password" ? (
				<div className="d-flex justify-content-start">
					<span className={"EmailInput_email_error__LdWw-"} style={{color: "#EF4040", display: 'flex', alignItems: 'center', backgroundColor: '#FEE7E7',width:'100%',padding:'5px' }}>
						<DangerExclamation  size={16} fill="black" />&nbsp;{confirmError.msg}
			  		</span>
				</div>
			) : null}
		</div>
	);
}
export default PasswordInput;
