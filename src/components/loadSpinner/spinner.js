import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Loader from "./loader";
 
 
 
const SpinnerSec = (Component, isLoad) => {
  return function SpinnerSecComponent({ isLoading, ...props }) {
    if (isLoad) {
      return <Loader />;
    }
    return <Component {...props} />;
  };
};
 
export default SpinnerSec;