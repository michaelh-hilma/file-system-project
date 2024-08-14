import { Route, Routes, useNavigate } from "react-router";
import FileSystem from "./pages/FileSystem/FileSystem";
import { useEffect, useState } from "react";
import SignInPage from "./pages/SigningPages/SignInPage/SignInPage";
import SignUpPage from "./pages/SigningPages/SignUpPage/SignUpPage";
import FileSystemLayout from "./Layouts/FileSystemLayout";
import { CurrentSignedInUserContext } from "./constants";

function App() {
  const [currentUserState, setCurrentUserState] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserState.username && currentUserState.id)
      navigate(currentUserState.username);
  }, [currentUserState, navigate]);

  return (
    <CurrentSignedInUserContext.Provider
      value={[currentUserState, setCurrentUserState]}
    >
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path={`/${
            currentUserState.username ? currentUserState.username : ""
          }`}
          element={<FileSystemLayout />}
        >
          <Route path="/*" element={<FileSystem />} />
        </Route>
      </Routes>
    </CurrentSignedInUserContext.Provider>
  );
}

export default App;
