import React, { useState } from "react";
import axios from "axios";

function register() {
  const baseURL = "https://api.realworld.io";
  // const baseURL = "http://127.0.0.1:8000";
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
      console.log(userData);
      localStorage.setItem("jwtToken", userData.token);
      window.location.pathname = "/";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setuNameError("");
    setemailError("");
    axios
      .post(baseURL + "/api/users", {
        user: {
          username: username,
          email: email,
          password: password,
        },
      })
      .then((response) => {
        handleResponse(response);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-center">Sign Up</h1>
          <p className="text-center">
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
        </div>
      </div>
    </div>
  );
}

export default register;
