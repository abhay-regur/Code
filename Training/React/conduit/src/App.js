import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initGoogleAPI } from "./services/googleAPIServices";
import { LocalStorage } from "./services/LocalStorage";
import { gapi } from "gapi-script";
import Content from "./components/content";
import Editor from "./components/editor";
import Login from "./components/login";
import Register from "./components/register";
import Setting from "./components/setting";
import Article from "./components/article";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Profile from "./components/profile";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    gapi.load("client:auth2", initGoogleAPI); // Initalize Google API's

    let authToken = LocalStorage.get("jwtToken");
    if (authToken) {
      axios
        .get(baseURL + "/api/user", {
          headers: { Authorization: `Token ${authToken}` },
        })
        .then((Response) => {
          if (Response.status === 200) {
            setUsername(Response.data.user.username);
            setUserEmail(Response.data.user.email);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      {username ? (
        <Navbar isAuthenticated={true} loggedUser={username} />
      ) : (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/newArticle" element={<Editor />} />
        <Route path="/article" element={<Article username={username} />}>
          <Route path=":articleSlug" element={<Article />} />
        </Route>
        <Route
          path="/setting"
          element={<Setting username={username} email={userEmail} />}
        />
        <Route path="/profile" element={<Profile username={username} />}>
          <Route path=":Username" element={<Profile />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
