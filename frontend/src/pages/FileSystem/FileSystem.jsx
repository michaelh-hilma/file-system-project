// General
import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

import {
  CurrentFolderContext,
  CurrentSignedInUserContext,
  getInfo,
  RefreshFileSystemDataContext,
} from "../../constants";

// Contexts

// Components
import FolderCard from "./components/Folder/FolderCard/FolderCard";
import FileCard from "./components/File/FileCard/FileCard";
import InfoSideBar from "./components/InfoSideBar/InfoSideBar";

import "./FileSystem.css";
import NewItemDialog from "./components/NewItemDialog/NewItemDialog";

function FileSystem() {
  const [currentUser] = useContext(CurrentSignedInUserContext);
  const [, setCurrentFolder] = useContext(CurrentFolderContext);
  const location = useLocation();

  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  const getData = useCallback(() => {
    getInfo(location.pathname, currentUser.userId).then((res) =>
      res
        ? setCurrentFolder(res.data) &&
          setFiles(res.data.contains.files) &&
          setFolders(res.data.contains.folders)
        : null
    );
  }, [location, currentUser, setCurrentFolder]);

  useEffect(() => {
    getInfo(location.pathname, currentUser.userId).then((res) =>
      res
        ? setCurrentFolder(res.data) &&
          setFiles(res.data.contains.files) &&
          setFolders(res.data.contains.folders)
        : null
    );
    console.log("ran fs", [location.pathname, currentUser, setCurrentFolder]);
  }, []);

  return (
    <RefreshFileSystemDataContext.Provider value={getData}>
      <div className="FileSystemContainer">
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} />
        ))}
        {files.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
        <InfoSideBar />
        <NewItemDialog />
      </div>
    </RefreshFileSystemDataContext.Provider>
  );
}

export default FileSystem;
