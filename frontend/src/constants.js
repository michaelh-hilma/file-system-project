import axios from "axios";
import { createContext } from "react";

export const RefreshFileSystemDataContext = createContext();
export const CreatingNewItemContext = createContext();
export const CurrentInfoSideBarItemContext = createContext();
export const CurrentFolderContext = createContext();
export const CurrentSignedInUserContext = createContext(null);

export const MAIN_URL = "http://localhost:3000";
export const getUrl = (path) => MAIN_URL + path;

export const getInfo = (path, userid, navigate) => {
  return axios
    .post(
      getUrl(path),
      {},
      {
        headers: { Authorization: userid },
      }
    )
    .catch((err) => {
      if (err) {
        alert(
          "Failed to catch info from server.\nPlease try again later. \n" + err
        );
        navigate("/signin");
      }
    });
};

export const sizeConversionHandler = (bytes, howFar) =>
  (bytes / Math.pow(1024, howFar)).toFixed(2);

export const sizeSizeConversionHandler = (bytes) =>
  bytes > 1048576
    ? `${sizeConversionHandler(bytes, 2)}MB`
    : `${sizeConversionHandler(bytes, 1)}KB`;
