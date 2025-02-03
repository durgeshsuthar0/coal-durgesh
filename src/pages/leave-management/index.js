import React from "react";
import { LeaveManagementSec } from "./leave-management";

export const LeaveManagement = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <LeaveManagementSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
