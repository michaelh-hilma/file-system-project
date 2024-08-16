import { Route, Routes, useLocation, useNavigate } from "react-router";
import FileSystem from "./pages/FileSystem/FileSystem";
import { useEffect, useState } from "react";
import SignInPage from "./pages/SigningPages/SignInPage/SignInPage";
import SignUpPage from "./pages/SigningPages/SignUpPage/SignUpPage";
import FileSystemLayout from "./Layouts/FileSystemLayout";
import { CurrentSignedInUserContext } from "./constants";

function App() {
  const [currentUserState, setCurrentUserState] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dynamicFolderRouter = `/${
    currentUserState.id && currentUserState.username
      ? location.pathname.substring(currentUserState.username.length + 1) === ""
        ? `${currentUserState.username}`
        : `${currentUserState.username}${location.pathname.substring(
            currentUserState.username.length + 1
          )}`
      : "*"
  }`.replace(" ", "_");
  useEffect(() => {
    if (
      currentUserState.username &&
      currentUserState.id &&
      (location.pathname == "/signup" || location.pathname == "/signin")
    )
      navigate(`/${currentUserState.username}`);
  }, [currentUserState, location.pathname, navigate]);
  return (
    <CurrentSignedInUserContext.Provider
      value={[currentUserState, setCurrentUserState]}
    >
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path={`/${
            currentUserState.username && currentUserState.id
              ? currentUserState.username
              : "*"
          }`}
          element={<FileSystemLayout />}
        >
          <Route path={dynamicFolderRouter} element={<FileSystem />} />
        </Route>
      </Routes>
    </CurrentSignedInUserContext.Provider>
  );
}

export default App;
