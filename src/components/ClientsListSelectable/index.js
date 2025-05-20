import React, { useEffect, useState, useRef } from "react";
import "./ClientsListSelectable.scss";

const ClientsListSelectable = ({ item, onChange, clients, inputref, updateClientData }) => {

    const [filteredClients, setFilteredClients] = useState(clients);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);


    useEffect(() => {
        setFilteredClients(clients.filter(client => `${client.firstName} ${client.lastName}`.toLowerCase().includes(item.client_name.toLowerCase())))
    }, [item.client_name, clients])

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = async (client) => {
        
        const clientData = {
            client_id: client.client_id,
            client_name: `${client.firstName} ${client.lastName}`,
            client_email: client.email,
            client_phone: client.phone
        }
        updateClientData(clientData)
        setIsOpen(false)
    };

  

    return (
        <div className="col-3 gp-pmnt-pad-10" style={{position: 'relative'}} >
            <input 
                type="text" 
                value={item.client_name} 
                onChange={(e) => onChange(e.target.value)} 
                className="form-control"
                placeholder="Enter name"
                ref={inputref}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && (
                <div className="client-dropdown-list" ref={dropdownRef} >
                    {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                            <div
                                key={client.client_id}
                                className="client-dropdown-item"
                                onClick={() => handleSelect(client)}
                            >
                                {client.firstName} {client.lastName}
                            </div>
                        ))
                    ) : (
                        <div className="client-dropdown-item">No clients found</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ClientsListSelectable