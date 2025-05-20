import React from 'react';
import { Modal } from 'react-bootstrap';

const ModalComponent = ({ show, handleClose, htmlContent }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Booking Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <iframe
          srcDoc={htmlContent}
          title="Booking Form"
          style={{ width: '100%', height: '500px', border: 'none' }}
        ></iframe>
      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
