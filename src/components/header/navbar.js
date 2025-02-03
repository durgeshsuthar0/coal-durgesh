import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Form, Container } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import User from "../../assets/images/user.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/action";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hook/useNavbar";
import { Dropdown } from "primereact/dropdown";
import profileimg from "../../assets/images/user.png";
import Loader from "../loadSpinner/loader";

export const NavbarRow = ({ isToggled, handleToggle }) => {
  const dispatch = useDispatch();
  const [sticky, setSticky] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const role = useSelector((state) => state.auth.roleName);
  const firstName = useSelector((state) => state.auth.firstName);
  const lastName = useSelector((state) => state.auth.lastName);
  const [profileImage, setProfileImage] = useState(null);
  const personInfoId = useSelector((state) => state.auth.id);
  const navigate = useNavigate();

  const { yards, selectedYardId, handleYardChange } = useNavbar(personInfoId);

  const isSticky = () => {
    const scrollTop = window.scrollY;
    const stickyClass = scrollTop > 10 ? "is-sticky" : "";
    setSticky(stickyClass);
  };

  useEffect(() => {
    const handleScroll = () => {
      isSticky();
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const UserMenu = () => (
    <div className="d-flex align-items-center">
      {profileImage ? (
        <Image
          src={profileImage}
          alt="User profile"
          roundedCircle
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
      ) : (
        <Image
          src={User}
          alt="Default user profile"
          roundedCircle
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
      )}
    </div>
  );

  const classes = `${sticky}`;

  const handleLogout = () => {
    dispatch(logout());
    setIsLoading(true);
    setTimeout(() => {
      navigate("/");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <React.Fragment>
      {
        isLoading && (
          <div className="loader-wrapper d-flex justify-content-center align-items-center">
          <Loader />
        </div>
        )
      }
      <div className={classes}>
        <div className={isToggled ? `lg-header expand-header` : `lg-header`}>
          <Navbar collapseOnSelect expand="lg" className="navbar-dark">
            <Container fluid>
              <button
                onClick={handleToggle}
                className="d-lg-none bg-transparent border-0 text-light fs-4"
              >
                <FontAwesomeIcon icon={faBarsStaggered} />
              </button>
              <Navbar.Brand
                href="#home"
                className="d-flex d-lg-none align-items-center text-primary fw-bold text-uppercase ms-1 ms-md-3"
              >
                Coal Yard
              </Navbar.Brand>
              <Nav className="d-lg-block d-none header-title">
                <h4 className="fs-6 text-light">Coal Yard Management System</h4>
              </Nav>
              <Nav className="ms-auto align-items-center flex-row">
                <div className="d-none d-md-block card flex justify-content-center me-3 border-0">
                  {/* <Dropdown
                    value={selectedYardId}
                    options={yards}
                    onChange={(e) => handleYardChange(e.value)}
                    optionLabel="yardName"
                    optionValue="id"
                    placeholder="Select Yard"
                    className="custom-select w-full md:w-14rem"
                    editable
                  ></Dropdown> */}
                </div>
                {/* User Menu Dropdown */}
                <NavDropdown
                  title={<UserMenu />}
                  id="basic-nav-dropdown"
                  className="text-center"
                >
                  <div className="profile-container">
                    <div className="profile-img mb-3">
                      {/* Replace 'profileImgUrl' with the actual source of the image */}
                      <img
                        src={profileimg}
                        alt="Profile"
                        className="rounded-circle"
                        width="80"
                        height="80"
                      />
                    </div>
                    <h4 className="text-primary mb-0">
                      {firstName} {lastName}
                    </h4>
                    <p className="text-muted">{role}</p>
                  </div>
                  <NavDropdown.Divider />
                  <Nav.Link className="p-0">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Edit Profile Photo
                    </NavDropdown.Item>
                  </Nav.Link>
                  <Nav.Link className="p-0" onClick={handleLogout}>
                    <NavDropdown.Item>
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className="me-2"
                      />
                      Logout
                    </NavDropdown.Item>
                  </Nav.Link>
                </NavDropdown>
              </Nav>
            </Container>
          </Navbar>
        </div>
      </div>
    </React.Fragment>
  );
};
