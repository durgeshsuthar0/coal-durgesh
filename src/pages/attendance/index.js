import React from "react";
import { AttendanceListSec } from "./attendance-list";
import { AttendanceAddSec } from "./attendance-add";
import { AttendanceViewSec } from "./atttendance-view";
 
export const AttendanceList = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <AttendanceListSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const AttendanceAdd = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <AttendanceAddSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
 
export const AttendanceView = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <AttendanceViewSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};