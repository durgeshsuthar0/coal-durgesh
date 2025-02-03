import React from "react";
import { ShiftSchedulePageSec } from "./ShiftSchedulePage";

export const ShiftSchedulePage = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <ShiftSchedulePageSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
