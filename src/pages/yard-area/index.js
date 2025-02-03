import React from "react";
import { YardAreaFormSec } from "./yard-area-add";
import {YardAreaViewSec} from "./yard-area-view"
import { YardAreaOverviewSec } from "./yard-area-overview";
import { YardAreaListSec } from "./yard-area-list";


export const YardAreaAdd = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <YardAreaFormSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};


export const YardAreaView = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <YardAreaViewSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const YardAreaList = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <YardAreaListSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};


export const YardAreaOverview = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <YardAreaOverviewSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
