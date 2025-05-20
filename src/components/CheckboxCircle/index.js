import React, {useEffect} from "react";
import checkboxOn from '../../assets/icons/checkbox-circle-on.png';
import checkboxOff from '../../assets/icons/checkbox-circle-off.png';

import './CheckboxCircle.scss';

const CheckboxCircle = props => {
	const {selected, onChange} = props;

	useEffect(() => {
		const load = async () => {
			
		};
		load();
	}, []);

	return (
		<img src={selected ? checkboxOn : checkboxOff} onClick={onChange} />
	)
};

export default CheckboxCircle;