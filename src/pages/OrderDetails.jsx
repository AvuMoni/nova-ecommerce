import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API_URL from "../api";

const OrderDetails = () => {
const { id } = useParams();

const [order, setOrder] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const fetchOrder = async () => {
try {
const token =
localStorage.getItem("nova_token");


    if (!token) {
      throw new Error(
        "Please log in to view this order."
      );
    }

    const response = await fetch(
      `${API_URL}/orders/${id}`,
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
          "Unable to retrieve this order."
      );
    }

    setOrder(data.order);
  } catch (error) {
    console.error(
      "Order details error:",
      error
    );

    setError(error.message);
  } finally {
    setLoading(false);
  }
};

fetchOrder();


}, [id]);

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
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(date));


};

const statusClass = (status) =>
`order-details-status order-details-status-${String(
      status || "pending"
    ).toLowerCase()}`;

if (loading) {
return ( <main className="order-details-page"> <div className="order-details-container"> <div className="order-details-loading">
Loading order... </div> </div> </main>
);
}

if (error) {
return ( <main className="order-details-page"> <div className="order-details-container"> <div className="order-details-error"> <h1>Order unavailable</h1> <p>{error}</p>


        <Link
          to="/account"
          className="account-primary-button"
        >
          Back to account
        </Link>
      </div>
    </div>
  </main>
);


}

if (!order) {
return null;
}

return ( <main className="order-details-page"> <div className="order-details-container">


    <Link
      to="/account"
      className="order-back-link"
    >
      ← Back to my orders
    </Link>

    <header className="order-details-header">
      <div>
        <p className="account-eyebrow">
          NOVA ORDER
        </p>

        <h1>
          {order.paymentReference}
        </h1>

        <p>
          Placed on{" "}
          {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="order-details-status-group">
        <span
          className={statusClass(
            order.paymentStatus
          )}
        >
          Payment:{" "}
          {order.paymentStatus}
        </span>

        <span
          className={statusClass(
            order.orderStatus
          )}
        >
          Order:{" "}
          {order.orderStatus}
        </span>
      </div>
    </header>

    {/* PRODUCTS */}
    <section className="order-details-card">
      <div className="order-details-card-header">
        <h2>Items</h2>

        <span>
          {order.items?.length || 0} product
          {order.items?.length === 1
            ? ""
            : "s"}
        </span>
      </div>

      <div className="order-details-items">
        {order.items?.map(
          (item, index) => (
            <article
              className="order-details-item"
              key={`${item.productId}-${index}`}
            >
              <div className="order-details-item-image">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                ) : (
                  <div>
                    NOVA
                  </div>
                )}
              </div>

              <div className="order-details-item-info">
                <h3>
                  {item.name}
                </h3>

                <div className="order-details-item-options">
                  {item.size && (
                    <span>
                      Size: {item.size}
                    </span>
                  )}

                  {item.color && (
                    <span>
                      Color: {item.color}
                    </span>
                  )}

                  <span>
                    Quantity:{" "}
                    {item.quantity}
                  </span>
                </div>
              </div>

              <div className="order-details-item-price">
                {formatCurrency(
                  item.price *
                    item.quantity
                )}
              </div>
            </article>
          )
        )}
      </div>
    </section>

    {/* SUMMARY */}
    <section className="order-details-card">
      <div className="order-details-card-header">
        <h2>Order summary</h2>
      </div>

      <div className="order-summary">
        <div>
          <span>
            Subtotal
          </span>

          <strong>
            {formatCurrency(
              order.subtotal
            )}
          </strong>
        </div>

        <div>
          <span>
            Delivery
          </span>

          <strong>
            {order.deliveryFee === 0
              ? "FREE"
              : formatCurrency(
                  order.deliveryFee
                )}
          </strong>
        </div>

        <div className="order-summary-total">
          <span>
            Total
          </span>

          <strong>
            {formatCurrency(
              order.total
            )}
          </strong>
        </div>
      </div>
    </section>

    {/* PAYMENT */}
    <section className="order-details-card">
      <div className="order-details-card-header">
        <h2>Payment</h2>
      </div>

      <div className="order-payment-details">
        <div>
          <span>
            Reference
          </span>

          <strong>
            {order.paymentReference}
          </strong>
        </div>

        <div>
          <span>
            Currency
          </span>

          <strong>
            {order.currency}
          </strong>
        </div>

        <div>
          <span>
            Payment status
          </span>

          <strong
            className={statusClass(
              order.paymentStatus
            )}
          >
            {order.paymentStatus}
          </strong>
        </div>
      </div>
    </section>

  </div>
</main>


);
};

export default OrderDetails;
