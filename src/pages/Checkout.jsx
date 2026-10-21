import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

import API_URL from "../api";

function Checkout() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const {
    cart,
    cartSubtotal,
  } = useShop();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
  ========================================
  AUTHENTICATION CHECK
  ========================================
  */

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login", {
        state: {
          from: "/checkout",
        },
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    user,
    navigate,
  ]);

  /*
  ========================================
  DELIVERY + TOTAL
  ========================================
  */

  const deliveryFee =
    cartSubtotal >= 1000
      ? 0
      : cartSubtotal > 0
        ? 99
        : 0;

  const total =
    cartSubtotal + deliveryFee;

  /*
  ========================================
  CHECKOUT HANDLER
  ========================================
  */

  const handleCheckout = async () => {
    setError("");

    /*
    Make sure the customer is authenticated.
    */

    if (!isAuthenticated || !user) {
      navigate("/login", {
        state: {
          from: "/checkout",
        },
      });

      return;
    }

    /*
    Make sure the cart contains products.
    */

    if (!cart || cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    /*
    Prevent duplicate checkout requests.
    */

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      /*
      Retrieve the JWT created during login.
      */

      const token =
        localStorage.getItem("nova_token");

      if (!token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      /*
      ========================================
      PREPARE ORDER ITEMS
      ========================================

      IMPORTANT:
      Product IDs are strings:

      nova-001
      nova-002
      nova-003
      ...

      Do NOT convert them to Number().
      */

      const items = cart.map((item) => ({
        productId: String(item.productId),

        quantity: Math.max(
          1,
          Number(item.quantity) || 1
        ),

        size:
          item.size || null,

        color:
          item.color || null,
      }));

      /*
      ========================================
      SEND CHECKOUT REQUEST
      ========================================

      The backend is responsible for:

      - validating the JWT
      - validating products
      - checking stock
      - calculating prices
      - calculating delivery
      - calculating the final total
      - creating the pending order
      - initializing Paystack
      */

      const response = await fetch(
        `${API_URL}/orders/checkout`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            items,
          }),
        }
      );

      /*
      Attempt to parse the response safely.
      */

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      /*
      ========================================
      HANDLE BACKEND ERROR
      ========================================
      */

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to initialize checkout."
        );
      }

      /*
      ========================================
      PAYSTACK PAYMENT URL
      ========================================
      */

      const authorizationUrl =
        data?.payment?.authorizationUrl;

      if (authorizationUrl) {
        /*
        Redirect the customer to Paystack's
        secure hosted payment page.
        */

        window.location.assign(
          authorizationUrl
        );

        return;
      }

      /*
      No payment URL was returned.
      */

      throw new Error(
        "Paystack did not return a payment URL."
      );
    } catch (checkoutError) {
      console.error(
        "Checkout error:",
        checkoutError
      );

      setError(
        checkoutError?.message ||
          "Something went wrong during checkout."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  EMPTY CART
  ========================================
  */

  if (!cart || cart.length === 0) {
    return (
      <main className="nova-checkout-page">
        <div className="nova-checkout-container">
          <div className="nova-empty-state">
            <p className="nova-section-eyebrow">
              CHECKOUT
            </p>

            <h1>
              Your cart is empty
            </h1>

            <p>
              Add some products to your cart
              before checking out.
            </p>

            <Link
              to="/shop"
              className="nova-primary-button"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
  ========================================
  CHECKOUT PAGE
  ========================================
  */

  return (
    <main className="nova-checkout-page">
      <div className="nova-checkout-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="nova-checkout-header">
          <p className="nova-section-eyebrow">
            NOVA CHECKOUT
          </p>

          <h1>
            Complete your purchase
          </h1>

          <p>
            Review your order before
            continuing to secure payment.
          </p>
        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div
            className="nova-checkout-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="nova-checkout-layout">

          {/* =========================
              LEFT COLUMN
          ========================= */}

          <section className="nova-checkout-section">

            {/* CUSTOMER INFORMATION */}

            <div className="nova-checkout-card">
              <div className="nova-checkout-card-header">
                <h2>
                  Customer information
                </h2>
              </div>

              <div className="nova-checkout-customer">

                <div>
                  <span>
                    Name
                  </span>

                  <strong>
                    {user?.name ||
                      "Customer"}
                  </strong>
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    {user?.email || ""}
                  </strong>
                </div>

              </div>
            </div>

            {/* ORDER ITEMS */}

            <div className="nova-checkout-card">
              <div className="nova-checkout-card-header">
                <h2>
                  Your items
                </h2>
              </div>

              <div className="nova-checkout-items">

                {cart.map((item) => {
                  const itemTotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                  return (
                    <div
                      className="nova-checkout-item"
                      key={
                        item.cartItemId ||
                        item.productId
                      }
                    >

                      {/* IMAGE */}

                      <div className="nova-checkout-item-image">
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      </div>

                      {/* PRODUCT INFO */}

                      <div className="nova-checkout-item-info">
                        <h3>
                          {item.name}
                        </h3>

                        {item.size && (
                          <p>
                            Size:{" "}
                            {item.size}
                          </p>
                        )}

                        {item.color && (
                          <p>
                            Color:{" "}
                            {item.color}
                          </p>
                        )}

                        <p>
                          Quantity:{" "}
                          {item.quantity}
                        </p>
                      </div>

                      {/* PRICE */}

                      <strong className="nova-checkout-item-price">
                        R
                        {itemTotal.toLocaleString(
                          "en-ZA",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </strong>

                    </div>
                  );
                })}

              </div>
            </div>

          </section>

          {/* =========================
              RIGHT COLUMN
          ========================= */}

          <aside className="nova-checkout-summary">

            <div className="nova-checkout-card">

              <div className="nova-checkout-card-header">
                <h2>
                  Order summary
                </h2>
              </div>

              {/* SUBTOTAL */}

              <div className="nova-summary-row">
                <span>
                  Subtotal
                </span>

                <strong>
                  R
                  {cartSubtotal.toLocaleString(
                    "en-ZA",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>
              </div>

              {/* DELIVERY */}

              <div className="nova-summary-row">
                <span>
                  Delivery
                </span>

                <strong>
                  {deliveryFee === 0
                    ? "FREE"
                    : `R${deliveryFee.toLocaleString(
                        "en-ZA",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}`}
                </strong>
              </div>

              {/* FREE DELIVERY MESSAGE */}

              {cartSubtotal > 0 &&
                cartSubtotal < 1000 && (
                  <p className="free-delivery-note">
                    Add R
                    {(
                      1000 -
                      cartSubtotal
                    ).toLocaleString(
                      "en-ZA"
                    )}{" "}
                    more for free delivery.
                  </p>
                )}

              <div className="nova-summary-divider" />

              {/* TOTAL */}

              <div className="nova-summary-total">
                <span>
                  Total
                </span>

                <strong>
                  R
                  {total.toLocaleString(
                    "en-ZA",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>
              </div>

              {/* PAY BUTTON */}

              <button
                type="button"
                className="nova-checkout-button"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading
                  ? "Connecting to Paystack..."
                  : `Pay R${total.toLocaleString(
                      "en-ZA",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}`}
              </button>

              {/* SECURITY MESSAGE */}

              <p className="nova-checkout-secure">
                You will be redirected to
                Paystack's secure payment page.
              </p>

              {/* BACK TO CART */}

              <Link
                to="/cart"
                className="nova-back-to-cart"
              >
                ← Back to cart
              </Link>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}

export default Checkout;


