import React, { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import { LocalStorage } from "../services/LocalStorage";

import axios from "axios";

function Setting(props) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [isRunning, setisRunning] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [username, setUsername] = useState("");
  const [userBio, setUserBio] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let name = props.username;
    let authToken = LocalStorage.get("jwtToken");
    getCurrentUserDetails(name, authToken);
  }, []);

  const getCurrentUserDetails = (name, token) => {
    if (!isRunning) {
      axios
        .get(baseURL + "/api/profiles/" + name, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setisRunning(false);
            setValuesToInput(response.data);
          }
        })
        .catch((error) => {
          setisRunning(false);
          console.log(error);
        });
    }
  };

  const setValuesToInput = (userDetails) => {
    if (userDetails.profile.image != null)
      setImageUrl(userDetails.profile.image);
    if (userDetails.profile.username != null)
      setUsername(userDetails.profile.username);
    if (userDetails.profile.bio != null) setUserBio(userDetails.profile.bio);
    setUserEmail(props.email);
  };

  const updateUserDetails = (event) => {
    event.preventDefault();
    let authToken = LocalStorage.get("jwtToken");
    if (!isRunning) {
      axios
        .put(
          baseURL + "/api/user",
          {
            user: {
              bio: userBio,
              image: imageUrl,
            },
          },
          {
            headers: { Authorization: `Token ${authToken}` },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setisRunning(false);
            console.log(response);
          }
        })
        .catch((error) => {
          setisRunning(false);
          console.log(error);
        });
    }
  };

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
                    value={imageUrl}
                    placeholder="URL of profile picture"
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    value={username}
                    disabled
                    placeholder="Your Name"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    disabled
                    value={userEmail}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  onClick={(e) => updateUserDetails(e)}
                >
                  Update Settings
                </button>
              </fieldset>
            </form>
            <div className="col-md-12 text-right mt-2">
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
