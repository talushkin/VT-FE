import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import clearIcon from "../../assets/icons/closeIcon.png";
import arrowDown from "../../assets/icons/arrow-down.png";
import "./ClientsDropDown.scss";
import { userRequest } from "../../api/requestMethods";
import DangerExclamation from "../Icons/DangerExlamation/DangerExclamation.jsx";

const ClientsDropDown = (props) => {
  const agent_id = localStorage.getItem("agent_id");
  const { selectClient, formerClient, errorMsg, displayType } = props;
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [filteredClients, seFilteredClients] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const options = document.querySelectorAll(".destinations-floater");
      options.forEach((option) => {
        const optionWidth = containerWidth - 1;
        option.style.width = `${optionWidth}px`;
      });
    }
  }, [showOptions]);
  const getAllClients = async () => {
    const clientResponse = await userRequest.get(
      `/client/get-clients?agent_id=${agent_id}`,
      {
        params: { limit: "300", skip: "0", agent_id: 1 },
      }
    );
    if (
      clientResponse?.data?.clients !== null &&
      clientResponse?.data?.clients !== undefined
    ) {
      seFilteredClients(clientResponse?.data?.clients);
      
    }
  };

  useEffect(() => {
    getAllClients();
    if (formerClient) {
      setSearchText(formerClient);
    }
  }, []);

  const getComboIcon = () => {
    if (selectedOption !== "") {
      return (
        <img
          src={clearIcon}
          alt=""
          style={{ cursor: "pointer", width: "18px" }}
          onClick={() => selectOption("")}
        />
      );
    }

    return (
      <img
        alt="arrow"
        src={arrowDown}
        onClick={() => setShowOptions(!showOptions)}
        style={{
          width: "18px",
          transform: `rotateX(${showOptions ? "180deg" : "0deg"})`,
        }}
      />
    );
  };

  const updateText = (text) => {
    setSearchText(text);

    const clientsList = filteredClients
      ? filteredClients.filter(
        (client) =>
          client?.email?.toLowerCase().indexOf(text?.toLowerCase()) > -1
      )
      : [];
     seFilteredClients(clientsList);
     
  };

  const selectOption = (client) => {
    console.log('client selected:',client)
    const clientFullName =
      `${client?.firstName} ${client?.lastName}`;
    const clientEmail =
      `${client?.email}`;


    if (displayType === "cilentFullName") {
      setSelectedOption(clientFullName);
      setSearchText(clientFullName);
      setShowOptions(false);
      updateText(clientFullName);

    }
    else {
      setSelectedOption(client?.email);
      setSearchText(client?.email);
      setShowOptions(false);
      updateText(client?.email);

    }
    // localStorage.setItem("selectedClientName", clientFullName);
    // localStorage.setItem("selectedClientEmail", clientEmail);
    localStorage.setItem("selectedClient", JSON.stringify(client));
    selectClient(client);
  };

  function capitalizeFLetter(Word) {
    return Word[0].toUpperCase() + Word.slice(1);
  }

  const getLabelOption = (type, data) => {
    let displayText = "";
    if (displayType === "cilentFullName") {
      displayText = `${data?.firstName} ${data?.lastName}`;
    } else {
      displayText = data?.email;
    }
    return (
      <div
        key={`${type}-${displayText}`}
        className="destinations-label-option"
        title={displayText}
        onClick={() => selectOption(data)}
      >
        {displayText}
      </div>
    );
  };

  const comboResults = () => {
    //console.log("comboResults", filteredClients);
    // if (
    //   filteredClients?.length < 1
    // ) {
    //   return <div className="destinations-no-results">No matches</div>;
    // } else {
    const results = [];

    if (filteredClients?.length > 0) {
      //  results.push(getTitleOption("email"));
      filteredClients?.forEach((c) => results?.push(getLabelOption("email", c)));
    }

    return results;
    // }
  };

  return (
    <>
      {showOptions && (
        <div
          className="page-transparent-blocker"
          onClick={() => setShowOptions(false)}
        />
      )}
      <div className="destinations-wrapper">
        <div className="destinations-container" ref={containerRef}>
          <input
            type="text"
            value={searchText ? searchText : ""}
            onClick={() => setShowOptions(true)}
            onChange={(e) => updateText(e.target.value)}
            placeholder={
              displayType === "cilentFullName" ? "Cilent Name" : "Email"
            }
            className="destinations-input form-control"
          />

          {/* {getComboIcon()} */}
        </div>
        {showOptions && (
          <div className="destinations-floater">{comboResults()}</div>
        )}
        {filteredClients?.length < 1 && displayType !== "cilentFullName" && (
          <span className="text-danger">
            <DangerExclamation size={16} fill="red" />
            &nbsp; <span
              dangerouslySetInnerHTML={{ __html: errorMsg }}
            ></span>{" "}
          </span>
        )}
      </div>
    </>
  );
};

export default ClientsDropDown;
