import React, { useState } from "react";
import { Col, Container, Row, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHouseChimney,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAttendance } from "../../hook/useAttendance";
import { SealCheck } from "@phosphor-icons/react";
import { Calendar } from "primereact/calendar";
import { useSelector } from "react-redux";

export const AttendanceViewSec = ({ isToggled }) => {
  const [validated, setValidated] = useState(false);
  const personInfoId = useSelector((state) => state.auth.id);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [show, setShow] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [formData, setFormData] = useState({
    checkInTime: "",
    checkOutTime: "",
    date: "", // Date string (YYYY-MM-DD)
    id: 0,
    personInfoId: personInfoId, // Assuming this is the ID of the person submitting the attendance
    status: "", // Status (Present, Late, Half-Day, Leave)
    notes: "", // For Notes
  });

  const navigate = useNavigate();
  const { handleAttendance } = useAttendance();

  const handleClose = () => setShow(false);

  const handleNavigate = () => {
    navigate("/pages/attendance");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false || !formData.status) {
      setValidated(true);
      setModalMessage("Please select a status.");
      setIsError(true);
      setShow(true);
      setIsSubmitted(true);
      return;
    }

    // const formatTime = (date) => date ? `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` : '';
    // setFormData({
    //   checkInTime: formatTime(checkInTime),
    //   checkOutTime: formatTime(checkOutTime),
    // });
    // console.warn(checkInTime, checkOutTime);

    const formatTime = (date) =>
      date
        ? `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`
        : "";

    setFormData({
      checkInTime: formatTime(checkInTime),
      checkOutTime: formatTime(checkOutTime),
    });

    console.warn(formData.checkInTime, formData.checkOutTime);

    const payload = {
      checkInTime: formatTime(checkInTime),
      checkOutTime: formatTime(checkOutTime),
      date: formData.date, // Format: YYYY-MM-DD
      id: formData.id,
      personInfoId: formData.personInfoId, // This could be tied to the user info
      status: formData.status, // "Present", "Late", "Half-Day", "Leave"
      notes: formData.notes,
    };

    try {
      const response = await handleAttendance(payload);
      if (response && response.status) {
        const successMessage =
          response.data?.message || "Attendance saved successfully!";
        setModalMessage(successMessage);
        setIsError(false);
        setShow(true);
      } else {
        const errorMessage = response?.message || "Unexpected error occurred.";
        setModalMessage(errorMessage);
        setIsError(true);
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setModalMessage(error);
      setIsError(true);
      setShow(true);
    }
  };

  const BackPage = () => {
    navigate("/pages/attendance");
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
            <Breadcrumb.Item href="/pages/attendance">
              attendance
            </Breadcrumb.Item>
            <Breadcrumb.Item active>View attendance</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">View attendance</h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col md="4">
                  <Form.Group controlId="date" className="form-group">
                    <Form.Label>Date</Form.Label>
                    <h6 className="fs-6 fw-bold">02/12/2024</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="checkInTime" className="form-group">
                    <Form.Label>Check-In Time</Form.Label>
                    <h6 className="fs-6 fw-bold">01:20:23</h6>
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="checkOutTime" className="form-group">
                    <Form.Label>Check-Out Time</Form.Label>
                    <h6 className="fs-6 fw-bold">06:23:43</h6>
                  </Form.Group>
                </Col>

                <Col md="12">
                  <Form.Group
                    controlId="isActive"
                    className="form-group custom-radio"
                  >
                    <Form.Label>Status</Form.Label>
                    <h6 className="fs-6 fw-bold text-success">Present</h6>
                    {/* <h6 className="fs-6 fw-bold text-secondary">Late</h6>
                    <h6 className="fs-6 fw-bold text-warning">Half Day</h6>
                    <h6 className="fs-6 fw-bold text-danger">Leave</h6> */}
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group
                    controlId="formBasicDescription"
                    className="form-group"
                  >
                    <Form.Label>Notes</Form.Label>
                    <h6 className="fs-6 fw-bold">Medical reasons : This could include a medical condition, injury, or medical emergency</h6>
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid note.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

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
              </Row>
            </Form>
          </div>
        
        </Container>
      </div>

      {/* Modal Message */}
    </React.Fragment>
  );
};
