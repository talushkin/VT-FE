import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import './PropertySelection.scss';

const PropertySelection = props => {
	const {prop} = props;
	const dispatch = useDispatch();

	useEffect(() => {
		const load = async () => {
			
		};
		load();
	}, []);

	return (
		<div>
			
		</div>
	)
};

export default PropertySelection;