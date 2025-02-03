import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHouseChimney,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useYardArea } from "../../hook/useYardArea";
import { Dropdown } from "primereact/dropdown";
import { useMachine } from "../../hook/useMachine";
import { SealCheck } from "@phosphor-icons/react";

export const MachineAssignSec = ({ isToggled }) => {
  const { id } = useParams();
  const yardId = useSelector((state) => state.auth.selectedYardId);
  const [activeYardAreas, setActiveYardAreas] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedYardArea, setSelectedYardArea] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [operators, setOperators] = useState([]);
  const personInfoId = useSelector((state) => state.auth.id);
  const role = useSelector((state) => state.auth.roleName);
  // for dynemic message from api response
  const [modalMessage, setModalMessage] = useState(""); // For success or error messages
  const [isError, setIsError] = useState(false); // To track if the modal is for an error
  const handleClose = () => setShow(false);
  const handleNavigate = () => {
    navigate("/pages/machine-list");
  };

  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);

  const { fetchYardAreas } = useYardArea();
  const navigate = useNavigate();
  const { fetchOperators, saveOrUpdateMachineAssignmentsData } = useMachine();

  useEffect(() => {
    const fetchActiveYardAreas = async () => {
      try {
        const areas = await fetchYardAreas(yardId, role, personInfoId);
        setActiveYardAreas(areas);
      } catch (err) {
        console.error("Error fetching yard areas:", err);
      }
    };

    fetchActiveYardAreas();
  }, [yardId]);

  useEffect(() => {
    const loadOperators = async (yardId) => {
      if (!yardId) {
        console.error("yardId is required to fetch operators.");
        return;
      }

      try {
        const operators = await fetchOperators(yardId); // Fetch the operators data
        setOperators(
          operators.map((op) => ({ value: op.id, label: op.email })) // Map data to the desired format
        );
      } catch (err) {
        console.error("Error fetching operators:", err);
      }
    };

    loadOperators(yardId); // Call the function with the current yardId
  }, [yardId]); // Dependency array ensures it runs when yardId changes

  const handleAssignJobSubmit = async () => {
    const assignmentData = {
      machineId: id, // Pass the selected machine's ID
      personInfoId: selectedOperator,
      yardAreaId: selectedYardArea,
      yardId: yardId,
      createdBy: personInfoId,
    };
    try {
      const response = await saveOrUpdateMachineAssignmentsData(assignmentData);
      if (response) {
        const successMessage =
          response.message || "Machine Data Saved Successfully";
        setModalMessage(successMessage); // Set the success message
        setIsError(false); // Set error to false for success
        setShow(true); // Show the modal
        setValidated(false);
      }
    } catch (error) {
      console.error("Error assigning machine:", error);
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const BackPage = () => navigate("/pages/machine-list");

  return (
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
          <Breadcrumb.Item active>Machine List</Breadcrumb.Item>
          <Breadcrumb.Item active>Assign</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col lg={12}>
            <div className="title">
              <h2 className="text-start mb-0">Assign Machine</h2>
            </div>
          </Col>
        </Row>
        <div className="form-wrap">
          <Form>
            <Row>
              <Col md="4">
                <Form.Group controlId="operatorSelect" className="form-group">
                  <Form.Label>Operator</Form.Label>
                  <div className="card flex justify-content-center border-0">
                    <Dropdown
                      value={selectedOperator}
                      options={operators.map((operator) => ({
                        label: operator.label, // Displayed in the dropdown
                        value: operator.value, // Corresponds to the selected value
                      }))}
                      onChange={(e) => setSelectedOperator(e.value)}
                      placeholder="Select an Operator"
                      className="custom-select w-full md:w-14rem"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md="4">
                <Form.Group controlId="yardAreaSelect" className="form-group">
                  <Form.Label>Yard Area</Form.Label>
                  <div className="card flex justify-content-center border-0">
                    <Dropdown
                      value={selectedYardArea}
                      options={activeYardAreas.map((area) => ({
                        label: area.areaName, // Displayed in the dropdown
                        value: area.id, // Corresponds to the selected value
                      }))}
                      onChange={(e) => setSelectedYardArea(e.value)}
                      placeholder="Select Yard Area"
                      className="custom-select w-full md:w-14rem"
                    />
                  </div>
                </Form.Group>
              </Col>
              {/* <Col md="4">
                <Form.Group controlId="machineSelect" className="form-group">
                  <Form.Label>Select Lattitude</Form.Label>
                  <Form.Control
                      name="selectlattitude"
                      value=""
                    
                      required
                      type="text"
                      placeholder="Enter Lattitude"
                    />
                </Form.Group>
              </Col> */}
              {/* <Col md="4">
                <Form.Group controlId="machineSelect" className="form-group">
                  <Form.Label>Select Longitude</Form.Label>
                  <Form.Control
                      name="selectlongitude"
                      value=""
                    
                      required
                      type="text"
                      placeholder="Enter Longitude"
                    />
                </Form.Group>
              </Col> */}
            </Row>

            <div className="d-flex justify-content-between mt-3">
              <Button
                type="button"
                variant="primary"
                className="btn-style-primary2"
                onClick={BackPage}
              >
                <div className="btn-icon-style">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                className="btn-style-primary"
                onClick={handleAssignJobSubmit}
              >
                <div className="btn-icon-style">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
                Assign
              </Button>
            </div>
          </Form>
        </div>

        <Modal show={show} onHide={handleClose} className="success-modal">
          <Modal.Body>
            <Modal.Title className="fs-6 text-black text-center">
              <SealCheck
                size={50}
                className={
                  isError
                    ? "text-danger d-block mx-auto mb-2"
                    : "text-success d-block mx-auto mb-2"
                }
              />{" "}
              {modalMessage} {/* Display error or success message */}
            </Modal.Title>

            {/* Conditionally render button based on error */}
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
                Yard List
              </Button>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default MachineAssignSec;
