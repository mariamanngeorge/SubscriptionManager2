import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = Boolean(localStorage.getItem("access"));

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <Link to={isAuthenticated ? "/dashboard" : "/login"} className="navbar-logo">
        <span>Subscription</span>
        <strong>Manager</strong>
      </Link>

      {/* NAVIGATION */}
      <div className="navbar-links">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active-link" : ""}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={location.pathname === "/register" ? "active-link" : ""}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active-link" : ""}
            >
              Dashboard
            </Link>

            <Link
              to="/add-subscription"
              className={
                location.pathname === "/add-subscription" ? "active-link" : ""
              }
            >
              Add Subscription
            </Link>

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;