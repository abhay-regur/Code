import axios from "axios";
import ArticlePreview from "./articlepreview.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile(props) {
  const baseURL = process.env.REACT_APP_API_URL;
  const defaultImage = process.env.REACT_APP_DEFAULT_IMG;
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [activeId, setActiveId] = useState();
  const [isUser, setisUser] = useState(false);
  const [isRunning, setisRunning] = useState(false);
  const [articleObj, setarticleObj] = useState({});
  const [articleCount, setArticleCount] = useState();
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    let authToken = localStorage.getItem("jwtToken");
    let name = window.location.pathname.split("@").pop();
    setActiveId("myArticle");
    setisUser(name === props.username ? true : false);
    setToken(authToken);
    getprofileDetails(name);
  }, []);

  const getprofileDetails = (name) => {
    if (!isRunning) {
      setisRunning(true);
      axios
        .get(baseURL + "/api/profiles/" + name, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((Response) => {
          if (Response.status === 200) {
            setProfileData(Response.data.profile);
            getArticles(
              token,
              baseURL + "/api/articles?author=" + profileData.username + "&"
            );
            setisRunning(false);
          }
        })
        .catch((error) => {
          console.log(error.message);
          setisRunning(false);
        });
    }
  };

  const getArticles = (token, url) => {
    if (!isRunning) {
      setisRunning(true);
      axios
        .get(url + "limit=10&offset=0", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setisRunning(false);
            setarticleObj(response.data.articles);
            setArticleCount(response.data.articlesCount);
          }
        })
        .catch((error) => {
          setisRunning(false);
          console.log(error);
        });
    }
  };

  const handleFollow = (e) => {
    e.preventDefault();
    if (!isRunning && token) {
      let obj = { ...profileData };
      setisRunning(true);
      if (!e.target.classList.contains("btn-secondary-active")) {
        axios
          .post(
            baseURL + "/api/profiles/" + profileData.username + "/follow",
            {},
            {
              headers: { Authorization: `Token ${token}` },
            }
          )
          .then((Response) => {
            if (Response.status === 200) {
              obj.following = true;
              setProfileData(obj);
              setisRunning(false);
            }
          })
          .catch((error) => {
            console.log(error.message);
            setisRunning(false);
          });
      } else {
        axios
          .delete(
            baseURL + "/api/profiles/" + profileData.username + "/follow",
            {
              headers: { Authorization: `Token ${token}` },
            }
          )
          .then((Response) => {
            if (Response.status === 200) {
              obj.following = false;
              setProfileData(obj);
              setisRunning(false);
            }
          })
          .catch((error) => {
            console.log(error.message);
            setisRunning(false);
          });
      }
    }
    e = null;
  };

  const handleClick = (event, type) => {
    event.stopPropagation();
    setActiveId(event.target.id);
    getArticles(token, baseURL + type);
  };

  const handleArticleChange = (article) => {
    setarticleObj(
      articleObj.map((ar) => {
        return ar.slug === article.slug
          ? { ...ar, favorited: article.favorited } && {
              ...ar,
              favoritesCount: article.favoritesCount,
            }
          : ar;
      })
    );
  };

  const handleBtnClick = (event, key) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isRunning) {
      if (token) {
        setisRunning(true);
        let followingStatus =
          event.currentTarget.classList.contains("btn-success-active");

        if (!followingStatus) {
          axios
            .post(
              baseURL + "/api/articles/" + key + "/favorite",
              {},
              {
                headers: { Authorization: `Token ${token}` },
              }
            )
            .then((response) => {
              if (response.status === 200) {
                handleArticleChange(response.data.article);
                setisRunning(false);
              }
            })
            .catch((error) => {
              setisRunning(false);
              console.log(error);
            });
        } else {
          axios
            .delete(baseURL + "/api/articles/" + key + "/favorite", {
              headers: { Authorization: `Token ${token}` },
            })
            .then((response) => {
              if (response.status === 200) {
                handleArticleChange(response.data.article);
                setisRunning(false);
              }
            })
            .catch((error) => {
              setisRunning(false);
              console.log(error);
            });
        }
      } else {
        window.alert("Login Please");
      }
    }
  };

  const changeLocation = (url) => {
    navigate(url);
  };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={profileData.image || defaultImage}
                className="user-img"
                alt=""
              />
              <h4>{profileData.username}</h4>
              <p>{profileData.bio}</p>
              {isUser ? (
                <button
                  className={"btn btn-sm btn-outline-secondary"}
                  onClick={() => {
                    changeLocation("/setting/");
                  }}
                >
                  <i className="material-icons material-icons-outlined">
                    settings
                  </i>
                  &nbsp; Edit {profileData.username}
                </button>
              ) : (
                <button
                  className={
                    profileData.following
                      ? "btn btn-sm btn-outline-secondary btn-secondary-active"
                      : "btn btn-sm btn-outline-secondary"
                  }
                  onClick={(event) => {
                    handleFollow(event);
                  }}
                >
                  <i className="material-icons material-icons-outlined">add</i>
                  &nbsp; Follow {profileData.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <button
                    id="myArticle"
                    className={
                      activeId === "myArticle" ? "nav-link active" : "nav-link"
                    }
                    onClick={(event) =>
                      handleClick(
                        event,
                        "/api/articles?author=" + profileData.username + "&"
                      )
                    }
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    id="favArticle"
                    className={
                      activeId === "favArticle" ? "nav-link active" : "nav-link"
                    }
                    onClick={(event) =>
                      handleClick(
                        event,
                        "/api/articles?favorited=" + profileData.username + "&"
                      )
                    }
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>
            {
              <ArticlePreview
                article={articleObj}
                handleClick={handleBtnClick}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
