// export const PWD_RULES = [
// 	{
// 		title: "One lowercase character",
// 		regexp: /[a-z]/,
// 	},
// 	// {
// 	//   title: "One uppercase character",
// 	//   regexp: /[A-Z]/,
// 	// },
// 	{
// 		title: "One number",
// 		regexp: /[0-9]/,
// 	},
// 	// {
// 	//   title: "One special character",
// 	//   regexp: /[\|\$"\[\*@!`_#\%\?<\.,\-\=;:\\>\/&\(\)’\^~{}\]\+]+/,
// 	// },
// 	{
// 		title: "8 characters minimum",
// 		regexp: /.{8}/,
// 	},
// ];

export const PWD_RULES = [
	{
	  title: "One lowercase character",
	  regexp: /[a-z]/,
	},
	{
	  title: "One number",
	  regexp: /[0-9]/,
	},
	{
	  title: "Minimum 6 characters",
	  regexp: /^.{6,}$/,
	},
	{
	  title: "Uppercase and lowercase letters",
	  regexp: /^(?=.*[a-z])(?=.*[A-Z])/,
	},
  ];

export const validateEmail = (email) => {
	if  (email === undefined) {
		return false;}
	if  (email.includes("mailinator")) {
			return false;}
	if  (email.includes("yopmail")) {
				return false;}
	return /^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,10}$/.test(email);
};

export const nameValid = (name) => {
	if (name === undefined) {
		return false;
	}
	return (
		name.length > 0 &&
		!nameLooksLikeEmail(name) &&
		/^([a-zA-Z\u00C0-\u024F\u1E00-\u1EFF -]*)$/.test(name)
	);
};

export const nameLooksLikeEmail = (name) => {
	if (name === undefined) {
		return false;
	}
	
	return name.includes("@");
};

export const validatePhone = (phone) => {
	const phoneRegex = /^\+?[1-9]\d{7,14}$/;
	if  (phone === undefined) { return false; }
  	return phoneRegex.test(phone);
}
