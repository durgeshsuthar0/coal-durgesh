import {
  SET_TOKEN,
  SET_EMAIL,
  SET_ROLE_NAME,
  SET_ROLE_ID,
  SET_ID,
  LOGOUT,
  SET_SELECTED_YARD_ID,
  SET_MOBILE,
  SET_FIRST_NAME,
  SET_LAST_NAME,
  SET_PERSON_UUID,
} from './action';
import Cookies from 'js-cookie';

const initialState = {
  token: Cookies.get("token") || "",
  email: Cookies.get("email") || "",
  roleName: Cookies.get("roleName") || "",
  roleId: Cookies.get("roleId") || "",
  id: Cookies.get("id") || "",
  yardUUID: Cookies.get("yard") || "",
  mobile: Cookies.get("mobile") || "",
  firstName: Cookies.get("firstName") || "",
  lastName: Cookies.get("lastName") || "",
  personUUID: Cookies.get("personUUID") || "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      Cookies.set("token", action.payload, { sameSite: 'Lax' });
      return {
        ...state,
        token: action.payload,
      };
    case SET_EMAIL:
      Cookies.set("email", action.payload, { sameSite: 'Lax' });
      return {
        ...state,
        email: action.payload,
      };
    case SET_MOBILE:
      Cookies.set("mobile", action.payload, { sameSite: 'Lax' });
      return {
        ...state,
        mobile: action.payload,
      };
    case SET_ROLE_NAME:
      Cookies.set("roleName", action.payload, { sameSite: 'Lax' });
      return {
        ...state,
        roleName: action.payload,
      };
    case SET_ROLE_ID:
      Cookies.set("roleId", action.payload, { sameSite: 'Lax' });
      return {
        ...state,
        roleId: action.payload,
      };
    case SET_ID:
      Cookies.set("id", action.payload, { sameSite: 'Lax' });
      return {
        ...state,
        id: action.payload,
      };
    case SET_SELECTED_YARD_ID:
      Cookies.set("yard", action.payload, { sameSite: 'Lax' });
      return {
        ...state,
        yardUUID: action.payload,
      };
    case SET_FIRST_NAME:
      Cookies.set("firstName", action.payload, { sameSite: 'Lax' });
      return {
        ...state,
        firstName: action.payload,
      };
    case SET_LAST_NAME:
      Cookies.set("lastName", action.payload, { sameSite: 'Lax' });
      return {
        ...state,
        lastName: action.payload,
      };
    case SET_PERSON_UUID:
      Cookies.set("personUUID", action.payload, { sameSite: 'Lax' });
      return {
        ...state,
        personUUID: action.payload,
      };
    case LOGOUT:
      Cookies.remove("token");
      Cookies.remove("email");
      Cookies.remove("roleName");
      Cookies.remove("roleId");
      Cookies.remove("id");
      Cookies.remove("yard");
      Cookies.remove("mobile");
      Cookies.remove("firstName");
      Cookies.remove("lastName");
      Cookies.remove("personUUID");

      return initialState;
    default:
      return state;
  }
};

export default authReducer;
