import React, { useState, useEffect } from "react";
import { CaretLeft, HouseSimple } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./dropdown";
import { BsListNested } from "react-icons/bs";
import { FaRightLeft } from "react-icons/fa6";
import sidebarimg from "../../assets/images/coal-removebg-preview (1).png";
import Loader from "../loadSpinner/loader";

export const SidebarSec = ({ handleToggle, isToggled }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // Loader state
  const navigate = useNavigate();

  const handleMenuClick = (index) => {
    setActiveMenu(index === activeMenu ? null : index);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 772px)");

    const handleMediaQueryChange = (event) => {
      setIsMobileView(event.matches);
    };

    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleHideClick = () => {
    if (isMobileView && !isToggled) {
      handleToggle();
    }
  };

  const menuItems = [
    { id: 1, name: "Dashboard", link: "/pages/dashboard" },
    { id: 2, name: "Yard Management", link: "/pages/yard-list" },
    { id: 3, name: "User-Management", link: "/pages/user-management" },
    {
      id: 5,
      name: "Management",
      submenus: [
        { id: 6, name: "Users", link: "/pages/dashboard" },
        { id: 7, name: "Roles", link: "/pages/dashboard" },
      ],
    },
  ];

  const handleNavigate = (link) => {
    setIsLoading(true); 
    setTimeout(() => {
      navigate(link); 
      setIsLoading(false); 
    }, 1000);
  };

  return (
    <div className={!isToggled ? "sidebar" : "sidebar active"}>
      {isLoading && (
        <div className="loader-wrapper d-flex justify-content-center align-items-center">
          <Loader /> {/* Your loader component */}
        </div>
      )}
      <div className="menu-btn bg-yellow-btn" onClick={handleToggle}>
        <FaRightLeft size={24} />
      </div>

      <div className="head d-flex justify-content-center align-items-center">
        <div className="w-100 user-details">
          {isToggled ? (
            <img src={sidebarimg} width={50} alt="Sidebar Logo" />
          ) : (
            <div className="px-3 d-flex justify-content-between align-items-center">
              <h4 className="fs-5 fw-bold mb-0">CYMS</h4>
              <img className="d-none d-lg-block" src={sidebarimg} width={80} alt="Sidebar Logo" />
            </div>
          )}
        </div>
      </div>

      <hr />

      <div className="nav">
        <div className="menu">
          <ul>
            {menuItems.map((menuItem) => (
              menuItem.submenus ? (
                <li key={menuItem.id} className="has-dropdown">
                  <Dropdown
                    key={menuItem.id}
                    index={menuItem.id}
                    activeMenu={activeMenu}
                    handleMenuClick={handleMenuClick}
                    icon={HouseSimple}
                    title={menuItem.name}
                    handleHideClick={handleHideClick}
                    subItems={menuItem.submenus}
                  />
                </li>
              ) : (
                <li key={menuItem.id}>
                  <Link to="#" onClick={() => handleNavigate(menuItem.link)}>
                    <HouseSimple size={20} />
                    <span className="text">{menuItem.name}</span>
                  </Link>
                </li>
              )
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarSec;
