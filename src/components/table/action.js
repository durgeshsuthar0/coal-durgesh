import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPenToSquare, faTrash, faEye, faRotate } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";

const Actions = ({ onEdit, onView, onDelete, onShiftRoster, roleId }) => {
  return (
    <Dropdown className="action-dropdown">
      <Dropdown.Toggle id="dropdown-basic">
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* View Option: Always visible */}
        {onView && (
          <Dropdown.Item onClick={onView} className="view-item">
            <div className="btn-icon-style">
              <FontAwesomeIcon icon={faEye} />
            </div>
            View
          </Dropdown.Item>
        )}

        {/* Edit Option: Always visible */}
        {onEdit && (
          <Dropdown.Item onClick={onEdit} className="edit-item">
            <div className="btn-icon-style">
              <FontAwesomeIcon icon={faPenToSquare} />
            </div>
            Edit
          </Dropdown.Item>
        )}

        {/* Delete Option: Always visible */}
        {onDelete && (
          <Dropdown.Item onClick={onDelete} className="delete-item">
            <div className="btn-icon-style">
              <FontAwesomeIcon icon={faTrash} />
            </div>
            Delete
          </Dropdown.Item>
        )}

        {/* Shift Roster Option: Always visible */}
        {onShiftRoster && (
          <Dropdown.Item onClick={onShiftRoster} className="shift-roster-item">
            <div className="btn-icon-style">
              <FontAwesomeIcon icon={faRotate} />
            </div>
            Shift Roster
          </Dropdown.Item>
        )}

      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Actions;
