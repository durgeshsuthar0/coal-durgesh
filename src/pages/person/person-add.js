import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHouseChimney,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { usePerson } from "../../hook/usePerson";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { usePersonRoles } from "../../hook/usePersonRoles";
import { useYard } from "../../hook/useYard";

export const PersonFormmSec = ({ isToggled }) => {
  const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [assignRole, setAssignRole] = useState(false);
  const [show, setShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const { fetchYard } = useYard();
  const [yardData, setYardData] = useState([]);

  const [designationData, setDesignationData] = useState([]); // State to hold the designation data
  const yardId = useSelector((state) => state.auth.selectedYardId);

  const initialUserData = {
    id: null,
    userName: "",
    email: "",
    mobile: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    role: "",
    designationId: "",
    yardId: "",
  };

  const [formData, setFormData] = useState(initialUserData);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedYard, setSelectedYard] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const {
    handleAddPerson,
    handleUpdatePerson,
    fetchPersonById,
    handleAssignRole,
  } = usePerson();
  const personUuid = useSelector((state) => state.auth.personUUID);
  const role = useSelector((state) => state.auth.roleName);
  const { roles } = usePersonRoles(personUuid);
  const { fetchDesignationType } = usePerson();

  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  const handleNavigate = () => {
    navigate("/pages/user-management");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      const formattedData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? formData.dateOfBirth.toISOString()
          : null,
        role: selectedRole || role,
        personUuid: id,
        designationId: selectedDesignation || "",
        yardId: selectedYard || "",
      };

      try {
        let response;
        if (id) {
          response = await handleUpdatePerson(personUuid, formattedData);
        } else {
          response = await handleAddPerson(personUuid, formattedData);
        }

        if (response && response.status) {
          const successMessage =
            response.message || "Person added successfully!";
          setModalMessage(successMessage);
          setIsError(false);
          setShow(true);
          setFormData(initialUserData);
          setSelectedGender("");
          setSelectedYard("");
          setSelectedDesignation(null);
          setValidated(false);

          if (assignRole && selectedRole) {
            try {
              // const roleResponse = await handleAssignRole(selectedRole, response.data.data.id, yardId);
            } catch (error) {
              console.error("Error assigning role:", error);
            }
          }
        } else {
          const errorMessage = response?.message || "Failed to save person.";
          console.error(errorMessage);
          setModalMessage(errorMessage);
          setIsError(true);
          setShow(true);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        const errorMessage = error.message || "Unexpected error occurred.";
        setModalMessage(errorMessage);
        setIsError(true);
        setShow(true);
      }
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const BackPage = () => {
    navigate("/pages/user-management");
  };

  useEffect(() => {
    if (id) {
      const loadPerson = async () => {
        try {
          const personData = await fetchPersonById(id);

          if (personData && personData.data) {
            const {
              firstName,
              lastName,
              email,
              mobile,
              dateOfBirth,
              gender,
              role,
              roleNames,
              designation,
              yardId,
              designationName,
              yardName,
            } = personData.data;

            const strippedMobile = mobile.startsWith("+91")
              ? mobile.slice(3)
              : mobile;
            const birthDate = new Date(dateOfBirth);

            const formData = {
              id: personData.data.id,
              firstName: firstName,
              lastName: lastName,
              userName: `${firstName} ${lastName}`,
              email: email,
              mobile: strippedMobile,
              dateOfBirth: birthDate,
              gender: gender || "",
              role: role || "",
              designation: designation || "",
              yardId: yardId || "",
              designationName: designationName || "",
              yardName: yardName || "",
            };

            setFormData(formData);
            setSelectedGender(gender);

            setSelectedDesignation(designationName);
            setSelectedYard(yardName);

            if (roleNames && roleNames.length > 0) {
              setAssignRole(true);
              const selectedRoleFromApi = roles.find(
                (r) => r.roleName === roleNames[0]
              );
              if (selectedRoleFromApi) {
                setSelectedRole(selectedRoleFromApi.roleId);
              }
            }
          }
        } catch (error) {
          console.error("Error loading person data", error);
        }
      };
      loadPerson();
    }

    loadYards();
    fetchDesignationTypes();
  }, [id, roles]);

  // Function to fetch designation types from API
  const fetchDesignationTypes = async () => {
    try {
      const response = await fetchDesignationType();
      if (response.status) {
        setDesignationData(response.data);
      }
    } catch (err) {
      console.error("Error fetching designation types:", err);
    }
  };

  const loadYards = async () => {
    try {
      const response = await fetchYard();

      if (
        response &&
        response.status &&
        response.data &&
        Array.isArray(response.data)
      ) {
        setYardData(response.data);

        // Automatically select the yard if yardId is available

        if (yardId) {
          const selectedYardData = response.data.find(
            (yard) => yard.id === yardId
          );

          if (selectedYardData) {
            setSelectedYard(selectedYardData.coalYardName);
          }
        } else if (response.data.length === 1) {
          // If there is only one yard, pre-select it

          setSelectedYard(response.data[0].coalYardName);
        }
      } else {
        console.error("Invalid data structure:", response);

        setYardData([]);
      }
    } catch (error) {
      console.error("Error fetching yards:", error);

      setYardData([]);
    }
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
            <Breadcrumb.Item href="/#/pages/dashboard">
              <FontAwesomeIcon icon={faHouseChimney} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/#/pages/user-management">
              User Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {id ? "Edit User" : "Add User"}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="form-wrap">
            <div className="title-main mb-3">
              <div className="title-text">
                <h3>{id ? "Edit User" : "Add User"}</h3>
              </div>
            </div>
            <Form
              className="pt-2"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <Row>
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      placeholder="First Name"
                      onChange={handleChange}
                      pattern="^[A-Za-z\s]+$"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid First Name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom02"
                  >
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      placeholder="Last Name"
                      onChange={handleChange}
                      pattern="^[A-Za-z\s]+$"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Last Name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group
                    controlId="insuranceExpiration"
                    className="form-group"
                  >
                    <Form.Label>Date of Birth</Form.Label>
                    <Calendar
                      value={formData.dateOfBirth}
                      placeholder="MM/DD/YYYY"
                      name="dateOfBirth"
                      className="custom-calender"
                      onChange={handleDateChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid Date of Birth.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group controlId="genderSelect" className="form-group">
                    <Form.Label>Gender</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        value={selectedGender || ""}
                        onChange={(e) => {
                          const genderValue = e.value;
                          setSelectedGender(genderValue);
                          setFormData((prevData) => ({
                            ...prevData,
                            gender: genderValue,
                          }));
                        }}
                        options={[
                          { label: "Male", value: "male" },
                          { label: "Female", value: "female" },
                        ]}
                        placeholder="Select Gender"
                        required
                        name="gender"
                        className="custom-select"
                        editable
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Gender.
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom03"
                  >
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="userName"
                      placeholder="Username"
                      value={formData.userName}
                      onChange={handleChange}
                      pattern="^[A-Za-z\s]+$"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Username.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom04"
                  >
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Email Address.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom05"
                  >
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Contact Number"
                      maxLength={13}
                      pattern="^\+91\d{10}$"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Contact Number (+91xxxxxxxxxx).
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="designationSelect"
                  >
                    <Form.Label>Designation</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        value={selectedDesignation}
                        options={designationData.map((designation) => ({
                          label: designation.name,
                          value: designation.id,
                        }))}
                        onChange={(e) => setSelectedDesignation(e.value)}
                        placeholder="Select Designation"
                        required
                        className="custom-select"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a designation.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group className="form-group" controlId="roleSelect">
                    <Form.Label>Role</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        value={selectedRole}
                        options={roles.map((role) => ({
                          label: role.roleName,
                          value: role.roleId,
                        }))}
                        onChange={(e) => setSelectedRole(e.value)}
                        placeholder="Select Role"
                        required
                        className="custom-select"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a role.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group className="form-group" controlId="yardSelect">
                    <Form.Label>Yard Select</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        value={selectedYard}
                        onChange={(e) => setSelectedYard(e.value)}
                        options={yardData.map((yard) => ({
                          label: yard.coalYardName,
                          value: yard.id,
                        }))}
                        placeholder="Select Yard"
                        required
                        className="custom-select"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a Yard.
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
                <Button
                  type="submit"
                  className="btn btn-primary label-btn mt-2"
                >
                  {id ? "Update " : "Submit"}
                  <FontAwesomeIcon
                    className="label-btn-icon ms-2"
                    icon={faArrowRight}
                  />
                </Button>
              </div>
            </Form>
          </div>

          {/* Modal for Success/Error */}
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
    </React.Fragment>
  );
};
