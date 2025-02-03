import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import "./assets/scss/variable.scss";
import "./assets/scss/style.scss";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthView } from "./views/auth-view";
import { MainView } from "./views/main-view";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/*" element={<AuthView />}></Route>
          <Route path="/pages/*" element={<MainView />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;


// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.scss";
// import "./assets/scss/variable.scss";
// import "./assets/scss/style.scss";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthView } from "./views/auth-view";
// import { MainView } from "./views/main-view";
// import Unauthorized from "./pages/unauthorized";
// import { Navigate } from "react-router-dom";

// const App = () => {
//   return (
//     <Router>
//       <Routes>

//         {/* Authentication Routes */}
//         <Route path="/*" element={<AuthView />}></Route>

//         {/* Delegate main views to MainView */}
//       <Route path="/pages/" element={<MainView />}></Route>

//         {/* Unauthorized Route */}
//         <Route path="/unauthorized" element={<Unauthorized />} />

//         {/* Default Fallback */}
//         <Route path="*" element={<Navigate to="/unauthorized" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
