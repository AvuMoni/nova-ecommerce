import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useShop } from "../context/ShopContext";
import API_URL from "../api";


function PaymentCallback() {
const [searchParams] =
useSearchParams();

const { clearCart } = useShop();

const [status, setStatus] =
useState("verifying");

const [message, setMessage] =
useState(
"We're verifying your payment..."
);

const [order, setOrder] =
useState(null);

useEffect(() => {
let cancelled = false;

const verifyPayment = async () => {
  const reference =
    searchParams.get("reference");

  const token =
    localStorage.getItem(
      "nova_token"
    );

  if (!reference) {
    setStatus("error");
    setMessage(
      "No payment reference was provided."
    );
    return;
  }

  if (!token) {
    setStatus("error");
    setMessage(
      "Your session has expired. Please log in again."
    );
    return;
  }

  try {
    const response =
      await fetch(
        `${API_URL}/payment/verify/${encodeURIComponent(
          reference
        )}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    if (cancelled) {
      return;
    }

    if (
      !response.ok ||
      !data.success
    ) {
      setStatus("error");
      setMessage(
        data.message ||
          "We could not verify your payment."
      );
      return;
    }

    /*
    ------------------------------------------
    Payment successfully verified
    ------------------------------------------
    */

    if (
      data.data?.paymentStatus ===
      "paid"
    ) {
      clearCart();

      setOrder(data.data);
      setStatus("success");
      setMessage(
        "Your payment was successful and your order has been confirmed."
      );

      return;
    }

    setStatus("error");
    setMessage(
      "The payment could not be confirmed."
    );
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    if (!cancelled) {
      setStatus("error");
      setMessage(
        "Something went wrong while verifying your payment."
      );
    }
  }
};

verifyPayment();

return () => {
  cancelled = true;
};


}, [searchParams, clearCart]);

return ( <main className="payment-callback-page"> <section className="payment-callback-card">


    {status === "verifying" && (
      <>
        <div className="payment-status-icon">
          ...
        </div>

        <h1>
          Verifying payment
        </h1>

        <p>
          {message}
        </p>

        <p className="payment-secondary-text">
          Please do not close this page.
        </p>
      </>
    )}

    {status === "success" && (
      <>
        <div className="payment-status-icon success">
          ✓
        </div>

        <h1>
          Payment successful
        </h1>

        <p>
          {message}
        </p>

        {order && (
          <div className="order-confirmation-details">

            <div>
              <span>
                Order reference
              </span>

              <strong>
                {order.reference}
              </strong>
            </div>

            <div>
              <span>
                Total
              </span>

              <strong>
                R
                {(
                  Number(order.total) || 0
                ).toFixed(2)}
              </strong>
            </div>

            <div>
              <span>
                Payment status
              </span>

              <strong>
                Paid
              </strong>
            </div>

          </div>
        )}

        <div className="payment-callback-actions">

          <Link
            to="/account"
            className="payment-primary-button"
          >
            View account
          </Link>

          <Link
            to="/shop"
            className="payment-secondary-button"
          >
            Continue shopping
          </Link>

        </div>
      </>
    )}

    {status === "error" && (
      <>
        <div className="payment-status-icon error">
          !
        </div>

        <h1>
          Payment could not be confirmed
        </h1>

        <p>
          {message}
        </p>

        <div className="payment-callback-actions">

          <Link
            to="/cart"
            className="payment-primary-button"
          >
            Return to cart
          </Link>

          <Link
            to="/account"
            className="payment-secondary-button"
          >
            Go to account
          </Link>

        </div>
      </>
    )}

  </section>
</main>


);
}

export default PaymentCallback;
