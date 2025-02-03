import React from "react";
import { PersonFormmSec } from "./person-add";
import { PersonViewSec } from "./person-view";
import { PersonListSec } from "./person-list";

export const PersonForm = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <PersonFormmSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};


export const PersonView = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <PersonViewSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const PersonList = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <PersonListSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
