const setRememberMe = (isRememberMe) => {
  localStorage.setItem("isRememberMe", isRememberMe);
};

const isRememberMe = () => {
  if (
    localStorage.getItem("isRememberMe") === null ||
    localStorage.getItem("isRememberMe") === undefined
  ) {
    return true;
  }
  return JSON.parse(localStorage.getItem("isRememberMe"));
};

const setItem = (key, value) => {
  if (isRememberMe()) {
    localStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, value);
  }
};

const getItem = (key) => {
  if (isRememberMe()) {
    return localStorage.getItem(key);
  } else {
    return sessionStorage.getItem(key);
  }
};

const setToken = (token) => {
  setItem("token", token);
};

const getToken = () => {
  return getItem("token");
};

const setUserInfo = (userName, email, firstName, lastName, role, status) => {
  setItem("email", email);
  setItem("userName", userName);
  setItem("firstName", firstName);
  setItem("lastName", lastName);
  setItem("role", role);
  setItem("status", status);
};

const getUserInfo = () => {
  return {
    userName: getItem("userName"),
    email: getItem("email"),
    firstName: getItem("firstName"),
    lastName: getItem("lastName"),
    role: getItem("role"),
    status: getItem("status"),
  };
};

const removeStorage = () => {
  // infoo = {
  //   name: "quang",

  // }
  // localStorage.setItem('info', JSON.stringify(infoo))
  const tokenLocal = localStorage.getItem("token");
  const tokenSession = sessionStorage.getItem("token");
  console.log(tokenLocal, tokenSession);
  if (!!tokenLocal) {
    localStorage.clear();
  } else if (!!tokenSession) {
    sessionStorage.clear();
  }
};
const storage = {
  setUserInfo,
  getUserInfo,
  setToken,
  getToken,
  setRememberMe,
  isRememberMe,
  removeStorage,
};
export default storage;
