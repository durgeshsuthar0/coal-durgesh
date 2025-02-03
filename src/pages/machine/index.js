import React from "react";
import { IotMachineFormSec } from "./machine-add";
import {MachineViewSec} from "./machine-view"
import { MachineAssignSec } from "./machine-assign";
import { MachineListSec } from "./machine-list";

export const MachineAdd = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <IotMachineFormSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const MachineView = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <MachineViewSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const MachineAssign = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <MachineAssignSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};


export const MachineList = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <MachineListSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
