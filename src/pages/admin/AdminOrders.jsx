import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  orderStatuses,
  updateOrderStatus,
} from "../../features/orders/ordersSlice";
import formatPrice from "../../utils/formatPrice";

function formatDate(value) {
  if (!value) return "Date not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not provided"
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function orderItems(order) {
  return Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.products)
      ? order.products
      : [];
}

function AdminOrders({ initialOrderId = "" }) {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (first, second) =>
        new Date(second.orderDate ?? second.createdAt ?? 0).getTime() -
        new Date(first.orderDate ?? first.createdAt ?? 0).getTime(),
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortedOrders.filter((order) => {
      const customer = order.customer ?? {};
      const matchesSearch =
        order.id.toLowerCase().includes(query) ||
        (customer.fullName || customer.name || "").toLowerCase().includes(query) ||
        (customer.email || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sortedOrders, search, statusFilter]);

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">CUSTOMER ORDERS</p>
          <h1>Order Management</h1>
          <p>Review customer orders, inspect line items, verify shipping information, and update delivery statuses.</p>
        </div>
        <span className="admin-count-label">{orders.length} Total Orders</span>
      </div>

      <div
        className="admin-panel"
        style={{
          padding: "16px 20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", flex: 1 }}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer name, or email..."
            style={{
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              minWidth: "260px",
              flex: "1 1 260px",
              fontSize: "13px",
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "13px",
              background: "#ffffff",
              color: "var(--text-h)",
            }}
          >
            <option value="all">All Statuses ({orders.length})</option>
            {orderStatuses.map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              return (
                <option value={status} key={status}>
                  {status} ({count})
                </option>
              );
            })}
          </select>
        </div>
        <div style={{ fontSize: "13px", color: "var(--text)" }}>
          Showing <strong>{filteredOrders.length}</strong> of {orders.length} orders
        </div>
      </div>

      {filteredOrders.length ? (
        <section className="admin-orders-list" aria-label="Customer orders list">
          {filteredOrders.map((order) => {
            const items = orderItems(order);
            const customer = order.customer ?? {};
            const expanded = selectedOrderId === order.id;
            const currentStatus = orderStatuses.includes(order.status)
              ? order.status
              : "Order Placed";

            const totalItemCount = items.reduce(
              (sum, item) => sum + (Number(item.quantity) || 1),
              0,
            );

            return (
              <article className="admin-order-card" key={order.id}>
                <div className="admin-order-header">
                  <div className="admin-order-identity">
                    <strong style={{ fontSize: "15px", color: "var(--accent)" }}>
                      {order.id}
                    </strong>
                    <span>{formatDate(order.orderDate ?? order.createdAt)}</span>
                    <small style={{ color: "var(--text-h)", fontWeight: 500 }}>
                      Customer: {customer.fullName ?? customer.name ?? "Guest Customer"}
                    </small>
                  </div>

                  <div className="admin-order-total">
                    <span>Order Total ({totalItemCount} {totalItemCount === 1 ? "unit" : "units"})</span>
                    <strong>{formatPrice(Number(order.total) || 0)}</strong>
                  </div>

                  <label className="admin-order-status">
                    <span>Current Status</span>
                    <select
                      aria-label={`Update status for ${order.id}`}
                      value={currentStatus}
                      onChange={(event) =>
                        dispatch(
                          updateOrderStatus({
                            id: order.id,
                            status: event.target.value,
                          }),
                        )
                      }
                    >
                      {orderStatuses.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    className="button button-secondary admin-detail-toggle"
                    type="button"
                    aria-expanded={expanded}
                    onClick={() =>
                      setSelectedOrderId(expanded ? "" : order.id)
                    }
                  >
                    {expanded ? "Hide Details ▲" : "View Details ▼"}
                  </button>
                </div>

                <div className="admin-order-items" aria-label="Purchased products">
                  {items.length ? (
                    items.map((item, index) => (
                      <div
                        className="admin-order-item"
                        key={`${order.id}-${item.id ?? item.title ?? index}`}
                      >
                        <img
                          src={item.thumbnail ?? item.image}
                          alt=""
                          onError={(e) => {
                            e.currentTarget.src = "/images/xiaomi-m365.jpg";
                          }}
                        />
                        <span>{item.title ?? item.name ?? "Electric Scooter"}</span>
                        <span>
                          <strong>{item.quantity ?? 1}x</strong>{" "}
                          <span style={{ color: "var(--text)" }}>
                            @ {formatPrice(item.price)}
                          </span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="admin-order-no-items">Product details not provided.</p>
                  )}
                </div>

                {expanded && (
                  <section
                    className="admin-order-details"
                    aria-label={`Details for ${order.id}`}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
                      <h2>Complete Order Details — {order.id}</h2>
                      <span className="admin-status">{currentStatus}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                      <div>
                        <h3 style={{ fontSize: "13px", textTransform: "uppercase", color: "var(--text)", marginBottom: "8px" }}>
                          Customer & Shipping Details
                        </h3>
                        <dl style={{ display: "grid", gap: "8px" }}>
                          <div>
                            <dt>Full Name</dt>
                            <dd><strong>{customer.fullName ?? customer.name ?? "Not provided"}</strong></dd>
                          </div>
                          <div>
                            <dt>Email Address</dt>
                            <dd>{customer.email ?? "Not provided"}</dd>
                          </div>
                          <div>
                            <dt>Phone Number</dt>
                            <dd>{customer.phone ?? "Not provided"}</dd>
                          </div>
                          <div>
                            <dt>Shipping Address</dt>
                            <dd>
                              {[customer.address, customer.city, customer.postalCode]
                                .filter(Boolean)
                                .join(", ") || "Not provided"}
                            </dd>
                          </div>
                          <div>
                            <dt>Order Placed On</dt>
                            <dd>{formatDate(order.orderDate ?? order.createdAt)}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h3 style={{ fontSize: "13px", textTransform: "uppercase", color: "var(--text)", marginBottom: "8px" }}>
                          Item Breakdown
                        </h3>
                        <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                          <table className="admin-table" style={{ fontSize: "12px" }}>
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item, idx) => {
                                const qty = Number(item.quantity) || 1;
                                const itemTotal = (Number(item.price) || 0) * qty;
                                return (
                                  <tr key={idx}>
                                    <td>{item.title ?? item.name}</td>
                                    <td>{qty}</td>
                                    <td>{formatPrice(item.price)}</td>
                                    <td><strong>{formatPrice(itemTotal)}</strong></td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr style={{ background: "#fffaf6", fontWeight: 700 }}>
                                <td colSpan="3" style={{ textAlign: "right" }}>Total:</td>
                                <td style={{ color: "var(--price)" }}>
                                  {formatPrice(Number(order.total) || 0)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </article>
            );
          })}
        </section>
      ) : (
        <div className="admin-panel admin-empty-state">
          <h2>No orders match your filter</h2>
          <p>
            {search || statusFilter !== "all"
              ? "Try clearing your search term or selecting 'All Statuses'."
              : "Customer orders placed in the store or demo data will appear here."}
          </p>
          {(search || statusFilter !== "all") && (
            <button
              className="button button-secondary"
              type="button"
              style={{ marginTop: "12px" }}
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </main>
  );
}

export default AdminOrders;
