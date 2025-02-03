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

export const LogListSec = ({ isToggled }) => {
  const navigate = useNavigate();

  const { fetchYardAreas, deleteYardArea } = useYardArea();

  const [yardAreas, setYardAreas] = useState([]);

  const yardId = useSelector((state) => state.auth.selectedYardId);
  const personInfoId = useSelector((state) => state.auth.id);
  const role = useSelector((state) => state.auth.roleName);

  const columns = useMemo(
    () => [
      { Header: "Sr", accessor: "sr" },
      { Header: "Area Type", accessor: "areaType" },
      { Header: "Area", accessor: "areaName" },

      { Header: "Lat.", accessor: "latitude" },
      { Header: "Long.", accessor: "longitude" },
      { Header: "Area (SqFt)", accessor: "dimensions" },
      { Header: "Capacity", accessor: "containerCapacity" },
      {
        Header: "Assigned",
        accessor: "isAssigned",
        Cell: ({ value }) => (
          <div>
            {value ? (
              <FaCheckCircle color="green" />
            ) : (
              <FaTimesCircle color="red" />
            )}
          </div>
        ),
      },
      { Header: "Status", accessor: "isActive" },
      { Header: "Operational", accessor: "isOperational" },
      ...(role !== "SUPERADMIN"
        ? [{ Header: "Actions", accessor: "action" }]
        : []),
    ],
    [role]
  );

  const handleAdd = () => {
    navigate("/pages/yard-area-add");
  };

  const handleEditClick = (yardArea) => {
    navigate(`/pages/yard-area-add/${yardArea.id}`);
  };

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
        isAssigned: area.isAssignede,

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
        action: (
          <Actions
            onEdit={() => handleEditClick(area)}
            onDelete={() => handleDeleteClick(area.id)}
          />
        ),
      }));
      setYardAreas(formattedData);
    }
  };

  const handleDeleteClick = async (yardAreaId) => {
    const result = await deleteYardArea(yardAreaId);
    if (result.status) {
      loadYardAreas();
    } else {
      console.error("Failed to delete yard area:", result.message);
    }
  };

  useEffect(() => {
    loadYardAreas();
  }, [yardId, role, personInfoId]);

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
            <div className="d-block d-md-flex justify-content-between align-items-center text-start">
              <h2 className="mb-3 mb-md-0">Yard Area List</h2>
              {role !== "SUPERADMIN" ||
                (role !== "AREAMANAGER" && (
                  <Button
                    onClick={handleAdd}
                    variant="light"
                    className="btn-style"
                  >
                    <div className="btn-icon-style">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                    Add Yard Area
                  </Button>
                ))}
            </div>
          </div>
          <div>
            <TableSec columns={columns} data={yardAreas} />
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};
