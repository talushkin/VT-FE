import React, { useState } from "react";

const CollectionIcon = (props) => {
  const { label, path, selected, pathOver, className, style, onClick } = props;
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "60px",
        }}
      >
        <img
          onClick={onClick}
          className={className}
          src={isHovering || selected ? pathOver : path}
          onMouseOver={() => setIsHovering(true)}
          onMouseOut={() => setIsHovering(false)}
          style={{ ...style, ...{ cursor: "pointer", width: "80%" } }}
          alt=""
        />
      </div>
      {isHovering && (
        <div
          style={{
            maxWidth: "60px",
          }}
        >
          <img src={label} alt="" style={{ marginTop: "-2px", marginLeft: '-11px' }} />
        </div>
      )}
    </div>
  );
};

export default CollectionIcon;
