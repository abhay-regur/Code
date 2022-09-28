import jwt from "jwt-decode";
export const createGoogleOauthObject = (responseobj) => {
  let registrationObj = {
    user: {
      email: "",
      password: "",
      google_token: "",
    },
  };

  if (typeof responseobj == "object") {
    let profileObj = jwt(responseobj.credential);
    registrationObj.user.email = profileObj.email;
    registrationObj.user.google_token = profileObj.jti;
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
