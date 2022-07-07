import React from "react";
import PropTypes from "prop-types";
export default function Header(props) {
  return (
    <div className="header-wrapper jumbotron jumbotron-fluid">
      <div className="container text-center">
        <h1 className="display-3 logo-font">{props.mainHeading}</h1>
        <p className="lead">{props.subHeading}</p>
      </div>
    </div>
  );
}

Header.defaultProps = {
  mainHeading: "conduit",
  subHeading: "A place to share your knowledge",
};

Header.propTypes = {
  mainHeading: PropTypes.string,
  subHeading: PropTypes.string,
};
