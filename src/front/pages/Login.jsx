import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { store, dispatch } = useGlobalReducer();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${store.BASE_API_URL}api/login`, { // https://cautious-winner....3001/api/login
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      // data.token data.user
      dispatch({
        type: "set_user",
        payload: {
          user: data.user,
          token: data.token
        }
      });
      console.log("Logged in:", data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 400 }}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="text-danger mb-2">{error}</div>}
          <button
            type="submit"
            className="btn w-100 text-white"
            style={{ backgroundColor: "#333", borderRadius: "25px" }}
          >
            Log In
          </button>
        </form>
        <p className="mt-3">
          Don't have an account?{" "}
          <Link to="/" style={{ color: "green" }}>
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Login;
