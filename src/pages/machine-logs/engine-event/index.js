import React from "react";
import { EngineSec } from "./engine-event";

export const EngineEvent = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <EngineSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

