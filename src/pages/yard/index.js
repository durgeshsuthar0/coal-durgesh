import React from "react";
import { YardformSec } from "./yard-add";
import {YardviewSec} from "./yardView"
import YardListSec from "./yard-list";

export const Yardform = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <YardformSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const YardView = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <YardviewSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const YardList = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <YardListSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
