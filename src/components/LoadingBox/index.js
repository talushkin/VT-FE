import React, { useEffect } from "react";
import './LoadingBox.scss';
import loadingImage from '../../assets/icons/loading_ajax.gif'; // Import the loading image

const LoadingBox = (props) => {
  const { visible } = props;

  if (visible) {
    return (
      // <div className="loading-box">
      //   <img className="loading-image" src={loadingImage} alt="Loading" /> {/* Add the loading image */}
      // </div>
      <div className="spinner">
        {/* <div className="face face-1"></div>
        <div className="face face-2"></div>
        <div className="face face-3"></div>
        <div className="face face-4"></div> */}
      </div>
      
    );
  }

  return null;
};

export default LoadingBox;
