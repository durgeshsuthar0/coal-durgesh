import React, { useState } from "react";
import { Col, Container, Row, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHouseChimney,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useTagInventory } from "../../hook/useTagInventory";
import { SealCheck } from "@phosphor-icons/react";
import { useSelector } from "react-redux";

export const TagFormSec = ({ isToggled }) => {
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const yardId = useSelector((state) => state.auth.selectedYardId);

  const [formData, setFormData] = useState({
    tagName: "",
    assign: false,
    yardId: "",
  });

  const navigate = useNavigate();

  const { saveTag } = useTagInventory();

  const handleClose = () => setShow(false);

  const handleNavigate = () => {
    navigate("/pages/tag-inventory");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [modalMessagae, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const payload = {
      tagName: formData.tagName,
      assign: formData.assign,
      yardId: yardId,
    };
    try {
      const response = await saveTag(payload);
      if (response && response.status) {
        const successMessage = response.data.message || "tag save";
        setModalMessage(successMessage);
        setIsError(false);
        setShow(true);

        setFormData({
          tagName: "",
          assign: false,
          yardId: yardId,
        });
        setValidated(false);

      } else {
        const errorMessage = response?.message || "unexpected error occurred";
        setModalMessage(errorMessage);
        setIsError(true);
        setShow(true);

        setTimeout(() => {
          setShow(false);
        }, 3000);
        console.error("Error saving tag:", response.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const BackPage = () => {
    navigate("/pages/tag-inventory");
  };

  return (
    <React.Fragment>
      <div
        className={
          isToggled
            ? "inner-content p-3 expand-inner-content"
            : "inner-content p-3"
        }
      >
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/pages/dashboard">
              <FontAwesomeIcon icon={faHouseChimney} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/pages/tag-inventory">
              Tag List
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Add Tag</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">Add Tag</h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                {/* Tag ID */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>Tag Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter Tag Name"
                      name="tagName"
                      value={formData.tagName}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Tag ID.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-between">
                <Button
                  type="button"
                  variant="primary"
                  className="btn-style-primary2 mt-2"
                  onClick={BackPage}
                >
                  <div className="btn-icon-style">
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </div>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="btn-style-primary mt-2"
                >
                  <div className="btn-icon-style">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  Submit
                </Button>
              </div>
            </Form>
          </div>
          <Modal
            show={show}
            onHide={handleClose}
            className="
          success-modal"
          >
            {/* <Modal.Header closeButton>
        </Modal.Header> */}
            <Modal.Body>
              <Modal.Title className="fs-6 text-black text-center">
                <SealCheck
                  size={50}
                  className={
                    isError
                      ? "text-danger d-block mx-auto mb-2"
                      : " text-success d-block mx-auto mb-2"
                  }
                />{" "}
                {modalMessagae}
              </Modal.Title>
              {!isError && (
                <Button
                  type="submit"
                  variant="primary"
                  className="btn-style-primary mt-3 mx-auto"
                  onClick={handleNavigate}
                >
                  <div className="btn-icon-style">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  Tag-inventory List
                </Button>
              )}
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
