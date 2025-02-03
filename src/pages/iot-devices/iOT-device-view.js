import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useIOTDevice } from "../../hook/useIotDevice";

export const IotDeviceViewSec = ({ isToggled }) => {
  const { id } = useParams();
  const { fetchIotDevicebyId } = useIOTDevice();

  const [iotDeviceData, setIOTdeviceData] = useState({
    deviceName: "",
    deviceSerialNumber: "",
    manufacturer: "",
    isActive: false,
  });
  const [validated, setValidated] = useState(false);

  const yardId = useSelector((state) => state.auth.selectedYardId);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const loadIotDevice = async () => {
        const deviceData = await fetchIotDevicebyId(id);
        if (deviceData) {
          setIOTdeviceData({
            deviceName: deviceData.deviceName || "",
            deviceSerialNumber: deviceData.serialNumber || "",
            manufacturer: deviceData.manufactureName || "",
            simNo: deviceData.simNo || "",
            eventTypeName: deviceData.eventTypeName || "",
            isActive: deviceData.deviceStatus || false,
          });
        }
      };

      loadIotDevice();
    }
  }, [id, yardId]);

  const BackPage = () => {
    navigate("/pages/iot-device-list");
  };

  return (
    <React.Fragment>
      <div className={isToggled ? "inner-content p-3 expand-inner-content" : "inner-content p-3"}>
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/pages/dashboard">
              <FontAwesomeIcon icon={faHouseChimney} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/pages/iot-device-list">IOT Device List</Breadcrumb.Item>
            <Breadcrumb.Item active>View IOT Device</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="mb-0">View IOT Device</h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap">
            <Form noValidate validated={validated}>
              <Row className="mb-3">
                {/* Device Name */}
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom01">
                    <Form.Label>Device Name</Form.Label>
                    <h6 className="fs-6 fw-bold">{iotDeviceData.deviceName}</h6>
                  </Form.Group>
                </Col>

                {/* Device Serial Number */}
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom04">
                    <Form.Label>Device Serial Number</Form.Label>
                    <h6 className="fs-6 fw-bold">{iotDeviceData.deviceSerialNumber}</h6>
                  </Form.Group>
                </Col>

                {/* Manufacturer Name */}
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom06">
                    <Form.Label>Manufacturer Name</Form.Label>
                    <h6 className="fs-6 fw-bold">{iotDeviceData.manufacturer}</h6>
                  </Form.Group>
                </Col>


                {/* Sim Number */}
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom06">
                    <Form.Label>Sim Number</Form.Label>
                    <h6 className="fs-6 fw-bold">{iotDeviceData.simNo}</h6>
                  </Form.Group>
                </Col>

                {/* Event Type */}
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom06">
                    <Form.Label>Event Type</Form.Label>
                    <h6 className="fs-6 fw-bold">{iotDeviceData.eventTypeName}</h6>
                  </Form.Group>
                </Col>


                {/* Device Status */}
                <Col md="4">
                  <Form.Group className="form-group" controlId="validationCustom07">
                    <Form.Label>Device Status</Form.Label>
                    {iotDeviceData.isActive ? (
                      <p className="mb-0 text-success fw-bold">Active</p>
                    ) : (
                      <p className="mb-0 text-danger fw-bold">Inactive</p>
                    )}
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
                  <FontAwesomeIcon icon={faArrowLeft} />
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
