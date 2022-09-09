import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { LocalStorage } from "../services/LocalStorage";
import {
  createGoogleOauthObject,
  createRegistrationObject,
} from "../services/registrationServices";
import axios from "axios";

function Register() {
  const baseURL = process.env.REACT_APP_API_URL;
  const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setemailError] = useState("");
  const [uNameError, setuNameError] = useState("");

  const setError = (error) => {
    console.log(error);
    if (error.response.data.errors["user.username"] !== undefined) {
      setuNameError(
        error.response.data.errors["user.username"][0].replace(
          "user.username",
          "username"
        )
      );
    }
    if (error.response.data.errors["user.email"] !== undefined) {
      setemailError(
        error.response.data.errors["user.email"][0].replace(
          "user.email",
          "email"
        )
      );
    }
  };

  const handleResponse = (response) => {
    if (response.status === 200) {
      let userData = response.data.user;
      LocalStorage.set(userData.token);
      window.location.pathname = "/";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendDataToDatabase(createRegistrationObject(username, email, password));
    setuNameError("");
    setemailError("");
  };

  const sendDataToDatabase = (profileDetailsObj) => {
    let user = profileDetailsObj.user;
    axios
      .post(baseURL + "/api/users", {
        user,
      })
      .then((response) => {
        handleResponse(response);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const responseGoogleOauth = (response) => {
    if (typeof response == "object") {
      // console.log(response);
      sendDataToDatabase(createGoogleOauthObject(response));
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Sign Up</h1>
          <p className="text-xs-center">
            <a href="/login">Already have an account?</a>
          </p>
          <form className="form-group" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                className="form-control form-control-lg"
                id="userName"
                required="required"
                onChange={(e) => setUserName(e.target.value)}
              />
              {uNameError && <div className="error"> {uNameError} </div>}
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                className="form-control form-control-lg"
                id="userEmail"
                required="required"
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <div className="error"> {emailError} </div>}
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                className="form-control form-control-lg"
                id="userPassword"
                required="required"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <input
              type="submit"
              className="btn btn-lg btn-success pull-xs-right"
              value="Sign Up"
            />
          </form>
          <div className="row">
            <div className="col-md-12 text-center h5">Or</div>
            <div className="col-md-12 text-center">
              <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                  onSuccess={responseGoogleOauth}
                  onError={responseGoogleOauth}
                  useOneTap
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
