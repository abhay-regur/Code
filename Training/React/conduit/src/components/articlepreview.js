import React from "react";
import { useNavigate } from "react-router-dom";

function Articlepreview(props) {
  const navigate = useNavigate();
  const handleLink = (event, author) => {
    event.preventDefault();
    props.handleAuthorClick(author);
  };
  const gotoArticle = (e, slug) => {
    e.preventDefault();
    navigate("/article/" + slug, { state: { id: 7, color: "green" } });
  };
  return (
    <>
      {props.articles.map((article) => (
        <div className="article-preview" key={article.slug}>
          <div className="article-header">
            <a
              href="/"
              onClick={(event) => handleLink(event, article.author.username)}
            >
              <img
                className="userImage"
                src={article.author.image}
                alt={article.author.username}
              />
              <div className="user-info">
                <p className="userName">{article.author.username}</p>
                <time className="date" dateTime={article.createdAt}>
                  {new Date(article.createdAt).toDateString()}
                </time>
              </div>
              <div className="float-right">
                <button
                  className={
                    article.favorited
                      ? "btn btn-sm btn-outline-success btn-following"
                      : "btn btn-sm btn-outline-success"
                  }
                  onClick={(event) => props.handleClick(event, article.slug)}
                >
                  <span className="material-icons">favorite</span>
                  &nbsp;
                  {article.favoritesCount}
                </button>
              </div>
            </a>
          </div>
          <a
            href={"/article/"}
            className="preview-link"
            onClick={(e) => gotoArticle(e, article.slug)}
          >
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <span>Read more...</span>
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </a>
        </div>
      ))}
    </>
  );
}
export default Articlepreview;
