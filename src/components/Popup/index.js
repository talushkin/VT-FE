import React, { useEffect } from "react";
import closeIcon from '../../assets/icons/closeIcon.png';

import './Popup.scss';

const Popup = props => {
	const { children, onClose, width, style } = props;

	useEffect(() => {
		const load = async () => {

		};
		load();
	}, []);

	return (
		<div className="popup-wrapper" style={style} width={width}>
			<div className="popup-container" style={{width: '33%', left: '0'}}>
				<img src={closeIcon} className="popup-close-icon" onClick={onClose} />
				{children}
			</div>

		</div>
	)
};

export default Popup;