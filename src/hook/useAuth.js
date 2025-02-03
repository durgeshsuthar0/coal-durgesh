import { setID } from "../redux/action";
import { signUp, verifyOtp, resendOtp, login, forgotPassword, resetPassword, getRolesList, fetchRolesById, getSignUpData } from "../services/allServices/authService";
import { useDispatch } from "react-redux";
export const useAuth = () => {

  //Example of the handleSignup function

  const dispatch = useDispatch()

  const handleSignup = async (data) => {
    try {
      const response = await signUp(data); // try catch
      return response;
    } catch (err) {
    }
  };

  const handleVerifyOtp = async (otpData) => {
    try {
      const response = await verifyOtp(otpData);
      return response;
    } catch (err) {
      console.error("Error during OTP verification:", err);
      // Return a structured error response for the frontend to handle
      return {
        status: false,
        message: err.response?.data?.message || "An unexpected error occurred."
      };
    }
  };

  const handleResendOtp = async (data) => {
    try {
      const response = await resendOtp(data);
      return response;
    } catch (err) {
    }
  };

  const handleLogin = async (loginData) => {
    try {
      const response = await login(loginData); // Call login API
      if (response.status) {
        dispatch(setID(response.data.data.id)); // Dispatch the user ID to Redux
      }
      return response; // Return the response (for further handling in the component)
    } catch (err) {
      return { status: false, message: "An error occurred during login." }; // Return error message
    }
  };

  const handleForgotPassword = async (data) => {
    try {
      const response = await forgotPassword(data); // Call the forgotPassword API
      return response; // Return the response (for further handling in the component)
    } catch (err) {
      return { status: false, message: "An unexpected error occurred" }; // Handle errors gracefully
    }
  };
  const handleResetPassword = async (data) => {
    try {
      const response = await resetPassword(data);
      if (response.status) {
        // You could dispatch a Redux action or navigate after success
        dispatch(setID(response.data.id)); // If the reset password returns user ID
      }
      return response; // Return response to handle success/failure
    } catch (err) {
      return { status: false, message: "An error occurred" };
    }
  };


  const fetchRoles = async () => {
    try {
      const response = await getRolesList();
      return response;
    } catch (error) {
    }
  };

  const RoleList = async (personUuid) => {
    try {
      const response = await fetchRolesById(personUuid);
      if (response.status) {
        return { status: true, data: response.data };
      } else {
        return { status: false, message: response.message };
      }
    } catch (error) {
      return { status: false, message: error.message };
    }
  };
  

  const fetchSignUpData = async (token) => {
    try {
      const response = await getSignUpData(token);
      return { status: true, data: response.data.data };
    } catch (error) {
      return { status: false, message: error.message };
    }
  };



  return { handleSignup, handleVerifyOtp, handleResendOtp, handleLogin, handleForgotPassword, handleResetPassword, fetchRoles, RoleList, fetchSignUpData };
};

