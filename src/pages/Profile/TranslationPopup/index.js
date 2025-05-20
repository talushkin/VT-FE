import React, { useState, useRef } from 'react';
import axios from 'axios';
import { MdTranslate, MdOutlineMic } from 'react-icons/md'; // translation + mic icons
import './TranslationPopup.scss'; // styles
import ListSelectable from './ListSelectable';
import constants from '../../../Util/constants';

const TranslationPopup = ({ onClose, emailText, handleTranslatedEmailTemplate }) => {


  const [targetLang, setTargetLang] = useState(null);
  const [targetCode, setTargetCode] = useState(null);
  const [translatedText, setTranslatedText] = useState('');
  const inputRefs = useRef();

    const updateSelectedData = (data) => {
        setTargetLang(data.name)
        setTargetCode(data.code)
    }

  const handleTranslate = async () => {
    // const result = await translateText(emailText, targetLang);
    // setTranslatedText(result);
    try {
        const response = await axios.post(`${constants.BASE_URL}/general/translate-template`, {
            text: emailText,
            targetLanguage: targetLang,
        })
    
        console.log(response)
    } catch(error) {
       setTranslatedText(`${error.response.data.error.message} for ${targetLang}`);
    }
    // if(targetCode) {
    //     const res = await fetch("https://libretranslate.com/translate", {
    //         method: "POST",
    //         body: JSON.stringify({
    //           q: emailText,
    //           source: "en",
    //           target: targetCode,
    //         }),
    //         headers: { "Content-Type": "application/json" },
    //     });

    //     const result = await res.json();
    //     console.log(result);
    // }
    
  };

  return (
    <div
      className="modal gap-2"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      style={{ overflow: 'unset', textAlign: 'center' }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered" style={{ display: 'block' }}>
        <div className="modal-content">
          <div className="modal-header" style={{ display: 'block' }}>
            <div className="row">
              <div className="col-12">
                <h1 className="text-center mt-3" style={{ fontSize: '25px' }}>
                  <b style={{ color: 'black' }}><MdTranslate size={24} /> Translate your template</b>
                </h1>
                <h3 className="text-center" style={{ fontSize: 'revert' }}>
                  Translate your personal email template to the language of your choice.
                </h3>
              </div>
            </div>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
              style={{ position: 'absolute', right: '10px', top: '10px' }}
            ></button>
          </div>

          <hr style={{ margin: '1rem 0 0 0' }} />

          <div className="modal-body my-3 mx-3 offer-container" style={{ position: 'relative' }}>
            <div className="row justify-content-center gap-3">

              {/* Language selection */}
              <div className="d-flex justify-content-center mb-3">
                <div className='form-group' style={{marginTop: '10px', marginRight: '10px' }}><input type='text' value="English" readOnly className='form-control' /></div>
                

                <span style={{ alignSelf: 'center' }}>↔</span>
                <ListSelectable 
                    inputref={el => inputRefs.current = el}
                    updateSelectedData={updateSelectedData}
                    targetLangName={targetLang}
                    targetLangCode={targetCode}
                />
                {/* <select
                  className="form-select mx-2"
                  style={{ width: '200px' }}
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                >
                  <option>English</option>
                  <option>French</option>
                  <option>Spanish</option>
                  <option>German</option>
                  
                </select> */}
              </div>

              {/* Text input and translation result */}
              <div className="d-flex gap-3 justify-content-center">
                <div className="p-3 border rounded" style={{ width: '40%', minHeight: '150px', textAlign: 'left' }}>
                  <textarea
                    className="form-control border-0"
                    rows={6}
                    value={emailText}
                    placeholder="Enter text"
                    onChange={(e) => handleTranslatedEmailTemplate(e.target.value)}
                    style={{ resize: 'none', height: '100%', border: 'none' }}
                    disabled
                  />
                  <MdOutlineMic style={{ position: 'absolute', bottom: 20, left: 20, cursor: 'pointer' }}  />
                </div>

                <div className="p-3 border rounded bg-light" style={{ width: '40%', minHeight: '150px', textAlign: 'left' }}>
                  <div className="fw-bold mb-2">Translation</div>
                  <div>{translatedText}</div>
                </div>
              </div>

              <div className="mt-4" style={{ textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={handleTranslate}>
                  Translate
                </button>
                <button className="btn btn-primary" onClick={() => {}} style={{ marginLeft: '10px' }}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationPopup;
