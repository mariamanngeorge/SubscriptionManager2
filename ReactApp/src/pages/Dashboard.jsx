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
      console.error("Fetch subscriptions error:", error);

      if (error.response?.status === 401) {
        setMessage("Session expired. Please login again.");
      } else {
        setMessage("Unable to load subscriptions.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilPayment = (paymentDate) => {
    if (!paymentDate) return null;

    const today = new Date();
    const payment = new Date(paymentDate);

    today.setHours(0, 0, 0, 0);
    payment.setHours(0, 0, 0, 0);

    const difference = payment - today;

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.is_active
  );

  const totalMonthlySpend = activeSubscriptions.reduce(
    (total, subscription) => {
      const amount = Number(subscription.amount || 0);

      if (subscription.billing_cycle === "annual") {
        return total + amount / 12;
      }

      return total + amount;
    },
    0
  );

  const totalAnnualSpend = totalMonthlySpend * 12;

  if (loading) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Dashboard</h1>
        <p>Loading subscriptions...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1>My Subscriptions</h1>

      {/* ERROR MESSAGE */}
      {message && (
        <div
          style={{
            background: "#7f1d1d",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {message}
        </div>
      )}

      {/* SPENDING SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* MONTHLY */}
        <div
          style={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "25px",
            textAlign: "center",
          }}
        >
          <h2>💰 Monthly Spend</h2>

          <h1
            style={{
              margin: "10px 0 0",
              color: "#a78bfa",
            }}
          >
            ₹{totalMonthlySpend.toFixed(2)}
          </h1>
        </div>

        {/* ANNUAL */}
        <div
          style={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "25px",
            textAlign: "center",
          }}
        >
          <h2>📊 Annual Spend</h2>

          <h1
            style={{
              margin: "10px 0 0",
              color: "#34d399",
            }}
          >
            ₹{totalAnnualSpend.toFixed(2)}
          </h1>
        </div>
      </div>

      {/* ADD SUBSCRIPTION BUTTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        <Link to="/add-subscription">
          <button
            style={{
              padding: "12px 25px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            + Add Subscription
          </button>
        </Link>
      </div>

      {/* NO SUBSCRIPTIONS */}
      {activeSubscriptions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            background: "#1f2937",
            borderRadius: "12px",
            border: "1px solid #374151",
          }}
        >
          <h2>No Active Subscriptions</h2>

          <p>
            Add your first subscription to start
            managing your expenses.
          </p>

          <Link to="/add-subscription">
            <button
              style={{
                padding: "12px 20px",
                marginTop: "15px",
              }}
            >
              Add Your First Subscription
            </button>
          </Link>
        </div>
      ) : (
        /* SUBSCRIPTION CARDS */
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {activeSubscriptions.map((subscription) => {
            const daysUntilPayment =
              getDaysUntilPayment(
                subscription.next_payment_date
              );

            const amount = Number(
              subscription.amount || 0
            );

            const isAnnual =
              subscription.billing_cycle === "annual";

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
                {/* SERVICE */}
                <h2>
                  {subscription.service_name}
                </h2>

                {/* AMOUNT */}
                <h3>
                  ₹{amount.toFixed(2)}

                  <span
                    style={{
                      fontSize: "14px",
                      color: "#9ca3af",
                    }}
                  >
                    {isAnnual
                      ? " / year"
                      : " / month"}
                  </span>
                </h3>

                <hr />

                {/* LAST PAYMENT */}
                <p>
                  💳 <strong>Last Payment:</strong>{" "}
                  {subscription.last_payment_date ||
                    "Not specified"}
                </p>

                {/* NEXT PAYMENT */}
                <p>
                  📅 <strong>Next Payment:</strong>{" "}
                  {subscription.next_payment_date ||
                    "Not specified"}
                </p>

                {/* REMINDER */}
                <p>
                  🔔 <strong>Reminder:</strong>{" "}
                  {subscription.reminder_days} days
                  before
                </p>

                {/* AUTO PAY */}
                <p>
                  🔄 <strong>Auto-Pay:</strong>{" "}
                  {subscription.auto_pay
                    ? "Enabled"
                    : "Disabled"}
                </p>

                {/* END DATE */}
                <p>
                  ⏳ <strong>End Date:</strong>{" "}
                  {subscription.end_date ||
                    "Not specified"}
                </p>

                {/* STATUS */}
                <p>
                  🟢 <strong>Status:</strong>{" "}
                  {subscription.is_active
                    ? "Active"
                    : "Inactive"}
                </p>

                <hr />

                {/* PAYMENT REMINDER */}
                {daysUntilPayment !== null &&
                daysUntilPayment < 0 ? (
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
                ) : (
                  daysUntilPayment !== null &&
                  daysUntilPayment <=
                    subscription.reminder_days && (
                    <p
                      style={{
                        color: "#fbbf24",
                      }}
                    >
                      🔔 Payment due in{" "}
                      {daysUntilPayment} days
                    </p>
                  )
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