import React, { useState, useMemo, useEffect } from "react";
import { Col, Container, Row, Button, Modal } from "react-bootstrap";
import TableSec from "../../components/table/table";
import Status from "../../components/table/status";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faHouseChimney,
  faRotate,
  faArrowRight,
  faTrashAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { SealCheck } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Actions from "../../components/table/action";
import noData from "../../assets/images/noData.png";

export const PersonListSec = ({ isToggled }) => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [personsData, setPersonsData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);

  const handleAdd = () => {
    navigate("/pages/person-add");
  };

  const handleDeleteClick = () => {
    if (personToDelete) {
      setPersonsData(
        personsData.filter((person) => person.uuid !== personToDelete.uuid)
      );
      setModalMessage("User deleted successfully!");
      setIsError(false);
      setShow(true);
      setShowDeleteModal(false);
    }
  };

  const handleShiftRosterClick = (person) => {
    navigate(`/pages/shift-roster/${person.uuid}`);
  };

  const columns = useMemo(
    () => [
      { Header: "Sr. No", accessor: "sr" },
      { Header: "Username", accessor: "userName" },
      { Header: "Email Address", accessor: "email" },
      { Header: "Contact Number", accessor: "contactNumber" },
      { Header: "Created Date", accessor: "createdDate" },
      { Header: "Role", accessor: "roleNames" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Actions",
        accessor: "action",
        Cell: ({ row }) => {
          const person = row.original;
          return (
            <Actions
              onEdit={() => handleEditClick(person)}
              onView={() => handleViewClick(person)}
              onDelete={() => {
                setPersonToDelete(person);
                setShowDeleteModal(true);
              }}
              onShiftRoster={() => handleShiftRosterClick(person)}
            />
          );
        },
      },
    ],
    []
  );

  const handleShift = () => {
    navigate("/pages/shift-roster");
  };

  useEffect(() => {
    // Dummy data
    const dummyData = [
      {
        sr: 1,
        uuid: "1",
        email: "johndoe@example.com",
        userName: "John Doe",
        contactNumber: "1234567890",
        createdDate: "01/01/2022",
        roleNames: "Admin",
        status: <Status status={true} trueMessage="Active" falseMessage="Inactive" />,
        action: (
          <Actions
            onEdit={() => handleEditClick({ uuid: "1" })}
            onView={() => handleViewClick({ uuid: "1" })}
            onDelete={() => {
              setPersonToDelete({ uuid: "1" });
              setShowDeleteModal(true);
            }}
            onShiftRoster={() => handleShiftRosterClick({ uuid: "1" })}
          />
        ),
      },
      {
        sr: 2,
        uuid: "2",
        email: "janedoe@example.com",
        userName: "Jane Doe",
        contactNumber: "0987654321",
        createdDate: "02/01/2022",
        roleNames: "User",
        status: <Status status={false} trueMessage="Active" falseMessage="Inactive" />,
        action: (
          <Actions
            onEdit={() => handleEditClick({ uuid: "2" })}
            onView={() => handleViewClick({ uuid: "2" })}
            onDelete={() => {
              setPersonToDelete({ uuid: "2" });
              setShowDeleteModal(true);
            }}
            onShiftRoster={() => handleShiftRosterClick({ uuid: "2" })}
          />
        ),
      },
    ];

    setPersonsData(dummyData);
  }, []);

  const handleEditClick = (person) => {
    if (person) {
      navigate(`/pages/person-add/${person.uuid}`);
    }
  };

  const handleViewClick = (person) => {
    if (person) {
      navigate(`/pages/person-view/${person.uuid}`);
    }
  };

  const filteredData = useMemo(() => {
    let dataToFilter = personsData;

    if (filter === "Active") {
      dataToFilter = dataToFilter.filter((person) => person.status === "Active");
    } else if (filter === "Not Active") {
      dataToFilter = dataToFilter.filter((person) => person.status === "Inactive");
    }

    if (searchTerm) {
      dataToFilter = dataToFilter.filter(
        (person) =>
          person.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return dataToFilter;
  }, [filter, searchTerm, personsData]);

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
            <Breadcrumb.Item active>User Management</Breadcrumb.Item>
          </Breadcrumb>
          <div className="form-wrap">
            <div className="title-main">
              <div className="title-text">
                <h3>User Management</h3>
              </div>
              <div className="right-content d-flex gap-2">
                <Button
                  onClick={handleShift}
                  className="btn btn-primary label-btn"
                >
                  <FontAwesomeIcon className="label-btn-icon" icon={faClock} />
                </Button>
                <Button
                  onClick={handleAdd}
                  className="btn btn-primary label-btn"
                >
                  <FontAwesomeIcon
                    className="label-btn-icon me-2"
                    icon={faPlus}
                  />
                  Add User
                </Button>
              </div>
            </div>
            <div>
              {filteredData.length > 0 ? (
                <TableSec columns={columns} data={filteredData} />
              ) : (
                <div className="d-flex justify-content-center">
                  <img
                    className="noData-Img"
                    src={noData}
                    alt="No Data Available"
                  />
                </div>
              )}
            </div>
          </div>

          <Modal
            centered
            show={show}
            onHide={handleClose}
            className="success-modal"
          >
            <Modal.Body>
              <Modal.Title className="fs-6 text-black text-center">
                <SealCheck
                  size={50}
                  className={
                    isError
                      ? "text-danger d-block mx-auto mb-2"
                      : "text-success d-block mx-auto mb-2"
                  }
                />
                {modalMessage}
              </Modal.Title>
              {!isError && (
                <Button
                  type="submit"
                  variant="primary"
                  className="btn-style-primary mt-3 mx-auto"
                  onClick={handleClose}
                >
                  <div className="btn-icon-style">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  Close
                </Button>
              )}
            </Modal.Body>
          </Modal>

          <Modal
            centered
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            className="delete-modal"
          >
            <Modal.Body>
              <Modal.Title className="fs-6 text-black text-center">
                Are you sure you want to delete this user?
              </Modal.Title>
              <div className="d-flex justify-content-center mt-3">
                <Button
                  variant="danger"
                  className="btn-style-primary mr-2"
                  onClick={handleDeleteClick}
                >
                  Yes, Delete
                </Button>
                <Button
                  variant="secondary"
                  className="btn-style-primary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
