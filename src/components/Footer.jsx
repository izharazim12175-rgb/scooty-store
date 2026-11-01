function Footer() {
  return (
    <footer className="site-footer">
      <a className="footer-brand" href="/" aria-label="ScootStore home">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span>Scoot<span>Store</span></span>
      </a>
      <p>Find your next electric ride.</p>
      <div>
        <a className="footer-admin-link" href="/admin">
          Admin Dashboard ⚙
        </a>
      </div>
    </footer>
  );
}

export default Footer;
