import React, { useEffect, useMemo, useState } from "react";
import { Container, Button, Modal, Form } from "react-bootstrap";
import TableSec from "../../components/table/table";
import Status from "../../components/table/status";
import Actions from "../../components/table/action";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useYardArea } from "../../hook/useYardArea";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import noData from "../../assets/images/noData.png"

export const YardAreaListSec = ({ isToggled }) => {
  const { fetchYardAreas, deleteYardArea } = useYardArea(); // Destructure the fetchYardAreas function
  const [yardAreas, setYardAreas] = useState([]); // State to hold yard areas

  const yardId = useSelector((state) => state.auth.selectedYardId);
  const personInfoId = useSelector((state) => state.auth.id);
  const role = useSelector((state) => state.auth.roleName);

  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/pages/yard-area-add");
  };

  const handleEditClick = (yardArea) => {
    // Navigate to the edit page with the selected yard area ID
    navigate(`/pages/yard-area-add/${yardArea.id}`); // Adjust this to match your routing setup
  };
  const handleViewClick = (yardArea) => {
    // Navigate to the edit page with the selected yard area ID
    navigate(`/pages/yard-area-view/${yardArea.id}`); // Adjust this to match your routing setup
  };

  const columns = useMemo(
    () => [
      { Header: "Sr. No", accessor: "sr" },
      { Header: "Area Name", accessor: "areaName" },
      { Header: "Area Type", accessor: "areaType" },
      { Header: "Area Space (sq. ft.)", accessor: "dimensions" },
      { Header: "Number of Containers", accessor: "containerCapacity" },
      {
        Header: "Area Allotted",
        accessor: "isAssigned",
        Cell: ({ value }) => (
          <div>
            <Status
            status={value}
            trueMessage="Allotted"
            falseMessage="Not Allotted"
          />
          </div>
        ),
      },
      { Header: "Actions", accessor: "action" }, // Actions column added unconditionally
    ],
    [role]
  );
  
  const loadYardAreas = async () => {
    const areas = await fetchYardAreas(yardId, role, personInfoId);
    if (areas) {
      const formattedData = areas.map((area, index) => ({
        sr: index + 1,
        areaType: area.areaType || "N/A",
        areaName: area.areaName || "N/A",
        latitude: area.latitude || "N/A",
        longitude: area.longitude || "N/A",
        dimensions: area.totalAreaSpace || "N/A",
        containerCapacity: area.containerCapacity || "N/A",
        occupiedContainer: area.occupiedContainer || "0",
        isAssigned: area.isAssigned,
        isOperational: (
          <Status
            status={area.isOperational}
            trueMessage="Operational"
            falseMessage="Non-Operational"
          />
        ),
        isActive: (
          <Status
            status={area.isActive}
            trueMessage="Active"
            falseMessage="Inactive"
          />
        ),
        action: (() => {
          if (["SUPERADMIN", "AREAMANAGER", "GATEOPERATOR", "OPERATOR"].includes(role)) {
            return (
              <Actions
                onView={() => handleViewClick(area)}
              />
            );
          } else if (role === "ADMIN") {
            return (
              <Actions
                onEdit={() => handleEditClick(area)}
                onView={() => handleViewClick(area)}
                onDelete={() => handleDeleteClick(area.id)}
              />
            );
          }
          return null; // No actions for other roles
        })(),
      }));
      setYardAreas(formattedData);
    }
  };


  useEffect(() => {
    loadYardAreas();
  }, [yardId, role, personInfoId]);

  const handleDeleteClick = async (yardAreaId) => {
    const result = await deleteYardArea(yardAreaId);
    if (result.status) {
      loadYardAreas(); // Refresh the yard areas list after successful deletion
    } else {
      console.error("Failed to delete yard area:", result.message);
    }
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
            <Breadcrumb.Item active>Yard Area List</Breadcrumb.Item>
          </Breadcrumb>
          <div className="title">
            <div className="d-flex d-md-flex justify-content-between align-items-center text-start">
              <h2 className="mb-md-0">Yard Area List</h2>
              <div>
                {role !== "SUPERADMIN" && role !== "AREAMANAGER" && role !== "GATEOPERATOR" && (
                  <Button
                    onClick={handleAdd}
                    variant="light"
                    className="btn-style"
                  >
                    <div className="btn-icon-style">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <span className="d-none d-lg-block d-md-block">
                      Add Yard Area
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </div>
          {yardAreas.length > 0 ? (
          <TableSec columns={columns} data={yardAreas} />
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
