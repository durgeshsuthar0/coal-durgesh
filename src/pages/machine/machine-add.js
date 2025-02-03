import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHouseChimney,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useMachine } from "../../hook/useMachine";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { usePerson } from "../../hook/usePerson";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Calendar } from "primereact/calendar";

export const IotMachineFormSec = ({ isToggled }) => {
  const { id } = useParams();
  const personUuid = useSelector((state) => state.auth.personUUID);
  const yardId = useSelector((state) => state.auth.yardId);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [machineData, setMachineData] = useState({
    machineNumber: "",
    machineLogicalName: "",
    machineType: "",
    loadCapacity: "",
    manufacturer: "",
    fuelType: "",
    licensePlateNumber: "",
    insuranceExpirationDate: "",
    modelNumber: "",
    description: "",
    maintenanceStatus: false,
    rcBookFile: null,
    fuelTankCapacity: "",
    vehicleCategoryId: "",
    vehicleNo: "",
    vehicleParsingYear: "",
    operatorUuid: "",
    operatorName: "",
  });
  const [show, setShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const {
    fetchMachineTypes,
    fetchFuelTypes,
    saveMachineData,
    fetchMachineListById,
    fetchVehicleCategory,
  } = useMachine();

  const [machineTypes, setMachineTypes] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [vehicleCategory, setVehicleCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isRoleAssigned, setIsRoleAssigned] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [roles] = useState(["Admin", "User", "Manager"]);
  const { fetchPersons } = usePerson();
  const [availablePersons, setAvailablePersons] = useState([]);
  const [machineIsAssigned, setMachineIsAssigned] = useState(false);

  // Fetch available persons when role is assigned
  useEffect(() => {
    const fetchPersonList = async () => {
      try {
        if (isRoleAssigned && personUuid) {
          const response = await fetchPersons(personUuid);
          setAvailablePersons(
            response?.data.filter((person) => !person.machineIsAssigned) || []
          );
        }
      } catch (err) {
        setError("Error fetching data");
        console.error("Error fetching data:", err);
      }
    };

    fetchPersonList();
  }, [personUuid, isRoleAssigned]);

  // Fetch machine types, fuel types, and vehicle categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machineResponse, fuelResponse, vehicleResponse] =
          await Promise.all([
            fetchMachineTypes(),
            fetchFuelTypes(),
            fetchVehicleCategory(),
          ]);

        setMachineTypes(machineResponse?.data || []);
        setFuelTypes(fuelResponse?.data || []);
        setVehicleCategory(vehicleResponse?.data || []);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Load machine data if editing
  useEffect(() => {
    if (id) {
      const loadMachine = async () => {
        console.log("Fetching machine data for ID:", id);
        const machineData = await fetchMachineListById(id);

        if (machineData) {
          console.log("Machine data loaded:", machineData);

          const formattedDate = machineData.insuranceExpirationDate
            ? new Date(
                machineData.insuranceExpirationDate[0],
                machineData.insuranceExpirationDate[1] - 1,
                machineData.insuranceExpirationDate[2]
              )
                .toISOString()
                .split("T")[0]
            : "";

          setMachineData({
            ...machineData,
            insuranceExpirationDate: formattedDate,
          });
          setMachineIsAssigned(machineData.machineIsAssigned);

          // Check if operator is assigned based on the operatorName
          if (machineData.operatorName) {
            console.log(
              "Operator assigned with Name:",
              machineData.operatorName
            );
            const [firstName, lastName] = machineData.operatorName.split(" ");
            setIsRoleAssigned(true); // Set to assign
            setSelectedPersonId({
              uuid: machineData.operatorUuid || null,
              firstName: firstName,
              lastName: lastName,
            });
          }
        } else {
          console.log("No machine data found for ID:", id);
        }
      };
      loadMachine();
    }
  }, [id]);

  // Handle role action change (assign or not)
  const handleRoleActionChange = (e) => {
    console.log("Role action changed:", e.target.value);
    setIsRoleAssigned(e.target.value === "Assign");
    if (e.target.value === "Not-Assign") {
      console.log("Not assigning operator, clearing selection");
      setSelectedPersonId(null);
    }
  };

  // Handle person selection for operator
  const handlePersonSelect = (e) => {
    console.log("Person selected:", e.value);
    setSelectedPersonId(e.value);
    setMachineData((prevData) => ({
      ...prevData,
      operatorUuid: e.value.uuid,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMachineData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setMachineData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    try {
      const payload = { ...machineData, yardId };
      const response = await saveMachineData(payload, personUuid);

      if (response.status) {
        setModalMessage("Machine saved/updated successfully!");
        setIsError(false);
        navigate("/pages/machine-list");
      } else {
        setModalMessage("An error occurred while saving/updating the machine.");
        setIsError(true);
      }
      setShow(true);
      setValidated(false);
    } catch (err) {
      setModalMessage("An error occurred while saving/updating the machine.");
      setIsError(true);
      setShow(true);
    }
  };

  const handleClose = () => setShow(false);

  const BackPage = () => navigate(-1);

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
          <Breadcrumb.Item href="/#/pages/machine-list">
            Machine List
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            {machineData.id ? "Edit Machine" : "Add Machine"}
          </Breadcrumb.Item>
        </Breadcrumb>{" "}
        <div className="form-wrap">
          <div className="title-main mb-3">
            <div className="title-text">
              <h3>{machineData.id ? "Edit Machine" : "Add Machine"} </h3>
            </div>
          </div>
          <Form
            className="pt-2"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            {/* Role Action */}
            <Col md="4">
              <Form.Group
                controlId="validationCustom16"
                className="form-group custom-radio"
              >
                <Form.Label>Machine Allocation</Form.Label>
                <div className="d-flex">
                  <Form.Check
                    type="radio"
                    name="isAssign"
                    label="Assign"
                    value="Assign"
                    required
                    className="me-3"
                    id="assign-1"
                    checked={isRoleAssigned}
                    onChange={handleRoleActionChange}
                  />
                  <Form.Check
                    type="radio"
                    name="isAssign"
                    label="Not-Assign"
                    value="Not-Assign"
                    required
                    id="assign-2"
                    checked={!isRoleAssigned}
                    onChange={handleRoleActionChange}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  Please select a valid Status.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Show the Dropdown for Admin Selection when Role is Assigned */}
            {isRoleAssigned && !machineIsAssigned && (
              <Row>
              <Col md="4">
                <Form.Group
                  className="form-group"
                  controlId="assignRoleDropdown"
                >
                  <Form.Label>Select Operator</Form.Label>
                  <div className="card flex justify-content-center border-0">
                    <Dropdown
                      value={selectedPersonId} 
                      onChange={(e) =>
                        handlePersonSelect({
                          target: { name: "selectedPersonId", value: e.value },
                        })
                      } 
                      options={
                        availablePersons?.map((person) => ({
                          value: person.id,
                          label: `${person.firstName} ${person.lastName}`,
                        })) || []
                      } 
                      placeholder="Select Operator"
                      name="selectedPersonId"
                      className="custom-select w-full md:w-20rem" 
                      editable
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Please select a person.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              </Row>
            )}

            {/* Form Fields */}
            <Row className="mb-3">
              {[
                { label: "Machine Number", name: "machineNumber" },
                { label: "Vehicle Number", name: "vehicleNo" },
                { label: "Machine Logical Name", name: "machineLogicalName" },
                { label: "Fuel Tank Capacity", name: "fuelTankCapacity" },
                { label: "Load Capacity (tons)", name: "loadCapacity" },
                { label: "Manufacturer Name", name: "manufacturer" },
                { label: "Model Number", name: "modelNumber" },
                { label: "Vehicle Parsing Year", name: "vehicleParsingYear" },
                { label: "License Plate Number", name: "licensePlateNumber" },
                { label: "Description", name: "description", as: "textarea" },
              ].map((field) => (
                <Col md="4" key={field.name}>
                  <Form.Group className="form-group" controlId={field.name}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                      name={field.name}
                      value={machineData[field.name]}
                      onChange={handleChange}
                      required
                      type={field.as ? "textarea" : "text"}
                      placeholder={`Enter ${field.label}`}
                      isInvalid={validated && !machineData[field.name]}
                    />
                    <Form.Control.Feedback type="invalid">
                      {`Please provide ${field.label}.`}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              ))}

              {/* Dropdowns for Machine Type, Power Source, and Vehicle Category */}
              <Col md="4">
                <Form.Group className="form-group" controlId="machineType">
                  <Form.Label>Type of Machine</Form.Label>
                  <div className="card flex justify-content-center border-0">
                    <Dropdown
                      value={machineData.machineType}
                      onChange={(e) =>
                        handleChange({
                          target: { name: "machineType", value: e.value },
                        })
                      }
                      options={
                        loading
                          ? [{ label: "Loading...", value: "" }]
                          : machineTypes.map((type) => ({
                              label: type.machineName,
                              value: type.id,
                            }))
                      }
                      placeholder="Select Machine Type"
                      required
                      name="machineType"
                      className="custom-select"
                      editable
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Please select a Machine Type.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md="4">
                <Form.Group className="form-group" controlId="fuelType">
                  <Form.Label>Power Source</Form.Label>
                  <div className="card flex justify-content-center border-0">
                    <Dropdown
                      value={machineData.fuelType}
                      onChange={(e) =>
                        handleChange({
                          target: { name: "fuelType", value: e.value },
                        })
                      }
                      options={fuelTypes.map((fuel) => ({
                        label: fuel.fuelName,
                        value: fuel.id,
                      }))}
                      placeholder="Select Power Source"
                      required
                      className="custom-select"
                      editable
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Please select Power Source.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md="4">
                <Form.Group
                  className="form-group"
                  controlId="vehicleCategoryId"
                >
                  <Form.Label>Vehicle Category</Form.Label>
                  <div className="card flex justify-content-center border-0">
                    <Dropdown
                      value={machineData.vehicleCategoryId}
                      onChange={(e) =>
                        handleChange({
                          target: { name: "vehicleCategoryId", value: e.value },
                        })
                      } // Custom onChange handler
                      options={vehicleCategory.map((vehicle) => ({
                        label: vehicle.vehicleCategory,
                        value: vehicle.id,
                      }))}
                      placeholder="Select Vehicle Category"
                      required
                      name="vehicleCategoryId"
                      className="custom-select"
                      editable
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Please select Vehicle Category.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md="4">
                <Form.Group
                  className="form-group"
                  controlId="insuranceExpirationDate"
                >
                  <Form.Label>Insurance Expiration Date</Form.Label>
                  <Calendar
                    placeholder="YYYY/MM/DD"
                    name="insuranceExpirationDate"
                    className="custom-calendar"
                    value={machineData.insuranceExpirationDate}
                    onChange={handleChange}
                    dateFormat="yy-mm-dd"
                  />
                </Form.Group>
              </Col>

              <Col md="4">
                <Form.Group className="form-group" controlId="rcBookFile">
                  <Form.Label>RC Book File</Form.Label>
                  <Form.Control
                    name="rcBookFile"
                    type="file"
                    onChange={handleFileChange}
                    required
                    isInvalid={validated && !machineData.rcBookFile}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please upload the RC Book file.
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
              <Button type="submit" className="btn btn-primary label-btn mt-2">
                Submit
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
              {isError ? "Error!" : "Success!"}
            </Modal.Title>
            <p>{modalMessage}</p>
            <Button
              type="button"
              variant="primary"
              className="btn-style-primary mt-3 mx-auto"
              onClick={handleClose}
            >
              Close
            </Button>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};
