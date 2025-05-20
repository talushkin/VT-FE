import React, { useState } from 'react';

import './BlueWhiteButton.scss';
import { useLocation } from 'react-router-dom';

const BlueWhiteButton = (props) => {
  const [isHovering, setIsHovering] = useState(false);
  const { icon, iconOn, label, style, onClick } = props;
  const location = useLocation();
  const URL = location.pathname;

  // <div className="saved-search-white-button"><img src={link} />&nbsp;&nbsp;Share selection as link for the client</div>
  return (
    <div
      className={URL === '/search' ? (isHovering ? 'blue-white-button-on' : 'blue-white-button') : (URL === '/clients' ? (isHovering ? 'blue-white-button-on-client' : 'blue-white-button') : '')}
      //  style={style}
      onClick={onClick}
      onMouseOver={() => setIsHovering(!isHovering)}
      onMouseOut={() => setIsHovering(!isHovering)}
    >
      <img src={isHovering ? iconOn : icon} />
      &nbsp;&nbsp;{label}
    </div>
  );
};

export default BlueWhiteButton;
