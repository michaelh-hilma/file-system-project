import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/:userid" element={<FileSystemLayout />}>
          <Route path="/:path" element={<FileSystem />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
