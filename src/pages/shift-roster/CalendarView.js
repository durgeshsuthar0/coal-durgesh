import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import { useSelector } from "react-redux";
import { useShifts } from "../../hook/useShiftTypes"; 
import { updateShift } from "../../services/allServices/shiftRoster"; // Import updateShift

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [selectedShiftDetails, setSelectedShiftDetails] = useState(null);
  const [shiftDates, setShiftDates] = useState([]);

  const { id } = useParams();
  const yardId = useSelector((state) => state.auth.yardUUID);

  const { shiftTypes, shifts, loading, error } = useShifts(yardId, id);

  // Process the shifts
  useEffect(() => {
    if (shifts && shifts.length > 0) {
      const shiftDates = [];
      shifts.forEach((shift) => {
        const startDate = new Date(shift.weekStart);
        const endDate = new Date(shift.weekEnd);
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          currentDate.setHours(0, 0, 0, 0);
          const formattedDate = currentDate.toISOString().split("T")[0];

          const isWeekOff = shift.weekOff.includes(getDayOfWeek(currentDate));

          shiftDates.push({
            date: formattedDate,
            type: isWeekOff ? "Week Off" : shift.shiftType,
            startTime: `${shift.shiftStartTime[0].toString().padStart(2, "0")}:${shift.shiftStartTime[1].toString().padStart(2, "0")}`,
            endTime: `${shift.shiftEndTime[0].toString().padStart(2, "0")}:${shift.shiftEndTime[1].toString().padStart(2, "0")}`,
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      setShiftDates(shiftDates);
    }
  }, [shifts]);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Define the formatTime function here
  const formatTime = (time) => {
    return `${String(time[0]).padStart(2, "0")}:${String(time[1]).padStart(2, "0")}`;
  };

  const handleDateSelect = (date) => {
    const formattedSelectedDate = formatDate(date);
    const matchingShift = shiftDates.find((shift) => shift.date === formattedSelectedDate);

    setSelectedDate(formattedSelectedDate);
    setSelectedShiftDetails(matchingShift || { type: "No Shift" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedShiftId(null);
  };

  const handleSubmitShift = async () => {
    if (selectedShiftId && selectedDate) {
      const shiftDetails = {
        selectedDate: selectedDate,
        shiftId: selectedShiftId,
        personInfoUuid: id,
        yardId: yardId,
      };

      try {
        await updateShift(shiftDetails);
        alert("Shift updated successfully.");
        handleCloseModal();
      } catch (error) {
        alert("Failed to update shift. Please try again.");
        console.error("Error updating shift:", error);
      }
    } else {
      alert("Please select a shift.");
    }
  };

  const dropdownOptions = shiftTypes.map((shift) => ({
    id: shift.id,
    name: `${shift.shiftName} (${formatTime(shift.shiftStartTime)} - ${formatTime(shift.shiftEndTime)})`,
  }));

  const renderTileContent = ({ date }) => {
    const formattedDate = formatDate(date);
    const shift = shiftDates.find((shift) => shift.date === formattedDate);

    if (!shift) return null;

    return (
      <div className={`mt-2 shift-content d-flex align-items-center justify-content-between ${getShiftClass(shift.type)}`}>
        <span className="shift-type">{shift.type}</span>
        <span className="shift-time">{shift.startTime} - {shift.endTime}</span>
      </div>
    );
  };

  const getShiftClass = (shiftType) => {
    switch (shiftType) {
      case "Evening Shift":
        return "bg-evening-shift text-white";
      case "Week Off":
        return "bg-danger text-white";
      case "Night Shift":
        return "bg-night-shift text-white";
      default:
        return "";
    }
  };

  const getTileClass = ({ date }) => {
    const formattedDate = formatDate(date);
    const shift = shiftDates.find((shift) => shift.date === formattedDate);
    const dayOfWeek = date.getDay();

    if (shift?.type === "Week Off") return "week-off-date";
    if (shift?.type === "Evening Shift") return "evening-date";
    if (shift?.type === "Night Shift") return "night-date";
    return dayOfWeek === 0 || dayOfWeek === 6 ? "weekend-date" : "regular-date";
  };

  // Function to get the day of the week as a string
  const getDayOfWeek = (date) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="custom-calender d-flex justify-content-center">
        <Calendar
          onClickDay={handleDateSelect}
          tileContent={renderTileContent}
          tileClassName={getTileClass}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header className="bg-primary text-white">
          <Modal.Title className="fs-5 fw-bold">Update Shift</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-1">
            <p>
              <strong>Date:</strong> {selectedDate}
            </p>
            <p>
              <strong>Current Shift Type:</strong> {selectedShiftDetails?.type}
            </p>
            <p>
              <strong>Shift Time:</strong> {selectedShiftDetails?.startTime && selectedShiftDetails?.endTime
                ? `${selectedShiftDetails.startTime} - ${selectedShiftDetails.endTime}`
                : "N/A"}
            </p>
          </div>
          <Form>
            <Form.Group>
              <Form.Label>Update Shift Type</Form.Label>
              <div className="card flex justify-content-center border-0">
                <Dropdown
                  value={selectedShiftId}
                  onChange={(e) => setSelectedShiftId(e.value)}
                  options={dropdownOptions}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Shift"
                  className="custom-select w-full md:w-14rem"
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitShift}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
