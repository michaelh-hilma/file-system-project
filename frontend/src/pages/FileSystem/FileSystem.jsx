// General
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

import { getInfo } from "../../constants";

// Contexts
import { CurrentSignedInUserContext } from "../../App";
import { CurrentFolderContext } from "../../Layouts/FileSystemLayout";

// Components
import FolderCard from "./components/Folder/FolderCard/FolderCard";
import FileCard from "./components/File/FileCard/FileCard";

function FileSystem() {
  const [currentUser] = useContext(CurrentSignedInUserContext);
  const [, setCurrentFolder] = useContext(CurrentFolderContext);
  const location = useLocation();

  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    getInfo(location.pathname, currentUser.userId).then(
      (res) =>
        setCurrentFolder(res.data) &&
        setFiles(res.data.contains.files) &&
        setFolders(res.data.contains.folders)
    );
  }, [location, currentUser, setCurrentFolder]);

  return (
    <div>
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
}

export default FileSystem;
