import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function AddSubscription() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    service_name: "",
    amount: "",
    billing_cycle: "monthly",
    last_payment_date: "",
    auto_pay: false,
    reminder_days: 3,
    end_date: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await API.post("subscriptions/", {
        service_name: formData.service_name,
        amount: formData.amount,
        billing_cycle: formData.billing_cycle,
        last_payment_date: formData.last_payment_date || null,
        auto_pay: formData.auto_pay,
        reminder_days: Number(formData.reminder_days),
        end_date: formData.end_date || null,
      });

      console.log("Subscription added:", response.data);

      setSuccess("Subscription added successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.error("Add subscription error:", error);

      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);

      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (error.response?.status === 400) {
        setError(
          JSON.stringify(error.response.data)
        );
      } else if (error.response?.status === 404) {
        setError("Subscription API endpoint not found.");
      } else if (error.response?.status === 500) {
        setError("Server error. Please check Django backend.");
      } else {
        setError("Unable to add subscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
      }}
    >
      <h1>Add Subscription</h1>

      <p>
        Add a subscription to start tracking your
        recurring expenses.
      </p>

      {error && (
        <div
          style={{
            background: "#7f1d1d",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: "#065f46",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* SERVICE NAME */}
        <div style={{ marginBottom: "20px" }}>
          <label>Service Name</label>

          <input
            type="text"
            name="service_name"
            placeholder="Netflix"
            value={formData.service_name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* AMOUNT */}
        <div style={{ marginBottom: "20px" }}>
          <label>Amount (₹)</label>

          <input
            type="number"
            name="amount"
            placeholder="499"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* BILLING CYCLE */}
        <div style={{ marginBottom: "20px" }}>
          <label>Billing Cycle</label>

          <select
            name="billing_cycle"
            value={formData.billing_cycle}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
          >
            <option value="monthly">
              Monthly
            </option>

            <option value="annual">
              Annual
            </option>
          </select>
        </div>

        {/* LAST PAYMENT DATE */}
        <div style={{ marginBottom: "20px" }}>
          <label>Last Payment Date</label>

          <input
            type="date"
            name="last_payment_date"
            value={formData.last_payment_date}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              boxSizing: "border-box",
            }}
          />

          <small>
            Next payment date will be calculated automatically.
          </small>
        </div>

        {/* REMINDER */}
        <div style={{ marginBottom: "20px" }}>
          <label>Reminder Days</label>

          <input
            type="number"
            name="reminder_days"
            value={formData.reminder_days}
            onChange={handleChange}
            min="0"
            max="30"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              boxSizing: "border-box",
            }}
          />

          <small>
            Choose between 0 and 30 days.
          </small>
        </div>

        {/* AUTO PAY */}
        <div style={{ marginBottom: "20px" }}>
          <label>
            <input
              type="checkbox"
              name="auto_pay"
              checked={formData.auto_pay}
              onChange={handleChange}
            />

            {" "}Auto-Pay Enabled
          </label>
        </div>

        {/* END DATE */}
        <div style={{ marginBottom: "25px" }}>
          <label>Subscription End Date</label>

          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* BUTTONS */}
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 25px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Adding..."
              : "Add Subscription"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "12px 25px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>

      </form>
    </main>
  );
}

export default AddSubscription;