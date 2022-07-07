import React, { useEffect, useState } from "react";
import Header from "./header";
import TagList from "./taglist.js";
import ArticlePreview from "./articlepreview.js";
import PropTypes from "prop-types";
import axios from "axios";

export default function Content(props) {
  // const baseURL = "http://127.0.0.1:8000";
  const baseURL = "https://api.realworld.io";
  const [isRunning, setisRunning] = useState(false);
  const [activeId, setActiveId] = useState();
  const [selectedTag, setselectedTag] = useState("");
  // const [isupdate, setisUpdated] = useState(false);
  const [tagItemsList, settagItemsList] = useState([]);
  const [token, setToken] = useState("");
  const [articleObj, setarticleObj] = useState({
    articles: [],
    articlesCount: 0,
  });

  useEffect(() => {
    let authToken = localStorage.getItem("jwtToken");
    if (authToken) {
      getArticles(authToken, baseURL + "/api/articles/feed?");
      setActiveId("feedBtn");
    } else {
      getArticles("", baseURL + "/api/articles?");
      setActiveId("globalBtn");
    }
    setToken(authToken);

    if (!isRunning) {
      setisRunning(true);
      axios
        .get(baseURL + "/api/tags", {
          headers: { Authorization: `Token ${authToken || ""}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setisRunning(false);
            settagItemsList(response.data.tags);
          }
        })
        .catch((error) => {
          setisRunning(false);
          console.log(error);
        });
    }
  }, []);

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
            setarticleObj(response.data);
          }
        })
        .catch((error) => {
          setisRunning(false);
          console.log(error);
        });
    }
  };

  const handleArticleupdate = (article) => {
    setarticleObj({ ...articleObj, [article.favorited]: article });
  };

  const handleClick = (event, type) => {
    setActiveId(event.target.id);
    getArticles(token, baseURL + type);
  };

  const handleBtnClick = (event, key) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isRunning) {
      if (token) {
        setisRunning(true);
        let followingStatus =
          event.currentTarget.classList.contains("btn-following");

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
                setisRunning(false);
                handleArticleupdate(articleObj);
                // event.currentTarget.classList.toggle("btn-following");
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
                handleArticleupdate(response.data.article);
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

  const handletagClick = (event) => {
    event.preventDefault();
    let tag = event.currentTarget.innerText.split("#").pop();
    setActiveId("tagBbtn");
    getArticles(token, baseURL + "/api/articles?tag=" + tag + "&");
    setselectedTag(tag);
  };

  const handleAuthorClick = (author) => {
    setActiveId("tagBbtn");
    getArticles(token, baseURL + "/api/articles?author=" + author + "&");
    setselectedTag(author);
  };
  return (
    <div className="main-wrapper">
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {token ? (
                  <>
                    <li className="nav-item">
                      <button
                        id="feedBtn"
                        className={
                          activeId === "feedBtn"
                            ? "nav-link active"
                            : "nav-link"
                        }
                        onClick={(event) =>
                          handleClick(event, "/api/articles/feed?")
                        }
                      >
                        Your Feed
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        id="globalBtn"
                        className={
                          activeId === "globalBtn"
                            ? "nav-link active"
                            : "nav-link"
                        }
                        onClick={(event) =>
                          handleClick(event, "/api/articles?")
                        }
                      >
                        Global Feed
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <button
                        id="globalBtn"
                        className={
                          activeId === "globalBtn"
                            ? "nav-link active"
                            : "nav-link"
                        }
                        onClick={(event) =>
                          handleClick(event, "/api/articles?")
                        }
                      >
                        Global Feed
                      </button>
                    </li>
                  </>
                )}

                {selectedTag ? (
                  <>
                    <li id="tagNavPill" className="nav-item">
                      <button
                        id="tagBbtn"
                        className={
                          activeId === "tagBbtn"
                            ? "nav-link active"
                            : "nav-link"
                        }
                        onClick={(event) =>
                          handleClick(
                            event,
                            "/api/articles?tag=" + selectedTag + "&"
                          )
                        }
                      >
                        {"#" + selectedTag}
                      </button>
                    </li>
                  </>
                ) : (
                  <></>
                )}
              </ul>
            </div>
            {articleObj.articlesCount > 0 ? (
              <ArticlePreview
                {...articleObj}
                handleClick={handleBtnClick}
                handleAuthorClick={handleAuthorClick}
              />
            ) : (
              <>No articles are here... yet.</>
            )}
          </div>
          <div className="col-md-3">
            <div className="card sidebar">
              <div className="card-body">
                <h6 className="card-title">Popular Tags</h6>
                <TagList tagLists={tagItemsList} handleClick={handletagClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Content.defaultProps = {
  tagHeading: "",
};

Content.propTypes = {
  tagHeading: PropTypes.string,
};
