import React from "react";
// import { Spinner } from "react-bootstrap";
// import PulseLoader from "react-spinners/PulseLoader";
import loaderimg from "../../assets/images/loader.png"
 
function Loader() {
  return (
    <div
      className="d-flex justify-content-center align-items-center loader-main"
      style={{ height: "100%" }}
    >
      {/* <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner> */}
      {/* <PulseLoader>  <span className="visually-hidden">Loading...</span></PulseLoader> */}
      <img src={loaderimg} alt="Loading..." className="rotating-loader" />
    </div>
  );
}
 
export default Loader;