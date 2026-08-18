import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        <span>Subscription</span>
        <strong>Manager</strong>
      </Link>

      <div className="navbar-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add-subscription">Add Subscription</Link>
      </div>

    </nav>
  );
}

export default Navbar;