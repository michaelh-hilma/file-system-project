import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { CurrentSignedInUserContext } from "../App";

export const CurrentFolderContext = createContext();

function FileSystemLayout() {
  const [currentFolderState, setCurrentFolderState] = useState({});
  const [currentUser] = useContext(CurrentSignedInUserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser.id || !currentUser.username || currentUser.username == "")
      return navigate("signin");
    if (
      currentUser.username !=
      location.pathname.substring(0, location.pathname.indexOf("/"))
    )
      navigate(currentUser.username);
  }, [currentUser, location, navigate]);

  return (
    <CurrentFolderContext.Provider
      value={[currentFolderState, setCurrentFolderState]}
    >
      <>
        <Outlet />
      </>
    </CurrentFolderContext.Provider>
  );
}

export default FileSystemLayout;
