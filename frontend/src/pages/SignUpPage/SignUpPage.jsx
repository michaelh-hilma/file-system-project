import axios from "axios";
import { useContext, useRef } from "react";
import { CurrentSignedInUserContext } from "../../App";
import { useNavigate } from "react-router";
import "./SignUpPage.css";

function SignUpPage() {
  const [, setCurrentUser] = useContext(CurrentSignedInUserContext);

  const usernameRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();
  const errorRef = useRef();

  const navigate = useNavigate();

  const showError = (err) => (errorRef.current.textContent = err);

  const submitHandler = (e) => {
    e.preventDefault();
    const /** @type {String} */ username = usernameRef.current.value;
    const /** @type {String} */ password = passwordRef.current.value;
    if (username.length < 3 || username.length > 20)
      return showError(
        "Usernames cannot be shorter than 3 characters or longer than 20."
      );
    if (password.length < 3)
      return showError("Passwords cannot be shorter than 3 characters.");
    if (password != repeatPasswordRef.current.value)
      return showError("The passwords don't match!");
    axios
      .post("/signup", { username, password })
      .then((res) =>
        res.status == 200
          ? setCurrentUser(res.data)
          : showError(res.data.errorMessage)
      )
      .catch(
        (err) =>
          showError(
            "An error accured while trying to contact the server, please try again later."
          ) && console.log(err)
      );
  };

  return (
    <div className="sign-up-page">
      <form className="sign-up-form" onSubmit={submitHandler}>
        <input
          className="sign-up-input"
          ref={usernameRef}
          type="text"
          placeholder="Username"
        />
        <input
          className="sign-up-input"
          ref={passwordRef}
          type="password"
          placeholder="Password"
        />
        <input
          className="sign-up-input"
          ref={repeatPasswordRef}
          type="password"
          placeholder="Repeat Password"
        />
        <p className="sign-up-errormsg" ref={errorRef}></p>
        <button className="sign-up-button">Signup</button>
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate("/signin");
          }}
        >
          {"Already have an account?"}
        </a>
      </form>
    </div>
  );
}

export default SignUpPage;
