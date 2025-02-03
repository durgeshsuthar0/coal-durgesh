import React from "react";
import { LockUnlockSec } from "./lock-unlock-event";

export const LockUnlockEvent = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <LockUnlockSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

