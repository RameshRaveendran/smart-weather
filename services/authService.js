// Auth service: user registration and login business logic will be implemented here.

const registerUser = async ({ name, email, password }) => {
  // TODO: Implement user registration (validate, hash password, save, generate token)
  return {
    user: null,
    token: null,
  };
};

const loginUser = async ({ email, password }) => {
  // TODO: Implement login (find user, verify password, generate token)
  return {
    user: null,
    token: null,
  };
};

module.exports = {
  registerUser,
  loginUser,
};

