import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import clearIcon from "../../assets/icons/closeIcon.png";
import arrowDown from "../../assets/icons/arrow-down.png";
import "./ClientsDropDownMulti.scss";
import { userRequest } from "../../api/requestMethods";
import DangerExclamation from "../Icons/DangerExlamation/DangerExclamation.jsx";
import Select from "react-select";

const ClientsDropDownMulti = (props) => {
    const agent_id = localStorage.getItem("agent_id");
    const { selectClient } = props;
    const [selectedClients, setSelectedClients] = useState([]);
    const [clients, setClients] = useState([])
    const [allClients, setAllClients] = useState([])

    useEffect(() => {
        getAllClients();
    }, []);

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
            console.log(clientResponse?.data?.clients)

            if(clientResponse?.data?.clients?.length) {
                setAllClients(clientResponse?.data?.clients?.length)
                const clientoptions = clientResponse?.data?.clients.map((client, indx) => {
                    return({
                        value: client.email,
                        label: client.email,
                        name: `${client.firstName} ${client.lastName}`,
                        index: indx,
                        client_id: client.client_id,
                        phone: client.phone

                    })
                })
                setClients(clientoptions)
            }
          
        }
    };

    const handleChange = (selectedOptions) => {
        const newoptions = selectedOptions || [];
        setSelectedClients(newoptions);
        if(newoptions.length) {
            const clientData = {
                ClientNames : newoptions.map((itm) => itm.name).join(','),
                ClientEmails : newoptions.map((itm) => itm.value).join(','),
                ClientIds : newoptions.map((itm) => itm.client_id).join(','),
                ClientPhone : newoptions.map((itm) => itm.phone).join(',')
            }
            selectClient(clientData);
        } else {
            const clientData = {
                ClientNames : "",
                ClientEmails : "",
                ClientIds: "",
                ClientPhone: ""
            }
            selectClient(clientData);
        }
        
    };


    return (
        <>
            <div className="">
                
                {/* Multi-select dropdown */}
                <Select
                    options={clients}
                    isMulti
                    isSearchable
                    getOptionLabel={(e) => `${e.label}`} // Custom label format
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedClients}
                    onChange={handleChange}
                    placeholder="Search and select client emails..."
                />
            </div>
        </>
    )
}

export default ClientsDropDownMulti;