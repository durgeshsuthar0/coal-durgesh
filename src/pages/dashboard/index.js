import React from "react";
import { DashboardSec } from "./dashboard";
import { MachineDashboardSec } from "./machine-dashboard";
 
export const Dashboard = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <DashboardSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
 
export const MachineDashboard = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <MachineDashboardSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
 
