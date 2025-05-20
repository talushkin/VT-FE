import React from "react";
// import { ErrorDisplay } from '../../../Util/Interfaces';
import EmailInput from "../Fields/EmailInput/EmailInput";
import PasswordInput from "../Fields/PasswordInput/PasswordInput";

function LoginForm({
	onSubmit,
	onToggleSignup,
	error,
	username,
	password,
	setUsername,
	setPassword,
}) {

	return (
		<form onSubmit={onSubmit}>
			<EmailInput
				onSubmit={onSubmit}
				value={"2901@test.com"}
				setValue={setUsername}
				label="E-Mail*"
				inputName="email"
				showLoginLink="login"
				onToggleSignup={onToggleSignup}
				error={error}
				placeholder={"E-mail address"}
			/>

			<PasswordInput
				onSubmit={onSubmit}
				value={"12345678"}
				error={error}
				setValue={setPassword}
				label="Password*"
				inputName="current-password"
				placeholder={"Password"}
			/>
			{/* <div style={{ height: "19px" }} /> */}
		</form>
	);
}
export default LoginForm;
