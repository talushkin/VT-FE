import React, { useEffect, useRef, useState } from "react";
import { IoMdCopy } from "react-icons/io";
import './emailtemplatebutton.scss';

const EmailTemplateButton = ({handleAddEmailTemplate}) => {

    return(    
        <span className="img-fluid add-template-button" onClick={handleAddEmailTemplate} >
            <IoMdCopy size={20} /> 
            <span style={{fontSize: '15px'}}>Add Template</span>
        </span>
    )
}

export default EmailTemplateButton;