import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import "./assets/scss/variable.scss";
import "./assets/scss/style.scss";
import { BrowserRouter , Router, Routes, Route, } from "react-router-dom";
import { AuthView } from "./views/auth-view";
import { MainView } from "./views/main-view";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/*" element={<AuthView />} />

        {/* Delegate main views to MainView */}
        <Route path="/pages/*" element={<MainView />} /> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;