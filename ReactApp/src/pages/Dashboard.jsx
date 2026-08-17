import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await API.get("subscriptions/");
      setSubscriptions(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilPayment = (paymentDate) => {
    if (!paymentDate) {
      return null;
    }

    const today = new Date();
    const payment = new Date(paymentDate);

    if (isNaN(payment.getTime())) {
      return null;
    }

    today.setHours(0, 0, 0, 0);
    payment.setHours(0, 0, 0, 0);

    const difference = payment - today;

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  if (loading) {
    return (
      <main>
        <h1>Dashboard</h1>
        <p>Loading subscriptions...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>My Subscriptions</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        <Link to="/add-subscription">
          <button>Add Subscription</button>
        </Link>
      </div>

      {message && <p>{message}</p>}

      {subscriptions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            background: "#1f2937",
            borderRadius: "12px",
            border: "1px solid #374151",
          }}
        >
          <h2>No Subscriptions Yet</h2>

          <p>
            Add your first subscription to start
            managing your expenses.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {subscriptions.map((subscription) => {
            const daysUntilPayment =
              getDaysUntilPayment(
                subscription.next_payment_date
              );

            return (
              <div
                key={subscription.id}
                style={{
                  background: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "12px",
                  padding: "22px",
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.2)",
                }}
              >
                {/* Service Name */}
                <h2>
                  {subscription.service_name}
                </h2>

                {/* Amount */}
                <h3>
                  ₹
                  {subscription.amount !== null &&
                  subscription.amount !== undefined
                    ? subscription.amount
                    : "Not specified"}

                  <span
                    style={{
                      fontSize: "14px",
                      color: "#9ca3af",
                    }}
                  >
                    {" "}
                    /{" "}
                    {subscription.billing_cycle ===
                    "annual"
                      ? "year"
                      : "month"}
                  </span>
                </h3>

                <hr />

                {/* Billing Cycle */}
                <p>
                  🔄 <strong>Billing Cycle:</strong>{" "}
                  {subscription.billing_cycle ===
                  "annual"
                    ? "Annual"
                    : "Monthly"}
                </p>

                {/* Last Payment */}
                <p>
                  💳 <strong>Last Payment:</strong>{" "}
                  {subscription.last_payment_date ||
                    "Not specified"}
                </p>

                {/* Next Payment */}
                <p>
                  📅 <strong>Next Payment:</strong>{" "}
                  {subscription.next_payment_date ||
                    "Not calculated"}
                </p>

                {/* Reminder */}
                <p>
                  🔔 <strong>Reminder:</strong>{" "}
                  {subscription.reminder_days} days
                  before
                </p>

                {/* Auto Pay */}
                <p>
                  🔄 <strong>Auto-Pay:</strong>{" "}
                  {subscription.auto_pay
                    ? "Enabled"
                    : "Disabled"}
                </p>

                {/* End Date */}
                <p>
                  ⏳ <strong>End Date:</strong>{" "}
                  {subscription.end_date ||
                    "Not specified"}
                </p>

                {/* Status */}
                <p>
                  🟢 <strong>Status:</strong>{" "}
                  {subscription.is_active
                    ? "Active"
                    : "Inactive"}
                </p>

                <hr />

                {/* Payment Alert */}
                {daysUntilPayment === null ? (
                  <p
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    📅 Next payment date not
                    available
                  </p>
                ) : daysUntilPayment < 0 ? (
                  <p
                    style={{
                      color: "#f87171",
                    }}
                  >
                    ⚠️ Payment date has passed
                  </p>
                ) : daysUntilPayment === 0 ? (
                  <p
                    style={{
                      color: "#fbbf24",
                    }}
                  >
                    🔔 Payment is due today
                  </p>
                ) : daysUntilPayment <=
                  subscription.reminder_days ? (
                  <p
                    style={{
                      color: "#fbbf24",
                    }}
                  >
                    🔔 Payment due in{" "}
                    {daysUntilPayment} days
                  </p>
                ) : (
                  <p
                    style={{
                      color: "#34d399",
                    }}
                  >
                    ✓ Next payment in{" "}
                    {daysUntilPayment} days
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Dashboard;