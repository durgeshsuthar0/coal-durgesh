import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import {
  FaIndustry,
  FaTools,
  FaTruck,
  FaUsers,
  FaGasPump,
  FaCog,
} from "react-icons/fa"; // Importing relevant icons
import { IoMdTime } from "react-icons/io";
import CanvasJSReact from "@canvasjs/react-charts";
import React from "react";
import { useSelector } from "react-redux";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { ProgressBar, OverlayTrigger, Tooltip } from "react-bootstrap";
import Loader from "../../components/loadSpinner/loader";


export const DashboardSec = ({ isToggled }) => {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const yardId = useSelector((state) => state.auth.selectedYardId);

  const machines = [{ id: 1, name: "Machine A", efficiency: 30 }];
  const getMachineStatus = (efficiency) => {
    if (efficiency >= 80) return { status: "Good", className: "bg-success" };
    if (efficiency >= 50) return { status: "Average", className: "bg-yellow" };
    return { status: "Poor", className: "bg-danger" };
  };
  // Static data for charts
  const options = {
    title: {
      text: "Area Wise Containers",
    },
    data: [
      {
        type: "pie",
        startAngle: 240,
        dataPoints: [
          { label: "Area A", y: 450 },
          { label: "Area B", y: 250 },
          { label: "Area C", y: 120 },
          { label: "Area D", y: 250 },
          { label: "Area E", y: 220 },
          { label: "Area F", y: 180 },
          { label: "Area G", y: 100 },
        ],
      },
    ],
  };

  const options1 = {
    title: {
      text: "Area Wise Occupied Space",
    },
    data: [
      {
        type: "pie",
        startAngle: 240,
        dataPoints: [
          { label: "Area 1", y: 60 },
          { label: "Area 2", y: 40 },
          { label: "Area 3", y: 90 },
          { label: "Area 4", y: 110 },
          { label: "Area 5", y: 130 },
          { label: "Area 6", y: 50 },
          { label: "Area 7", y: 40 },
        ],
      },
    ],
  };

  // Static data for other stats
  const containerData = {
    totalEntryContainers: 1200,
    entryByRail: 300,
    entryByRoad: 600,
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
          <div className="title-text">
            <h6 className="mb-4">Dashboard</h6>
          </div>

          <Row>
            <Col lg={12} md={4} sm={6}>
              <div>
                <Card className="welcome-card text-start mb-3 p-3 border-0">
                  <div className="overlay"></div>
                  <Card.Body className="welcome-card-body">
                    <h3 className="welcome-heading">
                      Welcome to the Coal Yard Management System
                    </h3>
                    <p className="mb-0 welcome-description">
                      Your one-stop solution for monitoring and managing
                      operations.
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={3} md={3} sm={6}>
              {" "}
              <Card className="stat-card mb-3 hover-card text-center border-0">
                <Card.Body>
                  <div className="w-100 d-flex align-items-center gap-3">
                    <div className="p-2 bg-secondary-light rounded-2">
                      <div>
                        <FaIndustry size={40} className="text-secondary" />
                      </div>
                    </div>
                    <div className="text-start">
                      <h4 className="fw-bold mb-0 text-secondary">
                        {containerData.totalEntryContainers}
                      </h4>
                      <p className="mb-0">Online Machine</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={3} sm={6}>
              <Card className="stat-card mb-3 hover-card text-center border-0">
                <Card.Body>
                  <div className="w-100 d-flex align-items-center gap-3">
                    <div className="p-2 bg-orenge-light rounded-2">
                      <div>
                        <FaTools size={40} className="text-orenge" />
                      </div>
                    </div>
                    <div className="text-start">
                      <h4 className="text-orenge fw-bold mb-0">
                        {containerData.totalEntryContainers}
                      </h4>
                      <p className="mb-0">Maintenance Machine</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={3} sm={6}>
              <Card className="stat-card mb-3 hover-card text-center border-0">
                <Card.Body>
                  <div className="w-100 d-flex align-items-center gap-3">
                    <div className="p-2 bg-light-green rounded-2">
                      <div>
                        <FaTruck size={40} className="text-green" />
                      </div>
                    </div>
                    <div className="text-start">
                      <h4 className="text-green fw-bold mb-0">
                        {containerData.totalEntryContainers}
                      </h4>
                      <p className="mb-0">Total Operators</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={3} sm={6}>
              <Card className="stat-card mb-3 hover-card text-center border-0">
                <Card.Body>
                  <div className="w-100 d-flex align-items-center gap-3">
                    <div className="p-2 bg-danger-light rounded-2">
                      <div>
                        <FaUsers size={40} className="text-danger" />
                      </div>
                    </div>
                    <div className="text-start">
                      <h4 className="text-danger fw-bold mb-0">
                        {containerData.totalEntryContainers}
                      </h4>
                      <p className=" fw-medium mb-0">Online Operators</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col lg={6} md={3} sm={6}>
              {" "}
              <div className="form-wrap">
                <div className="mb-2 title-text d-flex justify-content-between">
                  <h6 className="mb-0">Machine Efficiency</h6>
                  {machines.map((machine) => {
                    const { status, className } = getMachineStatus(
                      machine.efficiency
                    );
                    return (
                      <Badge key={machine.id} className={className}>
                        {status}
                      </Badge>
                    );
                  })}
                </div>
                {machines.map((machine) => (
                  <div key={machine.id} className="">
                    <div className="d-flex justify-content-end">
                      <span>{machine.efficiency}%</span>
                    </div>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          Machine is operating at {machine.efficiency}%
                          efficiency
                        </Tooltip>
                      }
                    >
                      <ProgressBar
                        now={machine.efficiency}
                        label={`${machine.efficiency}%`}
                        variant={
                          machine.efficiency >= 80
                            ? "success"
                            : machine.efficiency >= 50
                            ? "warning"
                            : "danger"
                        }
                        style={{ height: "25px" }}
                      />
                    </OverlayTrigger>
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={3} md={3} sm={6}>
              {" "}
              <div className="form-wrap">
                <div className="mb-2 title-text d-flex justify-content-between">
                  <h6 className="mb-0">Fuel Consumption</h6>
                </div>
                <div className="w-100 d-flex align-items-center gap-3">
                  <div className="p-2 bg-success-light rounded-2">
                    <div>
                      <FaGasPump size={35} className="text-success" />
                    </div>
                  </div>
                  <div className="text-start">
                      <h4 className="fs-2 text-success fw-bold mb-0">
                     200 LTR
                      </h4>
                    </div>
                </div>
              </div>
            </Col>
            <Col lg={3} md={3} sm={6}>
              {" "}
              <div className="form-wrap">
                <div className="mb-2 title-text d-flex justify-content-between">
                  <h6 className="mb-0">Working Hours</h6>
                </div>
                <div className="w-100 d-flex align-items-center gap-3">
                  <div className="p-2 bg-yellow-light rounded-2">
                    <div>
                      <IoMdTime size={35} className="text-yellow" />
                    </div>
                  </div>
                  <div className="text-start">
                      <h4 className="fs-2 text-yellow fw-bold mb-0">
                    200 hrs
                      </h4>
                    </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* <Row className="mb-4">

              <Col xl={2} lg={3} md={4} sm={6}>
                <Card
                  className="stat-card mb-3 hover-card shadow-lg text-center"
                  style={{ backgroundColor: "#f8d7da" }}
                >
                  <Card.Body>
                    <FaIndustry
                      size={40}
                      className="mb-2"
                      style={{ color: "#721c24" }}
                    />
                    <Card.Title>
                      {containerData.totalEntryContainers}
                    </Card.Title>
                    <Card.Text>Online Machine Count</Card.Text>
                    <FaArrowUp size={20} style={{ color: "green" }} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={2} lg={3} md={4} sm={6}>
                <Card
                  className="stat-card mb-3 hover-card shadow-lg text-center"
                  style={{ backgroundColor: "#d1ecf1" }}
                >
                  <Card.Body>
                    <FaTools
                      size={40}
                      className="mb-2"
                      style={{ color: "#0c5460" }}
                    />
                    <Card.Title>{containerData.entryByRail}</Card.Title>
                    <Card.Text>Maintenance Machine Count</Card.Text>
                    <FaArrowDown size={20} style={{ color: "red" }} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={2} lg={3} md={4} sm={6}>
                <Card
                  className="stat-card mb-3 hover-card shadow-lg text-center"
                  style={{ backgroundColor: "#fff3cd" }}
                >
                  <Card.Body>
                    <FaTruck
                      size={40}
                      className="mb-2"
                      style={{ color: "#856404" }}
                    />
                    <Card.Title>{containerData.entryByRoad}</Card.Title>
                    <Card.Text>Total Operators</Card.Text>
                    <FaArrowUp size={20} style={{ color: "green" }} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={2} lg={3} md={4} sm={6}>
                <Card
                  className="stat-card mb-3 hover-card shadow-lg text-center"
                  style={{ backgroundColor: "#d4edda" }}
                >
                  <Card.Body>
                    <FaUsers
                      size={40}
                      className="mb-2"
                      style={{ color: "#155724" }}
                    />
                    <Card.Title>{containerData.entryByRoad}</Card.Title>
                    <Card.Text>Online Operators</Card.Text>
                    <FaArrowUp size={20} style={{ color: "green" }} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={2} lg={3} md={4} sm={6}>
                <Card
                  className="stat-card mb-3 hover-card shadow-lg text-center"
                  style={{ backgroundColor: "#f8d7da" }}
                >
                  <Card.Body>
                    <FaGasPump
                      size={40}
                      className="mb-2"
                      style={{ color: "#721c24" }}
                    />
                    <Card.Title>{containerData.entryByRoad}</Card.Title>
                    <Card.Text>Fuel Consumption</Card.Text>
                    <FaArrowDown size={20} style={{ color: "red" }} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={2} lg={3} md={4} sm={6}>
                <Card
                  className="stat-card mb-3 hover-card shadow-lg text-center"
                  style={{ backgroundColor: "#d1ecf1" }}
                >
                  <Card.Body>
                    <FaCog
                      size={40}
                      className="mb-2"
                      style={{ color: "#0c5460" }}
                    />
                    <Card.Title>{containerData.entryByRoad}</Card.Title>
                    <Card.Text>Machine Efficiency</Card.Text>
                    <FaArrowUp size={20} style={{ color: "green" }} />
                  </Card.Body>
                </Card>
              </Col>
            </Row> */}

          {/* <Row>
              <Col xl={6} md={6} sm={12} className="mb-3">
                <Card className="piechart-card hover-card shadow-lg card-with-line-background">
                  <div className="chart-title text-start d-flex justify-content-between">
                    <h2>Area Wise Containers</h2>
                    <p className="mb-0 fw-medium">
                      Total Containers :{" "}
                      <span className="text-primary ms-1">1580</span>
                    </p>
                  </div>
                  <div className="chart-container">
                    <CanvasJSChart options={options} />
                  </div>
                </Card>
              </Col>
              <Col xl={6} md={6} sm={12}>
                <Card className="piechart-card hover-card shadow-lg card-with-line-background">
                  <div className="chart-title text-start d-flex justify-content-between">
                    <h2>Area Wise Occupied Space</h2>
                    <p className="mb-0 fw-medium">
                      Total Areas: <span className="text-primary ms-1">07</span>
                    </p>
                  </div>
                  <div className="chart-container">
                    <CanvasJSChart options={options1} />
                  </div>
                </Card>
              </Col>
            </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};
