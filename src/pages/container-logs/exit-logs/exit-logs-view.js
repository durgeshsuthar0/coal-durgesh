import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useContainer } from "../../../hook/useContainer";

export const ExitLogViewSec = ({ isToggled }) => {
  const personInfoId = useSelector((state) => state.auth.id);
  const yardId = useSelector((state) => state.auth.selectedYardId);
  const { id } = useParams();
  const { fetchContainerById } = useContainer();

  const [showEntryHistory, setShowEntryHistory] = useState(false); // State to show/hide entry history form

  const [formData, setFormData] = useState({
    containerUniqueNumber: "",
    isEmpty: false,
    weight: "",
    vehicleNo: "",
    vehicleDriverName: "",
    vehicleDriverContact: "",
    containerDescription: "",
    entryBy: "",
    event: "",
    containerTypeId: "",
    containerMaterial: "",
    isActive: false,
    personInfoId: personInfoId,
    yardId: yardId,
    yardAreaId: null,
    tagId: null,
    tagName: "",
    containerConditionAtEntry: false,
    entryVehicleNo: "",
    entryVehicleDriverName: "",
    entryVehicleDriverContact: "",
    entryArrivalTime: "",
  });

  const navigate = useNavigate();

  // Pre-fill form if ID exists
  useEffect(() => {
    if (id) {
      const loadContainer = async () => {
        const containerData = await fetchContainerById(id);
        if (containerData) {
          setFormData({
            ...containerData,
            containerTypeId: containerData.containerType?.id || "",
            containerMaterial:
              containerData.containerType?.containerMaterial || "",
          });
        }
      };
      loadContainer();
    }
  }, [id]);

  const BackPage = () => {
    navigate("/pages/exit-logs-list");
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
            <Breadcrumb.Item href="pages/entry-logs-list">Logs</Breadcrumb.Item>
            <Breadcrumb.Item active>View Logs</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">View Exit Logs</h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap">
            <Form>
              <Row>
                {/* Container Unique Number */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>Container Unique Number</Form.Label>
                    <h6 className="fs-6 fw-bold">
                      {formData.containerUniqueNumber}
                    </h6>
                  </Form.Group>
                </Col>

                {/* Container Type ID */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom10"
                  >
                    <Form.Label>Container Type</Form.Label>
                    <h6 className="fs-6 fw-bold">
                      {formData.containerLength} (ft)
                    </h6>

                    <Form.Control.Feedback type="invalid">
                      Please select a valid container type.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Weight */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom03"
                  >
                    <Form.Label>Exit Weight (Tons)</Form.Label>
                    <h6 className="fs-6 fw-bold">{formData.weight}</h6>
                  </Form.Group>
                </Col>

                {/* Driver Name */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom05"
                  >
                    <Form.Label>Driver Name</Form.Label>
                    <h6 className="fs-6 fw-bold">
                      {formData.vehicleDriverName}
                    </h6>
                  </Form.Group>
                </Col>

                {/* Driver Contact */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom06"
                  >
                    <Form.Label>Driver Contact</Form.Label>
                    <h6 className="fs-6 fw-bold">
                      {formData.vehicleDriverContact}
                    </h6>
                  </Form.Group>
                </Col>

                {/* Vehicle Number */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom04"
                  >
                    <Form.Label>Vehicle Number</Form.Label>
                    <h6 className="fs-6 fw-bold">{formData.vehicleNo}</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustomYard"
                  >
                    <Form.Label>Select Yard Area</Form.Label>
                    <h6 className="fs-6 fw-bold">{formData.yardAreaName}</h6>
                    <Form.Control.Feedback type="invalid">
                      Please select a yard.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Select Tag (only show in add mode) */}

                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustomTag"
                  >
                    <Form.Label>Select Tag</Form.Label>
                    <h6 className="fs-6 fw-bold">{formData.tagName}</h6>

                    <Form.Control.Feedback type="invalid">
                      Please select a tag.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom08"
                  >
                    <Form.Label>Departure Time</Form.Label>
                    <h6 className="fs-6 fw-bold">{formData.time}</h6>
                  </Form.Group>
                </Col>
                {/* Entry By (By Road, By Rail) */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom08"
                  >
                    <Form.Label>Exit By</Form.Label>
                    <h6 className="fs-6 fw-bold">{formData.entryBy}</h6>
                  </Form.Group>
                </Col>

                {/* Status (isActive) */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom13"
                    className="form-group"
                  >
                    <Form.Label>Status</Form.Label>
                    {formData.isActive && (
                      <p className="fw-bold text-success">Active</p>
                    )}
                    {!formData.isActive && (
                      <p className="fw-bold text-danger">In-Active</p>
                    )}
                  </Form.Group>
                </Col>

                {/* Container Condition (isEmpty) */}
                <Col md="4">
                  <Form.Group
                    controlId="validationCustom02"
                    className="form-group"
                  >
                    <Form.Label>Container Condition</Form.Label>
                    {formData.isEmpty && <p className="fw-bold">Empty</p>}
                    {!formData.isEmpty && <p className="fw-bold">Filled</p>}
                  </Form.Group>
                </Col>

                {/* Container Description */}
                <Col md="12">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom07"
                  >
                    <Form.Label>Container Description</Form.Label>
                    <h6 className="fs-6 fw-bold">
                      {formData.containerDescription}
                    </h6>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-between mt-3">
                <div>
                  <Button
                    onClick={() => setShowEntryHistory(!showEntryHistory)} // Toggle visibility of entry history
                  >
                    Click Here to View Entry History
                  </Button>
                </div>
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
          {showEntryHistory && ( // Conditionally render entry history form
            <div className="form-wrap mt-4">
              <h4 className="mb-3">Entry History</h4>
              <Form>
                <Row>
                  <Col md="4">
                    <Form.Group
                      controlId="validationCustom02"
                      className="form-group"
                    >
                      <Form.Label>Container Condition</Form.Label>
                      {formData.containerConditionAtEntry && (
                        <p className="fw-bold">Empty</p>
                      )}
                      {!formData.containerConditionAtEntry && (
                        <p className="fw-bold">Filled</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md="4">
                    <Form.Group className="form-group">
                      <Form.Label>Vehicle No</Form.Label>
                      <h6 className="fs-6 fw-bold">
                        {formData.entryVehicleNo}
                      </h6>
                    </Form.Group>
                  </Col>
                  <Col md="4">
                    <Form.Group className="form-group">
                      <Form.Label>Weight (Tons)</Form.Label>
                      <h6 className="fs-6 fw-bold">{formData.entryWeight}</h6>
                    </Form.Group>
                  </Col>
                  <Col md="4">
                    <Form.Group className="form-group">
                      <Form.Label>entry By</Form.Label>
                      <h6 className="fs-6 fw-bold">{formData.entryDoneBy}</h6>
                    </Form.Group>
                  </Col>
                  <Col md="4">
                    <Form.Group className="form-group">
                      <Form.Label>Driver Name</Form.Label>
                      <h6 className="fs-6 fw-bold">
                        {formData.entryVehicleDriverName}
                      </h6>
                    </Form.Group>
                  </Col>
                  <Col md="4">
                    <Form.Group className="form-group">
                      <Form.Label>Driver Contact</Form.Label>
                      <h6 className="fs-6 fw-bold">
                        {formData.entryVehicleDriverContact}
                      </h6>
                    </Form.Group>
                  </Col>
                 
                  <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom08"
                  >
                    <Form.Label>Arrival Time</Form.Label>
                    <h6 className="fs-6 fw-bold">{formData.entryArrivalTime}</h6>
                  </Form.Group>
                </Col>
                </Row>
              </Form>
            </div>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};
