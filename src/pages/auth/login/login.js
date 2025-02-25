import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../../components/loadSpinner/loader";

export const LoginSec = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    
  
    setIsLoading(true);
    // Check if email and password match "admin"
    if (email === "admin" && password === "admin") {
      setSuccess("Login successful!");
  
      if (rememberMe) {
        Cookies.set("email", email, { expires: 30 });
        Cookies.set("password", password, { expires: 30 });
      } else {
        Cookies.remove("email");
        Cookies.remove("password");
      }
  
      // Simulate navigation after login
      setTimeout(() => {
        setIsLoading(false);
        navigate("pages/dashboard");
      }, 2000);
    } else {
      setError("Invalid email or password. Please try again.");
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
          <Col lg={6} className="p-0  d-lg-block position-relative">
            <div className="content-wrapper">
              <div className="auth-left-content text-white">
                <h3 className="mb-2">Coal Yard Management System</h3>
                <p className="d-none d-lg-block mt-3 auth-description">
                  Streamline coal yard operations and improve resource
                  management with our comprehensive platform.
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6} className="p-0">
            <div className="auth-form shadow-lg rounded-lg">
              <div className="main-form">
                <div className="section-title">
                  <h2 className="mt-3 text-black">Login</h2>
                  <p className="text-light mb-0">
                    Access your coal yard management account
                  </p>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-4">
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label className="fw-bold">Email address</Form.Label>
                    <div className="field-set position-relative">
                      <span
                        className="input-icon position-absolute"
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon className="" icon={faEnvelope} />
                      </span>

                      <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        className="rounded-lg"
                      />

                    </div>

                  </Form.Group>

                  <Form.Group
                    controlId="formBasicPassword"
                    className="mt-3 position-relative"
                  >
                    <Form.Label className="fw-bold">Password</Form.Label>

                    <div className="field-set position-relative">
                      <span
                        className="input-icon position-absolute"
                        onClick={togglePasswordVisibility}

                      >
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-lg"
                      />
                      <span
                        className="show-hide-icon position-absolute"
                        onClick={togglePasswordVisibility}

                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </span>
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <Button

                      type="submit"
                      className="btn-primary"
                    >
                      Login
                    </Button>
                    <a><Link to="/forgot-password" className="text-orange">
                      Forgot Password?
                    </Link></a>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};