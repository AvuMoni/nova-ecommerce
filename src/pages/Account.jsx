import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";


const Account = () => {
const [user, setUser] = useState(null);
const [orders, setOrders] = useState([]);

const [loadingUser, setLoadingUser] = useState(true);
const [loadingOrders, setLoadingOrders] = useState(true);

const [userError, setUserError] = useState("");
const [ordersError, setOrdersError] = useState("");

const [name, setName] = useState("");
const [savingProfile, setSavingProfile] = useState(false);
const [profileMessage, setProfileMessage] = useState("");
const [profileError, setProfileError] = useState("");

/* =========================================================
LOAD CURRENT USER
========================================================= */

useEffect(() => {
const fetchUser = async () => {
try {
const token = localStorage.getItem("nova_token");


    if (!token) {
      setUserError("Your session has expired. Please log in again.");
      setLoadingUser(false);
      return;
    }

    const response = await fetch(
      `${API_URL}/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Unable to load your account."
      );
    }

    const currentUser = data?.user;

    setUser(currentUser);
    setName(currentUser?.name || "");
  } catch (error) {
    console.error("Account user error:", error);
    setUserError(error.message);
  } finally {
    setLoadingUser(false);
  }
};

fetchUser();


}, []);

/* =========================================================
LOAD CUSTOMER ORDERS
========================================================= */

useEffect(() => {
const fetchOrders = async () => {
try {
const token = localStorage.getItem("nova_token");


    if (!token) {
      setOrdersError(
        "Please log in to view your orders."
      );
      setLoadingOrders(false);
      return;
    }

    const response = await fetch(
      `${API_URL}/orders`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Unable to load your orders."
      );
    }

    setOrders(
      Array.isArray(data?.orders)
        ? data.orders
        : []
    );
  } catch (error) {
    console.error("Orders error:", error);
    setOrdersError(error.message);
  } finally {
    setLoadingOrders(false);
  }
};

fetchOrders();


}, []);

/* =========================================================
UPDATE PROFILE
========================================================= */

const handleProfileUpdate = async (event) => {
event.preventDefault();


setProfileMessage("");
setProfileError("");

if (!name.trim()) {
  setProfileError("Name cannot be empty.");
  return;
}

try {
  setSavingProfile(true);

  const token = localStorage.getItem("nova_token");

  const response = await fetch(
    `${API_URL}/auth/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name.trim(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Unable to update your profile."
    );
  }

  setUser(data.user);
  setName(data.user.name);

  setProfileMessage(
    "Profile updated successfully."
  );
} catch (error) {
  console.error(
    "Profile update error:",
    error
  );

  setProfileError(error.message);
} finally {
  setSavingProfile(false);
}


};

/* =========================================================
FORMATTERS
========================================================= */

const formatCurrency = (amount) => {
return new Intl.NumberFormat("en-ZA", {
style: "currency",
currency: "ZAR",
}).format(Number(amount) || 0);
};

const formatDate = (date) => {
if (!date) return "—";


return new Intl.DateTimeFormat("en-ZA", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}).format(new Date(date));

};

const getPaymentStatusClass = (status) => {
return `order-status order-status-${String(
      status || "pending"
    ).toLowerCase()}`;
};

const getOrderStatusClass = (status) => {
return `order-status order-status-${String(
      status || "pending"
    ).toLowerCase()}`;
};

/* =========================================================
LOADING
========================================================= */

if (loadingUser) {
return ( <main className="account-page"> <section className="account-container"> <div className="account-loading">
Loading your account... </div> </section> </main>
);
}

/* =========================================================
ERROR
========================================================= */

if (userError) {
return ( <main className="account-page"> <section className="account-container"> <div className="account-error"> <h1>Account unavailable</h1> <p>{userError}</p>


        <Link
          to="/login"
          className="account-primary-button"
        >
          Log in
        </Link>
      </div>
    </section>
  </main>
);


}

/* =========================================================
ACCOUNT
========================================================= */

return ( <main className="account-page"> <section className="account-container">


    {/* HEADER */}
    <div className="account-header">
      <div>
        <p className="account-eyebrow">
          NOVA ACCOUNT
        </p>

        <h1>
          Welcome back,{" "}
          <span>
            {user?.name || "Customer"}
          </span>
        </h1>

        <p>
          Manage your profile and keep track
          of your NOVA orders.
        </p>
      </div>

      <Link
        to="/shop"
        className="account-secondary-button"
      >
        Continue shopping
      </Link>
    </div>

    {/* PROFILE */}
    <section className="account-card">
      <div className="account-card-header">
        <div>
          <p className="account-section-label">
            PROFILE
          </p>

          <h2>
            Personal information
          </h2>
        </div>
      </div>

      <form
        className="account-profile-form"
        onSubmit={handleProfileUpdate}
      >
        <div className="account-field">
          <label htmlFor="account-name">
            Full name
          </label>

          <input
            id="account-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Your full name"
          />
        </div>

        <div className="account-field">
          <label htmlFor="account-email">
            Email address
          </label>

          <input
            id="account-email"
            type="email"
            value={user?.email || ""}
            disabled
          />
        </div>

        <div className="account-profile-actions">
          <button
            type="submit"
            className="account-primary-button"
            disabled={savingProfile}
          >
            {savingProfile
              ? "Saving..."
              : "Save changes"}
          </button>

          {profileMessage && (
            <p className="account-success-message">
              {profileMessage}
            </p>
          )}

          {profileError && (
            <p className="account-error-message">
              {profileError}
            </p>
          )}
        </div>
      </form>
    </section>

    {/* ORDERS */}
    <section className="account-card account-orders-card">
      <div className="account-card-header">
        <div>
          <p className="account-section-label">
            ORDER HISTORY
          </p>

          <h2>
            My orders
          </h2>

          <p>
            View your recent purchases and
            payment information.
          </p>
        </div>

        <div className="account-order-count">
          {orders.length}
          <span>
            {orders.length === 1
              ? " order"
              : " orders"}
          </span>
        </div>
      </div>

      {/* ORDERS LOADING */}
      {loadingOrders && (
        <div className="orders-message">
          Loading your orders...
        </div>
      )}

      {/* ORDERS ERROR */}
      {!loadingOrders && ordersError && (
        <div className="orders-message orders-message-error">
          <p>{ordersError}</p>

          <button
            type="button"
            className="account-secondary-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try again
          </button>
        </div>
      )}

      {/* NO ORDERS */}
      {!loadingOrders &&
        !ordersError &&
        orders.length === 0 && (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              🛍
            </div>

            <h3>
              No orders yet
            </h3>

            <p>
              Your completed purchases will
              appear here.
            </p>

            <Link
              to="/shop"
              className="account-primary-button"
            >
              Start shopping
            </Link>
          </div>
        )}

      {/* ORDERS */}
      {!loadingOrders &&
        !ordersError &&
        orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <article
                className="order-card"
                key={order._id}
              >
                <div className="order-card-top">
                  <div>
                    <p className="order-reference-label">
                      ORDER REFERENCE
                    </p>

                    <h3>
                      {order.paymentReference}
                    </h3>

                    <p className="order-date">
                      {formatDate(
                        order.createdAt
                      )}
                    </p>
                  </div>

                  <div className="order-total">
                    {formatCurrency(
                      order.total
                    )}
                  </div>
                </div>

                <div className="order-card-info">
                  <div className="order-info-item">
                    <span>
                      Payment
                    </span>

                    <strong
                      className={getPaymentStatusClass(
                        order.paymentStatus
                      )}
                    >
                      {order.paymentStatus ||
                        "Pending"}
                    </strong>
                  </div>

                  <div className="order-info-item">
                    <span>
                      Order status
                    </span>

                    <strong
                      className={getOrderStatusClass(
                        order.orderStatus
                      )}
                    >
                      {order.orderStatus ||
                        "Pending"}
                    </strong>
                  </div>

                  <div className="order-info-item">
                    <span>
                      Items
                    </span>

                    <strong>
                      {order.items?.reduce(
                        (
                          total,
                          item
                        ) =>
                          total +
                          Number(
                            item.quantity
                          ),
                        0
                      ) || 0}
                    </strong>
                  </div>
                </div>

                <div className="order-card-bottom">
                  <div className="order-products-preview">
                    {order.items
                      ?.slice(0, 3)
                      .map(
                        (
                          item,
                          index
                        ) => (
                          <span
                            key={`${order._id}-${index}`}
                          >
                            {item.name}
                            {item.quantity >
                              1 &&
                              ` × ${item.quantity}`}
                          </span>
                        )
                      )}

                    {order.items?.length >
                      3 && (
                      <span>
                        +
                        {order.items.length -
                          3}{" "}
                        more
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/account/orders/${order._id}`}
                    className="account-secondary-button"
                  >
                    View order
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
    </section>

  </section>
</main>


);
};

export default Account;
