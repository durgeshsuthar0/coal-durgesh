import React from "react";
import { FooterRow } from "./copyright";

export const Footer = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="footer-main">
        <FooterRow isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
