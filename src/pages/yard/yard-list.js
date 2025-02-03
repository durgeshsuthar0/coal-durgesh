import React, { useState, useMemo } from "react";
import { Container, Button } from "react-bootstrap";
import TableSec from "../../components/table/table";
import Actions from "../../components/table/action";
import Status from "../../components/table/status";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import noData from "../../assets/images/noData.png";

const YardListSec = ({ isToggled }) => {
  const navigate = useNavigate();

  // Dummy yard data
  const dummyYardData = [
    {
      uuid: "1",
      coalYardName: "Yard 1",
      totalCoalCapacity: 50,
      totalCoalSpace: 1000,
      assigned: true,
      id: 1,
    },
    {
      uuid: "2",
      coalYardName: "Yard 2",
      totalCoalCapacity: 60,
      totalCoalSpace: 1200,
      assigned: false,
      id: 2,
    },
    {
      uuid: "3",
      coalYardName: "Yard 3",
      totalCoalCapacity: 40,
      totalCoalSpace: 800,
      assigned: true,
      id: 3,
    },
  ];

  const [yardData, setYardData] = useState(dummyYardData);

  // Navigate to the add yard page
  const handleAdd = () => {
    navigate("/pages/yard-add");
  };

  // Navigate to the edit yard page
  const handleEditClick = (yard) => {
    navigate(`/pages/yard-add/${yard.uuid}`);
  };

  // Navigate to the view yard page
  const handleViewClick = (yard) => {
    navigate(`/pages/yard-view/${yard.uuid}`);
  };

  // Handle yard deletion
  const handleDeleteClick = (yardId) => {
    setYardData((prevYardData) =>
      prevYardData.filter((yard) => yard.id !== yardId)
    );
  };

  // Define the columns for the yard list table
  const columns = useMemo(
    () => [
      {
        Header: "Sr. No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Yard Name",
        accessor: "coalYardName",
      },
      {
        Header: "Number of Containers",
        accessor: "totalCoalCapacity",
      },
      {
        Header: "Yard Capacity (sq. ft.)",
        accessor: "totalCoalSpace",
      },
      {
        Header: "Yard Allotted",
        accessor: "assigned",
        Cell: ({ value }) => (
          <div>
            <Status
              status={value}
              trueMessage="Is Allotted"
              falseMessage="Not Allotted"
              defaultMessage="Maintenance"
            />
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "id",
        Cell: ({ row }) => {
          const yard = row.original;
          return (
            <Actions
              yardId={yard.id}
              onDelete={() => handleDeleteClick(yard.id)}
              onEdit={() => handleEditClick(yard)}
              onView={() => handleViewClick(yard)}
            />
          );
        },
      },
    ],
    [handleDeleteClick, handleEditClick]
  );

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
          <Breadcrumb.Item active>Yard List</Breadcrumb.Item>
        </Breadcrumb>

        <div className="form-wrap">
          <div className="title-main">
            <div className="title-text">
              <h3>Yard List</h3>
            </div>
            <div className="right-content">
              <Button onClick={handleAdd} className="btn btn-primary label-btn">
                <FontAwesomeIcon
                  className="label-btn-icon me-2"
                  icon={faPlus}
                />
                Add Yard
              </Button>
            </div>
          </div>
          <div>
            {yardData.length > 0 ? (
              <TableSec columns={columns} data={yardData} isNotVisible={true} />
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
      </Container>
    </div>
  );
};

export default YardListSec;
