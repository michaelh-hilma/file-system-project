import { useCallback, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import "./FileSystemLayout.css";
import {
  CreatingNewItemContext,
  CurrentFolderContext,
  CurrentInfoSideBarItemContext,
  CurrentSignedInUserContext,
} from "../constants";

function FileSystemLayout() {
  const [currentFolderState, setCurrentFolderState] = useState({});
  const [currentUser, setCurrentUser] = useContext(CurrentSignedInUserContext);

  const [currentInfoSideBarItemState, setCurrentInfoSideBarItemState] =
    useState({ type: "", data: {} });
  const [isCreatingNewItem, setIsCreatingNewItem] = useState(false);

  const [URLPath, setUrlPath] = useState([]);
  const [LocationPaths, setLocationPaths] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const getUrlPaths = useCallback((url) => {
    // Remove leading slash for simplicity
    // Split the URL by '/'
    const segments = url.slice(1).split("/");

    // Initialize an empty array to store the result
    const paths = [];

    // Build each path progressively
    let currentPath = "";
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      paths.push(currentPath);
    }
    return paths;
  }, []);

  useEffect(() => {
    if (!currentUser.id || !currentUser.username || currentUser.username == "")
      return navigate("signin");
    if (
      currentUser.username !=
      location.pathname.substring(0, location.pathname.indexOf("/"))
    )
      navigate(currentUser.username);

    setUrlPath(getUrlPaths(location.pathname));
    setLocationPaths(() => {
      let tempPaths = location.pathname.split("/");
      tempPaths.shift();
      return tempPaths;
    });
  }, [getUrlPaths, setLocationPaths, currentUser, location, navigate]);

  const HomeButtonClickHandler = () => {
    //navigate to user home (should be localhost:3000/username-here)
    navigate(`/${currentUser.username}`);
  };
  const SignoutButtonClickHandler = () => {
    setCurrentUser({}); // should navigate back automatically because of the useEffect above
  };

  const NewItemClickHandler = () => {
    setIsCreatingNewItem(true);
  };

  const currentFolderInfo = () => {
    console.log(currentFolderState);
    setCurrentInfoSideBarItemState({
      type: "folder",
      data: currentFolderState,
    });
  };

  return (
    <CreatingNewItemContext.Provider
      value={[isCreatingNewItem, setIsCreatingNewItem]}
    >
      <CurrentFolderContext.Provider
        value={[currentFolderState, setCurrentFolderState]}
      >
        <CurrentInfoSideBarItemContext.Provider
          value={[currentInfoSideBarItemState, setCurrentInfoSideBarItemState]}
        >
          <div className="FileSystemLayout">
            <div className="Header">
              <button onClick={() => HomeButtonClickHandler()} className="Home">
                <span>Home</span>
              </button>
              <button onClick={() => NewItemClickHandler()} className="NewItem">
                <span>&#43;</span>
              </button>
              <button
                onClick={() => SignoutButtonClickHandler()}
                className="Signout"
              >
                <span>Sign Out</span>
              </button>
            </div>
            <div className="URLPath">
              {LocationPaths.map((url, index) =>
                url !== "" ? (
                  url !== currentUser.username ? (
                    <span key={index} onClick={() => navigate(URLPath[index])}>
                      /{`${url}`}
                    </span>
                  ) : (
                    <span
                      key={index}
                      onClick={() => navigate(`/${currentUser.username}`)}
                    >
                      {location.pathname}
                    </span>
                  )
                ) : null
              )}
              <span onClick={currentFolderInfo} className="infoButton">
                &#x1F6C8;
              </span>
            </div>
            <div className="Outlet">
              <Outlet />
            </div>
          </div>
        </CurrentInfoSideBarItemContext.Provider>
      </CurrentFolderContext.Provider>
    </CreatingNewItemContext.Provider>
  );
}

export default FileSystemLayout;
