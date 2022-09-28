import jwt from "jwt-decode";
export const createGoogleOauthObject = (responseobj) => {
  let registrationObj = {
    user: {
      username: "",
      email: "",
      google_token: "",
    },
  };

  if (typeof responseobj == "object") {
    let profileObj = jwt(responseobj.credential);
    registrationObj.user.username = profileObj.name
      .toLowerCase()
      .replace(" ", "_");
    registrationObj.user.email = profileObj.email;
    registrationObj.user.google_token = profileObj.sub;
    console.log(registrationObj);
  }
  return registrationObj;
  // return null;
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
