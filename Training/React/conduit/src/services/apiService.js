import axios from "axios";

export const postData = async (url, data, token) => {
  await axios
    .post(url, data, {
      headers: { Authorization: `Token ${token}` },
    })
    .then((Response) => {
      console.log(Response);
      return Response;
    })
    .catch((error) => {
      return error;
    });
};

export const getData = async (url, token) => {
  await axios
    .get(url, {
      headers: { Authorization: `Token ${token}` },
    })
    .then((Response) => {
      return Response;
    })
    .catch((error) => {
      return error;
    });
};

export const deleteData = async (url, token) => {
  await axios
    .delete(url, {
      headers: { Authorization: `Token ${token}` },
    })
    .then((Response) => {
      return Response;
    })
    .catch((error) => {
      return error;
    });
};
