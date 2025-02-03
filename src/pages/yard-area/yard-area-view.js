import React, { useState } from "react";
import { Col, Container, Row, Button, Badge, Form } from "react-bootstrap";
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

export const YardAreaViewSec = ({ isToggled }) => {
  const yardId = useSelector((state) => state.auth.selectedYardId);
  const { id } = useParams();
  const { fetchYardAreaById } = useYardArea();
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    yardId: yardId,
    areaTypeId: "",
    areaName: "",
    latitude: "",
    longitude: "",
    areaDescription: "",
    containerCapacity: "",
    isOperational: false,
    isActive: false,
  });

  const navigate = useNavigate();

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
              {formData.id ? "View Yard Area List" : "View Yard Area List"}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">
                  {formData.id ? "View Yard Area List" : "View Yard Area List"}
                </h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap mb-3">
            {/* Area Allocation */}
            <Form.Group
              controlId="validationCustom16"
              className="form-group custom-radio"
            >
              <Form.Label>
                Area Allocation -{" "}
                <span className="fs-6 fw-bold">
                  {formData.assignedPersons &&
                  formData.assignedPersons.length > 0
                    ? "Assigned"
                    : "Not Assigned"}
                </span>
              </Form.Label>
              <Row>
                {formData.assignedPersons &&
                formData.assignedPersons.length > 0 ? (
                  formData.assignedPersons.map((person, index) => (
                    <Col className="mb-2 p-2" md="6" lg="4" key={index}>
                      <div className="assign-card mb-3">
                        <h6>
                          Name :{" "}
                          <span className="fw-bold">
                            {person.firstName && person.lastName
                              ? `${person.firstName} ${person.lastName}`
                              : "NA"}
                          </span>
                        </h6>

                        <h6>
                          Email :{" "}
                          <span className="fw-bold">
                            {person.email || "N/A"}
                          </span>
                        </h6>
                        <h6>
                          Role :{" "}
                          <span className="fw-bold">
                            {person.role || "N/A"}
                          </span>
                        </h6>
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <p>No assigned persons available.</p>
                  </Col>
                )}
              </Row>
            </Form.Group>
          </div>

          <div className="form-wrap">
            <Form noValidate validated={validated}>
              <Row>
                {/* Yard Name */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom07"
                    className="form-group"
                  >
                    <Form.Label>Yard Name</Form.Label>
                    <h6 className="fw-bold">{formData.yardName}</h6>
                  </Form.Group>
                </Col>

                {/* Yard Area Name */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom01"
                    className="form-group"
                  >
                    <Form.Label>Yard Area Name</Form.Label>
                    <h6 className="fw-bold">{formData.areaName}</h6>
                  </Form.Group>
                </Col>

                {/* Area Type */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom02"
                    className="form-group"
                  >
                    <Form.Label>Area Type</Form.Label>
                    <h6 className="fw-bold">{formData.areaType}</h6>
                    {/* <div className="card flex justify-content-center border-0">
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
                    </div> */}
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
                    <h6 className="fw-bold">{formData.totalAreaSpace}</h6>
                  </Form.Group>
                </Col>

                {/* Container Capacity */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom11"
                    className="form-group"
                  >
                    <Form.Label>Container Capacity</Form.Label>
                    <h6 className="fw-bold">{formData.containerCapacity}</h6>
                  </Form.Group>
                </Col>

                {/* Latitude */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom07"
                    className="form-group"
                  >
                    <Form.Label>Latitude</Form.Label>
                    <h6 className="fw-bold">{formData.latitude}</h6>
                  </Form.Group>
                </Col>

                {/* Longitude */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom08"
                    className="form-group"
                  >
                    <Form.Label>Longitude</Form.Label>
                    <h6 className="fw-bold">{formData.longitude}</h6>
                  </Form.Group>
                </Col>

                {/* Occupied space */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom07"
                    className="form-group"
                  >
                    <Form.Label>Occupied AreaSpace</Form.Label>
                    <h6 className="fw-bold">{formData.occupiedAreaSpace}</h6>
                  </Form.Group>
                </Col>

                {/* Occupied Container */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom08"
                    className="form-group"
                  >
                    <Form.Label>Occupied Container</Form.Label>
                    <h6 className="fw-bold">{formData.occupiedContainer}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom08"
                    className="form-group"
                  >
                    <Form.Label>Created Date</Form.Label>
                    <h6 className="fw-bold">{formData.createDate}</h6>
                  </Form.Group>
                </Col>

                {/* Operational Type */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom12"
                    className="form-group custom-radio"
                  >
                    <Form.Label>Operational Type</Form.Label>
                    {formData.isOperational && (
                      <p className="mb-0 fw-bold">Operational</p>
                    )}
                    {!formData.isOperational && (
                      <p className="mb-0 fw-bold"> Non-Operational</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group
                    controlId="formBasicDescription"
                    className="form-group"
                  >
                    <Form.Label>Description</Form.Label>
                    <h6 className="fw-bold">{formData.areaDescription}</h6>
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
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default YardAreaViewSec;
