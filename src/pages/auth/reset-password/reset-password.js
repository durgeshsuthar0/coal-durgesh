import React, { useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AuthImg from "../../../assets/images/auth-img.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation here
import { useAuth } from "../../../hook/useAuth"; // Import the custom hook
import { useSelector } from "react-redux";
import truck from "../../../assets/images/coal-removebg-preview (1).png";

export const ResetSec = () => {
  const { handleResetPassword } = useAuth(); // Use the custom hook
  const location = useLocation(); // Use useLocation to get the query parameters
  const searchParams = new URLSearchParams(location.search); // Create a URLSearchParams instance
  const token = searchParams.get("token"); // Extract the token from the query string

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
    } else {
      setError("");
      setSuccess("");

      // Ensure the token is available
      if (!token) {
        setError("Token is missing or invalid.");
        return;
      }

      // Construct the request data, only sending the password and token
      const data = {
        password,
        token, // Send token extracted from URL query string
      };

      // Call the reset password API
      const response = await handleResetPassword(data);
      if (response?.status) {
        setSuccess("Password reset successful!");
        navigate("/#/dashboard"); // Redirect to login after successful password reset
      } else {
        setError(
          response.message || "Password reset failed. Please try again."
        );
      }
    }
  };

  return (
    <React.Fragment>
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
                <h2 className="mt-3 text-black">Create New Password</h2>
                <p className="text-light mb-4">
                  Your new password must be different from previously used
                  passwords.
                </p>
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label className="fw-bold">New Password</Form.Label>
                  <div className="field-set position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-lg p-3"
                    />
                    <span
                      className="show-hide-icon position-absolute"
                      onClick={togglePasswordVisibility}
                      style={{ right: "15px", top: "12px", cursor: "pointer" }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </Form.Group>

                <Form.Group
                  controlId="formBasicConfirmPassword"
                  className="mt-3"
                >
                  <Form.Label className="fw-bold">Confirm Password</Form.Label>
                  <div className="field-set position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-lg p-3"
                    />
                    <span
                      className="show-hide-icon position-absolute"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{ right: "15px", top: "12px", cursor: "pointer" }}
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-4 rounded-lg p-1"
                >
                  Reset Password
                </Button>
              </Form>
              <div className="mt-4 text-center auth-link fs-6">
                <p>
                  <Link to="/" className="text-black">
                    Back to login
                  </Link>
                </p>
              </div>
            </div>
            </div>
          </Col>
        </Row>

      </div>
    </React.Fragment>
  );
};
