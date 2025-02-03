import React, { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthImg from "../../../assets/images/auth-img.jpg";
import { useAuth } from "../../../hook/useAuth"; // Import useAuth hook
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import truck from "../../../assets/images/coal-removebg-preview (1).png"

export const ForgotSec = () => {
  const [email, setEmail] = useState("");
  const { handleForgotPassword } = useAuth(); // Destructure the forgot password function
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous error messages
    setSuccess(""); // Reset previous success messages

    // Prevent multiple submissions if already in progress
    if (isLoading) return;

    setIsLoading(true); // Set loading state to true

    try {
      const response = await handleForgotPassword({ email });
      if (response.status) {
        setSuccess("Password reset link sent successfully. Please check your email.");
        toast.success("Password reset link sent successfully.");
      } else {
        setError(response.message || "Failed to send reset password link.");
        toast.error(response.message || "Failed to send reset password link.");
      }
    } catch (err) {
      setError("An error occurred while sending the reset password link.");
      toast.error("An error occurred while sending the reset password link.");
    } finally {
      setIsLoading(false); // Reset loading state after the request completes
    }
  };

  return (
    <React.Fragment>
      <ToastContainer /> {/* Add the ToastContainer to render toast messages */}
      <div className="auth-box text-start h-100vh">
      <Row className="justify-content-md-center mx-auto auth-row">
        <Col
            lg={5}
            className="p-0 d-none d-lg-block position-relative"
          >
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
                <h2 className="mt-3 text-black">Forgot Password</h2>
                <p className="text-light mb-4">Enter your email and we'll send you a link to reset your password.</p>
              </div>
                {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label className="fw-bold">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg p-3"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-4 rounded-lg p-1"
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? "Sending..." : "Submit"} {/* Change button text when loading */}
                </Button>
              </Form>
              <div className="mt-4 text-center auth-link fs-6">
                <p>
                  <Link to="/" className="text-black">Back to login</Link>
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
