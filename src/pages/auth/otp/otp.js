import React, { useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import AuthImg from "../../../assets/images/auth-img.jpg";
import { useAuth } from "../../../hook/useAuth"; // Import the useAuth hook
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

export const OtpSec = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // For email OTP
  const [mobileOtp, setMobileOtp] = useState(["", "", "", "", "", ""]); // For mobile OTP
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const mobileInputRefs = useRef([]);
  const { handleVerifyOtp, handleResendOtp: resendOtp } = useAuth(); // Rename to avoid conflict

  const { email, mobile } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Use navigate to redirect

  // Handle OTP change for individual input boxes
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle Mobile OTP change for individual input boxes
  const handleMobileOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 1) {
      const newMobileOtp = [...mobileOtp];
      newMobileOtp[index] = value;
      setMobileOtp(newMobileOtp);

      if (value && index < 5) {
        mobileInputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace logic for OTP
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle backspace logic for mobile OTP
  const handleMobileKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newMobileOtp = [...mobileOtp];
      if (mobileOtp[index] === "" && index > 0) {
        mobileInputRefs.current[index - 1].focus();
        newMobileOtp[index - 1] = "";
        setMobileOtp(newMobileOtp);
      } else {
        newMobileOtp[index] = "";
        setMobileOtp(newMobileOtp);
      }
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    const mobileOtpCode = mobileOtp.join("");
    if (otpCode.length !== 6 || mobileOtpCode.length !== 6) {
      setError("Please enter valid 6-digit OTPs.");
    } else {
      setError("");
      const data = {
        email: email,
        mobile: mobile,
        emailOTP: otpCode,
        mobileOTP: mobileOtpCode,
      };

      const response = await handleVerifyOtp(data);
      if (response && response.status) {
        const successMessage = response.data.message || "User registered successfully";
        toast.success(successMessage);
        setTimeout(() => {
          navigate("/"); // Redirect to the login page after success
        }, 3000); // 2 seconds delay before redirect
      } else {
        toast.error(response.message || "OTP verification failed.");
      }
    }
  };

  // Resend OTP function
  const handleResendOtp = async () => {
    const data = {
      email: email, // Use the actual email from state
      mobile: mobile, // Use the actual mobile number from state
    };

    const response = await resendOtp(data); // Use the renamed function
    if (response && response.status) {
      toast.success("OTP resent successfully!");
    } else {
      toast.error(response.message || "Failed to resend OTP.");
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      {/* Add the ToastContainer for showing toast notifications */}
      <div className="auth-box text-start h-100vh">
        <Row className="justify-content-md-center mx-auto auth-row">
          <Col lg={7} className="p-0 auth-img d-none d-lg-block position-relative">
            <div className="image-content-wrapper">
              <div className="auth-left-content text-white">
                <h2 className="mb-3">Coal Yard Management System</h2>
                <p className="auth-description text-light">
                  Track and manage your Coal with ease, using our intuitive and efficient platform.
                </p>
              </div>
            </div>
            <div className="image-overlay"></div>
            <img src={AuthImg} alt="container-yard-image" className="w-100" />
          </Col>

          <Col lg={5} className="p-0">
            <div className="auth-form p-0 pt-5">
              <div className="pt-5 auth-field">
                <div className="section-title pb-3">
                  <h2 className="text-black">OTP Verification</h2>
                  <p className="text-light mb-0">
                    Enter the OTP sent to your email and Mobile Number
                  </p>
                </div>
                <Form onSubmit={handleSubmit}>
                  {/* Email OTP Input Fields */}
                  <div className="mb-4">
                    <p className="text-light text-center">Enter the OTP sent to your email</p>
                    <div className="d-flex justify-content-center otp-input-group mb-3">
                      {otp.map((digit, index) => (
                        <Form.Control
                          key={index}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          ref={(el) => (inputRefs.current[index] = el)}
                          className="otp-input text-center me-2"
                          required
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mobile OTP Input Fields */}
                  <div className="mb-4">
                    <p className="text-light text-center">Enter the OTP sent to your mobile number</p>
                    <div className="d-flex justify-content-center otp-input-group mb-3">
                      {mobileOtp.map((digit, index) => (
                        <Form.Control
                          key={index}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleMobileOtpChange(e, index)}
                          onKeyDown={(e) => handleMobileKeyDown(e, index)}
                          ref={(el) => (mobileInputRefs.current[index] = el)}
                          className="otp-input text-center me-2"
                          required
                        />
                      ))}
                    </div>
                  </div>

                  <Button variant="primary" type="submit" className="w-100 mt-4">
                    Verify OTP
                  </Button>
                </Form>

                {/* Resend OTP */}
                <div className="mt-4 text-center auth-link fs-6">
                  <p className="text-light">
                    Didn't receive the OTP?{" "}
                    <span onClick={handleResendOtp} className="cursor-pointer text-black">
                      Resend OTP
                    </span>
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
