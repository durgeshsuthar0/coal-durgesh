import React from "react";
import { JobHistorySec } from "./job-history";
import AssignJobSec from "./assign-job";
import { UpcomingJobDetailsSec } from "./upcoming-jobs";

export const JobHistory = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <JobHistorySec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const AssignJob = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <AssignJobSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
 

export const UpcomingJobDetails = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <UpcomingJobDetailsSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};