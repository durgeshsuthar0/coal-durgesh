import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { Footer } from "../components/footer";
import { Dashboard, MachineDashboard } from "../pages/dashboard";
import { MachineAdd, MachineAssign, MachineView, MachineList } from "../pages/machine";
import { YardAreaAdd, YardAreaView, YardAreaList, YardAreaOverview } from "../pages/yard-area";
import { PersonForm, PersonView, PersonList } from "../pages/person";
import { IotDeviceAdd, IotDeviceView, IotDeviceList } from "../pages/iot-devices";
import { Yardform, YardList, YardView } from "../pages/yard";
import { TagInventoryList } from "../pages/tag-Inventory";
import { TagForm } from "../pages/tag-Inventory";
import { useSelector } from "react-redux";
import { LogList } from "../pages/report-logs";
import { LogForm } from "../pages/container-logs";
import { EntryLogView } from "../pages/container-logs";
import { EntryLogList } from "../pages/container-logs";
import { ExitLogList } from "../pages/container-logs";
import { ExitLogView } from "../pages/container-logs";
import { JobHistory, AssignJob, UpcomingJobDetails } from "../pages/job-management";
import { AttendanceList } from "../pages/attendance";
import { AttendanceAdd, AttendanceView } from "../pages/attendance";
import { YardMapView } from "../pages/map-view";
import { LeaveManagement } from "../pages/leave-management";
import { LockUnlockEvent } from "../pages/machine-logs/lock-unlock-event";
import { EngineEvent } from "../pages/machine-logs/engine-event";
import { ShiftSchedulePage } from "../pages/shift-roster";
import { CalendarView } from "../pages/shift-roster/CalendarView";


