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
import { useContainer } from "../../hook/useContainer";

export const AssignJobSec = ({ isToggled }) => {
  const personInfoId = useSelector((state) => state.auth.id);
  const { jobId, yardAreaId } = useParams(); // Retrieve params from the URL
 const [machines, setMachines] = useState([]);
  // const [activeYardAreas, setActiveYardAreas] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState("");
  // const [selectedYardArea, setSelectedYardArea] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const { fetchYardAreasByYardId, getMachinesByYardArea } = useYardArea();
  const { sendJobCard } = useContainer();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchActiveYardAreas = async () => {
  //     try {
  //       const areas = await fetchYardAreasByYardId(yardId);
  //       setActiveYardAreas(areas);
  //     } catch (err) {
  //       console.error("Error fetching yard areas:", err);
  //     }
  //   };

  //   fetchActiveYardAreas();
  // }, [yardId]);

  useEffect(() => {
    const fetchMachinesByYardArea = async (yardAreaId) => {
      try {
        const response = await getMachinesByYardArea(yardAreaId);
        setMachines(response.data || []);
       
      } catch (err) {
        console.error("Error fetching machines:", err);
        setMachines([]);
      }
    };
      fetchMachinesByYardArea(yardAreaId);
  
  }, [yardAreaId]);

  const handleAssignJobSubmit = async () => {
    try {
      // Prepare the data to pass into the API
      const jobData = {
        jobId: jobId,            // Assuming 'id' is the container ID
        machineId: selectedMachine, // Selected machine ID
        personInfoId: personInfoId
      };

      // Send job card data via the API call
      const response = await sendJobCard(jobData);

      // Check if the response is successful
      if (response && response.status) {
        setShowModal(false); // Close modal after successful assignment
      } else {
        console.error("Failed to assign machine:", response.message);
      }
    } catch (error) {
      console.error("Error assigning machine:", error);
    }
  };


  const handleCloseModal = () => setShowModal(false);
  const BackPage = () => navigate("/pages/entry-logs-list");

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
          <Breadcrumb.Item active>Assign Job</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col lg={12}>
            <div className="title">
              <h2 className="text-start mb-0">
                Assign Job for Container
              </h2>
            </div>
          </Col>
        </Row>
        <div className="form-wrap">
          <Form>
            <Row>
              {/* <Col md="4">
                <Form.Group controlId="yardAreaSelect" className="form-group">
                  <Form.Label>Drop Location</Form.Label>
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
              </Col> */}
              <Col md="4">
                <Form.Group controlId="machineSelect" className="form-group">
                  <Form.Label>Machine</Form.Label>
                  <div className="card flex justify-content-center border-0">
                    <Dropdown
                      value={selectedMachine}
                      options={machines.map((machine) => ({
                        label: machine.machineName, // Displayed in the dropdown
                        value: machine.machineId, // Corresponds to the selected value
                      }))}
                      onChange={(e) => setSelectedMachine(e.value)}
                      placeholder="Select Machine"
                      className="custom-select w-full md:w-14rem"
                    />
                  </div>
                </Form.Group>
              </Col>
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
                Assign Job
              </Button>
            </div>
          </Form>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Body>
            <Modal.Title
              className={`fs-6 text-center ${isError ? "text-danger" : "text-success"
                }`}
            >
              {modalMessage}
            </Modal.Title>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AssignJobSec;
