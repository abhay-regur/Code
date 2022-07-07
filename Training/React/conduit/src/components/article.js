import axios from "axios";
import React, { useEffect, useState } from "react";

function Article() {
  const [token, setToken] = useState();
  const [articleSlug, setArticleSlug] = useState();
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

  const [isRunning, setisRunning] = useState(false);

  const [articleUpdated, setArticleupdated] = useState(false);

  const baseURL = "https://api.realworld.io";
  const defaultImage = "https://api.realworld.io/images/smiley-cyrus.jpeg";

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
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      console.log("aricle updated");
      setArticleupdated(true);
    }
  }, [article, isRunning]);

  const handleFollow = (e) => {
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
              setisRunning(false);
            }
          })
          .catch((error) => {
            console.log(error.message);
            setisRunning(false);
          });
      }
      setArticle(obj);
    }
    e = null;
  };

  const handleFavorite = (event) => {
    event.preventDefault();
    if (!isRunning && token) {
      let obj = { ...article };
      setisRunning(true);
      if (!event.target.classList.contains("btn-secondary-active")) {
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
              setisRunning(false);
            }
          })
          .catch((error) => {
            console.log(error.message);
            setisRunning(false);
          });
      }
      setArticle(obj);
    }
    event = null;
  };

  const debugger_ = (e) => {
    console.log(articleSlug);
    console.log(token);
    console.log(isRunning);
    console.log(articleUpdated);
    console.log(article);
    console.log();
    console.log();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(new FormData(event.currentTarget));
    if (false) {
      axios
        .post(
          baseURL + "/api/articles/" + articleSlug + "/comments",
          {},
          {
            headers: { Authorization: `Token ${token}` },
          }
        )
        .then()
        .catch();
    }
    event = null;
  };

  return (
    <div className="main article-wrapper">
      <button onClick={(e) => debugger_(e)}>debugger</button>
      {articleUpdated ? (
        <div className="article-page">
          <div className="banner">
            <div className="container">
              <h1>{article.title || ""}</h1>

              <div className="article-meta">
                <a href={"/profile/" + article.username}>
                  <img
                    src={article.author.image || { defaultImage }}
                    alt={article.author.name}
                  />
                </a>
                <div className="info">
                  <a href="/" className="author">
                    {article.author.name}
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
                  onClick={(event) => handleFollow(event)}
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
                  onClick={(event) => handleFavorite(event)}
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
                <a href="profile.html">
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
                  onClick={(event) => handleFollow(event)}
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
                  onClick={(event) => handleFavorite(event)}
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

                <div className="card">
                  <div className="card-block">
                    <p className="card-text">
                      With supporting text below as a natural lead-in to
                      additional content.
                    </p>
                  </div>
                  <div className="card-footer">
                    <a href="/" className="comment-author">
                      <img
                        src="http://i.imgur.com/Qr71crq.jpg"
                        className="comment-author-img"
                        alt=""
                      />
                    </a>
                    &nbsp;
                    <a href="/" className="comment-author">
                      Jacob Schmidt
                    </a>
                    <span className="date-posted">Dec 29th</span>
                  </div>
                </div>

                <div className="card">
                  <div className="card-block">
                    <p className="card-text">
                      With supporting text below as a natural lead-in to
                      additional content.
                    </p>
                  </div>
                  <div className="card-footer">
                    <a href="/" className="comment-author">
                      <img
                        src="http://i.imgur.com/Qr71crq.jpg"
                        className="comment-author-img"
                        alt=""
                      />
                    </a>
                    &nbsp;
                    <a href="/" className="comment-author">
                      Jacob Schmidt
                    </a>
                    <span className="date-posted">Dec 29th</span>
                    <span className="mod-options">
                      <i className="ion-edit"></i>
                      <i className="ion-trash-a"></i>
                    </span>
                  </div>
                </div>
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
