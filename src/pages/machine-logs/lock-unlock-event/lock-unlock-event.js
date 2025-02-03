import React, { useState, useEffect, useMemo } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import TableSec from "../../../components/table/table";
import Status from "../../../components/table/status";
import Actions from "../../../components/table/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests
import { useSelector } from 'react-redux';
import ImageModal from "./ImageModal";

export const LockUnlockSec = ({ isToggled }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // State to hold the fetched data
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image URL
  const yardId = 1;

  function getUrls() {
    const isProduction = process.env.REACT_APP_ENV === "production";

    const WebSocketURL = isProduction
      ? process.env.REACT_APP_WEBSOCKET_PRODUCTION_URL
      : process.env.REACT_APP_WEBSOCKET_DEVLOPMENT_URL;

    const RestUrl = isProduction
      ? process.env.REACT_APP_PRODUCTION_URL
      : process.env.REACT_APP_DEVLOPMENT_URL;

    return { WebSocketURL, RestUrl };
  }

  const { WebSocketURL, RestUrl } = getUrls();

  // Function to open the modal with the selected image
  const handleImageClick = (imagePath) => {
    setSelectedImage(RestUrl + `images/${imagePath}`);
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        Header: "Sr",
        accessor: "sr",
      },

      {
        Header: "Yard ID",
        accessor: "yardId",
      },

      {
        Header: "Device Id",
        accessor: "deviceId",
      },
      {
        Header: "Latitude",
        accessor: "latitude",
      },
      {
        Header: "Longitude",
        accessor: "longitude",
      },
      {
        Header: "Time",
        accessor: "time",
      },
      // {
      //   Header: "Status",
      //   accessor: "status",
      // },
      {
        Header: "Height",
        accessor: "height",
      },
      {
        Header: "Tag ID",
        accessor: "tagId",
      },
      {
        Header: "RTCM Data Format",
        accessor: "rtcm",
      },
      {
        Header: "Image",
        accessor: "imageName",
      },
      {
        Header: "Event",
        accessor: "lockFlag",
        Cell: ({ value }) => (
          <span style={{ color: value === "Unlock" ? "red" : "green" }}>
            {value}
          </span>
        ),
      },
    ],

    []
  );

  const handleAdd = () => {
    navigate("/pages/container-form");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${RestUrl}lock-event?yardId=${yardId}`);

        const formattedData = response.data.map((entity, index) => ({
          sr: index + 1,
          yardId: entity.yardId,
          latitude: entity.latitude,
          longitude: entity.longitude,
          time: entity.timestamp,
          deviceId: entity.yardId,
          lockFlag: entity.lockflag ? "Lock" : "Unlock", // Conditionally set "Lock" or "Unlock"
          height: entity.height,
          tagId: entity.tagId,
          rtcm: entity.rtcm,
          imageName: (
            <Button
              variant="link"
              onClick={() => handleImageClick(entity.imagePath)}
            >
              View Image
            </Button>
          ),
          action: <Actions />,
        }));
        setData(formattedData); // Set the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const socket = new WebSocket(WebSocketURL + "lock-event"); // Replace with your WebSocket endpoint

    socket.onopen = () => {
    };

    socket.onmessage = (event) => {
      try {
        const newEntity = JSON.parse(event.data);

        // Check if the new entity's yardId matches the selected yardId
        if (newEntity.yardId === yardId) {
          // Format the new data
          const newEntry = {
            sr: 1, // New data always gets 1
            latitude: newEntity.latitude,
            longitude: newEntity.longitude,
            time: newEntity.timestamp,
            deviceId: newEntity.deviceId,
            lockFlag: newEntity.lockflag ? "Lock" : "Unlock",
            sequenceId: newEntity.seqid,
            tagId: newEntity.tagid,
            height: newEntity.height,
            rtcm: newEntity.rtcm,

            imageName: (
              <Button
                variant="link"
                onClick={() => handleImageClick(newEntity.imagePath)}
              >
                View Image
              </Button>
            ),
            action: <Actions />,
          };

          // Prepend the new entry and reassign serial numbers
          setData((prevData) => [
            newEntry,
            ...prevData.map((item, index) => ({
              ...item,
              sr: index + 2, // Adjust serial numbers for existing items
            })),
          ]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };


    socket.onclose = () => {
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []); // Empty dependency array to run only once when the component mounts

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
          <div className="d-flex justify-content-between mt-5 mb-2 text-start">
            <h3 className="fs-4">Container Transaction Report</h3>
          </div>
          <div>
            <TableSec columns={columns} data={data} />
          </div>
        </Container>
        {/* Use the ImageModal Component */}
        <ImageModal
          show={showModal}
          handleClose={handleCloseModal}
          imageUrl={selectedImage}
        />
      </div>
    </React.Fragment>
  );
};
