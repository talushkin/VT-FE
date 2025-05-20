import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory
import arrowDownIcon from '../../assets/icons/arrow-down-green.png';
import selectedPropertiesIcon from '../../assets/icons/selected-properties-dropdown.png';
import Button from '../Buttons/Button/Button';
import checkboxOn from '../../assets/icons/checkbox-circle-on.png';
import swal from 'sweetalert';
import './SelectedPropertiesDropdown.scss';
import makeCalculations from '../../Hooks/makeCalculations';

const SelectedPropertiesDropdown = (props) => {
  const { setShowSelection, selectedPropertiesItem, onToggle } = props;
  const [isOpen, setIsOpen] = useState(true);
  const history = useHistory(); // Use useHistory for navigation

  const properties = selectedPropertiesItem?.properties;
  localStorage.setItem('SelectedPropertiesDropdown', JSON.stringify(properties));

  const totalSelectedPropertiesItem = selectedPropertiesItem?.properties?.length;
  localStorage.setItem('totalSelectedPropertiesItem', totalSelectedPropertiesItem);
  localStorage.setItem('selectedPropertiesItem', JSON.stringify(properties));

  useEffect(() => {
    const load = async () => {};
    load();
  }, []);

  useEffect(() => {
    setIsOpen(properties.length > 0);
  }, [properties]);

  const handleGenerateBrochure = () => {
    console.log('click')
      console.log('should open selectedProps!')
      setShowSelection(true)
  };

  return (
    <div className='selected-properties-dropdown-container'>
      <div className='selected-properties-dropdown-header' onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex' }}>
          <img src={selectedPropertiesIcon} alt='' />
          <div>&nbsp;Your Selected Properties</div>
        </div>
        <img src={arrowDownIcon} alt='' style={{ transform: `rotateX(${isOpen ? '180deg' : '0deg'})` }} />
      </div>

      {isOpen && (
        <div className='selected-properties-dropdown-body'>
          <div className='selected-properties-dropdown-body-rows'>
            {properties &&
              properties.map((property, i) => (
                <div className='selected-properties-dropdown-body-row' key={property.listing._id}>
                  <div className='checkbox-circle'>
                    <img src={checkboxOn} onClick={() => onToggle(property)} />
                  </div>
                  <div className='selected-properties-dropdown-body-row-title'>
                    <li>{property?.listing?.title}</li>
                  </div>
                </div>
              ))}
          </div>
          <div className='selected-properties-dropdown-footer'>
            <Button
              style={{ fontSize: '18px', marginRight: '30px' }}
              variant='link'
              text='Cancel'
              onClick={() => setIsOpen(false)}
            />
            <Button
              style={{ fontSize: '18px' }}
              text='Generate Brochure'
              onClick={handleGenerateBrochure}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedPropertiesDropdown;
