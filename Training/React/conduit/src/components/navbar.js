import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function LoggedOutNavbar() {
  return (
    <ul className="nav justify-content-center">
      <li className="nav-item">
        <Link className="nav-link active" to="/">
          Home
        </Link>
      </li>
      <li className="nav-item noUser">
        <Link className="nav-link" to="/login">
          Sign in
        </Link>
      </li>
      <li className="nav-item noUser">
        <Link className="nav-link" to="/register">
          Sign up
        </Link>
      </li>
    </ul>
  );
}

function LoggedInNavbar(props) {
  return (
    <ul className="nav justify-content-center">
      <li className="nav-item">
        <Link className="nav-link active" to="/">
          Home
        </Link>
      </li>
      <li className="nav-item withUser">
        <Link className="nav-link" to="/newArticle">
          <i className="material-icons material-icons-outlined">edit_note</i>
          New Article
        </Link>
      </li>
      <li className="nav-item withUser">
        <Link className="nav-link" to="/setting">
          <i className="material-icons material-icons-outlined">settings</i>
          Settings
        </Link>
      </li>
      <li className="nav-item withUser">
        <Link className="nav-link" to={"/profile/@" + props.loggedUser}>
          <i className="material-icons material-icons-outlined">
            account_circle
          </i>
          &nbsp;
          {props.loggedUser}
        </Link>
      </li>
    </ul>
  );
}

export default function Navbar(props) {
  return (
    <div className="header-wrapper">
      <nav className="navbar navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            conduit
          </Link>
          {props.isAuthenticated ? (
            <LoggedInNavbar loggedUser={props.loggedUser} />
          ) : (
            <LoggedOutNavbar />
          )}
        </div>
      </nav>
    </div>
  );
}

Navbar.defaultProps = {
  isAuthenticated: false,
  loggedUser: "Test",
};

Navbar.propTypes = {
  mainHeading: PropTypes.bool,
  subHeading: PropTypes.string,
};
