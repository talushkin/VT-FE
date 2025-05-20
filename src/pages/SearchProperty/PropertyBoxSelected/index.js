import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import bathsIcon from '../../../assets/property/baths.png';
import picLeft from '../../../assets/property/pic-left.svg';
import picLeftOn from '../../../assets/property/pic-left-on.svg';
import picRight from '../../../assets/property/pic-right.svg';
import picRightOn from '../../../assets/property/pic-right-on.svg';
import likeFull from '../../../assets/icons/like-full.png';
import favoriteIcon from '../../../assets/icons/favorite.png';
import bedsIcon from '../../../assets/property/beds.png';
import peopleIcon from '../../../assets/property/people.png';

import eventsIcon from '../../../assets/collections/icons/events.png';
import familyIcon from '../../../assets/collections/icons/family.png';
import petsIcon from '../../../assets/collections/icons/pets.png';
import sustainIcon from '../../../assets/collections/icons/sustainable.png';

import selectedProperty from '../../../assets/property/selected.png';
import unselectedProperty from '../../../assets/property/unselected.png';
import numeral from 'numeral';

import './PropertyBoxSelected.scss';
import { isNullOrEmptyArray } from "../../../Util/general";
import ImageWithHover from "../../../components/ImageWithHover";
import { PATH_PROPERTY } from "../../../Util/constants";
import { baseURL } from "../../../core";
import axios from "axios";

const PropertyBox = (props,token) => {
	const [picIndex, setPicIndex] = useState(0);
	const { property, xdata, fullCalendar, selected, favorited, onToggle } = props;
	console.log("property, selected, favorited, onToggle " , props );
	const [favorites, FavToggle ] = useState(favorited);
	const [select, selectToggle ] = useState(selected);
	const history = useHistory();
	
	useEffect(() => {
		const load = async () => {
			//console.log(property._id,"favorited? ",favorited>-1)
			//console.log(property,"=property details")
			//FavToggle(favorited>-1);
		};
		load();
	}, []);

	token = localStorage.getItem("jToken");
	const userRequest = axios.create({
		baseURL: baseURL,
		headers: {
		  token: `Bearer ${token}`,
		},
	  });
	  
	const favoriteAdd = async (propID) => {
		console.log("ID=",propID);
		const agentID=localStorage.getItem("agent_id");
		const favoritesResponse = await userRequest.post(`/favorite/add-favorite?agent_id=${agentID}&property_id=${propID}`);
		console.log("favorite respond >>>>", favoritesResponse.data);
	}

	const favoriteRemove = async (propID) => {
		console.log("ID=",propID);
		const agentID=localStorage.getItem("agent_id");
		const favoritesResponse = await userRequest.post(`/favorite/remove-favorite?agent_id=${agentID}&property_id=${propID}`);
		console.log("favorite respond >>>>", favoritesResponse.data);
	}

	const toggleFavorites = () => {
		// 👇️ passed function to setState
		
		FavToggle(current => !current);
		console.log("favorites pressed! property #", property._id, favorites ? " removed " : " added! ", " for agent_id: ", localStorage.getItem("agent_id"));
		favorites ? favoriteRemove(property._id) :favoriteAdd(property._id);
		
	  };
	const renderAmount = (title, pic, amount) => {
		return (
			<div className="property-box-footer-left-icon"><img src={pic} alt="" style={{ width: '40px' }} /></div>
		)
	};

	const renderCollectionImage = (title, pic, amount) => {
		return (
			<div className="property-box-footer-left-icon"><img src={pic} alt="" style={{ width: '40px' }} /></div>
		)
	};

	const showProperty = () => {
		history.push(PATH_PROPERTY, { property,xdata,fullCalendar });
	};

	let pic = null;

	const setNextPic = () => {
		setPicIndex(picIndex + 1);
	};

	const setPrevPic = () => {
		let p = picIndex - 1;
		if (p < 0) {
			p += property.pictures.length;
		}
		setPicIndex(p);
	};

	if (!isNullOrEmptyArray(property.pictures)) {
		
		pic = property.pictures[picIndex % property.pictures.length].original;
		//console.log(property.pictures.length, picIndex,pic);
	}
	//console.log(property.tags);
	return (
		<div className="property-box-wrapper col-xl-4 col-md-6">
			<div className="property-box-container" style={{ backgroundImage: pic ? `url(${pic})` : 'transparent', backgroundSize: 'cover', height: '350px' }}>

				<ImageWithHover path={picLeft} pathOver={picLeftOn} className="property-box-prev-next-pic" style={{ left: '10px' }} onClick={setPrevPic} />
				<div className="property-box-center" onClick={showProperty} />
				<ImageWithHover path={picRight} pathOver={picRightOn} className="property-box-prev-next-pic" style={{ right: '10px' }} onClick={setNextPic} />

				<div className="property-box-selected-icon" onClick={onToggle}><img src={selected ? selectedProperty : unselectedProperty} alt="" /></div>
				<div className="property-box-image-footer">
					<span className="property-box-image-footer-text" title={property?.title}>{property?.title}</span>
				</div>
			</div>
			<div className="property-box-footer">
				<div className="property-box-footer-left">
					<div className="property-box-footer-left-icon"><img src={peopleIcon} alt="" />{property?.accommodates}</div>
					<div className="property-box-footer-left-icon"><img src={bedsIcon} alt="" />{property?.beds}</div>
					<div className="property-box-footer-left-icon"><img src={bathsIcon} alt="" />{property?.bathrooms}</div>
					<div className="property-box-footer-left-icon-small"><img src={property?.tags?.indexOf("familyCollection")>-1?familyIcon:{}} /></div>
					<div className="property-box-footer-left-icon-small"><img src={property?.tags?.indexOf("petsCollection")>-1?petsIcon:{}} /></div>
					<div className="property-box-footer-left-icon-small"><img src={property?.tags?.indexOf("eventCollection")>-1?eventsIcon:{}} /></div>
					<div className="property-box-footer-left-icon-small"><img src={property?.tags?.indexOf("sustainCollection")>-1?sustainIcon:{}}  /></div>
				</div>
				<div className="property-box-footer-right">
					<div className="property-box-footer-right-top">
						<div><span className="property-box-footer-right-top-dollar">{property?.prices?.currency}</span>{numeral(property?.prices?.basePrice).format('0,0')}</div>
						<div className="property-box-footer-right-top-night">/night</div>
						<div className="property-box-favorites-icon" onClick={toggleFavorites}><img src={favorites ? likeFull : favoriteIcon} alt="" /></div>
					</div>
					<div className="property-box-footer-right-bottom">
						<div className="property-box-footer-right-bottom-price"><span className="property-box-footer-right-bottom-dollar">{property?.prices?.currency}{numeral(property?.prices?.basePrice/10).format('0,0')}</span></div>
						<div style={{ fontSize: '14px', fontWeight: 'normal' }}>Agency Commission</div>
					</div>
				</div>
			</div>
		</div>
	)
};

export default PropertyBox;