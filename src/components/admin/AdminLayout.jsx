function AdminLayout({ activePage, children }) {
  const links = [
    { key: "dashboard", label: "Dashboard", href: "/admin" },
    { key: "products", label: "Products", href: "/admin/products" },
    { key: "orders", label: "Orders", href: "/admin/orders" },
  ];

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
        <a className="admin-back-link" href="/">← Back to Store</a>
      </aside>
      <div className="admin-content">
        <header className="admin-topbar">
          <span>Store Administration</span>
          <a href="/">View Store ↗</a>
        </header>
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
