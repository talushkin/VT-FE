import React from "react";
import EmailInput from "../Fields/EmailInput/EmailInput";
import styles from "./ResetPasswordForm.module.scss";

function ResetPasswordForm({ onSubmit, email, setEmail, error }) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <EmailInput
          onSubmit={onSubmit}
          value={email}
          setValue={setEmail}
          label="E-Mail*"
          inputName="email"
          showLoginLink="none"
          error={error}
          placeholder={"E-mail address"}
        />
      </div>
    </form>
  );
}
export default ResetPasswordForm;
