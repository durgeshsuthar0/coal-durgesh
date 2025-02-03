import React, { useState } from "react";
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux"; // Import useSelector
import { useYardArea } from "../../hook/useYardArea";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import { SealCheck } from "@phosphor-icons/react";
import { Dropdown } from "primereact/dropdown";

export const YardAreaFormSec = ({ isToggled }) => {
  const yardId = useSelector((state) => state.auth.selectedYardId);
  const { id } = useParams();
  const { fetchYardAreaById, fetchAvailablePersons } = useYardArea();
  const { submitYardArea, fetchAreaTypes, assignYardTAreaoPerson } =
    useYardArea();

    const initialYardAreaData = {
      id: null,
      yardId: yardId,
      areaTypeId: "",
      areaName: "",
      latitude: "",
      longitude: "",
      areaDescription: "",
      containerCapacity: "",
      isOperational: null, // Set to null instead of false
      isActive: false,
    };

  const [validated, setValidated] = useState(false);
  const [areaTypes, setAreaTypes] = useState([]);
  const [show, setShow] = useState(false);
  const [availablePersons, setAvailablePersons] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [formData, setFormData] = useState(initialYardAreaData);

  const personInfoId = useSelector((state) => state.auth.id);
  const currentUserRole = useSelector((state) => state.auth.roleName);

  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleNavigate = () => {
    navigate("/pages/yard-area-List"); // Replace with your desired aroute
  };

  useEffect(() => {
    if (id) {
      const loadYardArea = async () => {
        const areaData = await fetchYardAreaById(id);
        if (areaData) {
          setFormData(areaData);
        }
        
      };
      loadYardArea();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOperationalChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      isOperational: e.target.value === "Operational",
    }));
  };

  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const yardAreaData = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };
    try {
      const response = await submitYardArea(personInfoId, yardAreaData);
      if (response && response.status) {
        const successMessage =
          response.data.message || "yard area data saved successfully";
        setModalMessage(successMessage);
        setIsError(false);
        setShow(true);

        if (selectedPersonId) {
          await assignYardareaToPerson(
            selectedPersonId,
            response.data.data.id,
            yardId
          );
        }
        // Reset form state
        setFormData(initialYardAreaData);
        setValidated(false);
      } else {
        const errorMessage = response?.message || "unexpected Error Occurred";
        setModalMessage(errorMessage);
        setIsError(true);
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 3000);
        console.error("form submittion failed", errorMessage);
      }
    } catch (error) {
      console.error("form submittion failed", error);
    }
  };

  const assignYardareaToPerson = async (personInfoId, yardAreaId) => {
    try {
      const response = await assignYardTAreaoPerson(
        personInfoId,
        yardAreaId,
        yardId
      );
      if (response) {
      } else {
        console.error("Failed to assign yard");
      }
    } catch (error) {
      console.error("Error fetching available persons:", error);
    }
  };

  useEffect(() => {
    const loadAreaTypes = async () => {
      const types = await fetchAreaTypes();
      setAreaTypes(types);
    };

    loadAreaTypes();
  }, []);

  const [roleAction, setRoleAction] = useState("assign");
  useEffect(() => {
    if (roleAction === "assign") {
      fetchAvailablePersonsData();
    } else {
      setAvailablePersons([]);
    }
  }, [roleAction, currentUserRole, formData.id]);

  const fetchAvailablePersonsData = async () => {
    try {
      const persons = await fetchAvailablePersons(currentUserRole, formData.id,personInfoId);
      setAvailablePersons(persons.data);
    } catch (error) {
      console.error("Error fetching available persons:", error);
    }
  };

  const [isRoleAssigned, setIsRoleAssigned] = useState(false);
  const handleRoleActionChange = (e) => {
    setIsRoleAssigned(e.target.value === "Assign");
    setSelectedPersonId("");
  };
  const BackPage = () => {
    navigate("/pages/yard-area-List");
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
            <Breadcrumb.Item href="/pages/yard-area-list">
              Yard Area List
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {formData.id ? "Edit Yard Area" : "Add Yard Area"}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">
                  {formData.id ? "Edit Yard Area" : "Add Yard Area"}
                </h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap mb-3">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Col md="4">
                <Form.Group
                  controlId="validationCustom16"
                  className="form-group custom-radio"
                >
                  <Form.Label>Area Allocation</Form.Label>
                  <div className="d-flex">
                    <Form.Check
                      type="radio"
                      name="isAssign"
                      label="Assign"
                      value="Assign"
                      required
                      className="me-3"
                      id="assign-1"
                      onChange={handleRoleActionChange}
                    />
                    <Form.Check
                      type="radio"
                      name="isAssign"
                      label="Not-Assign"
                      value="Not-Assign"
                      required
                      id="assign-2"
                      onChange={handleRoleActionChange}
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Please select a valid Status.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {isRoleAssigned && (
                <Col md="4">
                  <Form.Group
                    controlId="assignRoleDropdown"
                    className="form-group"
                  >
                    <Form.Label>Assign Role</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        value={selectedPersonId}
                        options={availablePersons.map((person) => ({
                          value: person.id,
                          label: person.email,
                        }))}
                        onChange={(e) => setSelectedPersonId(e.value)} // Update selected person ID
                        required
                        placeholder="Select Person"
                        className="custom-select w-full md:w-14rem"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a person.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
            </Form>
          </div>
          <div className="form-wrap">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                {/* Yard Area Name */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom01"
                    className="form-group"
                  >
                    <Form.Label>Area Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter Yard Area Name"
                      name="areaName"
                      pattern="^[A-Za-z\s]+$"
                      value={formData.areaName}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Yard Area Name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Area Type */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom02"
                    className="form-group"
                  >
                    <Form.Label>Area Type</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        value={formData.areaTypeId}
                        options={areaTypes.map((type) => ({
                          value: type.id,

                          label: type.areaType,
                        }))}
                        onChange={(e) =>
                          handleChange({
                            target: { name: "areaTypeId", value: e.value },
                          })
                        }
                        optionLabel="label"
                        placeholder="Select an option"
                        className="custom-select w-full md:w-14rem"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select an Area Type.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Area Space */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom09"
                    className="form-group"
                  >
                    <Form.Label>Area Space (sq. ft.)</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      step="any"
                      placeholder="Enter Area Space"
                      name="totalAreaSpace"
                      value={formData.totalAreaSpace}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Area Number.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Container Capacity */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom11"
                    className="form-group"
                  >
                    <Form.Label>Number of Containers</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      step="any"
                      placeholder="Number of Containers"
                      name="containerCapacity"
                      value={formData.containerCapacity}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Capacity.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Latitude */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom07"
                    className="form-group"
                  >
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      step="any"
                      placeholder="Enter Latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Latitude.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Longitude */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom08"
                    className="form-group"
                  >
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      step="any"
                      placeholder="Enter Longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Longitude.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Operational Type */}
                <Col md="4">
  <Form.Group
    controlId="validationCustom12"
    className="custom-radio"
  >
    <Form.Label>Operational Type</Form.Label>
    <div className="d-flex">
    <Form.Check
  type="radio"
  name="isOperational"
  label="Operational"
  value="Operational"
  id="operational-1"
  checked={formData.isOperational === true}
  onChange={handleOperationalChange}
  required
  className="me-3"
/>
<Form.Check
  type="radio"
  name="isOperational"
  label="Non-Operational"
  value="Non-Operational"
  id="operational-2"
  checked={formData.isOperational === false}
  onChange={handleOperationalChange}
  required
/>

    </div>
    <Form.Control.Feedback type="invalid">
      Please select a valid Operational Type.
    </Form.Control.Feedback>
  </Form.Group>
</Col>

 
 
                {/* Status */}
                {/* <Col md="4">
                  <Form.Group
                    controlId="validationCustom13"
                    className="custom-radio"
                  >
                    <Form.Label>Status</Form.Label>
                    <div className="d-flex">
                      <Form.Check
                        type="radio"
                        name="isActive"
                        label="Active"
                        value="Active"
                        id="status-1"
                        checked={formData.isActive}
                        onChange={handleActiveChange}
                        required
                        className="me-3"
                      />
                      <Form.Check
                        type="radio"
                        name="isActive"
                        label="Inactive"
                        value="Inactive"
                        id="status-2"
                        checked={!formData.isActive}
                        onChange={handleActiveChange}
                        required
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a valid Status.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col> */}
                <Col md={12}>
                  <Form.Group
                    controlId="formBasicDescription"
                    className="form-group mt-2"
                  >
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter area description"
                      name="areaDescription"
                      value={formData.areaDescription}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid description.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-between">
                <Button
                  type="submit"
                  varient="primary"
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
                  varient="primary"
                  className="btn-style-primary mt-2"
                >
                  <div className="btn-icon-style">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  {formData.id ? "Update " : "Submit"}
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
                      : "text-success d-block mx-auto mb-2"
                  }
                />{" "}
                {modalMessage}
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
                  Yard Area List
                </Button>
              )}
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default YardAreaFormSec;
