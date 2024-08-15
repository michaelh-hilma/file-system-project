// General
import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

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
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  const getData = useCallback(() => {
    if (currentUser.id) {
      let index = location.pathname.lastIndexOf("/");
      let folder = location.pathname;
      if (index != 0)
        folder =
          location.pathname.slice(0, index + 1) +
          "folder-" +
          location.pathname.slice(index + 1);

      getInfo(folder, currentUser.id, navigate).then((res) => {
        if (res && res.status === 200) {
          setCurrentFolder(res.data);
          setFiles(res.data.contains.files);
          setFolders(res.data.contains.folders);
        }
      });
    }
  }, [location, currentUser, setCurrentFolder, navigate]);

  useEffect(() => {
    getData();
  }, [currentUser.id, location.pathname, setCurrentFolder, navigate, getData]);

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
