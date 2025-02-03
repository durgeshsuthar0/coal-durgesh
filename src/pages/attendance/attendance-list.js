import React, { useState, useMemo, useEffect } from "react";
import { Col, Container, Row, Button, Modal } from "react-bootstrap";
import TableSec from "../../components/table/table";
import Status from "../../components/table/status";
import Actions from "../../components/table/action";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useAttendance } from "../../hook/useAttendance";
import noData from "../../assets/images/noData.png";

export const AttendanceListSec = ({ isToggled }) => {
  const navigate = useNavigate();
  const [attandanceData, setAttendanceData] = useState([]);
  const personInfoId = useSelector((state) => state.auth.id);

  const { fetchAllAttendance } = useAttendance([]);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const response = await fetchAllAttendance(personInfoId);
      if (response && response.data && Array.isArray(response.data)) {
        setAttendanceData(response.data);
        console.warn(attandanceData);
      } else {
        console.error("Fetched data is not an array:", response);
        setAttendanceData([]);
      }
    } catch (error) {
      console.error("Error fetching yards:", error);
      setAttendanceData([]);
    }
  };

  const role = useSelector((state) => state.auth.roleName);
 
  const columns = useMemo(
    () => [
      {
        Header: "Sr. No",
        accessor: "sr",
        Cell: ({ row }) => row.index + 1,
      },

      {
        Header: "Date",
        accessor: "date",
      },

      {
        Header: "Check In Time",
        accessor: "checkInTime",
      },

      {
        Header: "Check Out Time",
        accessor: "checkOutTime",
      },

      {
        Header: "Status",
        accessor: "status",
      },

      {
        Header: "Working Hours",
        accessor: "workingHours",
      },
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
    []
  );

  const data = useMemo(
    () =>
      attandanceData.map((attendance, index) => ({
        sr: index + 1,
        date: attendance.date,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        status: attendance.status,
        workingHours: attendance.todayHours,
        notes: attendance.notes,
        // status: (
        //   <Status
        //     status={
        //       attendance.status === "Present" ||
        //       attendance.status === "Late" ||
        //       attendance.status === "Half-Day"
        //     }
        //     trueMessage={
        //       attendance.status === "Present"
        //         ? "Present"
        //         : attendance.status === "Late"
        //         ? "Late"
        //         : "Half-Day"
        //     }
        //     falseMessage={
        //       attendance.status === "Leave" ? "Leave" : "Early"
        //     }
        //     defaultMessage="Maintenance"
        //   />
        // ),
        action: (
          <Actions
            onView={() => handleViewClick()}
          />
        ),
      })),
    [attandanceData]
  );

  
  const handleViewClick = () => {
    navigate(`/pages/attendance-view`);
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
            <Breadcrumb.Item active>attendance</Breadcrumb.Item>
          </Breadcrumb>
          <div className="title">
            <div className="d-flex justify-content-between align-items-center text-start">
              <h2 className="mb-0">attendance</h2>
          
            </div>
          </div>
          {attandanceData.length > 0 ? (
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
        </Container>
      </div>
    </React.Fragment>
  );
};
