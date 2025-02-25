import React from "react";
import { MdChevronRight } from "react-icons/md";
import { Link } from "react-router-dom";

const Dropdown = ({
  index,
  activeMenu,
  handleMenuClick,
  title,
  iconName,  // Accept iconName prop
  subItems,
  handleHideClick,
}) => {
  const isActive = activeMenu === index;

  return (
    <li className={isActive ? "active" : ""}>
      <a
        href="#/"
        onClick={(e) => {
          e.preventDefault();
          handleMenuClick(index);
        }}
      >
        <span className="text">{title}</span>
        <MdChevronRight size={20} className="arrow" />
      </a>

      {/* Conditionally render the submenu items */}
      {isActive && (
        <ul className={`sub-menu ${isActive ? 'show' : ''}`}>
          {subItems.map((item) => (
            <li key={item.id}>
              <Link to={item.link} onClick={handleHideClick}>
                <span className="text">{item.name}</span>
              </Link>

              {/* If this item has submenus, recursively pass them down */}
              {item.submenus && item.submenus.length > 0 && (
                <Dropdown
                  index={item.id}
                  activeMenu={activeMenu}
                  handleMenuClick={handleMenuClick}
                  iconName={item.iconName}  // Pass the correct iconName
                  title={item.name}
                  handleHideClick={handleHideClick}
                  subItems={item.submenus}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Dropdown;
