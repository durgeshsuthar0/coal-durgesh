import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHouseChimney,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { useContainer } from "../../../hook/useContainer";
import { SealCheck } from "@phosphor-icons/react";
import { Dropdown } from "primereact/dropdown";
import { useYardArea } from "../../../hook/useYardArea";
import { useTagInventory } from "../../../hook/useTagInventory";
import axios from "axios";
import { fetchContainerUniqueNumbersByYardId } from "../../../services/allServices/addContainerService";

export const LogFormSec = ({ isToggled }) => {
  const personInfoId = useSelector((state) => state.auth.id);
  const yardId = useSelector((state) => state.auth.selectedYardId);
  const { id } = useParams();
  const [containerUniqueNumbers, setContainerUniqueNumbers] = useState([]); // For container unique numbers

  // for dynemic message from api response
  const [modalMessage, setModalMessage] = useState(""); // For success or error messages
  const [isError, setIsError] = useState(false); // To track if the modal is for an error

  const [validated, setValidated] = useState(false);
  const role = useSelector((state) => state.auth.roleName);
  const [isDisabled, setIsDisabled] = useState(false);
  const [labelText, setLabelText] = useState("Entry By");

  const [show, setShow] = useState(false);
  const [tags, setTags] = useState([]);
  const [containerTypes, setContainerTypes] = useState([]);
  const [yardAreas, setYardAreas] = useState([]);

  const initialLogData = {
    containerUniqueNumber: "",
    isEmpty: false,
    weight: "",
    vehicleNo: "",
    vehicleDriverName: "",
    vehicleDriverContact: "",
    containerDescription: "",
    entryBy: "",
    entry: false,
    containerTypeId: "",
    containerMaterial: "",
    isActive: false,
    personInfoId: personInfoId,
    yardId: yardId,
    yardAreaId: null,
    tagId: null,
    tagName: "",
  };

  const [formData, setFormData] = useState(initialLogData);

  const { fetchYardAreas } = useYardArea();
  const { fetchTags } = useTagInventory();
  const {
    fetchContainerType,
    sendContainer,
    fetchContainerById,
    fetchContainerByContainerUniqueNo,
  } = useContainer();

  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => setShow(false);

  const handleNavigate = () => {
    navigate("/pages/entry-logs-list");
  };

  // const fetchContainerUniqueNumbersByYardId = async (yardId) => {
  //   try {
  //     const response = await axios.get(
  //       `http://192.168.1.:9091/api/containers/active-entry-container?yardId=${yardId}`
  //     );
  //     const data = await response.data;
  //     setContainerUniqueNumbers(data || []);
  //   } catch (error) {
  //     console.error("Error fetching container unique numbers:", error);
  //     setContainerUniqueNumbers([]);
  //   }
  // };

  useEffect(() => {
    // Fetch container unique numbers when component mounts or yardId changes
    const fetchData = async () => {
      const uniqueNumbers = await fetchContainerUniqueNumbersByYardId(yardId);
      setContainerUniqueNumbers(uniqueNumbers);
    };

    fetchData();
  }, [yardId]); // Add yardId as a dependency so it re-fetches when yardId changes

  const [breadcrumbTitle, setBreadcrumbTitle] = useState(""); // This will store the breadcrumb title
  const [breadcrumbLink, setBreadcrumbLink] = useState(""); // This will store the breadcrumb link

  useEffect(() => {
    if (location.pathname === "/pages/entry-logs-add") {
      setFormData((prev) => ({ ...prev, entry: true }));
      setLabelText("Entry By");
      setBreadcrumbTitle("Entry Logs");
      setBreadcrumbLink("/pages/entry-logs-list");
    } else if (location.pathname === "/pages/exit-logs-add") {
      setFormData((prev) => ({ ...prev, entry: false }));
      setLabelText("Exit By");
      setBreadcrumbTitle("Exit Logs");
      setBreadcrumbLink("/pages/exit-logs-list");
      fetchContainerUniqueNumbersByYardId(yardId); // Fetch container numbers for exit log
    }
  }, [location.pathname]);

  useEffect(() => {
    const selectYardArea = async () => {
      const yardAreaData = await fetchYardAreas(yardId, role, personInfoId);
      if (yardAreaData) {
        setYardAreas(yardAreaData);
      }
    };
    selectYardArea();
  }, [yardId, role, personInfoId]);

  useEffect(() => {
    fetchTag();
  }, []);

  const fetchTag = async () => {
    try {
      const response = await fetchTags(yardId);
      if (response && response.data && Array.isArray(response.data)) {
        setTags(response.data);
      } else {
        console.error("Fetched data is not an array:", response);
        setTags([]);
      }
    } catch (error) {
      console.error("Error fetching yards:", error);
      setTags([]);
    }
  };

  // Pre-fill form if ID exists
  useEffect(() => {
    if (id) {
      const loadContainer = async () => {
        const containerData = await fetchContainerById(id);
        if (containerData) {
          setFormData({
            ...containerData,
            containerTypeId: containerData.containerLength + " ft" || "",
            containerMaterial: containerData.containerType?.containerMaterial || "",
          });
        }
      };
      loadContainer();
    }
  }, [id]);

  useEffect(() => {
    const fetchContainer = async () => {
      try {
        const response = await fetchContainerType();
        setContainerTypes(response.data || []);
        if (response.status) {
          setContainerTypes(response.data || []);
        } else {
          console.error("Failed to fetch container type:", response.message);
        }
      } catch (error) {
        console.error("Error fetching container type:", error);
      }
    };
    fetchContainer();

    // Call the function
  }, []); // Empty dependency array to run only once

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value === "true"
            ? true
            : value === "false"
              ? false
              : value, // Handle boolean values and normal inputs
    });
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      isActive: value === "Active", // Set isActive based on dropdown selection
    });
  };

  useEffect(() => {
    if (
      formData.containerUniqueNumber &&
      location.pathname === "/pages/exit-logs-add"
    ) {

      (async () => {
        try {
          const containerData = await fetchContainerByContainerUniqueNo(
            formData.containerUniqueNumber
          );
          if (containerData) {
            setFormData((prev) => ({
              ...prev,
              ...containerData,
              containerTypeId: containerData.containerType?.id || "",
              containerMaterial:
                containerData.containerType?.containerMaterial || "",
              entry: prev.entry,
            }));
          }
        } catch (error) {
          console.error("Error fetching container data:", error);
        }
      })();
    }
  }, [formData.containerUniqueNumber, location.pathname]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    } else {
      try {
        const response = await sendContainer(formData);
        if (response && response.status) {
          const successMessage =
            response.data.message || " entry logs add successfully ";
          setModalMessage(successMessage);
          setIsError(false);
          setShow(true);

          setFormData(initialLogData);
          setValidated(false);
        } else {
          const errorMessage =
            response?.message || " entry logs add successfully ";
          setModalMessage(errorMessage);
          setIsError(true);
          setShow(true);
          setTimeout(() => {
            setShow(false); // Hide the modal after 5 seconds
          }, 3000);
        }
      } catch (error) {
        console.error("Error during API call:", error);
      }
    }
  };
  const BackPage = () => {
    navigate("/pages/entry-logs-list");
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
            <Breadcrumb.Item href={breadcrumbLink || "/pages/logs"}>
              {" "}
              {breadcrumbTitle || "Logs"}{" "}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {formData.id ? "Edit Log" : "Add Log "}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">
                  {formData.id ? "Edit Log " : "Add Log"}
                </h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                {/* Container Unique Number */}
                {/* <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>Container Unique Number</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter Container Unique Number"
                      name="containerUniqueNumber"
                      value={formData.containerUniqueNumber}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Container Unique Number.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col> */}

                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom01"
                  >
                    <Form.Label>Container Unique Number</Form.Label>
                    {location.pathname === "/pages/exit-logs-add" ? (
                      <div className="card flex justify-content-center border-0">
                        <Dropdown
                          value={formData.containerUniqueNumber}
                          options={containerUniqueNumbers}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              containerUniqueNumber: e.value,
                            })
                          }
                          placeholder="Select Container"
                          className="custom-select w-full md:w-14rem"
                        />
                      </div>
                    ) : (
                      <Form.Control
                        required
                        type="text"
                        placeholder="Enter Container Unique Number"
                        name="containerUniqueNumber"
                        value={formData.containerUniqueNumber}
                        onChange={handleChange}
                      />
                    )}
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Container Unique Number.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>


                {/* Container Type ID */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom10"
                  >
                    <Form.Label>Container Type</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        name="containerTypeId"
                        value={formData.containerTypeId}
                        options={
                          containerTypes.length > 0
                            ? containerTypes.map((type) => ({
                              value: type.id,
                              label: `${type.containerLength}ft - ${type.containerMaterial}`,
                            }))
                            : []
                        }
                        onChange={(e) =>
                          handleChange({
                            target: { name: "containerTypeId", value: e.value },
                          })
                        }
                        placeholder="Select Container Type"
                        required
                        className="custom-select w-full md:w-14rem"
                        editable
                      >
                        {containerTypes.length === 0 && (
                          <option disabled>Loading container types...</option>
                        )}
                      </Dropdown>
                    </div>
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
                    <Form.Label>Weight (tons)</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      placeholder="Enter Weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid weight.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Driver Name */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom05"
                  >
                    <Form.Label>Driver Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter Driver Name"
                      name="vehicleDriverName"
                      value={formData.vehicleDriverName}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Driver Name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Driver Contact */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom06"
                  >
                    <Form.Label>Driver Contact</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter Driver Contact"
                      name="vehicleDriverContact"
                      value={formData.vehicleDriverContact}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Driver Contact.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Vehicle Number */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom04"
                  >
                    <Form.Label>Vehicle Number</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter Vehicle Number"
                      name="vehicleNo"
                      value={formData.vehicleNo}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Vehicle Number.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustomYard"
                  >
                    <Form.Label>Select Yard Area</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        name="yardAreaId"
                        value={formData.yardAreaId || ""}
                        options={yardAreas.map((yardArea) => ({
                          value: yardArea.id, // The value to store (tag id)
                          label: yardArea.areaName, // The label to display (tagId)
                        }))}
                        onChange={handleChange}
                        placeholder="Select Yard"
                        required
                        className="custom-select w-full md:w-14rem"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select a yard.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Select Tag (only show in add mode) */}
                {!formData.id && (
                  <Col md="4">
                    <Form.Group
                      className="form-group"
                      controlId="validationCustomTag"
                    >
                      <Form.Label>Select Tag</Form.Label>
                      <div className="card flex justify-content-center border-0">
                        <Dropdown
                          name="tagId"
                          value={formData.tagId || ""}
                          options={tags.map((tag) => ({
                            value: tag.id, // The value to store (tag id)
                            label: tag.tagName, // The label to display (tagId)
                          }))}
                          onChange={handleChange}
                          placeholder="Select Tag"
                          required
                          className="custom-select w-full md:w-14rem"
                          editable
                        />
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Please select a tag.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                )}

                {/* Entry By (By Road, By Rail) */}
                <Col md="4">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom08"
                  >
                    <Form.Label>{labelText}</Form.Label>
                    <div className="card flex justify-content-center border-0">
                      <Dropdown
                        name="entryBy"
                        value={formData.entryBy}
                        options={[
                          { value: "", label: "Select Entry Type" },
                          { value: "by-road", label: "By Road" },
                          { value: "by-rail", label: "By Rail" },
                        ]}
                        onChange={(e) =>
                          handleChange({
                            target: { name: "entryBy", value: e.value },
                          })
                        }
                        placeholder="Select Entry Type"
                        required
                        className="custom-select w-full md:w-14rem"
                        editable
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please select an entry type.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Row>
                  {/* Status (isActive) */}
                  <Col md="4">
                    <Form.Group
                      controlId="validationCustom13"
                      className="form-group"
                    >
                      <Form.Label>Status</Form.Label>
                      <div className="custom-radio">
                        <Form.Check
                          inline
                          type="radio"
                          id="active-status"
                          label="Active"
                          name="isActive"
                          value="Active"
                          checked={formData.isActive === true}
                          onChange={handleStatusChange}
                          required
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="inactive-status"
                          label="Inactive"
                          name="isActive"
                          value="Inactive"
                          checked={formData.isActive === false}
                          onChange={handleStatusChange}
                          required
                        />
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Please select a valid Status.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Container Condition (isEmpty) */}
                  <Col md="4">
                    <Form.Group
                      controlId="validationCustom02"
                      className="form-group"
                    >
                      <Form.Label>Container Condition</Form.Label>
                      <div className="custom-radio">
                        <Form.Check
                          inline
                          type="radio"
                          id="empty-status"
                          label="Empty"
                          name="isEmpty"
                          value="true" // Represent Empty as true
                          checked={formData.isEmpty === true}
                          onChange={handleChange}
                          required
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="filled-status"
                          label="Filled"
                          name="isEmpty"
                          value="false" // Represent Filled as false
                          checked={formData.isEmpty === false}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Please select a valid Condition.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Container Description */}
                <Col md="12">
                  <Form.Group
                    className="form-group"
                    controlId="validationCustom07"
                  >
                    <Form.Label>Container Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter Container Description"
                      name="containerDescription"
                      value={formData.containerDescription}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid description.
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
                {modalMessage} {/* Display error or success message */}
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
