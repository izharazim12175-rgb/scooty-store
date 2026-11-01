
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProductDetails from "./pages/ProductDetails";
import Shop from "./pages/Shop";
import Wishlist from "./pages/Wishlist";

function App() {
  const products = useSelector((state) => state.products);
  const [currentUrl, setCurrentUrl] = useState(
    () => `${window.location.pathname}${window.location.search}`,
  );

  const navigate = useCallback((path) => {
    window.history.pushState(null, "", path);
    setCurrentUrl(`${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const updateSearch = useCallback((searchTerm) => {
    const query = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : "";
    const path = `/shop${query}`;

    if (window.location.pathname !== "/shop") {
      navigate(path);
      return;
    }

    window.history.replaceState(null, "", path);
    setCurrentUrl(`${window.location.pathname}${window.location.search}`);
  }, [navigate]);

  useEffect(() => {
    const handlePopState = () =>
      setCurrentUrl(`${window.location.pathname}${window.location.search}`);
    const handleInternalLink = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event.target.closest("a");
      if (!link || link.target || link.origin !== window.location.origin) return;

      event.preventDefault();
      navigate(`${link.pathname}${link.search}${link.hash}`);
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleInternalLink);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleInternalLink);
    };
  }, [navigate]);

  const url = new URL(currentUrl, window.location.origin);
  const path = url.pathname;
  let page;

  const isAdminRoute = path.startsWith("/admin");

  if (path === "/admin") {
    page = <AdminDashboard />;
  } else if (path === "/admin/products") {
    page = <AdminProducts />;
  } else if (path === "/admin/orders") {
    const orderId = url.searchParams.get("order") || "";
    page = <AdminOrders key={orderId} initialOrderId={orderId} />;
  } else if (isAdminRoute) {
    page = <NotFound />;
  } else if (path === "/") {
    page = <Home products={products} />;
  } else if (path === "/shop") {
    page = (
      <Shop
        products={products}
        searchTerm={url.searchParams.get("q") || ""}
      />
    );
  } else if (path === "/wishlist") {
    page = <Wishlist />;
  } else if (path === "/cart") {
    page = <Cart />;
  } else if (path === "/checkout") {
    page = <Checkout />;
  } else if (/^\/products\/\d+$/.test(path)) {
    page = (
      <ProductDetails
        key={Number(path.split("/").at(-1))}
        productId={Number(path.split("/").at(-1))}
        products={products}
      />
    );
  } else {
    page = <NotFound />;
  }

  return (
    isAdminRoute ? (
      <AdminLayout
        activePage={path === "/admin/products" ? "products" : path === "/admin/orders" ? "orders" : "dashboard"}
      >
        {page}
      </AdminLayout>
    ) : (
      <div className="app-shell">
        <Navbar
          searchTerm={url.searchParams.get("q") || ""}
          onSearch={(searchTerm) =>
            navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`)
          }
          onSearchChange={updateSearch}
        />
        {page}
        <Footer />
      </div>
    )
  );
}

export default App;
