import React, { useEffect, useState } from "react";
import Button from "../../../components/Buttons/Button/Button";
import editIcon from "../../../assets/icons/admin-edit-icon.png";
import editAdminIcon from "../../../assets/icons/admin/menu/edit.svg";
import addAdminIcon from "../../../assets/icons/admin/menu/add.svg";
import deleteAdminIcon from "../../../assets/icons/admin/menu/delete.svg";
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const AgencyActionDropdown = ({ item, onAddAgency, onEditAgency, onDeleteAgency }) => {

    const [showDropdown, setShowDropdown] = useState(false);
    return (
        <Nav>
        {/* Toggle Button */}
        <Button 
          variant="light" 
          className="dropdown-toggle-button bgtransparent"
          onClick={() => setShowDropdown(!showDropdown)}
          style={{backgroundColor: 'transparent'}}
        >
          <img src={editIcon} alt="editIcon" />
        </Button>

        {/* NavDropdown with Custom Show State */}
        <NavDropdown
          show={showDropdown}
          onToggle={(isOpen) => setShowDropdown(isOpen)}
          id="nav-dropdown-dark-example"
          className="nav-dropdown"
        >
          <NavDropdown.Item href="#" onClick={onAddAgency}>
            <img src={addAdminIcon} alt="add" /> Add Agency
          </NavDropdown.Item>
          <NavDropdown.Item 
            href="#" 
            onClick={() => onEditAgency(item?._id || 0, item?.agencyDetails[0]?.agency_id || 0, item.agencyDetails[0])}
          >
            <img src={editAdminIcon} alt="edit" /> Edit Agency
          </NavDropdown.Item>
          <NavDropdown.Item href="#" onClick={() => onDeleteAgency(item?._id, item)}>
            <img src={deleteAdminIcon} alt="delete" /> Delete Agency
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    )

}

export default AgencyActionDropdown;