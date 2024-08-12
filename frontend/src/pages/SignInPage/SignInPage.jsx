import axios from "axios";
import { useContext, useRef } from "react";
import { CurrentSignedInUserContext } from "../../App";
import { useNavigate } from "react-router";

function SignInPage() {
  const [, setCurrentUser] = useContext(CurrentSignedInUserContext);

  const usernameRef = useRef();
  const passwordRef = useRef();
  const errorRef = useRef();
  const navigate = useNavigate();

  const showDefaultError = () =>
    (errorRef.current.textContent =
      "An error accured please make sure you filled out the fields correctly.");

  const submitHandler = (e) => {
    e.preventDefault();

    const /** @type {String} */ username = usernameRef.current.value;
    const /** @type {String} */ password = passwordRef.current.value;
    if (
      username.length < 3 ||
      username.length > 20 ||
      (username == "signup") | "signin"
    )
      return showDefaultError();
    if (password.length < 3) return showDefaultError();
    axios
      .post("/login", { username, password })
      .then((res) =>
        res !== undefined && res.status == 200
          ? setCurrentUser(res.data)
          : showDefaultError()
      )
      .catch((err) => showDefaultError() && console.log(err));
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input ref={usernameRef} type="text" placeholder="Username" />
        <input ref={passwordRef} type="password" placeholder="Password" />
        <p ref={errorRef}></p>
        <button type="submit">Login</button>
      </form>
      <a
        onClick={(e) => {
          e.preventDefault();
          navigate("/signup");
        }}
      >
        {"Don't have an account?"}
      </a>
    </div>
  );
}

export default SignInPage;
