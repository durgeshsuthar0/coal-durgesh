import React from "react";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export const FooterRow = ({ isToggled }) => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Update the year when the component mounts
    setYear(new Date().getFullYear());
  }, []);

  return (
    <React.Fragment>
      <div
        className={
          isToggled ? "copyright py-3 expand-copyright" : "copyright py-3"
        }
      >
        <Container>
          <p className="text-dark mb-0">
            {`Copyright © ${year}. All Rights Reserved | Designed & Developed by`}
            <Link to="https://qpaix.com/" target="_blank" className="ms-1">
              Qpaix Infitech Pvt. Ltd.
            </Link>
          </p>
        </Container>
      </div>
    </React.Fragment>
  );
};
