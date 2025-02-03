// import React from "react";
// import { TagInventoryListSec } from "./tag-InventoryList";

// export const TagInventoryList = ({ isToggled }) => {
//   return (
//     <React.Fragment>
//       <div className="admin-content">
//         <TagInventoryListSec isToggled={isToggled} />
//       </div>
//     </React.Fragment>
//   );
// };


import React from "react";
import { TagInventoryListSec } from "./tag-list";
import { TagFormSec } from "./tag-add";
 
export const TagInventoryList = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <TagInventoryListSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};

export const TagForm = ({ isToggled }) => {
  return (
    <React.Fragment>
      <div className="admin-content">
        <TagFormSec isToggled={isToggled} />
      </div>
    </React.Fragment>
  );
};