export const MainView = () => {
  const [isToggled, setIsToggled] = useState(false);
  const role = useSelector((state) => state.auth.roleName);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    let localValue = { isToggled: !isToggled };
    localStorage.setItem("layout", JSON.stringify(localValue));
  };
  return (
    <React.Fragment>
      <Header isToggled={isToggled} handleToggle={handleToggle} />
      <Sidebar isToggled={isToggled} handleToggle={handleToggle} />
      <Routes>
        <Route path="/*" element={<Dashboard isToggled={isToggled} />}></Route>
        <Route path="/logs" element={<LogList isToggled={isToggled} />}></Route>
        <Route
          path="/yard-area-overview"
          element={<YardAreaOverview isToggled={isToggled} />}
        ></Route>
        <Route
          path="/container-view/:id"
          element={<EntryLogView isToggled={isToggled} />}
        ></Route>
        <Route
          path="/machine-list"
          element={<MachineList isToggled={isToggled} />}
        ></Route>
        <Route
          path="/machine-add"
          element={<MachineAdd isToggled={isToggled} />}
        ></Route>
        <Route
          path="/machine-add/:id"
          element={<MachineAdd isToggled={isToggled} />}
        ></Route>
        <Route
          path="/machine-view/:id"
          element={<MachineView isToggled={isToggled} />}
        ></Route>
        <Route
          path="/iot-device-list"
          element={<IotDeviceList isToggled={isToggled} />}
        ></Route>
        <Route
          path="/iot-device-add"
          element={<IotDeviceAdd isToggled={isToggled} />}
        ></Route>
        <Route
          path="/iot-device-add/:id"
          element={<IotDeviceAdd isToggled={isToggled} />}
        ></Route>
        <Route
          path="/iot-device-view/:id"
          element={<IotDeviceView isToggled={isToggled} />}
        ></Route>
        <Route
          path="/yard-area-List"
          element={<YardAreaList isToggled={isToggled} />}
        ></Route>
        <Route
          path="/yard-area-add/:id"
          element={<YardAreaAdd isToggled={isToggled} />}
        ></Route>
        <Route
          path="/yard-area-view/:id"
          element={<YardAreaView isToggled={isToggled} />}
        ></Route>
        <Route
          path="/yard-area-add"
          element={<YardAreaAdd isToggled={isToggled} />}
        ></Route>
        <Route
          path="/person-add"
          element={<PersonForm isToggled={isToggled} />}
        ></Route>
        <Route
          path="/user-management"
          element={<PersonList isToggled={isToggled} />}
        ></Route>

        <Route path="/shift-roster/:id" element={<ShiftSchedulePage isToggled={isToggled} />} />
        <Route path="/shift-roster" element={<ShiftSchedulePage isToggled={isToggled} />} />


        <Route
          path="/yard-add"
          element={<Yardform isToggled={isToggled} />}
        ></Route>
        <Route
          path="/yard-view/:id"
          element={<YardView isToggled={isToggled} />}
        ></Route>
        <Route
          path="/yard-add/:id"
          element={<Yardform isToggled={isToggled} />}
        ></Route>
        <Route
          path="/yard-list"
          element={<YardList isToggled={isToggled} />}
        ></Route>
        <Route
          path="/tag-inventory"
          element={<TagInventoryList isToggled={isToggled} />}
        ></Route>
        <Route
          path="/add-tag"
          element={<TagForm isToggled={isToggled} />}
        ></Route>
        <Route
          path="/entry-logs-add"
          element={<LogForm isToggled={isToggled} />}
        ></Route>
        <Route
          path="/entry-logs-add/:id"
          element={<LogForm isToggled={isToggled} />}
        ></Route>
        <Route
          path="/exit-logs-add/:id"
          element={<LogForm isToggled={isToggled} />}
        ></Route>
        <Route
          path="/exit-logs-add"
          element={<LogForm isToggled={isToggled} />}
        ></Route>
        <Route
          path="/entry-logs-list"
          element={<EntryLogList isToggled={isToggled} />}
        ></Route>
        <Route
          path="/exit-logs-list"
          element={<ExitLogList isToggled={isToggled} />}
        ></Route>
        <Route
          path="/exit-logs-view/:id"
          element={<ExitLogView isToggled={isToggled} />}
        ></Route>
        <Route
          path="/assign-job/:jobId/yardAreaId/:yardAreaId"
          element={<AssignJob isToggled={isToggled} />}
        ></Route>
        <Route
          path="/machine-assign/:id"
          element={<MachineAssign isToggled={isToggled} />}
        ></Route>
        <Route
          path="/upcoming-jobs"
          element={<UpcomingJobDetails isToggled={isToggled} />}
        ></Route>
        <Route
          path="/job-history"
          element={<JobHistory isToggled={isToggled} />}
        ></Route>
        <Route
          path="/attendance"
          element={< AttendanceList isToggled={isToggled} />}
        ></Route>
        <Route
          path="/mark-attendance"
          element={< AttendanceAdd isToggled={isToggled} />}
        ></Route>
        <Route
          path="/person-add/:id"
          element={<PersonForm isToggled={isToggled} />}
        ></Route>
        <Route
          path="/person-view/:id"
          element={<PersonView isToggled={isToggled} />}
        ></Route>
        <Route
          path="/machine-dash"
          element={<MachineDashboard isToggled={isToggled} />}
        ></Route>

        <Route
          path="/attendance-view"
          element={< AttendanceView isToggled={isToggled} />}
        ></Route>

        <Route
          path="/yard-map-view"
          element={< YardMapView isToggled={isToggled} />}
        ></Route>


        <Route
          path="/leave-management"
          element={< LeaveManagement isToggled={isToggled} />}
        ></Route>

        <Route
          path="/lock-unlock-event"
          element={<LockUnlockEvent isToggled={isToggled} />}
        ></Route>

        <Route
          path="/engine-event"
          element={<EngineEvent isToggled={isToggled} />}
        ></Route>



      </Routes>

      <Footer isToggled={isToggled} handleToggle={handleToggle} />
    </React.Fragment>
  );
};

