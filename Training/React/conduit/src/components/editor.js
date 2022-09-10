import axios from "axios";
import { useEffect, useState } from "react";

function Editor(props) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [isRunning, setisRunning] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [token, setToken] = useState("");
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    setToken(localStorage.getItem("jwtToken"));
  }, []);

  const changeTagInput = (event) => {
    setTagInput(event.target.value);
  };

  const addTag = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (tagInput && !tagList.includes(tagInput)) {
        var tempTagarr = tagInput.split(",");
        console.log(tempTagarr);
        tempTagarr.map((tempTag) =>
          setTagList((tagList) => [...tagList, tempTag])
        );
      }
      console.log(tagList);
      setTagInput("");
    }
  };

  const removeTag = (tag) => () => {
    setTagList(tagList.filter((newTag) => newTag !== tag));
  };

  const submitForm = (event) => {
    event.preventDefault();
    let url = baseURL + "/api/articles";
    let slug = "";
    let articleData = {
      title: title,
      description: description,
      body: body,
      tagList: tagList,
    };

    if (!isRunning) {
      axios
        .post(
          url,
          { article: articleData },
          {
            headers: { Authorization: `Token ${token}` },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            slug = response.data.article.slug;
            window.location.pathname = "/article/" + slug;
            setisRunning(false);
          }
        })
        .catch((error) => {
          setisRunning(false);
          console.log(error);
        });
    }
  };

  return (
    <div className="editor-page container">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-xs-12">
          <h1 className="text-center">Editor</h1>
          <form>
            <div>
              <div className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Article Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="What's this article about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <textarea
                  className="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter tags"
                  value={tagInput}
                  onChange={changeTagInput}
                  onKeyUp={addTag}
                />

                <div className="tag-list">
                  {tagList.map((tag) => {
                    return (
                      <span className="tag-default tag-pill" key={tag}>
                        <span
                          className="material-icons material-icons-outlined"
                          onClick={removeTag(tag)}
                        >
                          close
                        </span>
                        <span>{tag}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              <button
                className="btn btn-lg float-right btn-success"
                type="button"
                onClick={submitForm}
              >
                Publish Article
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Editor;
