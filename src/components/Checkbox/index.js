import React, { useEffect, useState } from "react";

import "./Checkbox.scss";

const Checkbox = (props) => {
  const { uid, label, onChange, style } = props;
  const [checked, setChecked] = useState(props.checked);

  useEffect(() => {
    const load = async () => {
      setChecked(props.checked);
    };
    load();
  }, [props.checked]);

  return (
    <div className="checkbox-container">
      <input
        id={uid}
        type="checkbox"
        className="form-check-input"
        value={checked}
        onChange={() => onChange(!checked)}
      />
      <label className="form-check-label m-1" style={style} htmlFor={uid}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
