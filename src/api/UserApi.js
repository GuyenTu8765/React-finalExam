import Api from "./Api";

const url = "/users";

// const getAll = () => {
//     return Api.get(url);
// };

// const getByID = (id) => {
//     return Api.get(`${url}/${id}`);
// };

const existsByEmail = (email) => {
  return Api.get(`${url}/email/${email}`);
};

const existsByUserName = (userName) => {
  return Api.get(`${url}/userName/${userName}`);
};

const create = (firstName, lastName, userName, email, password) => {
  const body = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    email: email,
    password: password,
  };
  return Api.post(url, body);
};

const resendEmailToActiveAccount = (email) => {
  const parameters = {
    email: email,
  };

  return Api.get(`${url}/userRegistrationConfirmRequest`, {
    params: parameters,
  });
};

const resetPasswordRequest = (email) => {
  const parameters = {
    email: email,
  };

  return Api.get(`${url}/resetPasswordRequest`, {
    params: parameters,
  });
};

const resendEmailToResetPassword = (email) => {
  const parameters = {
    email: email,
  };

  return Api.get(`${url}/resendResetPassword`, {
    params: parameters,
  });
};

const resetPassword = (token, newPassword) => {
  const parameters = {
    token: token,
    newPassword: newPassword,
  };

  return Api.get(`${url}/resetPassword`, {
    params: parameters,
  });
};

const getProfile = () => {
  return Api.get(`${url}/profile`);
};

const updateProfile = (avatarUrl) => {
  const body = {
    avatarUrl: avatarUrl,
  };

  return Api.put(`${url}/profile`, body);
};
// const updateByID = (id, body) => {
//     return Api.put(`${url}/${id}`, body);
// }

// const deleteByID = (id) => {
//     return Api.delete(`${url}/${id}`);
// }

const UserApi = {
  existsByEmail,
  existsByUserName,
  create,
  resendEmailToActiveAccount,
  resetPasswordRequest,
  resendEmailToResetPassword,
  resetPassword,
  getProfile,
  updateProfile,
};
export default UserApi;
