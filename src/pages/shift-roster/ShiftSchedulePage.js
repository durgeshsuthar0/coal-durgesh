import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ShiftFormModal from "./ShiftFormModal";
import { CalendarView } from "./CalendarView";
import axios from "axios";
import { Container, Button, Form, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { format, parseISO, isBefore, isAfter, addDays } from "date-fns";
import {
  getShiftsForEmployee,
  getShiftTypesByYardId,
  saveShifts,
} from "../../services/allServices/shiftRoster";
import { useSelector } from "react-redux";

export const ShiftSchedulePageSec = ({
  isToggled,
  show,
  handleClose,
  onSave,
}) => {
  const { personInfoUuid } = useParams();
  const [shiftTypes, setShiftTypes] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [shifts, setShifts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]); // All employees
  const [selectedEmployees, setSelectedEmployees] = useState([]); // Selected employees
  const navigate = useNavigate();
  const yardUuid = useSelector((state) => state.auth.yardUuid);

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const yardId = useSelector((state) => state.auth.yardUUID);

  // Helper to generate a date range
  const generateDateRange = (start, end) => {
    const dates = [];
    let current = start;

    while (isBefore(current, end) || current.getTime() === end.getTime()) {
      dates.push(format(current, "yyyy-MM-dd"));
      current = addDays(current, 1);
    }
    return dates;
  };

  // Fetch scheduled shifts and extract disabled dates

  useEffect(() => {
    if (show && personInfoUuid) {
      getShiftsForEmployee(personInfoUuid)
        .then((data) => {
          // Generate the scheduled shifts (date ranges)
          const scheduledShifts = data.flatMap((shift) =>
            generateDateRange(
              parseISO(shift.weekStart),
              parseISO(shift.weekEnd)
            )
          );
          setDisabledDates(scheduledShifts.map((date) => parseISO(date)));
        })
        .catch((error) => {
          console.error("Error fetching scheduled shifts:", error);
        });
    }
  }, [show, personInfoUuid]);

  // Generate week-wise data when start and end dates are selected

  useEffect(() => {
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

          // Ensure the weekEnd does not exceed the selected endDate
          if (isAfter(weekEnd, end)) weekEnd.setTime(end.getTime());

          // Generate an array of day names with their respective dates
          const daysInWeek = [];
          let tempDate = new Date(weekStart);

          while (
            isBefore(tempDate, weekEnd) ||
            tempDate.getTime() === weekEnd.getTime()
          ) {
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
            days: daysInWeek, // Store the array of days in the week
          });

          current.setDate(current.getDate() + 7);
        }

        setWeeks(weekArray);
        setCurrentWeek(0);
      }
    }
  }, [startDate, endDate]);
  const [selectedShiftType, setSelectedShiftType] = useState(null); // Track selected shift type

  const handleShiftChange = (shiftType) => {
    setSelectedShiftType(shiftType); // Set selected shift type
    setWeeks((prev) =>
      prev.map((week, index) =>
        index === currentWeek ? { ...week, shiftType } : week
      )
    );
  };

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

  const handleSubmit = async () => {
    // Validate the selected employees
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee.");
      return;
    }

    // Check for invalid dates
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

    // Prepare schedule data
    const scheduleData = selectedEmployees.map((employeeId) => {
      const employee = allEmployees.find((emp) => emp.id === employeeId);

      if (!employee) {
        return {};
      }

      return {
        personInfoUuid: employee.id,
        employee: employee.name,
        weeks: weeks.map((week) => ({
          weekStart: week.weekStart,
          weekEnd: week.weekEnd,
          shiftTypeId: week.shiftType,
          weekOff: week.weekOff,
          yardUuid: yardUuid,
        })),
      };
    });

    try {
      // Call the API to save shifts
      const response = await saveShifts(scheduleData);
      console.log("Shifts saved successfully", response);
      // Optionally handle any UI updates on success
      handleClose();
    } catch (error) {
      console.error("Error saving shifts:", error);
      alert("Failed to save shifts.");
    }
  };

  const handleSaveAllEmployee = () => {
    // Use handleSubmit function to handle the saving process
    handleSubmit();
  };

  const handleNextWeek = () => {
    if (currentWeek < weeks.length - 1) setCurrentWeek(currentWeek + 1);
  };

  const handlePreviousWeek = () => {
    if (currentWeek > 0) setCurrentWeek(currentWeek - 1);
  };

  useEffect(() => {
    if (yardId) {
      getShiftTypesByYardId(yardId)
        .then((data) => {
          console.log("Fetched shift types data:", data);

          if (Array.isArray(data.data)) {
            setShiftTypes(data.data);
          } else {
            console.error("Expected an array of shift types, but got:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching shift types:", error);
        });
    }
  }, [yardId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = [
        { name: "John Doe", id: 1 },
        { name: "Jane Smith", id: 2 },
        { name: "Samuel Green", id: 3 },
        { name: "Chris Brown", id: 4 },
        { name: "Alice Johnson", id: 5 },
      ];
      setAllEmployees(employees);
    };
    fetchEmployees();
  }, []);

  const addShift = (weekData) => {
    const newShifts = weekData.flatMap((week) => {
      const dates = [];
      let currentDate = new Date(week.weekStart);
      const endDate = new Date(week.weekEnd);

      while (currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        const isWeekOff = week.weekOff.includes(
          new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
            currentDate
          )
        );

        dates.push({
          date: formattedDate,
          type: isWeekOff ? "Week-Off" : week.shiftType,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    });

    setShifts([...shifts, ...newShifts]);

    const shiftsToSave = weekData.map((week) => ({
      personInfoUuid,
      shiftTypeId: week.shiftType,
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      weekOff: week.weekOff,
      yardUuid: yardUuid,
    }));

    saveShifts(shiftsToSave)
      .then((response) => {
        console.log("Shifts saved", response.data);
      })
      .catch((error) => console.error("Error saving shifts:", error));
  };
  const handleBack = () => {
    navigate("/pages/person-list");
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
          <div className="form-wrap">
            <div className="title-main mb-3">
              <div className="title-text">
                <h3>
                  {personInfoUuid ? "Shift Monitor" : "Schedule Shift By-Week"}
                </h3>
              </div>
              <div className="right-content d-flex gap-2">
                {personInfoUuid && (
                  <div>
                    <Button
                      onClick={() => setShowModal(true)}
                      className="btn btn-primary label-btn"
                    >
                      <FontAwesomeIcon
                        className="label-btn-icon me-2"
                        icon={faPlus}
                      />
                      Schedule Shift
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div>
              {personInfoUuid ? (
                <CalendarView />
              ) : (
                <div>
                  <div className="pt-2">
                    {" "}
                    <Form>
                      <Row>
                        <Col lg={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Calendar
                              placeholder="YYYY/MM/DD"
                              name="StartDate"
                              className="custom-calendar"
                              value={startDate}
                              onChange={(e) => setStartDate(e.value)}
                              dateFormat="yy-mm-dd"
                              minDate={new Date()}
                              disabledDates={disabledDates} // Dynamically fetched disabled dates
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Calendar
                              placeholder="YYYY/MM/DD"
                              name="EndDate"
                              className="custom-calendar"
                              value={endDate}
                              onChange={(e) => setEndDate(e.value)}
                              dateFormat="yy-mm-dd"
                              minDate={new Date()}
                              selected={endDate}
                              disabledDates={disabledDates}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              )}
            </div>
            <ShiftFormModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              onSave={addShift}
              personInfoUuid={personInfoUuid}
            />
          </div>

          {personInfoUuid ? (
            <CalendarView />
          ) : (
            <div className="mt-3">
              {weeks.length > 0 && (
                <>
                  <div className="form-wrap">
                    <h5 className="text-center mb-0 fs-5 fw-bold bg-yellow text-black py-2 rounded-3">
                      Week : {weeks[currentWeek].weekStart} to{" "}
                      {weeks[currentWeek].weekEnd}
                    </h5>
                    <div className="d-flex justify-content-between align-items-center my-3">
                      <Button
                        onClick={handlePreviousWeek}
                        disabled={currentWeek === 0}
                        type="submit"
                        className="btn btn-style-primary2 label-btn mt-2"
                      >
                        <FontAwesomeIcon
                          className="label-btn-icon ms-2"
                          icon={faArrowLeft}
                        />
                        Prev
                      </Button>
                      <Button
                        onClick={handleNextWeek}
                        disabled={currentWeek === weeks.length - 1}
                        type="submit"
                        className="btn btn-primary label-btn mt-2"
                      >
                        Next
                        <FontAwesomeIcon
                          className="label-btn-icon ms-2"
                          icon={faArrowRight}
                        />
                      </Button>
                    </div>
                    <Row className="mt-3 mb-2">
                      <Col lg={4}>
                        {" "}
                        <Form.Group className="">
                          <Form.Label>Select Employees</Form.Label>
                          <div className="card flex justify-content-center border-0">
                            <MultiSelect
                              value={selectedEmployees}
                              options={allEmployees}
                              onChange={(e) => setSelectedEmployees(e.value)}
                              optionLabel="name"
                              optionValue="id"
                              placeholder="Select Employees"
                              className="custom-select"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg={4}>
                        <Form.Group>
                          <Form.Label>Shift Type</Form.Label>
                          <div className="card flex justify-content-center border-0">
                            <Dropdown
                              value={selectedShiftType} // Bind the selected shift type here
                              onChange={(e) => handleShiftChange(e.value)} // Handle the change
                              options={shiftTypes}
                              optionLabel="shiftName"
                              optionValue="id"
                              placeholder="Select Shift"
                              className="custom-select"
                              required
                              editable
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mt-3">
                      <Form.Label>Week-Off Days</Form.Label>
                      <Row>
                        {weeks[currentWeek].days.map((day) => (
                          <Col className="mb-2" lg={3}>
                            <Form.Check
                              key={day.date}
                              type="checkbox"
                              label={`${day.dayName} (${day.date})`}
                              checked={weeks[currentWeek].weekOff.includes(
                                day.dayName
                              )}
                              onChange={(e) =>
                                handleWeekOffChange(
                                  day.dayName,
                                  e.target.checked
                                )
                              }
                            />
                          </Col>
                        ))}
                      </Row>
                    </Form.Group>
                    <div className="mt-3 d-flex justify-content-between">
                      <Button
                        varient="primary"
                        className="btn-style-primary2"
                        onClick={handleBack}
                      >
                        <FontAwesomeIcon
                          className="label-btn-icon ms-2"
                          icon={faArrowLeft}
                        />
                        Back
                      </Button>
                      <Button variant="primary" onClick={handleSaveAllEmployee}>
                        Save
                        <FontAwesomeIcon
                          className="label-btn-icon ms-2"
                          icon={faArrowRight}
                        />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};
