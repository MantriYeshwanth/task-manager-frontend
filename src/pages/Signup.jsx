import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/authApi";

const Signup = () => {
  const [name, setName] = useState("");
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
      const { data } = await signup({ name, email, password });
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="auth-form-inner">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
