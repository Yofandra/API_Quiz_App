// const roleAccess = (userRole, endpoint, accessConfig, method) => {
//     const endpointConfig = accessConfig[endpoint];

//     if (endpointConfig) {
//         if (endpointConfig[userRole]) {
//             if (userRole === 'admin' && method !== 'GET') {
//                 return false;
//             }
//             return true;
//         }
//     }
//     return true;
// }

const roleAccess = (userRole, endpoint, method) => {
  if (userRole === "admin" && method !== "GET" && endpoint === "/room") {
    return false;
  } else if (userRole !== "user" && endpoint === "/doQuiz") {
    return false
  } else {
    return true
  }
};

export default roleAccess;
