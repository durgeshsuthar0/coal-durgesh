import React, { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../../components/loadSpinner/loader";

export const ForgotSec = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }
    setError("");
    setSuccess("");

    if (isLoading) return;

    setIsLoading(true);

    // Simulate a successful password reset request
    setSuccess("Password reset link sent successfully. Please check your email.");

    // Simulate navigation after successful submission
    setTimeout(() => {
      setIsLoading(false);
      navigate("/"); // Navigate back to the login page
    }, 2000);
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
                  <h2 className="mt-3 text-black">Forgot Password</h2>
                  <p className="text-light mb-0">
                    Enter your email and we'll send you a link to reset your
                    password.
                  </p>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label className="fw-bold">Email address</Form.Label>
                    <div className="field-set position-relative">
                      <span className="input-icon position-absolute">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-lg"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid email.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 btn-full-width mt-4 rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? " Sending..." : " Submit"}
                  </Button>
                </Form>
                <div className="text-center mt-4">
                  <p>
                    <Link to="/" className="text-orange text-decoration-none">
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