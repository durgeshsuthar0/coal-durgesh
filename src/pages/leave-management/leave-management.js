import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import TableSec from "../../components/table/table";
import Status from "../../components/table/status";
import { faAdd, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getLeaveBalance,getLeaveInfo,applyLeave } from "../../services/allServices/leaveManagementService.js";
export const LeaveManagementSec = ({ isToggled }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState({
    totalAnnualLeave: 0,
    appliedLeave: 0,
    pendingLeave: 0,
    approvedLeave: 0,
    sickLeave: 0,
  });
 
  const [formData, setFormData] = useState({
    leaveType: "", // Updated field name
    details: "", // Updated field name
    leaveStartDate: "", // Updated field name
    leaveEndDate: "", // Updated field name
    personInfoId: 1, // Assuming this is static, or you can fetch/set dynamically
  });
 
  const [successMessage, setSuccessMessage] = useState(null);
  const [leaveInfo, setLeaveInfo] = useState(null);
  const [error, setError] = useState(null);
  const [leaveInfoData, setLeaveInfoData] = useState([]); // State to store the fetched leave data
 
 
const personInfoId = 1;
  useEffect(() => {
 
    const fetchLeaveBalance = async () => {
     
      try {
        const balance = await getLeaveBalance(personInfoId);
        console.log("balancedata",balance.data)
        setLeaveBalance(balance.data);
      } catch (err) {
      console.log("error",err);
      }
    };
 
    fetchLeaveBalance();
  }, [personInfoId]);
 
 
 
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
 
    // Ensure that the date is properly formatted before submitting
    const dataToSubmit = {
      leaveType: formData.leaveType,
      details: formData.details,
      leaveStartDate: formData.leaveStartDate, // Format date
      leaveEndDate: formData.leaveEndDate, // Format date
      personInfoId: formData.personInfoId,
    };
 
    try {
      const response = await applyLeave(dataToSubmit);
      setSuccessMessage("Leave application submitted successfully!");
      console.log("API Response:", response);
 
      // Close the modal after successful submission
      handleClose();
    } catch (err) {
      console.log("error", err);
    }
  };
 
  const handleCalendarChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
 
 
 
  const handleClose = () => {
    setShow(false);
    setFormData({
      leaveType: "", // Reset to initial state
      details: "",
      leaveStartDate: "",
      leaveEndDate: "",
      personInfoId: 1,
    });
  };
    const handleApplyLeave = () => setShow(true);
  const columns = useMemo(
    () => [
      { Header: "Type", accessor: "type" },
      { Header: "Details", accessor: "details" },
      { Header: "Approved By", accessor: "approvedBy" },
      { Header: "Status", accessor: "status" },
      { Header: "Request On", accessor: "requestOn" },
    ],
    []
  );
 
  useEffect(() => {
    const fetchLeaveInfo = async () => {
        try {
            const data = await getLeaveInfo(personInfoId);
            setLeaveInfoData(data.data);
            console.log("data",data) // Set the fetched data to state
        } catch (err) {
            setError('Failed to fetch leave information');
        }
    };
 
    fetchLeaveInfo();
}, [personInfoId]);
const data = useMemo(() => {
  return leaveInfoData.map((leave) => ({
    type: leave.leaveType.name || "Leave",
    details: leave.details || "Leave Request",
    status:leave.status,
    approvedBy: leave.approvedBy || "N/A",
    requestOn: new Date(leave.requestOn).toLocaleDateString() || "Unknown Date", // Format requestOn as a readable date
  }));
}, [leaveInfoData]);
 
 
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
          <div className="tracking-summary pb-4">
            <div className="title-text">
              <h6 className="mb-3">Leave Management</h6>
            </div>
            <Row className="mb-3">
              <Col lg={3} md={6} sm={12}>
                <Card className="mb-3 mb-lg-0 dashboard-card">
                  <div className="text-start ">
                    <div className="">
                      <Card.Body>
                        <Card.Text>Annual Leave</Card.Text>
                        <div className="d-flex justify-content-between">
                          <Card.Title className="text-primary">{leaveBalance.totalAnnualLeave}</Card.Title>{" "}
                        </div>
                      </Card.Body>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="mb-3 mb-lg-0 dashboard-card">
                  <div className="text-start d-flex justify-content-between">
                    <div className="">
                      <Card.Body>
                        <Card.Text>Applied Leave</Card.Text>
                        <Card.Title className="text-secondary">
                          {leaveBalance.appliedLeave}
                        </Card.Title>{" "}
                        {/* Dynamic Data */}
                        {/* Dynamic Data */}
                      </Card.Body>
                    </div>
                  </div>
                </Card>
              </Col>
 
              <Col lg={3} md={6} sm={12}>
                <Card className="mb-3 mb-lg-0  dashboard-card">
                  <div className="text-start d-flex justify-content-between">
                    <div className="">
                      <Card.Body>
                        <Card.Text>Sick Leave</Card.Text>
                        <Card.Title className="text-warning">{leaveBalance.sickLeave}</Card.Title>{" "}
                        {/* Dynamic Data */}
                        {/* Dynamic Data */}
                      </Card.Body>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="mb-3 mb-lg-0 dashboard-card">
                  <div className="text-start d-flex justify-content-between">
                    <div className="">
                      <Card.Body>
                        <Card.Text>Pending Request</Card.Text>
                        <Card.Title className="text-danger">{leaveBalance.pendingLeave}</Card.Title>{" "}
                        {/* Dynamic Data */}
                      </Card.Body>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="title-text">
                  <h6 className="mb-0">Your Request</h6>
                </div>
                <div>
                <Button
  onClick={handleApplyLeave}
                  className="btn-style-primary"
                >
                  <div className="btn-icon-style">
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                  <span className="d-none d-lg-block d-md-block">
                    Apply Leave
                  </span>
                </Button>
                </div>
              </div>
 
              <div>
                {" "}
                <TableSec columns={columns} data={data} />
              </div>
            </div>
          </div>
        </Container>
      </div>
 
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="border-0">
          <Modal.Title className="fs-5 fw-bold">
            {" "}
            Add Leave Request
          </Modal.Title>
        </Modal.Header>
        <div className="form-modal">
          <Form>
            <Form.Group controlId="details" className="mb-3">
              <Form.Label>Leave Details</Form.Label>
              <Form.Control
                name="details"
                value={formData.details}
                onChange={handleChange}
                type="text"
                placeholder="Enter Leave Details"
                required
              />
            </Form.Group>
            <Form.Group controlId="leaveType" className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                type="text"
                placeholder="Enter Leave Type"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group controlId="leaveStartDate" className="mb-3">
                  <Form.Label>Start</Form.Label>
                  <Calendar
                  value={formData.leaveStartDate}
                  onChange={(e) => handleCalendarChange("leaveStartDate", e.value)}
                    dateFormat="yy-mm-dd"
                    placeholder="DD/MM/YYYY"
                    appendTo="self"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="leaveEndDate" className="mb-3">
                  <Form.Label>End</Form.Label>
                  <Calendar
                  value={formData.leaveEndDate}
                  onChange={(e) => handleCalendarChange("leaveEndDate", e.value)}
                    dateFormat="yy-mm-dd"
                    placeholder="DD/MM/YYYY"
                    required
                    appendTo="self"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Reason Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Reason"
                required
              />
            </Form.Group>
            <div className="d-flex">
              <Button onClick={handleSubmit}>Save</Button>
              <Button className="ms-2 btn-style-primary2" onClick={handleClose}>
                Close
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </React.Fragment>
  );
};
 
