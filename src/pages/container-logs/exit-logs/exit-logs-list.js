import React, { useState, useEffect, useMemo } from "react";
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import TableSec from "../../../components/table/table";
import Status from "../../../components/table/status";
import Actions from "../../../components/table/action";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContainer } from "../../../hook/useContainer";
import { useYardArea } from "../../../hook/useYardArea";
import { format } from "date-fns";
import noData from "../../../assets/images/noData.png";

export const ExitLogListSec = ({ isToggled }) => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedYardArea, setSelectedYardArea] = useState("");
  const [selectedContainerId, setSelectedContainerId] = useState(null);
  const [yardAreas, setYardAreas] = useState([]);
  const [activeYardAreas, setActiveYardAreas] = useState([]); // Yard areas fetched from the API

  const yardId = useSelector((state) => state.auth.selectedYardId);
  const role = useSelector((state) => state.auth.roleName);
  const personInfoId = useSelector((state) => state.auth.id);

  const { fetchContainers } = useContainer([]);
  const { fetchYardAreasByYardId } = useYardArea([]);
  const { fetchYardAreas, getEligibleContainers } = useYardArea();

  const columns = useMemo(
    () => [
      { Header: "Sr. No", accessor: "sr" },
      { Header: "Container ID", accessor: "containerID" },
      { Header: "Container Type", accessor: "containerSize" },
      { Header: "Container Condition", accessor: "containerStatus" },
      { Header: "Exit  Mode", accessor: "entryBy" },
      { Header: "Tag Id", accessor: "tagName" },
      { Header: "Departure Time", accessor: "departureTime" },
      {
        Header: "Actions",
        accessor: "action",
        Cell: ({ row }) => {
          // Display Actions column only for specified roles
          if (
            role === "SUPERADMIN" ||
            role === "OPERATOR" ||
            role === "ADMIN" ||
            role === "AREAMANAGER" ||
            role === "GATEOPERATOR"
          ) {
            return row.original.action;
          }
          return null;
        },
      },
    ],
    [role]
  );

  useEffect(() => {
    const fetchActiveYardAreas = async () => {
      try {
        const areas = await fetchYardAreasByYardId(yardId);
        setActiveYardAreas(areas);
      } catch (err) {
        console.error("Error fetching yard areas:", err);
        setError(err);
      }
    };

    fetchActiveYardAreas();
  }, [yardId]);

  const handleAdd = () => {
    navigate("/pages/exit-logs-add");
  };

  const handleEditClick = (container) => {
    navigate(`/pages/exit-logs-add/${container.id}`);
  };

  const handleViewClick = (container) => {
    navigate(`/pages/exit-logs-view/${container.id}`);
  };

  useEffect(() => {
    const fetchYardAreasData = async () => {
      try {
        const areas = await fetchYardAreas(yardId, role, personInfoId);
        setYardAreas(areas);
        if (areas.length > 0) {
          setSelectedYardArea(areas[0].id); // Default to the first yard area
        }
      } catch (err) {
        console.error("Error fetching yard areas:", err);
        setError(err);
      }
    };

    fetchYardAreasData();
  }, [yardId, role, personInfoId]);

  useEffect(() => {
    const loadContainerData = async () => {
      if (!yardId || !selectedYardArea) return;

      try {
        let fetchedData = [];
        if (role === "AREAMANAGER") {
          fetchedData = await getEligibleContainers(selectedYardArea);
        } else {
          fetchedData = await fetchContainers(yardId);
        }

        const filteredData = fetchedData.filter(
          (container) => container.entry === false
        );
        setData(filteredData);
      } catch (err) {
        console.error("Error fetching container data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadContainerData();
  }, [yardId, selectedYardArea, role]);

  const tableData = useMemo(() => {
    return data.map((container, index) => ({
      sr: index + 1,
      OperatorName: container.OperatorName || "N/A",
      containerID: container.containerUniqueNumber,
      containerEvent: (
        <Status
          status={container.entry}
          trueMessage="Entry"
          falseMessage="Exit"
        />
      ),
      containerSize: container.containerLength + "ft",
      weightCapacity: container.weight,
      yardLocation: "Yard " + container.yardId,
      vehicleNo: container.vehicleNo,
      vehicleDriverName: container.vehicleDriverName,
      vehicleDriverContact: container.vehicleDriverContact,
      tagName: container.tagName,
      yardAreaName: container.yardAreaName,
      entryBy: container.entryBy,
      departureTime: container.time,
      isActive: (
        <Status
          status={container.isActive}
          trueMessage="Active"
          falseMessage="Inactive"
        />
      ),
      containerStatus: container.isEmpty ? "Empty" : "Filled",
      //   action: (
      //     <Actions
      //       onEdit={
      //         role === "AREAMANAGER"
      //           ? () => handleAssignJob(container)
      //           : () => handleEditClick(container)
      //       }
      //       onView={ () => handleViewClick(container)}
      //       isAdmin={role === "AREAMANAGER"} // Pass isAdmin based on the role
      //     />
      //   ),
      // }));
      action:
        role === "SUPERADMIN" || role === "OPERATOR" || role === "ADMIN" ? (
          <Actions
            // onEdit={() => handleEditClick(container)}
            // onDelete={() => handleDeleteClick(container.id)}
            onView={() => handleViewClick(container)}
          />
        ) : role === "AREAMANAGER" ? (
          <Actions
            onView={() => handleViewClick(container)}
            onEdit={() => handleAssignJob(container)}
          />
        ) : role === "GATEOPERATOR" ? (
          <Actions
            onEdit={() => handleEditClick(container)}
            // onDelete={() => handleDeleteClick(container.id)}
            onView={() => handleViewClick(container)}
          />
        ) : null, // No actions for other roles
    }));
  }, [data, role]);

  const handleAssignJob = (container) => {
    setSelectedContainerId(container.id);
    setShowModal(true);
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
            <Breadcrumb.Item active>Exit Logs </Breadcrumb.Item>
          </Breadcrumb>
          <div className="title">
            <div className="d-flex justify-content-between align-items-center text-start">
              <h2 className="mb-0">Exit Logs </h2>
              <div>
                {role === "AREAMANAGER" && (
                  <Col lg={3} className="d-flex align-items-center">
                    <h2 className="mb-0 me-4">Yard Area:</h2>
                    <Form.Group controlId="yardAreaSelect">
                      <Form.Control
                        as="select"
                        value={selectedYardArea}
                        onChange={(e) => setSelectedYardArea(e.target.value)}
                      >
                        <option value="">Select a Yard Area</option>
                        {yardAreas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.areaName}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                )}
                {role !== "SUPERADMIN" &&
                  role !== "ADMIN" &&
                  role !== "AREAMANAGER" && (
                    <Button
                      onClick={handleAdd}
                      variant="light"
                      className="btn-style"
                    >
                      <div className="btn-icon-style">
                        <FontAwesomeIcon icon={faPlus} />
                      </div>
                      <span className="d-none d-lg-block d-md-block">Add Log </span>
                    </Button>
                  )}
              </div>
            </div>
          </div>
          {tableData.length > 0 ? (
            <TableSec columns={columns} data={tableData} />
          ) : (
            <div className="form-wrap d-flex justify-content-center">
              <img
                className="noData-Img"
                src={noData}
                alt="No Data Available"
              />
            </div>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};
