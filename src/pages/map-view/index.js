import React from "react";
import { YardMapViewSec } from "./yard-map";

export const YardMapView   = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <YardMapViewSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
