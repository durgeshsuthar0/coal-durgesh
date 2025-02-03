import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import truck from "../../../assets/images/coal-removebg-preview (1).png";
import { useSelector } from "react-redux";
import { useAuth } from "../../../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { setRoleName, setRoleId, setYardId } from "../../../redux/action";
import { useDispatch } from "react-redux";
import { useYard } from "../../../hook/useYard";
import Loader from "../../../components/loadSpinner/loader";

export const SelectRoleSec = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedYard, setSelectedYard] = useState("");
  const [roles, setRoles] = useState([]);
  const [yardData, setYardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const personUuid = useSelector((state) => state.auth.personUUID);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { RoleList } = useAuth();
  const { fetchYard } = useYard([]);

  useEffect(() => {
    const loadRoles = async () => {
      const response = await RoleList(personUuid);
      if (response.status) {
        setRoles(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error("Failed to fetch roles:", response.message);
        setRoles([]);
      }
    };
    loadRoles();
  }, [personUuid]);

  useEffect(() => {
    loadYards();
  }, []);

  const loadYards = async () => {
    try {
      const response = await fetchYard();
      if (response && response.status && response.data && Array.isArray(response.data)) {
        setYardData(response.data);
      } else {
        console.error("Invalid data structure:", response);
        setYardData([]);
      }
    } catch (error) {
      console.error("Error fetching yards:", error);
      setYardData([]);
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setSelectedYard("");
  };

  const handleYardChange = (event) => {
    setSelectedYard(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Role ID 1 does not require yard selection
    if (selectedRole) {
      const selectedRoleObj = roles.find(role => role.id === Number(selectedRole));

      if (selectedRoleObj) {
        const selectedRoleId = selectedRoleObj.id;
        dispatch(setRoleId(selectedRoleId));
        
        // If selectedRole is 1, we skip the yard check
        if (selectedRoleId === 1 || selectedYard) {
          dispatch(setYardId(selectedYard));

          // Navigate based on the selected roleId
          if (selectedRoleId === 3) {
            setIsLoading(true);
            setTimeout(() => {
              navigate("/pages/machine-dash");
              setIsLoading(false);
            }, 2000);
          } else {
            setIsLoading(true);
            setTimeout(() => {
              navigate("/pages/dashboard");
              setIsLoading(false);
            }, 2000);
          }
        } else {
          if (selectedYard) {
            dispatch(setYardId(selectedYard));
            navigate("/pages/dashboard");
          } else {
            console.error("Please select a yard.");
          }
        }
      } else {
        console.error("Role ID is not valid. Please check if the roleId matches any available role.");
      }
    }
  };

  return (
    <React.Fragment>
       {isLoading && (
        <div className="loader-wrapper d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      <div className="auth-box text-start h-100vh">
        <Row className="justify-content-md-center mx-auto auth-row">
          <Col lg={5} className="p-0 d-none d-lg-block position-relative">
            <div className="content-wrapper">
              <div className="auth-left-content text-white">
                <img className="mb-3" src={truck} width={100} />
                <h2 className="mb-4">Coal Yard Management System</h2>
                <p className="auth-description">
                  Streamline coal yard operations and improve resource
                  management with our comprehensive platform.
                </p>
              </div>
            </div>
          </Col>
          <Col lg={7} className="p-0">
            <div className="auth-form shadow-lg rounded-lg">
              <div className="main-form">
                <div className="section-title pb-3 mb-3 border-bottom border-black">
                  <h2 className="mt-3 text-black text-center">Select Role</h2>
                  <p className="text-center text-light mt-2 mb-3">Step Into Your Role</p>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formRoleSelect" className="mt-3">
                    <Form.Label>Select Role</Form.Label>
                    <Form.Select
                      value={selectedRole}
                      onChange={handleRoleChange}
                      required
                    >
                      <option value="">-- Select Role --</option>
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))
                      ) : (
                        <option>No roles available</option>
                      )}
                    </Form.Select>
                  </Form.Group>

                  {/* Conditionally render the Yard dropdown based on the selected role */}
                  {selectedRole !== "1" && selectedRole !== "3" && (
                    <Form.Group controlId="formYardSelect" className="mt-3">
                      <Form.Label>Select Yard</Form.Label>
                      <Form.Select
                        value={selectedYard}
                        onChange={handleYardChange}
                        required
                      >
                        <option value="">-- Select Yard --</option>
                        {yardData.map((yard) => (
                          <option key={yard.uuid} value={yard.uuid}>
                            {yard.coalYardName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    className="mb-3 w-100 mt-4"
                  >
                    Submit
                  </Button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};
