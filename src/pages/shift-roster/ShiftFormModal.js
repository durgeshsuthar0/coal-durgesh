import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { format, parseISO, isBefore, isAfter, addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "primereact/calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "primereact/dropdown";
import { useShifts } from "../../hook/useShiftTypes";
import { useSelector } from "react-redux";


const ShiftFormModal = ({ show, handleClose, onSave, personInfoUuid }) => {
  const [weeks, setWeeks] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);

  const yardId = useSelector((state) => state.auth.yardUUID);
  const { shiftTypes, loading, error } = useShifts(yardId);

  const generateDateRange = (start, end) => {
    const dates = [];
    let current = start;

    while (isBefore(current, end) || current.getTime() === end.getTime()) {
      dates.push(format(current, "yyyy-MM-dd"));
      current = addDays(current, 1);
    }
    return dates;
  };

  useEffect(() => {
    if (show && personInfoUuid) {
      const mockScheduledShifts = [
        { weekStart: "2025-01-01", weekEnd: "2025-01-07" },
        { weekStart: "2025-01-08", weekEnd: "2025-01-14" },
      ];

      const scheduledShifts = mockScheduledShifts.flatMap((shift) =>
        generateDateRange(parseISO(shift.weekStart), parseISO(shift.weekEnd))
      );
      setDisabledDates(scheduledShifts.map((date) => parseISO(date)));
    }
  }, [show, personInfoUuid]);

  useEffect(() => {
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    if (startDate && endDate) {
      const start = startDate;
      const end = endDate;

      if (isBefore(start, end)) {
        const weekArray = [];
        let current = new Date(start);

        while (isBefore(current, end) || current.getTime() === end.getTime()) {
          const weekStart = new Date(current);
          const weekEnd = new Date(current);
          weekEnd.setDate(current.getDate() + 6);

          if (isAfter(weekEnd, end)) weekEnd.setTime(end.getTime());

          const daysInWeek = [];
          let tempDate = new Date(weekStart);

          while (isBefore(tempDate, weekEnd) || tempDate.getTime() === weekEnd.getTime()) {
            daysInWeek.push({
              dayName: format(tempDate, "EEEE"),
              date: format(tempDate, "yyyy/MM/dd"),
            });
            tempDate.setDate(tempDate.getDate() + 1);
          }

          weekArray.push({
            weekStart: format(weekStart, "yyyy-MM-dd"),
            weekEnd: format(weekEnd, "yyyy-MM-dd"),
            shiftType: "",
            weekOff: [],
            days: daysInWeek,
          });

          current.setDate(current.getDate() + 7);
        }

        setWeeks(weekArray);
        setCurrentWeek(0);
      }
    }
  }, [startDate, endDate]);

  useEffect(() => {
  }, [shiftTypes]);

  const handleShiftChange = (shiftType) => {
    console.log("Selected Shift Type:", shiftType);
    setWeeks((prev) =>
      prev.map((week, index) =>
        index === currentWeek ? { ...week, shiftType } : week
      )
    );
  };

  // Handler to toggle week-off days for the current week
  const handleWeekOffChange = (day, checked) => {
    setWeeks((prev) =>
      prev.map((week, index) =>
        index === currentWeek
          ? {
            ...week,
            weekOff: checked
              ? [...week.weekOff, day]
              : week.weekOff.filter((d) => d !== day),
          }
          : week
      )
    );
  };

  // Handler to save selected shifts
  const handleSave = () => {
    const invalidDates = weeks.flatMap((week) =>
      disabledDates.filter(
        (date) =>
          (isAfter(date, new Date(week.weekStart)) ||
            date.getTime() === new Date(week.weekStart).getTime()) &&
          (isBefore(date, new Date(week.weekEnd)) ||
            date.getTime() === new Date(week.weekEnd).getTime())
      )
    );

    if (invalidDates.length > 0) {
      alert("Some dates are already scheduled. Please adjust the schedule.");
      return;
    }

    onSave(weeks);
    handleClose();
  };

  // Handlers for navigating between weeks
  const handleNextWeek = () => {
    if (currentWeek < weeks.length - 1) setCurrentWeek(currentWeek + 1);
  };

  const handlePreviousWeek = () => {
    if (currentWeek > 0) setCurrentWeek(currentWeek - 1);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title className="fs-5 fw-bold">Schedule Shifts by-Week</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Start Date</Form.Label>
            <Col sm={9}>
              <Calendar
                placeholder="YYYY/MM/DD"
                name="StartDate"
                className="custom-calendar"
                value={startDate}
                onChange={(e) => setStartDate(e.value)}
                dateFormat="yy-mm-dd"
                minDate={new Date()}
                disabledDates={disabledDates}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>End Date</Form.Label>
            <Col sm={9}>
              <Calendar
                placeholder="YYYY/MM/DD"
                name="EndDate"
                className="custom-calendar"
                value={endDate}
                onChange={(e) => setEndDate(e.value)}
                dateFormat="yy-mm-dd"
                selected={endDate}
                disabledDates={disabledDates}
              />
            </Col>
          </Form.Group>
          {weeks.length > 0 && (
            <>
              <div className="bg-primary p-2 rounded-2">
                <h5 className="text-white mb-0 fs-6 fw-bold">
                  Week : {weeks[currentWeek].weekStart} to {weeks[currentWeek].weekEnd}
                </h5>
              </div>
              <div className="d-flex justify-content-between align-items-center my-3">
                <Button
                  variant="primary"
                  className="btn-sm"
                  onClick={handlePreviousWeek}
                  disabled={currentWeek === 0}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Week
                </Button>
                <Button
                  variant="primary"
                  className="btn-sm"
                  onClick={handleNextWeek}
                  disabled={currentWeek === weeks.length - 1}
                >
                  Week <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </div>

              <Form.Group>
                <Form.Label>Shift Type</Form.Label>
                <div className="card flex justify-content-center border-0">
                  <Dropdown
                    value={weeks[currentWeek].shiftType}
                    onChange={(e) => handleShiftChange(e.value)}
                    options={shiftTypes}
                    optionLabel="shiftName"
                    optionValue="id"
                    placeholder="Select Shift"
                    className="custom-select w-full md:w-14rem"
                  />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Week-Off Days</Form.Label>
                {weeks[currentWeek].days.map((day) => (
                  <Form.Check
                    key={day.date}
                    type="checkbox"
                    label={`${day.dayName} (${day.date})`}
                    checked={weeks[currentWeek].weekOff.includes(day.dayName)}
                    onChange={(e) =>
                      handleWeekOffChange(day.dayName, e.target.checked)
                    }
                  />
                ))}
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShiftFormModal;



