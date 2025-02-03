import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  setEmail,
  setFirstName,
  setLastName,
  setPersonUUID,
  setRoleId,
  setToken,
} from "../../../redux/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hook/useAuth";
import truck from "../../../assets/images/coal-removebg-preview (1).png";
import Loader from "../../../components/loadSpinner/loader";

export const LoginSec = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleNavigate = () => {
    setIsLoading(true); 
    setTimeout(() => {
      setIsLoading(false);
      navigate("/pages/dashboard"); 
    }, 2000); 
  };
  

  return (
    <React.Fragment>
       {isLoading && (
            <div className="loader-wrapper d-flex justify-content-center align-items-center">
              <Loader /> {/* Your loader component */}
            </div>
          )}
      <div className="auth-box text-start h-100vh">
        <Row className="justify-content-md-center mx-auto auth-row">
          <Col lg={5} className="p-0 d-none d-lg-block position-relative">
            <div className="content-wrapper">
              <div className="auth-left-content text-white">
                <img className="mb-3" src={truck} width={100}></img>
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
                <div className="section-title pb-3 mb-4 border-bottom border-black text-center">
                  <h2 className="mt-3 text-black">Login</h2>
                  <p className="text-light mt-2 mb-3">
                    Access your coal yard management account
                  </p>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form >
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label className="fw-bold">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      className="rounded-lg p-3"
                    />
                  </Form.Group>

                  <Form.Group
                    controlId="formBasicPassword"
                    className="mt-4 position-relative"
                  >
                    <Form.Label className="fw-bold">Password</Form.Label>
                    <div className="field-set position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-lg p-3"
                      />
                      <span
                        className="show-hide-icon position-absolute"
                        onClick={togglePasswordVisibility}
                        style={{
                          right: "15px",
                          top: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </span>
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <Form.Group controlId="formBasicCheckbox">
                      <Form.Check type="checkbox" label="Remember me" />
                    </Form.Group>
                    <Link to="/forgot-password" className="text-black fs-6">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button onClick={handleNavigate} type="submit" className="mb-3 w-100 mt-4 rounded-lg p-1">
                    Login
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
