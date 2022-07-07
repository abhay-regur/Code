import React from "react";

export default function TagList(props) {
  return (
    <div className="tag-list">
      {props.tagLists.map((tagList) => (
        <button
          type="button"
          className="btn btn-sm-default tag-pill"
          key={tagList}
          onClick={(event) => props.handleClick(event)}
        >
          #{tagList}
        </button>
      ))}
    </div>
  );
}
