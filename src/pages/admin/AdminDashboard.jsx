import { useSelector } from "react-redux";
import formatPrice from "../../utils/formatPrice";

function getCustomerName(order) {
  return order.customer?.fullName ?? order.customer?.name ?? "Customer";
}

function getCustomerEmail(order) {
  return order.customer?.email ?? order.customerEmail ?? "";
}

function getOrderDate(order) {
  return order.orderDate ?? order.createdAt ?? "";
}

function AdminDashboard() {
  const products = useSelector((state) => state.products);
  const orders = useSelector((state) => state.orders);

  const lowStockProducts = products.filter(
    (product) =>
      typeof product.stockQuantity === "number" && product.stockQuantity <= 5,
  );

  const uniqueCustomers = new Set(
    orders
      .map((o) => getCustomerEmail(o) || getCustomerName(o))
      .filter(Boolean)
      .map((val) => val.trim().toLowerCase()),
  );

  const nonCancelledOrders = orders.filter(
    (order) => order.status !== "Cancelled",
  );

  const totalSales = nonCancelledOrders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0,
  );

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(getOrderDate(b) || 0).getTime() -
        new Date(getOrderDate(a) || 0).getTime(),
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      detail: `${products.length - lowStockProducts.length} healthy, ${lowStockProducts.length} low stock`,
    },
    {
      label: "Total Orders",
      value: orders.length,
      detail: `${nonCancelledOrders.length} active/completed`,
    },
    {
      label: "Total Customers",
      value: uniqueCustomers.size,
      detail: "Unique verified buyers",
    },
    {
      label: "Total Sales",
      value: formatPrice(totalSales),
      detail: "Excludes cancelled orders",
    },
  ];

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">STORE OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>Real-time summary of catalog inventory, customer orders, and sales performance.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a className="button button-primary" href="/admin/products">
            + Manage Products
          </a>
          <a className="button button-secondary" href="/admin/orders">
            View All Orders
          </a>
        </div>
      </div>

      <section className="admin-stats-grid" aria-label="Store statistics">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </div>
            <small className="admin-table-subtext">{stat.detail}</small>
          </article>
        ))}
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel" aria-labelledby="recent-orders-title">
          <div className="admin-panel-heading">
            <div>
              <h2 id="recent-orders-title">Recent Orders</h2>
              <p>Latest customer transactions recorded in this store.</p>
            </div>
            <a className="admin-text-link" href="/admin/orders">
              View all ({orders.length}) →
            </a>
          </div>
          {recentOrders.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <a
                          href={`/admin/orders?order=${encodeURIComponent(order.id)}`}
                          style={{ fontWeight: 600, color: "var(--accent)" }}
                        >
                          {order.id}
                        </a>
                      </td>
                      <td>
                        <span>{getCustomerName(order)}</span>
                        <small className="admin-table-subtext">
                          {getCustomerEmail(order)}
                        </small>
                      </td>
                      <td>
                        {getOrderDate(order)
                          ? new Date(getOrderDate(order)).toLocaleDateString()
                          : "—"}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {formatPrice(Number(order.total) || 0)}
                      </td>
                      <td>
                        <span className="admin-status">
                          {order.status || "Order Placed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-inline">
              <p>No orders have been recorded yet.</p>
              <span>Customer orders will appear here automatically.</span>
            </div>
          )}
        </section>

        <section className="admin-panel" aria-labelledby="low-stock-title">
          <div className="admin-panel-heading">
            <div>
              <h2 id="low-stock-title">Low-Stock Products</h2>
              <p>Inventory with 5 or fewer units remaining.</p>
            </div>
            <a className="admin-text-link" href="/admin/products">
              Manage stock →
            </a>
          </div>
          {lowStockProducts.length ? (
            <ul className="admin-low-stock-list">
              {lowStockProducts.map((product) => (
                <li key={product.id}>
                  <img src={product.thumbnail} alt={product.title} />
                  <span>
                    <strong>{product.title}</strong>
                    <small className="admin-table-subtext">
                      {product.vehicleType || product.category || "Scooter"}
                    </small>
                  </span>
                  <strong style={{ color: "var(--price)" }}>
                    {product.stockQuantity} left
                  </strong>
                </li>
              ))}
            </ul>
          ) : (
            <div className="admin-empty-inline">
              <p>All products have healthy inventory levels.</p>
              <span>No items currently have 5 or fewer units in stock.</span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
