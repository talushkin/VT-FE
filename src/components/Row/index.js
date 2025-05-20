import React from "react";

const Row = props => {
	const {children, style, mobileClass} = props;

	const stl = {...style, ...{display: 'flex', alignItems: 'center'}};

	return (
		<div className={mobileClass} style={stl}>
			{children}
		</div>
	)
};

export default Row;