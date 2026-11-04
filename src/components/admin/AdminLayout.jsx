import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

function AdminLayout({ activePage, children }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const links = [
    { key: "dashboard", label: "Dashboard", href: "/admin" },
    { key: "products", label: "Products", href: "/admin/products" },
    { key: "orders", label: "Orders", href: "/admin/orders" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    window.history.pushState(null, "", "/admin/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>ScootStore <small>Admin</small></span>
        </a>
        <nav className="admin-nav" aria-label="Admin navigation">
          {links.map((link) => (
            <a
              className={activePage === link.key ? "is-active" : ""}
              href={link.href}
              key={link.key}
              aria-current={activePage === link.key ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div style={{ marginTop: "auto", display: "grid", gap: "8px" }}>
          {auth.user && (
            <div
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                background: "var(--accent-bg)",
                fontSize: "11px",
                color: "var(--accent)",
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={auth.user.email}
            >
              🛡️ {auth.user.name || "Administrator"}
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "10px 12px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#b42318",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>🚪</span> Log Out
          </button>
          <a className="admin-back-link" href="/">← Back to Store</a>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Store Administration</span>
            <span
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                background: "#e6f4ea",
                color: "#137333",
                borderRadius: "12px",
                fontWeight: 700,
              }}
            >
              ● Authenticated Admin
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "12px", color: "var(--text)" }}>
              {auth.user?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                border: 0,
                background: "transparent",
                color: "var(--accent)",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Log Out
            </button>
            <a href="/" target="_blank" rel="noreferrer">View Store ↗</a>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
