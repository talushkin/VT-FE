import React, { useEffect, useState, useRef } from "react";
import "./ListSelectable.scss";
import { langCodes } from "../translatelangcodes";

const ListSelectable = ({ inputref, updateSelectedData, targetLangName, targetLangCode }) => {

    const [filteredList, setFilteredList] = useState(null);
    
    
    const [sourceLang, setSourceLang] = useState({"code": "en", "name": "English"});
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        console.log('total lang',langCodes.length)
        const SourceLangCode = langCodes.filter((lang) => lang.code === sourceLang.code)[0];
        
        setFilteredList(langCodes);
        setSourceLang(SourceLangCode);
    }, [])

    const onChange = (value) => {
        updateSelectedData({"code": "", "name": value})
        const filteredLangCodes = langCodes.filter((lang) => lang.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredList(filteredLangCodes);
    }

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

    const handleSelect = async (lang) => {
        updateSelectedData(lang)
        setIsOpen(false)
    };

  

    return (
        <div className="col-3 gp-pmnt-pad-10" style={{position: 'relative'}} >
            <input 
                type="text" 
                value={targetLangName || ""} 
                onChange={(e) => onChange(e.target.value)} 
                className="form-control"
                placeholder="Select language"
                ref={inputref}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && (
                <div className="client-dropdown-list" ref={dropdownRef} >
                    {filteredList.length > 0 ? (
                        filteredList.map((itm) => (
                            <div
                                key={itm.code}
                                className="client-dropdown-item"
                                onClick={() => handleSelect(itm)}
                            >
                                {itm.name}
                            </div>
                        ))
                    ) : (
                        <div className="client-dropdown-item">No data</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ListSelectable