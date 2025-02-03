// // api.js
// import axios from 'axios';

// // Create an Axios instance with default headers and configurations
// const baseURLs = {
//   production: 'http://192.168.1.12:9091/api',
//   development: 'http://192.168.1.12:9091/api',
//   secondary: 'http://192.168.1.12:9091/api',
//   common_service: 'http://192.168.1.12:9091/api',
// };

// // Create Axios instances for each base URL
// const primaryApi = axios.create({
//   baseURL: process.env.REACT_APP_NODE_ENV === 'production' ? baseURLs.production : baseURLs.development,
//   headers: {
//       'Content-Type': 'application/json',
//   },
// });


// export { primaryApi};
// api.js




// // api.js
import axios from 'axios'

export const baseURL =
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_PROD_REST_API
    : process.env.REACT_APP_DEV_REST_API
//: process.env.REACT_APP_DEV_REST_API
 
const primaryApi = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    // Add any other common headers here
  },
})
 
export { primaryApi };