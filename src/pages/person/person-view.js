import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { usePerson } from "../../hook/usePerson";
import { useParams, useNavigate } from "react-router-dom";

export const PersonViewSec = ({ isToggled }) => {
  const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");

  const initialUserData = {
    id: null,
    userName: "",
    email: "",
    mobile: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    roleNames: [],
  };
  const [formData, setFormData] = useState(initialUserData);

  const { fetchPersonById } = usePerson();
  const navigate = useNavigate();

  const BackPage = () => {
    navigate("/pages/user-management");
  };

  useEffect(() => {
    if (id) {
      const loadPerson = async () => {
        try {
          const personData = await fetchPersonById(id);

          if (personData && personData.data) {
            const { firstName, lastName, email, mobile, dateOfBirth, gender, roleNames } = personData.data;

            const strippedMobile = mobile.startsWith("+91")
              ? mobile.slice(3)
              : mobile;

            const formData = {
              id: personData.data.id,
              firstName: firstName,
              lastName: lastName,
              userName: `${firstName} ${lastName}`,
              email: email,
              mobile: strippedMobile,
              dateOfBirth: dateOfBirth,
              gender: gender || "",
              roleNames: roleNames || [],
            };

            setFormData(formData);

            setSelectedGender(gender);
          }
        } catch (error) {
          console.error("Error fetching person data:", error);
        }
      };
      loadPerson();
    }
  }, [id]);

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
            <Breadcrumb.Item active>User View</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">View User</h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap">
            <Form noValidate validated={validated}>
              <Row>
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>First Name</Form.Label>
                    <h6 className="fw-bold">{formData.firstName}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>Last Name</Form.Label>
                    <h6 className="fw-bold">{formData.lastName}</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group
                    controlId="insuranceExpiration"
                    className="form-group"
                  >
                    <Form.Label>Date of Birth</Form.Label>
                    <h6 className="fw-bold">{formData.dateOfBirth}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group controlId="genderSelect" className="form-group">
                    <Form.Label>Gender</Form.Label>
                    <h6 className="fw-bold">{formData.gender}</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>Username</Form.Label>
                    <h6 className="fw-bold">{formData.userName}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom02"
                  >
                    <Form.Label>Email Address</Form.Label>
                    <h6 className="fw-bold">{formData.email}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom06"
                  >
                    <Form.Label>Contact Number</Form.Label>
                    <h6 className="fw-bold">{formData.mobile}</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="roleSelect" className="form-group">
                    <Form.Label>Assigned Roles</Form.Label>
                    <h6 className="fw-bold">
                      {formData.roleNames.length > 0
                        ? formData.roleNames.join(", ")
                        : "No roles assigned"}
                    </h6>
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
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};
