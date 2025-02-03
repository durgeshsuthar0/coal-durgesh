import React, { useEffect, useState, useMemo } from "react";
import { Container, Button } from "react-bootstrap";
import TableSec from "../../components/table/table";
import Actions from "../../components/table/action";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useIOTDevice } from "../../hook/useIotDevice";
import Status from "../../components/table/status";
import noData from "../../assets/images/noData.png";
import Swal from "sweetalert2";

export const IotDeviceListSec = ({ isToggled }) => {
  const navigate = useNavigate();
  const [iotDeviceList, setIotDeviceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchIOTDeviceByYardAndStatus, DeleteIotDeviceData } = useIOTDevice();
  const personUUID = useSelector((state) => state.auth.personUUID);
  const roleId = useSelector((state) => state.auth.roleId);

  useEffect(() => {
    const loadIotDeviceList = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchIOTDeviceByYardAndStatus(personUUID);
        setIotDeviceList(data);
      } catch (err) {
        setError("Failed to load IoT device list");
      } finally {
        setLoading(false);
      }
    };

    if (personUUID) {
      loadIotDeviceList();
    }
  }, [personUUID]);

  const columns = useMemo(
    () => [
      { Header: "Sr. No", accessor: "sr" },
      { Header: "Device Name", accessor: "name" },
      {
        Header: "Assigned Status",
        accessor: "assignedStatus",
        Cell: ({ value }) => (value ? "Assigned" : "Unassigned"),
      },
      { Header: "Device Serial Number", accessor: "serialNumber" },
      { Header: "Manufacturer Name", accessor: "manufactureName" },
      {
        Header: "Status",
        accessor: "isActive",
      },
      {
        Header: "Actions",
        accessor: "action",
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <Actions
              onView={() => handleViewClick(original)}
              onEdit={() => handleEditClick(original)}
              onDelete={() => handleDeleteClick(original)}
              showEdit={true}
              showDelete={true}
            />
          );
        },
      },
    ],
    []
  );

  const data = useMemo(
    () =>
      iotDeviceList.map((iotDevice, index) => ({
        sr: index + 1,
        name: iotDevice.deviceName,
        assignedStatus: iotDevice.assigned,
        devicetype: iotDevice.deviceType,
        serialNumber: iotDevice.serialNumber,
        manufactureName: iotDevice.manufactureName,
        isActive: (
          <Status
            status={iotDevice.deviceStatus}
            trueMessage="Active"
            falseMessage="Inactive"
          />
        ),
        id: iotDevice.id,
        uuid: iotDevice.uuid,
        action: {},
      })),
    [iotDeviceList]
  );

  const handleEditClick = (device) => {
    navigate(`/pages/iot-device-add/${device.uuid}`);
  };

  const handleViewClick = (device) => {
    navigate(`/pages/iot-device-view/${device.uuid}`);
  };

  const handleAdd = () => {
    navigate("/pages/iot-device-add");
  };

  const handleDeleteClick = (device) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await DeleteIotDeviceData(device.uuid);

          if (response && response.status === true && response.code === 200) {
            Swal.fire("Deleted!", "The IoT device has been deleted.", "success");
            setIotDeviceList((prevList) =>
              prevList.filter((iotDevice) => iotDevice.uuid !== device.uuid)
            );
          } else {
            Swal.fire("Failed!", response.message || "There was an issue deleting the IoT device.", "error");
          }
        } catch (err) {
          console.error("Error deleting IoT device:", err);
          Swal.fire("Error!", "An error occurred while deleting the IoT device.", "error");
        }
      }
    });
  };

  return (
    <React.Fragment>
      <div className={isToggled ? "inner-content p-3 expand-inner-content" : "inner-content p-3"}>
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/pages/dashboard">
              <FontAwesomeIcon icon={faHouseChimney} />
            </Breadcrumb.Item>
            <Breadcrumb.Item active>IOT Device List</Breadcrumb.Item>
          </Breadcrumb>
          <div className="title">
            <div className="d-flex justify-content-between align-items-center text-start">
              <h2 className="mb-0">IOT Device List</h2>
              {/* Conditionally render the Add Device button based on roleId */}
              {roleId !== "1" && (
                <Button onClick={handleAdd} variant="light" className="btn-style">
                  <div className="btn-icon-style">
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                  <span className="d-none d-lg-block d-md-block">Add Devices</span>
                </Button>
              )}
            </div>
          </div>
          {iotDeviceList.length > 0 ? (
            <TableSec columns={columns} data={data} />
          ) : (
            <div className="form-wrap d-flex justify-content-center">
              <img className="noData-Img" src={noData} alt="No Data Available" />
            </div>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};
