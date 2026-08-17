import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("token/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-page">

      {/* Background glow */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      {/* Floating subscription logos */}
      <div className="app-logo netflix-logo">N</div>
      <div className="app-logo spotify-logo">●</div>
      <div className="app-logo youtube-logo">▶</div>
      <div className="app-logo prime-logo">P</div>
      <div className="app-logo disney-logo">D</div>
      <div className="app-logo apple-logo">●</div>
      
   {/* MAIN CONTENT */}
      <main className="login-content">

        {/* LEFT SIDE */}
        <section className="login-intro">

          <div className="small-heading">
            YOUR SUBSCRIPTIONS, SIMPLIFIED
          </div>

          <h2>
            Never lose track
            <br />
            of your
            <br />
            <span>subscriptions.</span>
          </h2>

          <p className="intro-text">
            Manage all your recurring subscriptions in one place.
            Track payments, get reminders and understand exactly
            where your money goes.
          </p>

          <div className="features">

            <div>
              <span>✓</span>
              Payment reminders
            </div>

            <div>
              <span>✓</span>
              Spending tracking
            </div>

            <div>
              <span>✓</span>
              Automatic renewal alerts
            </div>

          </div>

        </section>

        {/* RIGHT LOGIN CARD */}
        <section className="login-card">

          <div className="login-card-header">

            <div className="lock-icon">
              🔐
            </div>

            <h2>Welcome back</h2>

            <p>
              Login to manage your subscriptions
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="input-group">

              <label>Username</label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

            </div>

            <div className="input-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

            <button
              type="submit"
              className="login-button"
            >
              Login →
            </button>

          </form>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="register-link">
            Don't have an account?

            <button
              onClick={() => navigate("/register")}
            >
              Create account
            </button>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="login-footer">
        SUBSCRIPTION MANAGER • TRACK • MANAGE • SAVE
      </footer>

    </div>
  );
}

export default Login;