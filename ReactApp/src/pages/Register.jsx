import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      await API.post("register/", formData);

      setMessage("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        setMessage(
          JSON.stringify(error.response.data)
        );
      } else {
        setMessage("Registration failed.");
      }
    }
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <br />

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <br />

        <button type="submit">
          Register
        </button>

        {message && (
          <p style={{ marginTop: "15px" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;