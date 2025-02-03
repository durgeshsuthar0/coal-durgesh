import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/auth/login";
import { Signup } from "../pages/auth/signup";
import { Forgotpassword } from "../pages/auth/forgot-password";
import { Resetpassword } from "../pages/auth/reset-password";
import { Otp } from "../pages/auth/otp";
import { SelectRolePage } from "../pages/auth/select-role";

export const AuthView = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/select-role" element={<SelectRolePage />} />
      </Routes>
    </React.Fragment>
  );
};
