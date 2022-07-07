import axios from "axios";
import React, { useState } from "react";

function Login() {
  const baseURL = "https://api.realworld.io";
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [Error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    let user = {
      email: username,
      password: password,
    };
    axios
      .post(baseURL + "/api/users/login", { user }, {})
      .then((Response) => {
        if (Response.status === 200) {
          localStorage.setItem("jwtToken", Response.data.user.token);
          window.location.pathname = "/";
        }
      })
      .catch((error) => {
        setError(error);
        console.log(error);
      });
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign In</h1>
            <p className="text-xs-center">
              <a href="/Register">Need an account?</a>
            </p>
            <ul className="error-messages">
              {Error ? <li>Invalid Username or Password</li> : <></>}
            </ul>
            <form onSubmit={(e) => handleSubmit(e)}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
                <span className="username-error"></span>
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="password-error"></span>
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
