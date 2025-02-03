import React from "react";
import { EntryLogListSec } from "./entry-logs/entry-logs-list";
import { ExitLogViewSec } from "./exit-logs/exit-logs-view";
import { EntryLogViewSec } from "./entry-logs/entry-log-view";
import { ExitLogListSec } from "./exit-logs/exit-logs-list";
import { LogFormSec } from "./logs-add/logs-add";


export const EntryLogList = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <EntryLogListSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const ExitLogList = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <ExitLogListSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const ExitLogView= ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <ExitLogViewSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};


export const EntryLogView = ({ isToggled }) => {
    return (
      <React.Fragment>
        <div className="admin-content">
          <EntryLogViewSec isToggled={isToggled} />
        </div>
      </React.Fragment>
    );
  };
  
  export const LogForm = ({ isToggled }) => {
    return (
      <React.Fragment>
        <div className="admin-content">
          <LogFormSec isToggled={isToggled} />
        </div>
      </React.Fragment>
    );
  };