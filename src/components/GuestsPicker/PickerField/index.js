import React, { useEffect } from "react";
import minusOnIcon from '../../../assets/icons/minus-on.svg';
import minusOffIcon from '../../../assets/icons/minus-off.svg';
import plusOnIcon from '../../../assets/icons/plus-on.svg';
import plusOffIcon from '../../../assets/icons/plus-off.svg';

import './PickerField.scss';

const PickerField = props => {
  const { title, subTitle, onAdd, onReduce, value, max, disableReduce } = props;

  useEffect(() => {
    const load = async () => {
      // Placeholder for any async loading logic if necessary
    };
    load();
  }, []);

  const doReduce = () => {
    if (value > 0 && !disableReduce) {
      if ((title === 'Adults') && (value > 1)) {
        onReduce();
      } else {
        if (title !== 'Adults') {
          onReduce();
        }
      }
    }
  };

  const doAdd = () => {
    if (value < max) {
      onAdd();
    }
  };

  return (
    <div className="guests-picker-field-container">
      <div>
        <div className="guests-picker-title">{title}</div>
        {subTitle && <div className="guests-picker-sub-title">{subTitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={disableReduce || value < 1 ? minusOffIcon : minusOnIcon} style={{ cursor: disableReduce || value < 1 ? 'default' : 'pointer' }} onClick={doReduce} />
        <span style={{ fontSize: '25px', color: '#707070', cursor: 'default', width: '50px', textAlign: 'center' }}>{value}</span>
        <img src={value < max ? plusOnIcon : plusOffIcon} style={{ cursor: value < max ? 'pointer' : 'default' }} onClick={doAdd} />
      </div>
    </div>
  );
};

export default PickerField;
