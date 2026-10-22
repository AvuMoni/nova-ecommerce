
import { useCallback, useEffect, useMemo, useState } from "react";
import API_URL from "../api";


const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatCurrency(amount, currency = "ZAR") {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
  }).format(Number(amount) || 0);
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [notice, setNotice] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("nova_token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${API_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      setError(err.message || "Something went wrong loading orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        order.customerName || order.user?.name || "";

      const customerEmail =
        order.customerEmail || order.user?.email || "";

      const matchesSearch =
        !term ||
        customerName.toLowerCase().includes(term) ||
        customerEmail.toLowerCase().includes(term) ||
        String(order.paymentReference || "").toLowerCase().includes(term) ||
        String(order._id || "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        order.orderStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((order) => order.orderStatus === "pending").length,
    processing: orders.filter((order) => order.orderStatus === "processing").length,
    paidRevenue: orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0),
  }), [orders]);

  async function updateOrderStatus(orderId, orderStatus) {
    setUpdatingOrder(orderId);
    setError("");
    setNotice("");

    try {
      const token = localStorage.getItem("nova_token");

      const response = await fetch(
        `${API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update order status.");
      }

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: data.order?.orderStatus || orderStatus,
                updatedAt: data.order?.updatedAt || new Date().toISOString(),
              }
            : order
        )
      );

      setNotice("Order status updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update order status.");
    } finally {
      setUpdatingOrder(null);
    }
  }

  return (
    <main className="admin-orders-page">
      <section className="admin-orders-header">
        <div>
          <p className="admin-eyebrow">NOVA MANAGEMENT</p>
          <h1>Orders</h1>
          <p className="admin-subtitle">
            Manage customer orders, payments and fulfilment.
          </p>
        </div>

        <button
          className="admin-refresh-button"
          type="button"
          onClick={fetchOrders}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh orders"}
        </button>
      </section>

      {error && (
        <div className="admin-message admin-message-error" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div className="admin-message admin-message-success" role="status">
          {notice}
        </div>
      )}

      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <span>Total orders</span>
          <strong>{stats.total}</strong>
        </article>

        <article className="admin-stat-card">
          <span>Pending orders</span>
          <strong>{stats.pending}</strong>
        </article>

        <article className="admin-stat-card">
          <span>Processing orders</span>
          <strong>{stats.processing}</strong>
        </article>

        <article className="admin-stat-card">
          <span>Paid order revenue</span>
          <strong>{formatCurrency(stats.paidRevenue)}</strong>
        </article>
      </section>

      <section className="admin-orders-panel">
        <div className="admin-orders-panel-heading">
          <div>
            <h2>All orders</h2>
            <p>{filteredOrders.length} matching orders</p>
          </div>
        </div>

        <div className="admin-order-filters">
          <input
            type="search"
            placeholder="Search customer, email or reference..."
            aria-label="Search orders"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            aria-label="Filter by order status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All order statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by payment status"
            value={paymentFilter}
            onChange={(event) => setPaymentFilter(event.target.value)}
          >
            <option value="all">All payment statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-orders-empty">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-orders-empty">
            No orders match your filters.
          </div>
        ) : (
          <div className="admin-orders-table-wrap">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Order status</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const customerName =
                    order.customerName || order.user?.name || "Customer";

                  const customerEmail =
                    order.customerEmail || order.user?.email || "—";

                  return (
                    <tr key={order._id}>
                      <td>
                        <span className="admin-order-reference">
                          {order.paymentReference || order._id}
                        </span>
                      </td>

                      <td>
                        <div className="admin-customer-cell">
                          <strong>{customerName}</strong>
                          <span>{customerEmail}</span>
                        </div>
                      </td>

                      <td>{formatDate(order.createdAt)}</td>

                      <td className="admin-order-total">
                        {formatCurrency(order.total, order.currency)}
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge status-${String(
                            order.paymentStatus || "pending"
                          ).toLowerCase()}`}
                        >
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>

                      <td>
                        <select
                          className="admin-status-select"
                          aria-label={`Update order status for ${order.paymentReference || order._id}`}
                          value={order.orderStatus || "pending"}
                          disabled={updatingOrder === order._id}
                          onChange={(event) =>
                            updateOrderStatus(order._id, event.target.value)
                          }
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>

                        {updatingOrder === order._id && (
                          <small className="admin-updating-label">
                            Saving...
                          </small>
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-details-button"
                          onClick={() =>
                            setExpandedOrder((current) =>
                              current === order._id ? null : order._id
                            )
                          }
                        >
                          {expandedOrder === order._id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredOrders.map((order) =>
              expandedOrder === order._id ? (
                <section className="admin-order-details" key={order._id}>
                  <div className="admin-order-details-heading">
                    <h3>Order details</h3>
                    <span>{order.paymentReference || order._id}</span>
                  </div>

                  <p>
                    <strong>Customer:</strong>{" "}
                    {order.customerName || order.user?.name || "Customer"}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {order.customerEmail || order.user?.email || "—"}
                  </p>

                  <p>
                    <strong>Payment reference:</strong>{" "}
                    {order.paymentReference || "—"}
                  </p>

                  <p>
                    <strong>Subtotal:</strong>{" "}
                    {formatCurrency(order.subtotal, order.currency)}
                  </p>

                  <p>
                    <strong>Delivery:</strong>{" "}
                    {formatCurrency(order.deliveryFee, order.currency)}
                  </p>

                  <h4>Items</h4>

                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    <ul className="admin-order-items">
                      {order.items.map((item, index) => (
                        <li key={`${item.productId || item.name}-${index}`}>
                          <span>
                            <strong>{item.name}</strong>
                            <small>
                              Size: {item.size || "—"} · Color: {item.color || "—"} · Qty: {item.quantity || 1}
                            </small>
                          </span>

                          <strong>
                            {formatCurrency(
                              (Number(item.price) || 0) *
                                (Number(item.quantity) || 1),
                              order.currency
                            )}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No item details are available.</p>
                  )}

                  <p className="admin-order-details-total">
                    <strong>Order total:</strong>{" "}
                    {formatCurrency(order.total, order.currency)}
                  </p>
                </section>
              ) : null
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminOrders;
