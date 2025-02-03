import React from "react";
import { Modal } from "react-bootstrap";

const ImageModal = ({ show, handleClose, imageUrl }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Image Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Selected"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <p>No image to display</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;
