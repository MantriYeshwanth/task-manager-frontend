import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    document.body.className = dark ? "dark" : "";
    localStorage.setItem("darkMode", dark ? "true" : "false");
  }, [dark]);

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <h3>Task Manager</h3>

        <div>
          <button onClick={() => setDark((prev) => !prev)}>
            {dark ? "Light" : "Dark"}
          </button>
          <button onClick={handleLogout} style={{ marginLeft: "0.75rem" }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
