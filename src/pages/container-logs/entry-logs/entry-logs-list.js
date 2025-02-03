import React, { useState, useEffect, useMemo } from "react";
import { Col, Container, Row, Button, Form, Breadcrumb } from "react-bootstrap";
import TableSec from "../../../components/table/table";
import Status from "../../../components/table/status";
import Actions from "../../../components/table/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContainer } from "../../../hook/useContainer";
import { useYardArea } from "../../../hook/useYardArea";
import { format } from "date-fns";
import { Dropdown } from "primereact/dropdown";
import noData from "../../../assets/images/noData.png"

export const EntryLogListSec = ({ isToggled }) => {
  const navigate = useNavigate();
 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yardAreas, setYardAreas] = useState([]);
  const [selectedYardArea, setSelectedYardArea] = useState("");
  const { getEligibleContainers } = useYardArea([]);
  const { fetchContainers,fetchContainerStatus } = useContainer([]);
  const { fetchYardAreas } = useYardArea();
  const yardId = useSelector((state) => state.auth.selectedYardId);
  const role = useSelector((state) => state.auth.roleName);
  const personInfoId = useSelector((state) => state.auth.id);
  const showJobAssign ="AREAMANAGER";

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
          fetchedData = await getEligibleContainers(yardId,selectedYardArea);
        } else {
          fetchedData = await fetchContainers(yardId);
        }
 
        const filteredData = fetchedData.filter(
          (container) => container.entry === true
        );

        //new method

        const updatedData = await Promise.all(
          filteredData.map(async (container) => {
            const jobStatus = await fetchContainerStatus(container.id);
            return {
              ...container,
              transmitStatus: jobStatus.jobStatus,
              jobInProgress: jobStatus.isAssignedAndInProgress, // Store the job status in the container data
            };
          })
        );
        setData(updatedData);

        // setData(filteredData);
      } catch (err) {
        console.error("Error fetching container data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
 
    loadContainerData();
  }, [yardId, selectedYardArea, role]);
 
 
  const columns = useMemo(() => {
    return [
      { Header: "Sr", accessor: "sr" },
      { Header: "Container ID", accessor: "containerID" },
      { Header: "Container Type", accessor: "containerSize" },
      { Header: "Entry Mode", accessor: "entryBy" },
      { Header: "Tag Id", accessor: "tagName" },
      { Header: "Arrival Time", accessor: "arrivalTime" },
      { Header: "Transmitting Status", accessor: "transmitStatus" },
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
    ];
  }, [role]);
 
  const tableData = useMemo(() => {
    return data.map((container, index) => ({
      sr: index + 1,
      containerID: container.containerUniqueNumber,
      
      containerSize: container.containerLength + "ft",
      weightCapacity: container.weight,
      tagName: container.tagName,
      yardAreaName: container.yardAreaName,
      entryBy: container.entryBy,
      arrivalTime: container.time,
      transmitStatus: container.transmitStatus,
      isActive: (
        <Status
          status={container.isActive}
          trueMessage="Active"
          falseMessage="Inactive"
        />
      ),
     
      containerStatus: container.isEmpty ? "Empty" : "Filled",
      action:
      role === "SUPERADMIN" || role === "OPERATOR" || role === "ADMIN" ? (
        <Actions
          onView={() => handleViewClick(container)}
        />
      ) : role === "AREAMANAGER" ? (
        <Actions
        showJobAssign={showJobAssign}
        onView={() => handleViewClick(container)} // View option
        onAssign={() =>
          container.jobInProgress
            ? handleUnassignJob(container)
            : handleAssignJob(container)
        } 
        buttonLabel={container.jobInProgress ? "Unassign" : "Assign"} // Set button label dynamically
      />
      ) : role === "GATEOPERATOR" ? (
        <Actions
          onEdit={() => handleEditClick(container)}
          onDelete={() => handleDeleteClick(container.id)}
          onView={() => handleViewClick(container)}
        />
      ) : null // No actions for other roles
    }));
  }, [data, role]);
 
 

  const handleDeleteClick = (containerId) => {
    // Add your delete logic here
  };
 
  const handleViewClick = (container) => {
    navigate(`/pages/container-view/${container.id}`);
  };
 
  const handleUnassignJob = (container) => {
    navigate(`/pages/container-viewsdghsjh/${container.id}`);
  };
  const handleAdd = () => {
    navigate("/pages/entry-logs-add");
  };
 
  const handleEditClick = (container) => {
    navigate(`/pages/entry-logs-add/${container.id}`);
  };
 
  const handleAssignJob = (container) => {
    navigate(`/pages/assign-job/${container.jobId}/yardAreaId/${container.yardAreaId}`);  
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
            <Breadcrumb.Item active>Entry Logs</Breadcrumb.Item>
          </Breadcrumb>
          <div className="title">
            <div className="d-block d-lg-flex d-md-flex justify-content-between align-items-center text-start">
              <h2 className="mb-2 mb-md-0 text-start">Entry Logs</h2>
              <div>
                {role === "AREAMANAGER" && (
                  <Col className="d-block d-lg-flex d-md-flex align-items-center">
                    <h6 className="mb-0 me-3 text-white">
                      Yard Area :
                    </h6>
                    <Form.Group controlId="yardAreaSelect">
                      <Dropdown
                        name="yardArea"
                        value={selectedYardArea}
                        options={yardAreas.map((area) => ({
                          label: area.areaName, // Displayed in the dropdown
                          value: area.id, // Corresponds to the selected value
                        }))}
                        onChange={(e) => setSelectedYardArea(e.value)}
                        placeholder="Select a Yard Area"
                        className="custom-select w-full md:w-14rem"
                      />
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
                      <span className="d-none d-lg-block d-md-block">
                        Add Log
                      </span>
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
 