import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useYard } from "../../hook/useYard";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const YardviewSec = ({ isToggled }) => {
  const { id } = useParams();
  const { fetchLocation, fetchYardById } = useYard();
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
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
    assignedPersons: [],
    stateName: "",
    districtName: "",
    talukaName: "",
    personName: "",
    personEmail: "",

  });

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
    if (id) {
      const loadYard = async () => {
        const yardData = await fetchYardById(id);

        if (yardData && yardData.status) {
          const data = yardData.data;

          // Find the names for state, district, and taluka using their IDs
          const selectedStateObj = locations.find(loc => loc.id === data.stateId);
          const selectedDistrictObj = selectedStateObj?.childList?.find(
            district => district.id === data.districtId
          );
          const selectedTalukaObj = selectedDistrictObj?.childList?.find(
            taluka => taluka.id === data.talukaId
          );

          // Set form data
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
            assignedPersons: data.assignedPersons || [],
            stateName: selectedStateObj?.name || "",
            districtName: selectedDistrictObj?.name || "",
            talukaName: selectedTalukaObj?.name || "",
            personName: data.personName || "",
            personEmail: data.personEmail || "",
          });
        } else {
          console.error("Yard data not found.");
        }
      };
      loadYard();
    }
  }, [id, locations]);

  const BackPage = () => {
    navigate("/pages/yard-list");
  };

  return (
    <React.Fragment>
      <div className={isToggled ? "inner-content p-3 expand-inner-content" : "inner-content p-3"}>
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/pages/dashboard">
              <FontAwesomeIcon icon={faHouseChimney} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/pages/yard-list">Yard List</Breadcrumb.Item>
            <Breadcrumb.Item active>{formData.id ? "View Yard" : "View Yard"}</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">{formData.id ? "View Yard Area" : "View Yard Area"}</h2>
              </div>
            </Col>
          </Row>
          <div className="assign-card mb-3">
            <Form.Group controlId="validationCustom16" className="form-group custom-radio">
              <Form.Label>
                Area Allocation -{" "}
                <span className="fs-6 fw-bold">
                  {/* Display "Assigned" if assigned is true, else "Not Assigned" */}
                  {formData.assignedPersons ? "Assigned" : "Not Assigned"}
                </span>
              </Form.Label>
              <div className="custom-assigned-role">
                <Row className="custom-row">
                  {/* If assigned, display the person's name */}
                  {formData.assignedPersons ? (
                    <Col className="mb-2 p-2" md="6" lg="4">
                      <div className="form-wrap">
                        <h6>
                          Name: <span className="fw-bold">{formData.personName}</span>
                        </h6>
                        {/* Displaying static message if no email/roles are available */}
                        <h6>Email: <span className="fw-bold">{formData.personEmail}</span></h6>
                        {/* <h6>Role: <span className="fw-bold">N/A</span></h6> */}
                      </div>
                    </Col>
                  ) : (
                    <Col><p>No assigned persons available.</p></Col>
                  )}
                </Row>
              </div>
            </Form.Group>
          </div>


          <div className="form-wrap">
            <Form noValidate validated={validated}>
              <Row>
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom01">
                    <Form.Label>Yard Name</Form.Label>
                    <h6 className="fw-bold">{formData.coalYardName}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom09">
                    <Form.Label>Yard Capacity (sq. ft.)</Form.Label>
                    <h6 className="fw-bold">{formData.totalCoalSpace}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom11">
                    <Form.Label>Number of Containers</Form.Label>
                    <h6 className="fw-bold">{formData.totalCoalCapacity}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom04">
                    <Form.Label>State</Form.Label>
                    <h6 className="fw-bold">{formData.stateName}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom04">
                    <Form.Label>District</Form.Label>
                    <h6 className="fw-bold">{formData.districtName}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom04">
                    <Form.Label>Taluka</Form.Label>
                    <h6 className="fw-bold">{formData.talukaName}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom01">
                    <Form.Label>Address</Form.Label>
                    <h6 className="fw-bold">{formData.address}</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom09">
                    <Form.Label>PinCode</Form.Label>
                    <h6 className="fw-bold">{formData.pinCode}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom07">
                    <Form.Label>Latitude</Form.Label>
                    <h6 className="fw-bold">{formData.latitude}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom08">
                    <Form.Label>Longitude</Form.Label>
                    <h6 className="fw-bold">{formData.longitude}</h6>
                  </Form.Group>
                </Col>
                <Col md="12">
                  <Form.Group className="form-group" controlId="validationCustom01">
                    <Form.Label>Description</Form.Label>
                    <h6 className="fw-bold">{formData.description}</h6>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-between">
                <Button
                  type="submit"
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
