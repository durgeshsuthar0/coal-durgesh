// import { addContainer,getContainerList } from "../services/allServices/addContainerService";

// export const useContainer = () => {
 

//   const saveContainer = async (data) => {
//     try {
//       const response = await addContainer( data);
//       if (response.status) {
//         return response.data;
//       } else {
//         console.error("Failed to save container:", response.message);
//       }
//     } catch (error) {
//       console.error("Error saving container:", error);
//     }
//   };

  
//   const fetchContainer = async (yardId) => {
//     try {
//         const response = await getContainerList(yardId);
//         if (response.status) {
//             return response.data.data;
//         }
//         console.error("Failed to fetch container:", response.message);
//         return [];
//     } catch (err) {
//         console.error("Error:", err);
//         return [];
//     }
// };

// return {
//     saveContainer,
//     fetchContainer
// };
// };

// src/hooks/useContainerForm.js
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const useContainer = () => {
  const yardId = useSelector((state) => state.auth.selectedYardId);
  const personInfoId = useSelector((state) => state.auth.id);

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    containerUniqueNumber: '',
    isEmpty: false,
    weight: '',
    vehicleNo: '',
    vehicleDriverName: '',
    vehicleDriverContact: '',
    containerDescription: '',
    entryBy: '',
    event: '',
    containerTypeId: '',
    containerMaterial: '',
    personInfoId: personInfoId,
    yardId: yardId,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      containerUniqueNumber: '',
      isEmpty: false,
      weight: '',
      vehicleNo: '',
      vehicleDriverName: '',
      vehicleDriverContact: '',
      containerDescription: '',
      entryBy: '',
      event: '',
      containerTypeId: '',
      containerMaterial: '',
      personInfoId: personInfoId,
      yardId: yardId,
    });
    setValidated(false);
  };

  return {
    validated,
    formData,
    handleChange,
    resetForm,
    setValidated,
  };
};
