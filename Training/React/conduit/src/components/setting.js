import React from "react";
import { googleLogout } from "@react-oauth/google";
import { LocalStorage } from "../services/LocalStorage";

function Setting() {
  const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;

  const logoutHandler = () => {
    console.log("Logged Out");
    googleLogout();
    LocalStorage.delete("jwtToken");
    window.location.pathname = "/";
  };

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
              </fieldset>
            </form>
            <div className="col-md-12 text-right mt-2">
              {/* <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={logoutHandler}
              ></GoogleLogout> */}
              <button className="btn btn-lg btn-danger" onClick={logoutHandler}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
