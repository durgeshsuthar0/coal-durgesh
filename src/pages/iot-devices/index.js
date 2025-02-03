import React from "react";
import { IotDeviceFormSec } from "./IOT-device-add";
import { IotDeviceListSec } from "./IOT-Device-list";
import { IotDeviceViewSec } from "./iOT-device-view";

export const IotDeviceAdd = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <IotDeviceFormSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const IotDeviceView = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <IotDeviceViewSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const IotDeviceList = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <IotDeviceListSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
