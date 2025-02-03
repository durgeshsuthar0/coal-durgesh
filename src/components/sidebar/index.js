import React from "react";
import { SidebarSec } from "./Sidebar";

export const Sidebar = ({ isToggled, handleToggle }) => {
  return (
    <React.Fragment>
      <div className="sidebar-section">
        <SidebarSec isToggled={isToggled} handleToggle={handleToggle} />
      </div>
    </React.Fragment>
  );
};
