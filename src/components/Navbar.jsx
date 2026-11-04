import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";

function Navbar({ searchTerm, onSearch, onSearchChange }) {
  const cartCount = useSelector((state) =>
    state.cart.reduce((count, item) => count + item.quantity, 0),
  );
  const wishlistCount = useSelector((state) => state.wishlist.length);
  const auth = useSelector((state) => state.auth);
  const adminHref = auth?.isAdmin ? "/admin" : "/admin/login";

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="ScootStore home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>Scoot<span>Store</span></span>
        </a>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/shop">Shop All</a>
          <a href="/shop?type=electric-scooters">Electric Scooters</a>
        </div>
        <div className="nav-tools">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={onSearch}
            onSearchChange={onSearchChange}
          />
          <a className="nav-count-link" href="/wishlist">
            <span aria-hidden="true">♡</span>
            Wishlist
            <span className="count-badge">{wishlistCount}</span>
          </a>
          <a className="nav-count-link" href="/cart">
            <span aria-hidden="true">🛒</span>
            Cart
            <span className="count-badge">{cartCount}</span>
          </a>
          <a className="nav-admin-highlight" href={adminHref} title="Open Admin Panel">
            <span aria-hidden="true">⚙</span>
            Admin
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
