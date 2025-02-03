import Cookies from 'js-cookie';

export const SET_TOKEN = 'SET_TOKEN';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_ROLE_NAME = 'SET_ROLE_NAME';
export const SET_ROLE_ID = 'SET_ROLE_ID';
export const SET_ID = 'SET_ID';
export const LOGOUT = 'LOGOUT';
export const SET_SELECTED_YARD_ID = 'SET_SELECTED_YARD_ID';
export const SET_MOBILE = "SET_MOBILE";
export const SET_FIRST_NAME = "SET_FIRST_NAME";
export const SET_LAST_NAME = "SET_LAST_NAME";
export const SET_PERSON_UUID = "SET_PERSON_UUID";

export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

export const setMobile = (mobile) => ({
  type: SET_MOBILE,
  payload: mobile,
});

export const setEmail = (email) => ({
  type: SET_EMAIL,
  payload: email,
});

export const setRoleName = (roleName) => ({
  type: SET_ROLE_NAME,
  payload: roleName,
});

export const setRoleId = (roleId) => ({
  type: SET_ROLE_ID,
  payload: roleId,
});

export const setID = (id) => ({
  type: SET_ID,
  payload: id,
});

export const setYardId = (yardId) => ({
  type: SET_SELECTED_YARD_ID,
  payload: yardId,
});

export const setFirstName = (firstName) => ({
  type: SET_FIRST_NAME,
  payload: firstName,
});

export const setLastName = (lastName) => ({
  type: SET_LAST_NAME,
  payload: lastName,
});

export const setPersonUUID = (personUUID) => ({
  type: SET_PERSON_UUID,
  payload: personUUID,
});

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('email');
  Cookies.remove('roleName');
  Cookies.remove('id');
  Cookies.remove('yard');
  Cookies.remove('mobile');
  Cookies.remove('firstName');
  Cookies.remove('lastName');
  Cookies.remove('personUUID');
  Cookies.remove('roleId');

  return {
    type: LOGOUT,
  };
};
