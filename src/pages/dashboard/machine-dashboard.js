import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPersonCircleXmark,
  faPersonCircleCheck,
  faBusinessTime,
  faBriefcase,
  faClock,
  faGasPump,
  faTruckRampBox,
  faLocationDot
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useSelector } from "react-redux";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import {
  fetchAssignedJobsByOperator,
  fetchJobsByAreaManager,
  saveOrUpdateJob,
} from "../../services/allServices/addContainerService";
import axios from "axios";

import {
  fetchCountData,
  fetchActiveMachineData
} from "../../services/allServices/dashboardService";

import { getMachineWorkLog, checkIn, checkOutOperator, fetchCheckInStatus, fetchGetOperatorJobTotalTime } from "../../services/allServices/machineService";
export const MachineDashboardSec = ({ isToggled, operatorId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobAssignments, setJobAssignments] = useState([]);
  const [timers, setTimers] = useState({});
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [activeJobs, setActiveJobs] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const personInfoId = useSelector((state) => state.auth.id);
  const role = useSelector((state) => state.auth.roleName);
  const [machineData, setMachineData] = useState(null);
  const [totalTime, setTotalTime] = useState(null);



  const [todayHours, setTodayHours] = useState("1h 0m");
  const [monthlyHours, setMonthlyHours] = useState("100");



  const handleCheckIn = async () => {
    try {
      const data = await checkIn(personInfoId);
      setIsCheckedIn(true);
      setCheckInTime(new Date(data.split(": ")[1]));
    } catch (error) {
      console.error("Error during check-in:", error);
    }
  }

  const formatElapsedTime = (elapsedTime) => {
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleAction = async (jobId, action) => {
    try {
      await saveOrUpdateJob(jobId, personInfoId, action);

      setJobAssignments((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId
            ? {
              ...job,
              buttons: {
                startDisabled: action === "Start" || action === "Complete",
                pauseDisabled: action !== "Start" && action !== "Pause",
                completeDisabled: action !== "Start" && action !== "Complete",
              },
            }
            : job
        )
      );

      if (action === "Start") {
        const timerInterval = setInterval(() => {
          setTimers((prev) => ({
            ...prev,
            [jobId]: {
              ...prev[jobId],
              elapsedTime: (prev[jobId]?.elapsedTime || 0) + 1000,
              isRunning: true,
            },
          }));
        }, 1000);

        setTimers((prev) => ({
          ...prev,
          [jobId]: { startTime: Date.now(), elapsedTime: 0, timerInterval, isRunning: true },
        }));
      } else if (action === "Pause") {
        clearInterval(timers[jobId]?.timerInterval);
        setTimers((prev) => ({
          ...prev,
          [jobId]: { ...prev[jobId], isRunning: false },
        }));
      } else if (action === "Complete") {
        clearInterval(timers[jobId]?.timerInterval);
        setTimers((prev) => ({
          ...prev,
          [jobId]: { ...prev[jobId], isRunning: false },
        }));
        // toast.success("Job completed successfully!");
      }
    } catch (error) {
      console.error(`Failed to ${action} job:`, error);
    }
  };


  const settings = {
    width: "100",
    height: "100",
  };





  const handleCheckOut = async () => {
    try {
      const data = await checkOutOperator(personInfoId);
      setIsCheckedIn(false);
      setCheckOutTime(new Date());
    } catch (error) {
      console.error('Error during check-out:', error);
    }
  };




  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


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
              <h6 className="">Dashboard</h6>
              <p>Machine Operator</p>
            </div>
            <Row className="mb-3">

              <Col lg={3} md={6} sm={12}>
                <Card className="mb-3 mb-lg-0 dashboard-card">
                  <div className="text-start d-flex justify-content-between">
                    <div className="">
                      <Card.Body>
                        <Card.Title className="text-primary">{activeJobs}</Card.Title> {/* Dynamic Data */}
                        {/* Dynamic Data */}
                        <Card.Text>Active Jobs</Card.Text>
                      </Card.Body>
                    </div>
                    <div className="card-icon bg-primary">
                      <Link to="/pages/machine-dash">
                        <FontAwesomeIcon icon={faBusinessTime} />
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="mb-3 mb-lg-0 dashboard-card">
                  <div className="text-start d-flex justify-content-between">
                    <div className="">
                      <Card.Body>
                        <Card.Title className="text-secondary">{completedJobs}</Card.Title> {/* Dynamic Data */}
                        {/* Dynamic Data */}
                        <Card.Text>Completed Jobs</Card.Text>
                      </Card.Body>
                    </div>
                    <div className="card-icon bg-secondary">
                      <Link>
                        <FontAwesomeIcon icon={faBriefcase} />
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col lg={3} md={6} sm={12}>
                <Card className="mb-3 mb-lg-0 dashboard-card">
                  <div className="text-start d-flex justify-content-between">
                    <div className="">
                      <Card.Body>
                        <Card.Title className="text-warning">18</Card.Title>{" "}
                        {/* Dynamic Data */}
                        <Card.Text>Present Days</Card.Text>
                      </Card.Body>
                    </div>
                    <div className="card-icon bg-warning">
                      <Link>
                        {" "}
                        <FontAwesomeIcon icon={faPersonCircleCheck} />
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="mb-3 mb-lg-0 dashboard-card">
                  <div className="text-start d-flex justify-content-between">
                    <div className="">
                      <Card.Body>
                        <Card.Title className="text-danger">12</Card.Title>{" "}
                        {/* Dynamic Data */}
                        <Card.Text>Absent Days</Card.Text>
                      </Card.Body>
                    </div>
                    <div className="card-icon bg-danger">
                      <Link>
                        <FontAwesomeIcon icon={faPersonCircleXmark} />
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row className="mb-3">

              <Col lg={6} md={6} sm={12}>
                <Row>
                  <Col>
                    <Card className="mb-3 mb-lg-0 dashboard-card">
                      <div className="text-start d-flex justify-content-between align-items-center">
                        <div>
                          <Button onClick={handleCheckIn} disabled={isCheckedIn || checkOutTime}
                          >
                            {isCheckedIn ? "Checked In" : "Check In"}
                          </Button>
                          {checkInTime && <p>Check-in Time: {checkInTime.toLocaleTimeString()}</p>}

                        </div>
                        <div>
                          {checkInTime && (
                            <p className="mb-0">
                              <strong>Last Check-IN:</strong>{" "}
                              {checkInTime.toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* Check-Out Section */}
                <Row className="mt-3">
                  <Col>
                    <Card className="mb-3 mb-lg-0 dashboard-card">
                      <div className="text-start d-flex justify-content-between align-items-center">
                        <div>
                          <Button
                            onClick={handleCheckOut}
                            disabled={!isCheckedIn}
                            variant="danger"
                          >
                            Check OUT
                          </Button>
                        </div>
                        <div>
                          {checkOutTime && (
                            <p className="mb-0">
                              <strong>Last Check-OUT:</strong>{" "}
                              {checkOutTime.toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Col>
              {jobAssignments.map((job) => {
                const timer = timers[job.id] || {};
                const elapsedTime = timer.elapsedTime || 0;

                return (
                  <Col lg={6} md={6} sm={12} key={job.id}>
                    <Card className="mb-3 mb-lg-0 dashboard-card">
                      <div className="d-flex justify-content-between">
                        <h6 className="fw-bold fs-6 text-start">Current Job</h6>
                      </div>

                      <div>
                        <h6 className="fw-bold fs-6 text-start">
                          <FontAwesomeIcon className="me-2" icon={faTruckRampBox} />
                          Container ID : <span>{job.containerUniqueNumber}</span>
                        </h6>
                        <h6 className="fw-bold fs-6 text-start">
                          <FontAwesomeIcon className="me-2" icon={faLocationDot} />
                          Pickup : <span>{job.pickupLocation}</span>
                        </h6>
                        <h6 className="fw-bold fs-6 text-start">
                          <FontAwesomeIcon className="me-2" icon={faLocationDot} />
                          Drop : <span>{job.yardArea}</span>
                        </h6>
                        <h6 className="fw-bold fs-6 text-start">
                          <FontAwesomeIcon className="me-2" icon={faClock} />
                          Assigned : <span>{job.timestamp}</span>
                        </h6>
                
                        {role !== 'AREAMANAGER' && (
                          <h6 className="fw-bold fs-6 text-start">
                            Timer : <span>{formatElapsedTime(elapsedTime)}</span>
                          </h6>
                        )}
                      </div>

                      {role !== 'AREAMANAGER' && (
                        <div className="mt-3 mb-0 d-flex justify-content-between">
                          <Button
                            size="sm"
                            disabled={job.buttons.startDisabled}
                            onClick={() => handleAction(job.id, 'Start')}
                          >
                            Start
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            disabled={job.buttons.pauseDisabled}
                            onClick={() => handleAction(job.id, 'Pause')}
                          >
                            Pause <FontAwesomeIcon icon={faPause} />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={job.buttons.completeDisabled}
                            onClick={() => handleAction(job.id, 'Complete')}
                          >
                            Complete
                          </Button>
                        </div>
                      )}
                    </Card>
                  </Col>
                );
              })}


            </Row>

            <Row className="mt-3">
              <Col lg={6} md={12} sm={12}>
                <Row>
                  <Col>
                    <Card className="mb-3 mb-lg-0 dashboard-card">
                      <div className="">
                        <Card.Body>
                          <Card.Title className="w-50 fs-6 text-start">
                            Assigned Machine
                          </Card.Title>{" "}
                          {/* Dynamic Data */}
                          <Card.Text className="d-flex justify-content-center align-items-center">
                            {/* Working Hours{" "} */}
                          </Card.Text>
                        </Card.Body>
                        <div className="d-flex justify-content-between">
                          <div className=" text-start mt-2">
                            {machineData ? (
                              <>
                                <h6>
                                  Machine Name :{" "}
                                  <span className="fw-bold">
                                    {machineData.machineName}
                                  </span>
                                </h6>
                                <h6>
                                  Assigned Date :{" "}
                                  <span className="fw-bold">
                                    {machineData.createdDate}
                                  </span>
                                </h6>
                                <h6>
                                  Load Capacity :{" "}
                                  <span className="fw-bold">
                                    {machineData.loadCapacity}
                                  </span>
                                </h6>
                                <h6>
                                  Status :{" "}
                                  <span>
                                    {machineData.status ? (
                                      <Badge bg="success">Active</Badge>
                                    ) : (
                                      <Badge bg="danger">Inactive</Badge>
                                    )}
                                  </span>
                                </h6>

                              </>
                            ) : (
                              <p>Loading Machine Data...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={4} md={6} sm={12}>
                    {" "}
                    <Card className="mb-3 mb-lg-0 dashboard-card">
                      {" "}
                      <div className="">
                        <h1 className="fs-1 fw-bold text-secondary">
                          <FontAwesomeIcon
                            className="me-2 text-secondary"
                            icon={faClock}
                          ></FontAwesomeIcon>
                          <br></br>
                          {/* {machineData.workingHours} */}
                          {totalTime}
                          <span className="fs-6">hr</span>
                        </h1>
                        <h6 className="fw-bold text-secondary mb-0">
                          Working hours
                        </h6>
                      </div>
                    </Card>
                  </Col>
                  <Col lg={4} md={6} sm={12}>
                    {" "}
                    <Card className="mb-3 mb-lg-0 dashboard-card">
                      <div className="">
                        <h1 className="fs-1 fw-bold text-success">
                          <FontAwesomeIcon
                            className="me-2 text-success"
                            icon={faGasPump}
                          />
                          <br></br>
                          {/* {fuelEfficiency} */}
                          {200}
                          <span className="fs-6">ltr</span>
                        </h1>
                        <h6 className="fw-bold text-success mb-0">
                          Fuel Efficiency (/hr)
                        </h6>
                      </div>
                    </Card>
                  </Col>
                  <Col lg={4} md={6} sm={12}>
                    {" "}
                    <Card className="mb-3 mb-lg-0 dashboard-card">
                      {" "}
                      <div className="">
                        <h1 className="fs-1 fw-bold text-danger">
                          <FontAwesomeIcon
                            className="me-2 text-danger"
                            icon={faGasPump}
                          />
                          <br></br>
                          {/* {machineData.fuelConsumed} */}
                          {100}
                          <span className="fs-6">ltr</span>
                        </h1>
                        <h6 className="fw-bold text-danger mb-0">
                          Fuel Consumed
                        </h6>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="mb-3 mb-lg-0 dashboard-card">
                  <div className="">
                    <div className="">
                      <Card.Body>
                        <Card.Title className="">{todayHours}</Card.Title>{" "}
                        {/* Dynamic Data */}
                        <Card.Text className="d-flex justify-content-center align-items-center">
                          Today's Hours{" "}
                          <FontAwesomeIcon
                            className="ms-2 fs-5 text-primary"
                            icon={faClock}
                          />
                        </Card.Text>
                      </Card.Body>
                      <Gauge
                        {...settings}
                        value={parseFloat(todayHours.split("h")[0])} // Parse the hour value from the string
                        cornerRadius="50%"
                        valueMax={50}
                        sx={(theme) => ({
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 20,
                          },
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#336666",
                          },
                          [`& .${gaugeClasses.referenceArc}`]: {
                            fill: "#f2f2f4",
                          },
                        })}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="mb-3 mb-lg-0 dashboard-card">
                  <div className="">
                    <div className="">
                      <Card.Body>
                        <Card.Title className="">{monthlyHours}</Card.Title>{" "}
                        {/* Dynamic Data */}
                        <Card.Text className="d-flex justify-content-center align-items-center">
                          Working Hours{" "}
                          <FontAwesomeIcon
                            className="ms-2 fs-5 text-primary"
                            icon={faClock}
                          />
                        </Card.Text>
                      </Card.Body>
                      <Gauge
                        {...settings}
                        value={parseFloat(monthlyHours.split("h")[0])} // Parse the hour value from the string
                        cornerRadius="50%"
                        valueMax={200}
                        sx={(theme) => ({
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 20,
                          },
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#336666",
                          },
                          [`& .${gaugeClasses.referenceArc}`]: {
                            fill: "#f2f2f4",
                          },
                        })}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

