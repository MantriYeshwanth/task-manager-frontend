import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await login({ email, password });
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form-inner">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
          </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
