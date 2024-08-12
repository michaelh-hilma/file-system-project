import { Route, Routes, useLocation, useNavigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import FileSystem from "./pages/FileSystem/FileSystem";
import { createContext, useEffect, useState } from "react";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import FileSystemLayout from "./Layouts/FileSystemLayout";

export const CurrentSignedInUserContext = createContext(null);

function App() {
  const [currentUserState, setCurrentUserState] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

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
