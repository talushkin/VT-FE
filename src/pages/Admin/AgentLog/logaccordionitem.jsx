import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import moment from "moment";

const LogAccordionItem = ({ agentKey, agent }) => {
  const [isActive, setIsActive] = useState(false);

  const handleAccordionClick = () => {
    setIsActive(!isActive);
  };

  return (
    <Accordion.Item eventKey={agentKey} className="log-accordion-items-wrapper">
      <Accordion.Header onClick={handleAccordionClick} >
        <div
          className="log-accordion-header"
          style={{ color: isActive ? "green" : "blue", background:'transparent' }}
        >
          {agent.firstName} {agent.lastName} - {agent.agent_id}
        </div>
      </Accordion.Header>
      <Accordion.Body className="log-accordion-body">
        {
            agent.actions && agent.actions.length ? 
                agent.actions.sort((a, b) => {
                    const dateA = new Date(a?.updatedAt);
                    const dateB = new Date(b?.updatedAt);
                    return dateB - dateA;
                  }).map((action, actnIndx) => (
                    <div key={actnIndx}>
                        <div
                            className="row  p-3"
                            style={{ backgroundColor: "#f5f5f2" }}
                        >
                            <div className="col-md-4 px-1">
                            {
                                action.actionName?.split('{')[0]
                            }
                            </div>
                            <div className="col-md-3 px-1">
                            {
                                moment(action.updatedAt).format('DD/MM/YYYY, h:mm:ss a')
                            }
                            </div>
                            <div className="col-md-5 px-1 log-breakword">
                            {
                                action.description
                            }
                            </div>
                        </div>
                    </div>
                ))
            : (<h5 className="text-center">No logs are available.</h5>)
        }
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default LogAccordionItem;
