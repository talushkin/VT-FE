import React, { useState } from "react";
import { Carousel } from "react-bootstrap";

const FaqCardItems = ({ originalImage, hoverImage, title, description }) => {
  const [imageSrc, setImageSrc] = useState(originalImage);

  const handleMouseOver = () => {
    setImageSrc(hoverImage);
  };

  const handleMouseOut = () => {
    setImageSrc(originalImage);
  };

  const breakDescription = (text, maxLength) => {
    const words = text.split(" ");
    let currentLength = 0;
    let result = "";

    for (let i = 0; i < words.length; i++) {
      currentLength += words[i].length + 1;
      if (currentLength <= maxLength) {
        result += words[i] + " ";
      } else {
        result += "\n" + words[i] + " ";
        currentLength = words[i].length + 1;
      }
    }

    return result.trim();
  };

  const renderDescription = () => {
    const maxLength = 28;
    const brokenDescription = breakDescription(description, maxLength);
    const descriptionLines = brokenDescription.split("\n");
    return descriptionLines.map((line, index) => (
      <p className="faq-item-desc" key={index}>
        {line}
      </p>
    ));
  };

  return (
    <div
      className="card bg-card"
      style={{
        border: "1px solid #cfcdcd",
        borderRadius: "7px",
        height: "100%",
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className="text-center d-flex faq-item-wrapper">
        <img src={imageSrc} className="faq-item-image" alt={title} />
        <div className="faq-item-title">
          <h4 className="Getting_Started">{title}</h4>
        </div>
        <div className="mt-3">{renderDescription()}</div>
      </div>
    </div>
  );
};

export default FaqCardItems;
