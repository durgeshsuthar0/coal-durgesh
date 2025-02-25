import React, { useState, useEffect } from "react";
import { CaretLeft, HouseSimple } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Dropdown from "./dropdown";
import { HiBars3BottomLeft } from "react-icons/hi2";
import sidebarimg from "../../assets/images/COalLogo.png";

// Import icons from react-icons library
import { FaHome, FaUser, FaIndustry } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { BsFan, BsFuelPumpDieselFill } from "react-icons/bs";

export const SidebarSec = ({ handleToggle, isToggled }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleMenuClick = (index) => {
    setActiveMenu(index === activeMenu ? null : index);
  };

  // Static menu items
  const menuItems = [
    {
      id: 1,
      name: "Home",
      iconName: "FaHome",
      link: "/pages/dashboard",
    },
    {
      id: 2,
      name: "Yard Management",
      iconName: "FaUser",
      link: "/pages/yard-list",
    },
    {
      id: 3,
      name: "User Management",
      iconName: "FaGears",
      link: "/pages/user-management",
    },
    {
      id: 4,
      name: "Industry",
      iconName: "FaIndustry",
      link: "/pages/dashboard",
    },
    {
      id: 5,
      name: "Cooling",
      iconName: "BsFan",
      link: "/pages/dashboard",
    },
    {
      id: 6,
      name: "Fuel",
      iconName: "BsFuelPumpDieselFill",
      link: "/pages/dashboard",
    },
  ];

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

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "FaHome":
        return <FaHome size={20} />;
      case "FaUser":
        return <FaUser size={20} />;
      case "FaGears":
        return <FaGears size={20} />;
      case "BsFan":
        return <BsFan size={20} />;
      case "FaIndustry":
        return <FaIndustry size={20} />;
      case "BsFuelPumpDieselFill":
        return <BsFuelPumpDieselFill size={20} />;
      default:
        return <HouseSimple size={20} />;
    }
  };

  const renderSubmenu = (submenuItems, isActive) => {
    return (
      <ul className={`submenu ${isActive ? "active" : ""}`}>
        {submenuItems.map((submenu) => {
          if (submenu.submenus && submenu.submenus.length > 0) {
            return (
              <li key={submenu.id} className="has-dropdown">
                <Dropdown
                  key={submenu.id}
                  index={submenu.id}
                  activeMenu={activeMenu}
                  handleMenuClick={handleMenuClick}
                  icon={renderIcon(submenu.iconName)}
                  title={submenu.name}
                  handleHideClick={handleHideClick}
                  subItems={submenu.submenus}
                />
              </li>
            );
          } else {
            return (
              <li key={submenu.id}>
                <Link to={submenu.link} onClick={handleHideClick}>
                  {renderIcon(submenu.iconName)}
                  <span className="text">{submenu.name}</span>
                </Link>
              </li>
            );
          }
        })}
      </ul>
    );
  };

  return (
    <div className={!isToggled ? "sidebar" : "sidebar active"}>
      {/* Sidebar Toggle Button */}
      <div className="menu-btn" onClick={handleToggle}>
        <HiBars3BottomLeft size={25} />
      </div>

      {/* Sidebar Header */}
      <div className="head d-flex justify-content-center align-items-center">
        <div className="w-100 user-details">
          {isToggled ? (
            <img src={sidebarimg} width={80} alt="Logo" />
          ) : (
            <div className="px-3 d-flex justify-content-between align-items-center">
              <img className="d-none d-lg-block pb-1" src={sidebarimg} width={130} alt="Logo" />
            </div>
          )}
        </div>
      </div>

      <hr />

      {/* Navigation Menu */}
      <div className="nav">
        <div className="menu">
          <ul>
            {Array.isArray(menuItems) && menuItems.length > 0 ? (
              menuItems.map((menuItem) => {
                return menuItem.submenus && menuItem.submenus.length > 0 ? (
                  <li key={menuItem.id} className="has-dropdown">
                    <Dropdown
                      key={menuItem.id}
                      index={menuItem.id}
                      activeMenu={activeMenu}
                      handleMenuClick={handleMenuClick}
                      renderIcon={renderIcon}  // Pass renderIcon to Dropdown
                      iconName={menuItem.iconName}  // Pass iconName to Dropdown
                      title={menuItem.name}
                      handleHideClick={handleHideClick}
                      subItems={menuItem.submenus}
                    >
                      {renderSubmenu(menuItem.submenus, activeMenu === menuItem.id)}
                    </Dropdown>
                  </li>
                ) : (
                  <li key={menuItem.id}>
                    <Link to={menuItem.link} onClick={handleHideClick}>
                      {renderIcon(menuItem.iconName)} {/* Render the icon here */}
                      <span className="text">{menuItem.name}</span>
                    </Link>
                  </li>
                );
              })
            ) : (
              <li>No menu items available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};