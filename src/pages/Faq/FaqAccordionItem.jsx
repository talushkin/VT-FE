import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";

const FaqAccordionItem = ({ eventKey, headerText, bodyContent }) => {
  const [isActive, setIsActive] = useState(false);

  const handleAccordionClick = () => {
    setIsActive(!isActive);
  };

  return (
    <Accordion.Item eventKey={eventKey} className="faq-accordion-items-wrapper">
      <Accordion.Header onClick={handleAccordionClick}>
        <div
          className="faq-accordion-header"
          style={{ color: isActive ? "green" : "blue", background:'transparent' }}
        >
          {headerText}
        </div>
      </Accordion.Header>
      <Accordion.Body className="faq-accordion-body">
        {bodyContent}
        {/* <div className="read-more">Read More</div> */}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default FaqAccordionItem;
