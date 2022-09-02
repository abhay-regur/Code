export const createGoogleOauthObject = (responseobj) => {
  let registrationObj = {
    user: {
      email: "",
      password: "",
    },
  };

  if (typeof responseobj == "object") {
    let profileObj = responseobj.profileObj;
    registrationObj.user.email = profileObj.email;
    registrationObj.user.password = profileObj.googleId;
  }
  return registrationObj;
};

export const createLoginObject = (email, password) => {
  let registrationObj = {
    user: {
      email: "",
      password: "",
    },
  };

  registrationObj.user.email = email;
  registrationObj.user.password = password;

  return registrationObj;
};

// export const deleteData = (url, token) => {};
