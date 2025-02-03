import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import { useMachine } from "../../hook/useMachine";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHouseChimney,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { initialMachineData } from "../../state/machineComponentState";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { SealCheck } from "@phosphor-icons/react";
import { useIOTDevice } from "../../hook/useIotDevice";
import { Dropdown } from "primereact/dropdown";

export const MachineViewSec = ({ isToggled }) => {
  const { id } = useParams();

  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [machineData, setMachineData] = useState(initialMachineData);
  const [machineTypes, setMachineTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [iotDeviceIds, setIotDeviceIds] = useState([]); // Changed to array for multi-select
  const [iotDevices, setIotDevices] = useState([]);

  const role = useSelector((state) => state.auth.roleName);
  const yardId = useSelector((state) => state.auth.selectedYardId);

  const { fetchMachineListById } =
    useMachine();

  const navigate = useNavigate();


  useEffect(() => {
    if (id) {
      const loadMachine = async () => {
        const machineData = await fetchMachineListById(id);
        if (machineData) {
          const { insuranceExpiration } = machineData;
          const formattedDate = insuranceExpiration
            ? new Date(
              insuranceExpiration[0],
              insuranceExpiration[1] - 1,
              insuranceExpiration[2]
            )
              .toISOString()
              .split("T")[0]
            : "";

          setMachineData({
            ...machineData,
            yardId: machineData.yardId || yardId,
            insuranceExpiration: formattedDate,
          });
        }
      };
      loadMachine();
    }
  }, [id, yardId]);

  const BackPage = () => {
    navigate("/pages/machine-list");
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
            <Breadcrumb.Item href="/pages/machine-list">
              Machine List
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {machineData.id ? "View" : "View"}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="mb-0">View Machine List</h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap mb-3">
            {" "}
            <Form.Group controlId="validationCustom16" className="form-group">
              <Form.Label>
                Machine Allocation -{" "}
                <span className="fs-6 fw-bold">
                  {machineData.assigned ? "Assigned" : "Not Assigned"}
                </span>
              </Form.Label>
              <Row>
                {machineData.assigned && (
                  <Col className="mb-2 p-2" md="6" lg="4">
                    <div className="assign-card mb-3">
                      <h6>
                        Name :{" "}
                        <span className="fw-bold">{`${machineData.operatorName}`}</span>
                      </h6>
                      <h6>
                        Email :{" "}
                        <span className="fw-bold">
                          {machineData.operatorEmail}
                        </span>
                      </h6>
                      <h6>
                        Yard Area :{" "}
                        <span className="fw-bold">
                          {machineData.yardName}
                        </span>
                      </h6>
                      <h6>
                        Date :{" "}
                        <span className="fw-bold">
                          {
                            (() => {
                              const dateParts = machineData.machineAssignmentCreatedDate.split("/");
                              const formattedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                              return formattedDate.toLocaleDateString("en-GB");
                            })()
                          }
                        </span>
                      </h6>

                    </div>
                  </Col>
                )}
              </Row>
            </Form.Group>
          </div>
          <div className="form-wrap">
            <Form noValidate validated={validated}>
              <Row className="mb-3">
                {/* Form Fields */}
                <Col md="4">
                  <Form.Group className="form-group" controlId="machineName">
                    <Form.Label>Machine Name</Form.Label>
                    <h6 className="fw-bold">{machineData.machineLogicalName}</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="vehicleNumber" className="form-group">
                    <Form.Label>Vehicle Number</Form.Label>
                    <h6 className="fw-bold">{machineData.vehicleNo}</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="machineTypeId" className="form-group">
                    <Form.Label>Type of Machine</Form.Label>
                    <h6 className="fw-bold">{machineData.machineTypeName}</h6>

                    <Form.Control.Feedback type="invalid">
                      Please Select Machine Type.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="loadCapacity" className="form-group">
                    <Form.Label>Load Capacity</Form.Label>
                    <h6 className="fw-bold">{machineData.loadCapacity}</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="manufacturer" className="form-group">
                    <Form.Label>Manufacturer Name</Form.Label>
                    <h6 className="fw-bold">{machineData.manufacturer}</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="fuelType" className="form-group">
                    <Form.Label>Power Source</Form.Label>
                    <h6 className="fw-bold">{machineData.fuelTypeName}</h6>
                    <Form.Control.Feedback type="invalid">
                      Please select a valid Fuel Type.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="licensePlateNo" className="form-group">
                    <Form.Label>License Plate Number</Form.Label>
                    <h6 className="fw-bold">{machineData.licensePlateNumber}</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group
                    controlId="insuranceExpiration"
                    className="form-group"
                  >
                    <Form.Label>Insurance Expiry Date</Form.Label>
                    <h6 className="fw-bold">
                      {machineData.insuranceExpirationDate}
                    </h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group
                    controlId="vehicleCategory"
                    className="form-group"
                  >
                    <Form.Label>Vehicle Category</Form.Label>
                    <h6 className="fw-bold">{machineData.vehicleCategoryName}</h6>
                    <Form.Control.Feedback type="invalid">
                      Please select a Vehicle Category.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="modelNumber" className="form-group">
                    <Form.Label>Model Number</Form.Label>
                    <h6 className="fw-bold">{machineData.modelNumber}</h6>
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group controlId="iotDevice" className="form-group">
                    <Form.Label>IOT Device Name</Form.Label>
                    <h6 className="fw-bold">{machineData.iotDeviceName}</h6>
                    {/* <div className="card flex justify-content-center border-0">
                      <Dropdown
                        value={iotDeviceIds}
                        options={iotDevices.map((device) => ({
                          value: device.id,
                          label: device.deviceName,
                        }))}
                        onChange={handleIotDeviceChange} // Update onChange to handle device selection
                        optionLabel="label"
                        placeholder="Select IoT Devices"
                        className="custom-select w-full md:w-14rem"
                        multiple // Enable multi-select dropdown
                        editable
                      />
                    </div> */}
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group controlId="iotDevice" className="form-group">
                    <Form.Label>IOT Device Serial No</Form.Label>
                    <h6 className="fw-bold">
                      {machineData.iotDeviceSerialNumber}
                    </h6>
                    {/* <div className="card flex justify-content-center border-0">
                      <Dropdown
                        value={iotDeviceIds}
                        options={iotDevices.map((device) => ({
                          value: device.id,
                          label: device.deviceName,
                        }))}
                        onChange={handleIotDeviceChange} // Update onChange to handle device selection
                        optionLabel="label"
                        placeholder="Select IoT Devices"
                        className="custom-select w-full md:w-14rem"
                        multiple // Enable multi-select dropdown
                        editable
                      />
                    </div> */}
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group
                    controlId="isActive"
                    className="form-group custom-radio"
                  >
                    <Form.Label>Status</Form.Label>
                    {machineData.assigned && (
                      <p className="mb-0 fw-bold text-success">Active</p>
                    )}
                    {!machineData.assigned && (
                      <p className="mb-0 fw-bold text-danger">InActive</p>
                    )}
                    {/* {!machineData.isActive && <p className="mb-0 fw-bold text-warning">Under-Mantainance</p>} */}
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group
                    controlId="formBasicDescription"
                    className="form-group"
                  >
                    <Form.Label>Description</Form.Label>
                    <h6 className="fw-bold">{machineData.description}</h6>
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
