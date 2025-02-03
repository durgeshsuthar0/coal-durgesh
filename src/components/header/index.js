import React from "react";
import { NavbarRow } from "./navbar";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import { useNavbar } from "../../hook/useNavbar"; // Import your custom hook
import { Form} from "react-bootstrap";

export const Header = ({ isToggled, handleToggle }) => {
  const personInfoId = useSelector((state) => state.auth.id); // Get person info ID from Redux store
  const { yards, selectedYardId, handleYardChange } = useNavbar(personInfoId); // Use the custom hook
  return (
    <React.Fragment>
      <div className="header-part">
        <NavbarRow isToggled={isToggled} handleToggle={handleToggle} />
      </div>
      <div><div className="header-select d-md-none card flex justify-content-center align-items-center border-0 pb-2">
      <Form.Label className="me-2">Select Yard</Form.Label>
                    <Dropdown
                      value={selectedYardId}
                      options={yards}
                      onChange={(e) => handleYardChange(e.value)}
                      optionLabel="yardName"
                      optionValue="id"
                      placeholder="Select Yard"
                      className="custom-select w-75"
                    ></Dropdown>
                  </div>{" "}</div>
    </React.Fragment>
  );
};
