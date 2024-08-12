import axios from "axios";

export const MAIN_URL = "http://localhost:3000/";
export const getUrl = (path) => MAIN_URL + path;

export const getInfo = (path, userid) =>
  axios
    .post(getUrl(path), {
      Headers: { Authorization: userid },
    })
    .catch((err) => {
      alert("Failed to catch info from server.\nPlease try again later.");
      console.log(err);
    });
