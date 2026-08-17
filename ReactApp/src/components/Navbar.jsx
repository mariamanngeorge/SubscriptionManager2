import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>Subscription Manager</h2>

      <div>
        <Link to="/login">Login</Link>{" "}
        <Link to="/register">Register</Link>{" "}
        <Link to="/dashboard">Dashboard</Link>{" "}
        <Link to="/add-subscription">
          Add Subscription
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;