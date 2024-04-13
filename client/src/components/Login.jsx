import axios from "axios";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { settingsActions } from "../store";

const Login = () => {
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.settings.mode);

  const userRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();

  const validateUserName = function () {
    console.log(userRef.current.value.includes(" "));

    if (userRef.current.value.length < 5) {
      return "Minimum 5 characters required in username";
    }
    if (userRef.current.value.includes(" ")) {
      return "Username must not contain spaces";
    }
    return false;
  };

  const validatePassword = function () {
    const passVal = passRef.current.value;

    if (passVal.length < 6) {
      return "Minimum 6 characters required in password";
    }
    if (passVal.includes(" ")) {
      return "Password must not contain spaces";
    }

    return false;
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    try {
      if (validateUserName()) {
        throw new Error(validateUserName());
      }

      if (validatePassword()) {
        throw new Error(validatePassword());
      }

      const res = await axios({
        method: "post",
        url: "http://localhost:5000/api/login",
        data: {
          user: userRef.current.value,
          password: passRef.current.value,
        },
      });

      console.log(res.data);
      if (res.data === "Invalid Credentials") throw new Error(res.data);

      dispatch(settingsActions.setUser(res.data.user));
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response?.data || err.message);
    }
  };

  return (
    <div
      className={`login-container ${
        mode === "dark" ? "mode2-login-container" : undefined
      }`}
    >
      <div
        className={`form-container ${
          mode === "dark" ? "mode2-form-container" : undefined
        }`}
      >
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor='username'>Username</label>
            <input ref={userRef} type='text' name='username' id='username' />
          </div>
          <br />
          <div>
            <label htmlFor='password'>Password</label>
            <input
              ref={passRef}
              type='password'
              name='password'
              id='password'
            />
          </div>
          <button className='login-btn'>Login</button>
          <Link className='sign-up-btn' to='/signup'>
            Not a user ? Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
