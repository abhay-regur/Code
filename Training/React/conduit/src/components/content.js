import React, { useEffect, useState } from "react";
import Header from "./header";
import TagList from "./taglist.js";
import ArticlePreview from "./articlepreview.js";
import PropTypes from "prop-types";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay";
import { LocalStorage } from "../services/LocalStorage";

export default function Content(props) {
  const baseURL = process.env.REACT_APP_API_URL;

  const [isRunning, setisRunning] = useState(false);
  const [activeId, setActiveId] = useState();
  const [selectedTag, setselectedTag] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [tagItemsList, settagItemsList] = useState([]);
  const [token, setToken] = useState("");
  const [articleObj, setarticleObj] = useState({});
  const [articleCount, setArticleCount] = useState();

  useEffect(() => {
    let authToken = LocalStorage.get("jwtToken");
    if (authToken) {
      getArticles(authToken, baseURL + "/api/articles/feed?");
      setActiveId("feedBtn");
    } else {
      getArticles("", baseURL + "/api/articles?");
      setActiveId("globalBtn");
    }
    setToken(authToken);
    getTagsFromdb(authToken);
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
            setarticleObj(response.data.articles);
            setArticleCount(response.data.articlesCount);
            setisLoading(false);
          }
        })
        .catch((error) => {
          setisRunning(false);
          console.log(error);
          setisLoading(false);
        });
    }
  };

  const getTagsFromdb = (token) => {
    if (!isRunning) {
      setisRunning(true);
      setisLoading(true);
      axios
        .get(baseURL + "/api/tags", {
          headers: { Authorization: `Token ${token || ""}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setisRunning(false);
            settagItemsList(response.data.tags);
            setisLoading(false);
          }
        })
        .catch((error) => {
          setisRunning(false);
          console.log(error);
          setisLoading(false);
        });
    }
  };

  const handleArticleChange = (article) => {
    setarticleObj(article);
  };

  const handleClick = (event, type) => {
    event.stopPropagation();
    setActiveId(event.target.id);
    getArticles(token, baseURL + type);
  };

  const handleBtnClick = (event, key) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isRunning) {
      if (token) {
        let obj = Object.assign({}, articleObj);
        setisRunning(true);
        setisLoading(true);
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
                obj = Object.values(obj).filter((ob) => {
                  return response.data.article.slug === ob.slug
                    ? (ob = response.data.article)
                    : ob;
                });
                handleArticleChange(obj);
                setisRunning(false);
                setisLoading(false);
              }
            })
            .catch((error) => {
              setisRunning(false);
              console.log(error);
              setisLoading(false);
            });
        } else {
          axios
            .delete(baseURL + "/api/articles/" + key + "/favorite", {
              headers: { Authorization: `Token ${token}` },
            })
            .then((response) => {
              if (response.status === 200) {
                obj = Object.values(obj).filter((ob) => {
                  return response.data.article.slug === ob.slug
                    ? (ob = response.data.article)
                    : ob;
                });
                handleArticleChange(obj);
                setisRunning(false);
                setisLoading(false);
              }
            })
            .catch((error) => {
              setisRunning(false);
              console.log(error);
              setisLoading(false);
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

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text="Loading article..."
      styles={{
        overlay: (base) => ({
          ...base,
          background: "rgba(0, 0, 0, 0.9)",
        }),
      }}
    >
      <div className="main main-wrapper">
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
              {
                <ArticlePreview
                  article={articleObj}
                  handleClick={handleBtnClick}
                />
              }
            </div>
            <div className="col-md-3">
              <div className="card sidebar mt-2">
                <div className="card-body">
                  <h6 className="card-title">Popular Tags</h6>
                  <TagList
                    tagLists={tagItemsList}
                    handleClick={handletagClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

Content.defaultProps = {
  tagHeading: "",
};

Content.propTypes = {
  tagHeading: PropTypes.string,
};
