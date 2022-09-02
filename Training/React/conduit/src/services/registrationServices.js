export const createGoogleOauthObject = (responseobj) => {
  let registrationObj = {
    user: {
      username: "",
      email: "",
      password: "",
    },
  };

  if (typeof responseobj == "object") {
    let profileObj = responseobj.profileObj;
    registrationObj.user.username = profileObj.name.replace(" ", "_");
    registrationObj.user.email = profileObj.email;
    registrationObj.user.password = profileObj.googleId;
  }
  return registrationObj;
};

export const createRegistrationObject = (username, email, password) => {
  let registrationObj = {
    user: {
      username: "",
      email: "",
      password: "",
    },
  };
  registrationObj.user.username = username;
  registrationObj.user.email = email;
  registrationObj.user.password = password;

  return registrationObj;
};

// export const deleteData = (url, token) => {};
