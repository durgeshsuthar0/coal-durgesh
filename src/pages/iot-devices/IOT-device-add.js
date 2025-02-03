import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHouseChimney, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { SealCheck } from "@phosphor-icons/react";
import { useIOTDevice } from "../../hook/useIotDevice";
import { useMachine } from "../../hook/useMachine";

export const IotDeviceFormSec = ({ isToggled }) => {
  const { id } = useParams();
  const { saveOrUpdateIotDeviceData, fetchIotDevicebyId, fetchIotDevicesTypes, UpdateIotDeviceData } = useIOTDevice();
  const { fetchMachineByEventType } = useMachine();
  const [validated, setValidated] = useState(false);
  const [iotDeviceData, setIOTdeviceData] = useState({});
  const [show, setShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [iotDeviceTypes, setIotDeviceTypes] = useState([]);
  const [machineList, setMachineList] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMachineUuid, setSelectedMachineUuid] = useState(null);
  const [EventTypeId, setEventTypeId] = useState(null);

  const personUuid = useSelector((state) => state.auth.personUUID);
  const yardId = useSelector((state) => state.auth.selectedYardId);
  const navigate = useNavigate();

  useEffect(() => {
    const loadIotDevice = async () => {
      try {
        const deviceTypes = await fetchIotDevicesTypes();
        if (deviceTypes && Array.isArray(deviceTypes)) {
          setIotDeviceTypes(deviceTypes);
        }

        if (EventTypeId !== null) {
          const data = await fetchMachineByEventType(EventTypeId);
          setMachineList(data);
        }

        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    loadIotDevice();
  }, [id, yardId, EventTypeId]);

  // Log the current state of iotDeviceData when it's updated
  useEffect(() => {
  }, [iotDeviceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIOTdeviceData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };

  // Handle machine selection
  const handleMachineSelect = (e) => {
    const selectedMachineId = e.target.value;

    if (!selectedMachineId) {
      console.error("Selected machine id is undefined or invalid");
      return;
    }

    const selectedMachine = machineList.find((machine) => machine.machineUuid === selectedMachineId);


    if (selectedMachine) {
      setIOTdeviceData((prevData) => {
        const updatedData = {
          ...prevData,
          machineNumber: selectedMachine.machineName,
          machineUUID: selectedMachine.machineUuid || null,
        };
        return updatedData;
      });
    } else {
      console.error("Machine not found in the list. Please check the machine UUID and the machine list.");
    }
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    } else {
      const selectedMachine = machineList.find((machine) => machine.id === iotDeviceData.machineNumber);
      const updatedIotDeviceData = { ...iotDeviceData };

      updatedIotDeviceData.machineUUID = iotDeviceData.machineUUID || null;
      updatedIotDeviceData.eventTypeId = EventTypeId;


      try {
        let response;
        if (iotDeviceData.id) {
          response = await UpdateIotDeviceData(personUuid, updatedIotDeviceData);
        } else {
          response = await saveOrUpdateIotDeviceData(personUuid, updatedIotDeviceData);
        }

        // Handle the response based on status
        if (response && response.status) {
          setModalMessage(response.message || "IoT Data Saved Successfully");
          setError(false);
          setShow(true);
          setIOTdeviceData({});
          setValidated(false);
        } else {
          setModalMessage(response.message || "Unexpected error occurred");
          setError(true);
          setShow(true);
          setTimeout(() => setShow(false), 3000);
        }
      } catch (err) {
        console.error("Error in handleSubmit:", err);
        setModalMessage("An error occurred while updating the IoT device.");
        setError(true);
        setShow(true);
        setTimeout(() => setShow(false), 3000);
      }
    }
  };

  const handleEventTypeChange = (e) => {
    setEventTypeId(e.target.value);
  };

  const BackPage = () => navigate("/pages/iot-device-list");

  const handleClose = () => setShow(false);

  const handleNavigate = () => navigate("/pages/iot-device-list");

  return (
    <React.Fragment>
      <div className={isToggled ? "inner-content p-3 expand-inner-content" : "inner-content p-3"}>
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/pages/dashboard">
              <FontAwesomeIcon icon={faHouseChimney} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/pages/iot-device-list">IOT Device List</Breadcrumb.Item>
            <Breadcrumb.Item active>{iotDeviceData.id ? "Edit Device" : "Add Device"}</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="mb-0">{iotDeviceData.id ? "Edit Device" : "Add Device"}</h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Form Fields */}
              <Row className="mb-3">
                <Col md="6">
                  <Form.Group className="form-group" controlId="validationCustom01">
                    <Form.Label>Device Name</Form.Label>
                    <Form.Control
                      name="deviceName"
                      value={iotDeviceData.deviceName}
                      onChange={handleChange}
                      required
                      type="text"
                      placeholder="Enter Device Name"
                      pattern="^[A-Za-z\s]+$"
                    />
                    <Form.Control.Feedback type="invalid">Please enter a valid Device Name.</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group className="form-group" controlId="validationCustom04">
                    <Form.Label>Device Serial Number</Form.Label>
                    <Form.Control
                      name="serialNumber"
                      value={iotDeviceData.serialNumber}
                      onChange={handleChange}
                      required
                      type="text"
                      placeholder="Enter Serial Number"
                    />
                    <Form.Control.Feedback type="invalid">Please enter a valid Device Serial Number.</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group className="form-group" controlId="validationCustom06">
                    <Form.Label>Manufacturer Name</Form.Label>
                    <Form.Control
                      name="manufactureName"
                      value={iotDeviceData.manufactureName}
                      onChange={handleChange}
                      required
                      type="text"
                      placeholder="Enter Manufacturer Name"
                    />
                    <Form.Control.Feedback type="invalid">Please enter a valid Manufacturer Name.</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group className="form-group" controlId="validationCustom07">
                    <Form.Label>Sim Number</Form.Label>
                    <Form.Control
                      name="simNo"
                      value={iotDeviceData.simNo}
                      onChange={handleChange}
                      required
                      type="text"
                      placeholder="Enter Sim Number"
                    />
                    <Form.Control.Feedback type="invalid">Please enter a valid Sim Number.</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group className="form-group" controlId="deviceStatus">
                    <Form.Label>Device Status</Form.Label>
                    <div className="d-flex">
                      <Form.Check
                        inline
                        type="radio"
                        label="Active"
                        name="deviceStatus"
                        value="Active"
                        checked={iotDeviceData.deviceStatus === true}
                        onChange={(e) => setIOTdeviceData({ ...iotDeviceData, deviceStatus: true })}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="Inactive"
                        name="deviceStatus"
                        value="Inactive"
                        checked={iotDeviceData.deviceStatus === false}
                        onChange={(e) => setIOTdeviceData({ ...iotDeviceData, deviceStatus: false })}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">Please select a Device Status.</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group className="form-group" controlId="eventType">
                    <Form.Label>Event Type</Form.Label>
                    <Form.Control
                      name="eventType"
                      as="select"
                      value={iotDeviceData.eventType}
                      onChange={handleEventTypeChange}
                    >
                      <option value="">Select Device Type</option>
                      {iotDeviceTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">Please select a valid Event Type.</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group className="form-group" controlId="machineNumber">
                    <Form.Label>Machine Number</Form.Label>
                    <Form.Control
                      name="machineNumber"
                      as="select"
                      value={iotDeviceData.machineNumber || ""}  // Use machineNumber from state, not from iotDeviceData
                      onChange={handleMachineSelect}
                    >
                      <option value="">Select Machine Number</option>
                      {machineList.length > 0 ? (
                        machineList.map((machine) => (
                          <option key={machine.id} value={machine.machineUuid}>
                            {machine.machineName}  {/* Show machine name in the dropdown */}
                          </option>
                        ))
                      ) : (
                        <option value="">No machines available</option>
                      )}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">Please select a valid Machine Number.</Form.Control.Feedback>
                  </Form.Group>
                </Col>



              </Row>

              <div className="d-flex justify-content-between">
                <Button type="button" variant="primary" className="btn-style-primary2 mt-2" onClick={BackPage}>
                  <div className="btn-icon-style">
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </div>
                  Back
                </Button>
                <Button type="submit" variant="primary" className="btn-style-primary mt-2">
                  <div className="btn-icon-style">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  {iotDeviceData.id ? "Update" : "Submit"}
                </Button>
              </div>
            </Form>
          </div>

          {/* Success/Error Modal */}
          <Modal centered show={show} onHide={handleClose} className="success-modal">
            <Modal.Body>
              <Modal.Title className="fs-6 text-black text-center">
                <SealCheck
                  size={50}
                  className={isError ? "text-danger d-block mx-auto mb-2" : "text-success d-block mx-auto mb-2"}
                />
                {modalMessage}
              </Modal.Title>
              {!isError && (
                <Button type="submit" variant="primary" className="btn-style-primary mt-3 mx-auto" onClick={handleNavigate}>
                  <div className="btn-icon-style">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  IOT Device List
                </Button>
              )}
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

