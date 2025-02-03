import React from "react";

const Status = ({ status, trueMessage, falseMessage }) => {
  const statusClassName =
    status ? "approved-status" : "pending-status";

  return (
    <p className={statusClassName}>
      {status ? trueMessage : falseMessage} {/* Conditional rendering of messages */}
    </p>
  );
};

export default Status;
