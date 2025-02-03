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

export const AttendanceAddSec = ({ isToggled }) => {
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
            <Breadcrumb.Item active>Add attendance</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col lg={12}>
              <div className="title">
                <h2 className="text-start mb-0">Add attendance</h2>
              </div>
            </Col>
          </Row>
          <div className="form-wrap">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col md="4">
                  <Form.Group controlId="date" className="form-group">
                    <Form.Label>Date</Form.Label>
                    <Calendar
                      className={isSubmitted && !formData.date ? "invalid" : ""}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.value })
                      }
                      value={formData.date}
                      dateFormat="yy-mm-dd"
                      placeholder="DD/MM/YYYY"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="checkInTime" className="form-group">
                    <Form.Label>Check-In Time</Form.Label>
                    <Calendar
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.value)}
                      timeOnly
                      showSeconds
                      placeholder=" Check in Time"
                      required
                      className={isSubmitted && !checkInTime ? 'invalid' : ''}

                    />
                  </Form.Group>
                </Col>

                <Col md="4">
                  <Form.Group controlId="checkOutTime" className="form-group">
                    <Form.Label>Check-Out Time</Form.Label>
                    <Calendar
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.value)}
                      timeOnly
                      showSeconds
                      required
                      placeholder="Check out Time"
                      className={isSubmitted && !checkOutTime ? 'invalid' : ''}

                    />
                  </Form.Group>
                </Col>

                <Col md="12">
                  <Form.Group
                    controlId="isActive"
                    className="form-group custom-radio"
                  >
                    <Form.Label>Status</Form.Label>
                    <div className="d-flex">
                      <Form.Check
                        inline
                        label="Present"
                        name="status"
                        type="radio"
                        value="Present"
                        required
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        label="Late"
                        name="status"
                        type="radio"
                        value="Late"
                        required
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        label="Half-Day"
                        name="status"
                        type="radio"
                        value="Half-Day"
                        required
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        label="Leave"
                        name="status"
                        type="radio"
                        value="Leave"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group
                    controlId="formBasicDescription"
                    className="form-group"
                  >
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter Note"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      required
                    />
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
                  <Button
                    type="submit"
                    variant="primary"
                    className="btn-style-primary mt-2"
                  >
                    <div className="btn-icon-style">
                      <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                    Submit
                  </Button>
                </div>
              </Row>
            </Form>
          </div>
          <Modal
            show={show}
            onHide={handleClose}
            className="
          success-modal"
          >
            {/* <Modal.Header closeButton>
        </Modal.Header> */}
            <Modal.Body>
              <Modal.Title className="fs-6 text-black text-center">
                <SealCheck
                  size={50}
                  className={
                    isError
                      ? "text-danger d-block mx-auto mb-2"
                      : " text-success d-block mx-auto mb-2"
                  }
                />{" "}
                {modalMessage}
              </Modal.Title>
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
                  Attandnce
                </Button>
              )}
            </Modal.Body>
          </Modal>
        </Container>
      </div>

      {/* Modal Message */}
    </React.Fragment>
  );
};
