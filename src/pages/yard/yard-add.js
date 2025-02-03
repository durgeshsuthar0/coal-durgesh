import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useYard } from "../../hook/useYard";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SealCheck } from "@phosphor-icons/react";
import { Dropdown } from "primereact/dropdown";
import { usePerson } from "../../hook/usePerson";

export const YardformSec = ({ isToggled }) => {
  const {
    fetchLocation,
    fetchYardById,
    saveYard,
    updateYard,
    fetchAvailablePersons,
    assignYard,
  } = useYard();
  const { fetchRoleByYard, fetchPersons } = usePerson();

  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const role = useSelector((state) => state.auth.roleName);

  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const personUuid = useSelector((state) => state.auth.personUUID);

  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [locations, setLocations] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredTalukas, setFilteredTalukas] = useState([]);
  const [availablePersons, setAvailablePersons] = useState([]);
  const [roleAction, setRoleAction] = useState("unassign");
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [roles, setRoles] = useState([]);

  const { id } = useParams();

  const initialYardData = {
    id: null,
    uuid: id || "",
    coalYardName: "",
    state: null,
    district: null,
    taluka: null,
    latitude: "",
    longitude: "",
    pinCode: "",
    address: "",
    status: "",
    description: "",
    totalCoalSpace: "",
    totalCoalCapacity: "",
    isActive: false,
    personName: "",
    personEmail: "",
    assignedPersons: [],
  };

  const [formData, setFormData] = useState(initialYardData);

  const handleNavigate = () => {
    navigate("/pages/yard-list");
  };

  const isAdminAndEditMode = role === "ADMIN" && formData.id;

  useEffect(() => {
    if (id) {
      const loadYard = async () => {
        const yardData = await fetchYardById(id);

        if (yardData && yardData.status) {
          const data = yardData.data;

          setFormData({
            id: data.id,
            coalYardName: data.coalYardName || "",
            state: data.stateId || null,
            district: data.districtId || null,
            taluka: data.talukaId || null,
            latitude: data.latitude || "",
            longitude: data.longitude || "",
            pinCode: data.pinCode || "",
            address: data.address || "",
            description: data.description || "",
            totalCoalSpace: data.totalCoalSpace || "",
            totalCoalCapacity: data.totalCoalCapacity || "",
            isActive: data.isActive,
            personName: data.personName || "",
            personEmail: data.personEmail || "",
            assigned: data.assigned || false,
          });

          // Load districts based on the selected state
          if (data.stateId) {
            const selectedStateObj = locations.find(
              (loc) => loc.id === data.stateId
            );
            if (selectedStateObj) {
              setFilteredDistricts(selectedStateObj.childList || []);

              // Load talukas based on the selected district
              const selectedDistrictObj = selectedStateObj.childList.find(
                (district) => district.id === data.districtId
              );
              if (selectedDistrictObj) {
                setFilteredTalukas(selectedDistrictObj.childList || []);

                // Set the selected taluka
                const selectedTalukaObj = selectedDistrictObj.childList.find(
                  (taluka) => taluka.id === data.talukaId
                );
                if (selectedTalukaObj) {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    taluka: selectedTalukaObj.id,
                  }));
                }
              }
            }
          }
        } else {
          console.error("Yard data not found.");
        }
      };
      loadYard();
    }
  }, [id, locations]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationData = await fetchLocation();
        if (locationData) {
          setLocations(locationData);
        } else {
          console.error("No locations found in response.");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (isRoleAssigned) {
      const loadAvailablePersons = async () => {
        try {
          const response = await fetchPersons(personUuid);
          if (response && response.status && Array.isArray(response.data)) {
            setAvailablePersons(response.data);
          } else {
            console.error(
              "Failed to fetch available persons:",
              response.message
            );
          }
        } catch (error) {
          console.error("Error fetching available persons:", error);
        }
      };

      loadAvailablePersons();
    }
  }, [roleAction, role, formData.id, personUuid]);

  const handleStateChange = (e) => {
    const selectedStateId = Number(e.target.value);
    const selectedStateObj = locations.find(
      (loc) => loc.id === selectedStateId
    );

    setFormData({
      ...formData,
      state: selectedStateId,
      district: null,
      taluka: null,
    });

    if (selectedStateObj) {
      setFilteredDistricts(selectedStateObj.childList || []);
      setFilteredTalukas([]);
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrictId = Number(e.target.value);
    const selectedDistrictObj = filteredDistricts.find(
      (district) => district.id === selectedDistrictId
    );

    setFormData({
      ...formData,
      district: selectedDistrictId,
      taluka: null,
    });

    if (selectedDistrictObj) {
      setFilteredTalukas(selectedDistrictObj.childList || []);
    }
  };

  const handleTalukaChange = (e) => {
    const selectedTalukaId = Number(e.target.value);

    // Find the corresponding district based on the selected Taluka
    const selectedDistrictObj = filteredDistricts.find((district) =>
      district.childList.some((taluka) => taluka.id === selectedTalukaId)
    );

    // Update the formData with the selected Taluka
    setFormData({
      ...formData,
      taluka: selectedTalukaId,
      district: selectedDistrictObj
        ? selectedDistrictObj.id
        : formData.district,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    // Check form validity
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    } else {
      // Prepare the payload for the API request
      const payload = {
        id: formData.id,
        uuid: formData.uuid || id,
        coalYardName: formData.coalYardName,
        stateId: formData.state,
        districtId: formData.district,
        talukaId: formData.taluka,
        latitude: formData.latitude,
        longitude: formData.longitude,
        pinCode: formData.pinCode,
        address: formData.address,
        description: formData.description,
        totalCoalSpace: formData.totalCoalSpace,
        totalCoalCapacity: formData.totalCoalCapacity,
        isActive: formData.isActive,
        personUUID: selectedPersonId,
      };

      try {
        let response;

        // Check if the form has an ID (for editing)
        if (formData.id) {
          // If there's an ID, it means we are editing an existing yard
          response = await updateYard(payload);
        } else {
          // If there's no ID, it means we're adding a new yard
          response = await saveYard(payload);
        }

        if (response && response.status) {
          // Success response
          const successMessage =
            response.data.message || "Yard Data Saved Successfully";
          setModalMessage(successMessage);
          setIsError(false);
          setShow(true);
          setFormData(initialYardData);
          setValidated(false);

          if (selectedPersonId) {
            await assignYardToPerson(
              selectedPersonId,
              response.data.data.id,
              selectedRole
            );
          }
        } else {
          const errorMessage = response?.message || "Unexpected error occurred";
          setModalMessage(errorMessage);
          setIsError(true);
          setShow(true);
          setTimeout(() => {
            setShow(false);
          }, 3000);
          console.error("Form submission failed:", errorMessage);
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "Unexpected error occurred";
        setModalMessage(errorMessage);
        setIsError(true);
        setShow(true);
        console.error("Error occurred during form submission:", error);
      }
    }
  };

  const assignYardToPerson = async (selectedPersonId, yardId, role) => {
    try {
      const response = await assignYard(selectedPersonId, yardId, role);
      if (response) {
      } else {
        console.error("Failed to assign yard");
      }
    } catch (error) {
      console.error("Error fetching available persons:", error);
    }
  };

  useEffect(() => {
    if (roleAction && selectedPersonId) {
      const fetchRoles = async () => {
        try {
          const response = await fetchRoleByYard(selectedPersonId, formData.id);
          if (response && response.data) {
            setRoles(response.data.map((roleMap) => roleMap.role));
          }
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      };
      fetchRoles();
    }
  }, [roleAction, selectedPersonId, formData.id]);

  const [isRoleAssigned, setIsRoleAssigned] = useState(false);

  const handleRoleActionChange = (e) => {
    const isAssign = e.target.value === "Assign";
    setIsRoleAssigned(isAssign);
    setRoleAction(isAssign ? "Assign" : "Unassign");
    setFormData({ ...formData, assigned: isAssign });
    setSelectedPersonId("");
  };

  const BackPage = () => {
    navigate("/pages/yard-list");
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
            <Breadcrumb.Item href="/pages/yard-list">Yard List</Breadcrumb.Item>
            <Breadcrumb.Item active>
              {formData.id ? "Edit Yard" : "Add Yard"}
            </Breadcrumb.Item>
          </Breadcrumb>{" "}
          {/* <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">
                  {" "}
                  {formData.uuid ? "Edit Yard Area" : "Add Yard Area"}
                </h2>
              </div>
            </Col>
          </Row> */}
          {/* <div className="form-wrap mb-3">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Col md="4">
                <Form.Group controlId="validationCustom16" className="form-group custom-radio">
                  <Form.Label>Yard Allocation</Form.Label>
                  <div className="d-flex">
                    <Form.Check
                      type="radio"
                      name="isAssign"
                      label="Assign"
                      value="Assign"
                      required
                      className="me-3"
                      id="assign-1"
                      checked={formData.assigned === true}
                      onChange={handleRoleActionChange}
                    />
                    <Form.Check
                      type="radio"
                      name="isAssign"
                      label="Not-Assign"
                      value="Not-Assign"
                      required
                      id="assign-2"
                      checked={formData.assigned === false}
                      onChange={handleRoleActionChange}
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Please select a valid Status.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {isRoleAssigned && formData.assigned && (
                <Col md="12">
                  <Form.Group className="form-group" controlId="assignRoleDropdown">
                    <Form.Label>Select Admin</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        value={selectedPersonId}
                        onChange={(e) => setSelectedPersonId(e.value)}
                        options={availablePersons.map((person) => ({
                          value: person.uuid,
                          label: person.email,
                        }))}
                        placeholder="Select Admin"
                        maxSelectedLabels={3}
                        className="custom-select w-full md:w-20rem"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a person.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}

              {isRoleAssigned && role === "ADMIN" && selectedPersonId && (
                <Col md="4">
                  <Form.Group className="form-group" controlId="assignRoleDropdown">
                    <Form.Label>Assign Role</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        value={selectedRole}
                        options={roles.map((roleName) => ({
                          value: roleName,
                          label: roleName,
                        }))}
                        onChange={(e) => setSelectedRole(e.value)}
                        required
                        placeholder="Select Role"
                        className="custom-select w-full md:w-14rem"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a role.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
            </Form>
          </div> */}
          {/* <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">
                  {formData.id ? "Edit Yard Area" : "Add Yard Area"}
                </h2>
              </div>
            </Col>
          </Row> */}
          <div className="form-wrap">
            <div className="title-main mb-3">
              <div className="title-text">
                <h3> {formData.id ? "Edit Yard Area" : "Add Yard Area"}</h3>
              </div>
            </div>
            <Form className="pt-2" noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                {/* Yard Name */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>Yard Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter Yard Name"
                      name="coalYardName"
                      pattern="^[A-Za-z\s]+$"
                      value={formData.coalYardName}
                      onChange={handleChange}
                      disabled={isAdminAndEditMode}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Yard Name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Area Space */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom09"
                  >
                    <Form.Label>Yard Capacity (sq. ft.)</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      step="any"
                      placeholder="Enter Area Space"
                      name="totalCoalSpace"
                      value={formData.totalCoalSpace}
                      onChange={handleChange}
                      disabled={isAdminAndEditMode}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Area Number.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Container Capacity */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom11"
                  >
                    <Form.Label>Total Coal Capacity</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      step="any"
                      min="1"
                      placeholder="Enter Coal Capacity"
                      name="totalCoalCapacity"
                      value={formData.totalCoalCapacity}
                      onChange={handleChange}
                      disabled={isAdminAndEditMode}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Capacity.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* State */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom04"
                  >
                    <Form.Label>State</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        required
                        name="state"
                        value={formData.state}
                        options={locations.map((state) => ({
                          value: state.id,
                          label: state.name,
                        }))}
                        onChange={handleStateChange}
                        disabled={isAdminAndEditMode}
                        placeholder="Select State"
                        className="custom-select w-full md:w-14rem"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a State.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* District */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom04"
                  >
                    <Form.Label>District</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        required
                        name="district"
                        value={formData.district}
                        options={filteredDistricts.map((district) => ({
                          value: district.id,
                          label: district.name,
                        }))}
                        onChange={handleDistrictChange}
                        disabled={isAdminAndEditMode}
                        placeholder="Select District"
                        className="custom-select w-full md:w-14rem"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a District.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Taluka */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom04"
                  >
                    <Form.Label>Taluka</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        required
                        name="taluka"
                        value={formData.taluka}
                        options={filteredTalukas.map((taluka) => ({
                          value: taluka.id,
                          label: taluka.name,
                        }))}
                        onChange={handleTalukaChange}
                        disabled={isAdminAndEditMode}
                        placeholder="Select Taluka"
                        className="custom-select w-full md:w-14rem"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a Taluka.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Address */}
                <Col md="12">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      required
                      as="textarea"
                      placeholder="Enter Yard Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={isAdminAndEditMode}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Yard Address.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* pinCode */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom09"
                  >
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter Postal Code"
                      pattern="^\d{6}$"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      disabled={isAdminAndEditMode}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid 6-digit pinCode.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Latitude */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom07"
                  >
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      step="any"
                      placeholder="Enter Latitude"
                      name="latitude"
                      min="-90"
                      max="90"
                      value={formData.latitude}
                      onChange={handleChange}
                      disabled={isAdminAndEditMode}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a Latitude value between -90 to 90
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Longitude */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom08"
                  >
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      step="any"
                      placeholder="Enter Longitude"
                      name="longitude"
                      min="-180"
                      max="180"
                      value={formData.longitude}
                      onChange={handleChange}
                      disabled={isAdminAndEditMode}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a Longitude value between -180 to 180
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="12">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      required
                      placeholder="Enter Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={isAdminAndEditMode}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Description.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-between">
                <Button
                  type="submit"
                  className="btn-style-primary2 mt-2"
                  onClick={BackPage}
                >
                  
                    <FontAwesomeIcon icon={faArrowLeft} />
                
                  Back
                </Button>
                <Button   type="submit" className="btn btn-primary label-btn mt-2">
                {formData.id ? "Update " : "Submit"}
                  <FontAwesomeIcon
                    className="label-btn-icon ms-2"
                    icon={faArrowRight}
                  />
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
                {modalMessage}
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
    </React.Fragment>
  );
};
