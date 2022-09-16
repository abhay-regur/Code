import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LocalStorage } from "../services/LocalStorage";
import LoadingOverlay from "react-loading-overlay";

function Editor(props) {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [isRunning, setisRunning] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [token, setToken] = useState("");
  const [tagList, setTagList] = useState([]);
  const [article, setArticle] = useState({});

  useEffect(() => {
    setToken(LocalStorage.get("jwtToken"));
    if (window.location.hash !== "") {
      setisEditMode(true);
      getArticleData(window.location.hash.split("#").pop());
    }
  }, []);

  const changeTagInput = (event) => {
    setTagInput(event.target.value);
  };
  const getArticleData = (slug) => {
    axios
      .get(baseURL + "/api/articles/" + slug, {
        headers: { Authorization: `Token ${token || ""}` },
      })
      .then((Response) => {
        if (Response.status === 200) {
          let obj = Object.assign(Response.data.article);
          setArticle(obj);
          setBody(obj.body);
          setDescription(obj.description);
          setTitle(obj.title);
          setTagList(obj.tagList);
          setisLoading(false);
        }
      })
      .catch((error) => {
        setisRunning(false);
        setisLoading(false);
        console.log(error);
      });
  };

  const addTag = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (tagInput && !tagList.includes(tagInput)) {
        var tempTagarr = tagInput.split(",");
        tempTagarr.map((tempTag) =>
          setTagList((tagList) => [...tagList, tempTag])
        );
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => () => {
    setTagList(tagList.filter((newTag) => newTag !== tag));
  };

  const submitForm = (event) => {
    event.preventDefault();
    setisLoading(true);
    let url = baseURL + "/api/articles";
    let slug = "";
    let articleData = {
      title: title,
      description: description,
      body: body,
      tagList: tagList,
    };

    if (!isRunning && !isEditMode) {
      axios
        .post(
          url,
          { article: articleData },
          {
            headers: { Authorization: `Token ${token}` },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 200 || response.status === 201) {
            slug = response.data.article.slug;
            window.location.pathname = "/article/" + slug;
            navigate("/", {});
            setisRunning(false);
            setisLoading(false);
          }
        })
        .catch((error) => {
          setisRunning(false);
          setisLoading(false);
          console.log(error);
        });
    } else if (!isRunning && isEditMode) {
      let slug = window.location.hash.split("#").pop();
      axios
        .put(
          url + "/" + slug,
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
            setisLoading(false);
          }
        })
        .catch((error) => {
          setisRunning(false);
          setisLoading(false);
          console.log(error);
        });
    }
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

                  <div className="tag-list editor-tag-pill">
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
    </LoadingOverlay>
  );
}

export default Editor;
