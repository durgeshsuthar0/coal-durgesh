import React from "react";
import { LogListSec } from "./log-list";

export const LogList = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <LogListSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
