import axios from "axios";
import React, { useEffect, useState } from "react";
import { updateFollowCount, updateFavoriteCount } from "../services/apiService";

function Article(props) {
  const [token, setToken] = useState();
  const [articleSlug, setArticleSlug] = useState();
  const [postComment, setPostComment] = useState();
  const [isRunning, setisRunning] = useState(false);
  const [articleUpdated, setArticleupdated] = useState(false);
  const [article, setArticle] = useState({
    slug: "",
    title: "",
    description: "",
    body: "",
    tagList: ["", ""],
    createdAt: "2000-01-01T03:00:00.637Z",
    updatedAt: "2000-01-01T03:00:00.824Z",
    favorited: false,
    favoritesCount: 0,
    author: {
      username: "",
      bio: "",
      image: "",
      following: false,
    },
  });

  const [comments, setComments] = useState();

  const baseURL = process.env.REACT_APP_API_URL;
  const defaultImage = process.env.REACT_APP_DEFAULT_IMG;

  useEffect(() => {
    let authToken = localStorage.getItem("jwtToken");
    let slug = window.location.pathname.split("/").pop();
    let obj = { ...article };
    if (!isRunning && slug) {
      setisRunning(true);
      axios
        .get(baseURL + "/api/articles/" + slug, {
          headers: { Authorization: `Token ${authToken || ""}` },
        })
        .then((Response) => {
          if (Response.status === 200) {
            obj = Object.assign(Response.data.article);
            setArticle(obj);
            setisRunning(false);
            setArticleSlug(slug);
            setToken(authToken);
          }
        })
        .catch((error) => {
          console.log(error.message);
          setToken(authToken);
          setisRunning(false);
        });
      obj = null;

      axios
        .get(baseURL + "/api/articles/" + slug + "/comments", {
          headers: { Authorization: `Token ${authToken || ""}` },
        })
        .then((Response) => {
          if (Response.status === 200) {
            obj = Object.assign(Response.data.comments);
            setComments(obj);
          }
        });
    }
  }, []);

  useEffect(() => {
    setArticleupdated(true);
  }, [article]);

  const updateFollow = (e) => {
    e.preventDefault();
    if (!isRunning && token) {
      let obj = { ...article };
      setisRunning(true);
      if (!e.target.classList.contains("btn-secondary-active")) {
        axios
          .post(
            baseURL + "/api/profiles/" + article.author.username + "/follow",
            {},
            {
              headers: { Authorization: `Token ${token}` },
            }
          )
          .then((Response) => {
            if (Response.status === 200) {
              obj.author.following = true;
              setArticle(obj);
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
            baseURL + "/api/profiles/" + article.author.username + "/follow",
            {
              headers: { Authorization: `Token ${token}` },
            }
          )
          .then((Response) => {
            if (Response.status === 200) {
              obj.author.following = false;
              setArticle(obj);
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

  const updateFavorite = (event) => {
    event.preventDefault();
    if (!isRunning && token) {
      let obj = { ...article };
      setisRunning(true);
      if (!event.target.classList.contains("btn-success-active")) {
        axios
          .post(
            baseURL + "/api/articles/" + articleSlug + "/favorite",
            {},
            {
              headers: { Authorization: `Token ${token}` },
            }
          )
          .then((Response) => {
            if (Response.status === 200) {
              obj.favorited = true;
              obj.favoritesCount++;
              setArticle(obj);
              setisRunning(false);
            }
          })
          .catch((error) => {
            console.log(error.message);
            setisRunning(false);
          });
      } else {
        axios
          .delete(baseURL + "/api/articles/" + articleSlug + "/favorite", {
            headers: { Authorization: `Token ${token}` },
          })
          .then((Response) => {
            if (Response.status === 200) {
              obj.favorited = false;
              obj.favoritesCount--;
              setArticle(obj);
              setisRunning(false);
            }
          })
          .catch((error) => {
            console.log(error.message);
            setisRunning(false);
          });
      }
    }
    event = null;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let comment = postComment;
    setPostComment("");
    let obj = Object.assign(comments);
    if (!isRunning && token) {
      setisRunning(true);
      axios
        .post(
          baseURL + "/api/articles/" + articleSlug + "/comments",
          {
            comment: { body: comment },
          },
          {
            headers: { Authorization: `Token ${token}` },
          }
        )
        .then((Response) => {
          if (Response.status === 200) {
            obj.push(Response.data.comment);
            setComments(obj);
            setisRunning(false);
          }
        })
        .catch((error) => {
          console.log(error.message);
          setisRunning(false);
        });
    }
    event = null;
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    if (!isRunning && token) {
      setisRunning(true);
      axios
        .delete(baseURL + "/api/articles/" + articleSlug + "/comments/" + id, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((Response) => {
          if (Response.status === 200) {
            setComments(comments.filter((obj) => obj.id !== id));
            setisRunning(false);
          }
        })
        .catch((error) => {
          console.log(error.message);
          setisRunning(false);
        });
    }
  };

  return (
    <div className="main article-wrapper">
      {/* <button onClick={(e) => debugger_(e)}>debugger</button> */}
      {articleUpdated ? (
        <div className="article-page">
          <div className="banner">
            <div className="container">
              <h1>{article.title || ""}</h1>

              <div className="article-meta">
                <a href={"/profile/" + article.author.username}>
                  <img
                    src={article.author.image || { defaultImage }}
                    alt={article.author.username}
                  />
                </a>
                <div className="info">
                  <a
                    href={"/profile/" + article.author.username}
                    className="author"
                  >
                    {article.author.username}
                  </a>
                  <time className="date" dateTime={article.createdAt}>
                    {new Date(article.createdAt).toDateString()}
                  </time>
                </div>
                <button
                  className={
                    article.author.following
                      ? "btn btn-sm btn-outline-secondary btn-secondary-active"
                      : "btn btn-sm btn-outline-secondary"
                  }
                  onClick={(event) => updateFollow(event)}
                >
                  <i className="material-icons material-icons-outlined">add</i>
                  &nbsp; Follow {article.author.username}
                </button>
                &nbsp;&nbsp;
                <button
                  className={
                    article.favorited
                      ? "btn btn-sm btn-outline-success btn-success-active"
                      : "btn btn-sm btn-outline-success"
                  }
                  onClick={(event) => updateFavorite(event)}
                >
                  <i className="material-icons material-icons-outlined">
                    favorite
                  </i>
                  &nbsp; Favorite Post{" "}
                  <span className="counter">({article.favoritesCount})</span>
                </button>
              </div>
            </div>
          </div>

          <div className="container page">
            <div className="row article-content">
              <div className="col-md-12">
                <p>{article.description}</p>
                <p>{article.body}</p>
              </div>
            </div>

            <hr />

            <div className="article-actions">
              <div className="article-meta">
                <a href={"/profile/" + article.author.username}>
                  <img
                    src={article.author.image || { defaultImage }}
                    alt={article.author.name}
                  />
                </a>
                <div className="info">
                  <a href={"/profile/" + article.username} className="author">
                    {article.author.username}
                  </a>
                  <time className="date" dateTime={article.createdAt}>
                    {new Date(article.createdAt).toDateString()}
                  </time>
                </div>
                <button
                  className={
                    article.author.following
                      ? "btn btn-sm btn-outline-secondary btn-secondary-active"
                      : "btn btn-sm btn-outline-secondary"
                  }
                  onClick={(event) => updateFollow(event)}
                >
                  <i className="material-icons material-icons-outlined">add</i>
                  &nbsp; Follow {article.author.username}
                </button>
                &nbsp;
                <button
                  className={
                    article.favorited
                      ? "btn btn-sm btn-outline-success btn-success-active"
                      : "btn btn-sm btn-outline-success"
                  }
                  onClick={(event) => updateFavorite(event)}
                >
                  <i className="material-icons material-icons-outlined">
                    favorite
                  </i>
                  &nbsp; Favorite Post{" "}
                  <span className="counter">({article.favoritesCount})</span>
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-md-8 offset-md-2">
                {token ? (
                  <form
                    className="card comment-form"
                    onSubmit={(event) => handleSubmit(event)}
                  >
                    <div className="card-block">
                      <textarea
                        className="form-control"
                        name="commentArea"
                        placeholder="Write a comment..."
                        rows="3"
                        required
                        value={postComment}
                        onChange={(e) => {
                          setPostComment(e.target.value);
                        }}
                      ></textarea>
                    </div>
                    <div className="card-footer">
                      <img
                        src={article.author.image || { defaultImage }}
                        alt={article.author.name}
                        className="comment-author-img"
                      />
                      <button className="btn btn-sm btn-success">
                        Post Comment
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="no-token-request">
                    <a href="/login">Sign in</a> or{" "}
                    <a href="/register">Sign Up</a> to comment on this article.
                  </div>
                )}
                {comments ? (
                  comments.map((comment) => {
                    return (
                      <div className="card" key={comment.id}>
                        <div className="card-block">
                          <p className="card-text">{comment.body}</p>
                        </div>
                        <div className="card-footer">
                          <a
                            href={"/profile/" + comment.author.username}
                            className="comment-author"
                          >
                            <img
                              src={comment.author.image || defaultImage}
                              className="comment-author-img"
                              alt={comment.author.username}
                            />
                          </a>
                          &nbsp;
                          <a
                            href={"/profile/" + comment.author.username}
                            className="comment-author"
                          >
                            &nbsp;
                            {comment.author.username}
                          </a>
                          &nbsp;
                          <time
                            className="date-posted"
                            dateTime={article.createdAt}
                          >
                            {new Date(comment.createdAt).toDateString()}
                          </time>
                          {props.username === comment.author.username ? (
                            <span
                              className="comment-delete float-right"
                              onClick={(e) => {
                                handleDelete(e, comment.id);
                              }}
                            >
                              <i className="material-icons material-icons-outlined">
                                delete
                              </i>
                            </span>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Article;
