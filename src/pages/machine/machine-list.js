import React, { useEffect, useState, useMemo } from "react";
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import TableSec from "../../components/table/table";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useMachine } from "../../hook/useMachine";
import { useSelector } from "react-redux";
import Actions from "../../components/table/action";
import Status from "../../components/table/status";
import noData from "../../assets/images/noData.png";

export const MachineListSec = ({ isToggled }) => {
  const navigate = useNavigate();

  const [machineList, setMachineList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [assignmentStatus, setAssignmentStatus] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const roleId = useSelector((state) => state.auth.roleId);
  const personUUID = useSelector((state) => state.auth.personUUID);

  const { fetchMachineByYard, fetchMachineAssignmentStatus, removeMachine } =
    useMachine();

  useEffect(() => {
    const loadMachineList = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMachineByYard(personUUID);
        setMachineList(data);

        const statusPromises = data.map(async (machine) => {
          return { id: machine.id };
        });

        const statuses = await Promise.all(statusPromises);
        const statusMap = {};
        statuses.forEach((status) => {
          statusMap[status.id] = status.assigned;
        });

        setAssignmentStatus(statusMap);
      } catch (err) {
        setError("Failed to load machine list");
        console.error("Error loading machine list:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMachineList();
  }, [personUUID]);

  const columns = useMemo(
    () => [
      { Header: "Sr. No", accessor: "sr" },
      { Header: "Machine Name", accessor: "machineLogicalName" },
      { Header: "Machine Type", accessor: "machineTypeName" },
      { Header: "Machine ID/Code", accessor: "machineid" },
      { Header: "License Plate Number", accessor: "licensePlateNumber" },
      { Header: "Status", accessor: "isAssigned" },
      {
        Header: "Actions",
        accessor: "action",
        Cell: ({ row }) => {
          const machine = row.original;
          return (
            <Actions
              onEdit={() => handleEditClick(machine)}
              onView={() => handleViewClick(machine)}
              onDelete={() => handleDeleteClick(machine)}
              roleId={roleId}
            />
          );
        },
      },
    ],
    [roleId, assignmentStatus]
  );

  const handleEditClick = (machine) => {
    navigate(`/pages/machine-add/${machine.uuid}`);
  };

  const handleViewClick = (machine) => {
    navigate(`/pages/machine-view/${machine.uuid}`);
  };

  const handleDeleteClick = (machine) => {
    setSelectedMachine(machine);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedMachine) {
      try {
        await removeMachine(selectedMachine.uuid);
        setMachineList((prevList) =>
          prevList.filter((machine) => machine.uuid !== selectedMachine.uuid)
        );
        setShowDeleteModal(false);
      } catch (err) {
        console.error("Error deleting machine:", err);
      }
    }
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setSelectedMachine(null);
  };

  const data = useMemo(
    () =>
      machineList.map((machine, index) => ({
        sr: index + 1,
        machineLogicalName: machine.machineLogicalName,
        machineTypeName: machine.machineTypeName,
        machineid: machine.modelNumber,
        licensePlateNumber: machine.licensePlateNumber,
        isAssigned: (
          <Status
            status={machine.assigned}
            trueMessage="Allotted"
            falseMessage="Not Allotted"
            defaultMessage="Maintenance"
          />
        ),
        id: machine.id,
        uuid: machine.uuid,
      })),
    [machineList]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading machine list: {error}</div>;
  }

  return (
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
          <Breadcrumb.Item active>Machine List</Breadcrumb.Item>
        </Breadcrumb>
        <div className="form-wrap">
          <div className="title-main">
            <div className="title-text">
              <h3>Machine List</h3>
            </div>
            <div className="right-content d-flex gap-2">
              {(roleId === "1" || roleId === "2" || roleId === "3") && (
                <Button
                  onClick={() => navigate("/pages/machine-add")}
                  className="btn btn-primary label-btn"
                >
                  <FontAwesomeIcon
                    className="label-btn-icon me-2"
                    icon={faPlus}
                  />
                  Add Machine
                </Button>
              )}
            </div>
          </div>

          <div>
            {data.length > 0 ? (
              <TableSec columns={columns} data={data} />
            ) : (
              <div className="form-wrap d-flex justify-content-center">
                <img
                  className="noData-Img"
                  src={noData}
                  alt="No Data Available"
                />
              </div>
            )}
          </div>

          <Modal show={showDeleteModal} onHide={handleDeleteClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this machine? This action cannot
              be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleDeleteClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Container>
    </div>
  );
};
