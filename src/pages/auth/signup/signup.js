import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AuthImg from "../../../assets/images/auth-img.jpg"; // Use the same image as in login
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../hook/useAuth"; // Import the useAuth hook
import { useDispatch } from "react-redux"; // Import useDispatch
import { setEmail, setMobile } from "../../../redux/action"; // Import the action
import truck from "../../../assets/images/coal-removebg-preview (1).png"

export const SignupSec = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formdata, setformdata] = useState({
    userName: "",
    email: "",
    mobile: "",
    password: "",
    token: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { handleSignup, fetchSignUpData } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const dispatch = useDispatch(); // Initialize useDispatch

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setformdata((prevFormData) => ({
          ...prevFormData,
          mobile: value,
        }));
      }
    } else {
      setformdata((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const loadSignUpData = async () => {
      const response = await fetchSignUpData(token);
      if (response.status) {
        const { email, userName, mobile } = response.data;
        setformdata((prevFormData) => ({
          ...prevFormData,
          userName: userName || "",
          email: email || "",
          mobile: mobile || "",
          token,
        }));
      }
    };
    loadSignUpData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await handleSignup(formdata);
      if (response && response.status) {
        dispatch(setEmail(formdata.email));
        dispatch(setMobile(formdata.mobile));
        toast.success("Sign up successful! Please check your email/mobile for OTP verification.");
        navigate("/otp");
      } else {
        const errorMessage = response?.message || "Sign up failed. Please try again.";
        const errorCode = response?.errCode;
        toast.error("Sign up failed (code: " + errorCode + "): " + errorMessage);
      }
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
    }
  };
  return (
    <React.Fragment>
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
                <h2 className="mt-3 text-black">Signup</h2>
                <p className="text-light mt-2 mb-3">Create a new account</p>
              </div>
                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label className="fw-bold">Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    placeholder="Enter Username"
                    value={formdata.userName}
                    onChange={handleInputChange}
                    disabled
                    className="rounded-lg p-3"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-4">
                  <Form.Label className="fw-bold">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formdata.email}
                    onChange={handleInputChange}
                    disabled
                    className="rounded-lg p-3"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicMobile" className="mt-4">
                  <Form.Label className="fw-bold">Mobile Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    placeholder="Enter Mobile Number"
                    value={formdata.mobile}
                    onChange={handleInputChange}
                    disabled
                    className="rounded-lg p-3"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-4 position-relative">
                  <Form.Label className="fw-bold">Password</Form.Label>
                  <div className="field-set position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formdata.password}
                      onChange={handleInputChange}
                      placeholder="Enter Password"
                      required
                      className="rounded-lg p-3"
                    />
                    <span
                      className="show-hide-icon position-absolute"
                      onClick={togglePasswordVisibility}
                      style={{ right: "15px", top: "12px", cursor: "pointer" }}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-4 rounded-lg p-1">
                  Sign up
                </Button>
              </Form>
              <div className="mt-4 text-center auth-link fs-6">
                <p className="text-light">
                  Already have an Account? <Link to="/" className="text-black">Sign In</Link>
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
