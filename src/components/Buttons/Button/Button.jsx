import React from "react";
import styles from "./Button.module.scss";
import LoaderSpinner from "../../LoadingSpinner/LoadingSpinner";

const defaultProps = {
	variant: "primary",
	as: "button",
};

function Button({
	                style,
	                variant,
	                loading,
	                text,
	                icon,
	                onClick,
	                href,
	                disabled,
	                fullwidth,
	                children,
                }) {
	function classes() {
		let classes = styles.button;

		classes += " " + styles[variant];

		if (fullwidth) {
			classes += " " + styles.fullwidth;
		}

		if (disabled) {
			classes += " " + styles.disabled;
		}

		return classes;
	}

	const buttonStyle = style || {};
	buttonStyle.borderRadius = '6px';
	//buttonStyle.fontWeight = 100;
 
	return (
		<button className={classes()} style={buttonStyle} disabled={disabled} onClick={onClick}>
			{ icon && icon }
			<span>{loading ? <LoaderSpinner /> : text}</span>
			{children}
		</button>
	);
}

Button.defaultProps = defaultProps;

export default Button;
