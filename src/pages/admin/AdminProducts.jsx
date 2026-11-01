import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "../../features/products/productsSlice";
import formatPrice from "../../utils/formatPrice";

const emptyForm = {
  title: "",
  company: "",
  thumbnail: "",
  price: "",
  description: "",
  category: "",
  stockQuantity: "",
};

const sampleImages = [
  { label: "Xiaomi M365", url: "/images/xiaomi-m365.jpg" },
  { label: "BMW CE 02", url: "/images/bmw-ce-02.jpg" },
  { label: "Honda EM1 e", url: "/images/honda-em1.jpg" },
  { label: "Ola S1 Pro", url: "/images/ola-s1-pro.jpg" },
  { label: "BeRider", url: "/images/berider-electric-scooter.jpg" },
  { label: "Nanrobot D4+", url: "/images/nanrobot-d4.jpg" },
  { label: "Yadea G5", url: "/images/yadea-g5.jpg" },
];

function AdminProducts() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const categories = useMemo(
    () =>
      [
        ...new Set(
          products
            .map((product) => product.vehicleType || product.category)
            .filter(Boolean),
        ),
      ].sort(),
    [products],
  );

  const brands = useMemo(
    () =>
      [...new Set(products.map((product) => product.company).filter(Boolean))].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const productCategory = product.vehicleType || product.category || "";
      const matchesSearch = `${product.title} ${product.company} ${productCategory} ${product.description}`
        .toLowerCase()
        .includes(query);
      const matchesCategory =
        categoryFilter === "all" ||
        productCategory.toLowerCase() === categoryFilter.toLowerCase();
      const matchesBrand =
        brandFilter === "all" || product.company === brandFilter;
      const hasStock = typeof product.stockQuantity === "number";
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && hasStock && product.stockQuantity <= 5) ||
        (stockFilter === "in-stock" && hasStock && product.stockQuantity > 5) ||
        (stockFilter === "untracked" && !hasStock);

      return matchesSearch && matchesCategory && matchesBrand && matchesStock;
    });
  }, [products, search, categoryFilter, brandFilter, stockFilter]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title ?? "",
      company: product.company ?? "",
      thumbnail: product.thumbnail ?? "",
      price: String(product.price ?? ""),
      description: product.description ?? "",
      category: product.vehicleType ?? product.category ?? "",
      stockQuantity:
        typeof product.stockQuantity === "number"
          ? String(product.stockQuantity)
          : "",
    });
    setFormError("");
    setSuccessMessage("");
    document.getElementById("admin-product-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const price = Number(form.price);
    const stockQuantity = Number(form.stockQuantity);

    if (!form.title.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!form.company.trim()) {
      setFormError("Brand name is required.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Enter a valid product price (0 or greater).");
      return;
    }
    if (!form.thumbnail.trim()) {
      setFormError("Product image URL is required.");
      return;
    }
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setFormError("Stock quantity must be a whole number of 0 or more.");
      return;
    }
    if (!form.category.trim()) {
      setFormError("Category is required.");
      return;
    }

    const changes = {
      title: form.title.trim(),
      company: form.company.trim(),
      thumbnail: form.thumbnail.trim(),
      price,
      description: form.description.trim(),
      category: form.category.trim(),
      vehicleType: form.category.trim(),
      stockQuantity,
    };

    if (editingId !== null) {
      dispatch(updateProduct({ id: editingId, changes }));
      setSuccessMessage(`Product "${changes.title}" updated successfully.`);
    } else {
      const nextId =
        products.reduce(
          (maximum, product) =>
            typeof product.id === "number" ? Math.max(maximum, product.id) : maximum,
          0,
        ) + 1;
      dispatch(
        addProduct({
          ...changes,
          id: nextId,
          rating: 4.5,
          category: changes.category,
        }),
      );
      setSuccessMessage(`New scooter "${changes.title}" added to catalog.`);
    }

    resetForm();
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.title}" from the catalog?`)) {
      dispatch(deleteProduct(product.id));
      if (editingId === product.id) resetForm();
      setSuccessMessage(`Product "${product.title}" has been deleted.`);
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  const handleStockAdjust = (product, delta) => {
    const currentStock = typeof product.stockQuantity === "number" ? product.stockQuantity : 0;
    const newStock = Math.max(0, currentStock + delta);
    dispatch(
      updateProduct({
        id: product.id,
        changes: { stockQuantity: newStock },
      }),
    );
  };

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">CATALOG INVENTORY</p>
          <h1>Product Management</h1>
          <p>Add, edit, delete, and manage stock quantities and pricing for all electric scooters.</p>
        </div>
        <span className="admin-count-label">{products.length} Products in Catalog</span>
      </div>

      {successMessage && (
        <div
          role="status"
          style={{
            padding: "12px 18px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            color: "var(--accent)",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          ✓ {successMessage}
        </div>
      )}

      <section className="admin-panel admin-form-panel" id="admin-product-form">
        <div className="admin-panel-heading">
          <div>
            <h2>{editingId === null ? "Add a New Scooter" : `Edit Product #${editingId}`}</h2>
            <p>
              {editingId === null
                ? "Fill in the details below to add a new electric scooter to your store."
                : "Modify the details below and save changes."}
            </p>
          </div>
          {editingId !== null && (
            <button
              className="admin-inline-button"
              type="button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <label>
            Product Name *
            <input
              required
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="e.g. Apollo Pro 2026"
              maxLength={100}
            />
          </label>
          <label>
            Brand / Manufacturer *
            <input
              required
              value={form.company}
              onChange={(event) => setForm({ ...form, company: event.target.value })}
              placeholder="e.g. Apollo, Xiaomi, Segway"
              maxLength={80}
            />
          </label>
          <label className="admin-form-wide">
            Product Image URL *
            <input
              required
              type="text"
              value={form.thumbnail}
              onChange={(event) => setForm({ ...form, thumbnail: event.target.value })}
              placeholder="https://... or /images/xiaomi-m365.jpg"
            />
            <div style={{ marginTop: "6px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--text)" }}>Quick presets:</span>
              {sampleImages.slice(0, 5).map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setForm({ ...form, thumbnail: img.url })}
                  style={{
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    border: "1px solid var(--border)",
                    background: form.thumbnail === img.url ? "var(--accent-bg)" : "#ffffff",
                    color: form.thumbnail === img.url ? "var(--accent)" : "inherit",
                    cursor: "pointer",
                  }}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </label>
          <label>
            Price (USD) *
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
              placeholder="e.g. 899.00"
            />
          </label>
          <label>
            Stock Quantity *
            <input
              required
              type="number"
              min="0"
              step="1"
              value={form.stockQuantity}
              onChange={(event) =>
                setForm({ ...form, stockQuantity: event.target.value })
              }
              placeholder="e.g. 15"
            />
          </label>
          <label>
            Category *
            <input
              required
              list="category-suggestions"
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              placeholder="Select or enter category"
              maxLength={80}
            />
            <datalist id="category-suggestions">
              {categories.map((cat) => (
                <option value={cat} key={cat} />
              ))}
            </datalist>
          </label>
          <label className="admin-form-wide">
            Description *
            <textarea
              required
              rows="3"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              placeholder="Describe the scooter features, battery, range, and intended riding style..."
              maxLength={1000}
            />
          </label>
          {formError && (
            <p className="admin-form-error" role="alert">{formError}</p>
          )}
          <div className="admin-form-actions admin-form-wide">
            <button className="button button-primary" type="submit">
              {editingId === null ? "+ Add Scooter to Catalog" : "Save Changes"}
            </button>
            {editingId !== null && (
              <button
                className="button button-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-panel admin-products-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>All Products ({filteredProducts.length})</h2>
            <p>Filter by category, brand, or search by name to inspect and edit items.</p>
          </div>
          <div className="admin-product-filters">
            <label>
              <span className="visually-hidden">Search products</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
              />
            </label>
            <label>
              <span className="visually-hidden">Filter by category</span>
              <select
                aria-label="Filter by category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option value={cat} key={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="visually-hidden">Filter by brand</span>
              <select
                aria-label="Filter by brand"
                value={brandFilter}
                onChange={(event) => setBrandFilter(event.target.value)}
              >
                <option value="all">All Brands</option>
                {brands.map((brand) => (
                  <option value={brand} key={brand}>{brand}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="visually-hidden">Filter by stock status</span>
              <select
                aria-label="Filter by stock status"
                value={stockFilter}
                onChange={(event) => setStockFilter(event.target.value)}
              >
                <option value="all">All Stock Levels</option>
                <option value="low">Low Stock (≤ 5)</option>
                <option value="in-stock">In Stock (&gt; 5)</option>
                <option value="untracked">Untracked</option>
              </select>
            </label>
          </div>
        </div>
        {filteredProducts.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const hasStock = typeof product.stockQuantity === "number";
                  const isLow = hasStock && product.stockQuantity <= 5;
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          <img
                            src={product.thumbnail}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.src = "/images/xiaomi-m365.jpg";
                            }}
                          />
                          <div>
                            <strong>{product.title}</strong>
                            <small className="admin-table-subtext">ID #{product.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>
                          {product.vehicleType || product.category || "Electric Scooter"}
                        </span>
                      </td>
                      <td>
                        <span>{product.company}</span>
                      </td>
                      <td>
                        <strong style={{ color: "var(--price)" }}>
                          {formatPrice(Number(product.price) || 0)}
                        </strong>
                      </td>
                      <td>
                        {hasStock ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span
                              className={isLow ? "admin-stock-low" : ""}
                              style={{ minWidth: "24px", textAlign: "center" }}
                            >
                              {product.stockQuantity}
                            </span>
                            {isLow && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  padding: "2px 6px",
                                  background: "#fee4e2",
                                  color: "#b42318",
                                  borderRadius: "10px",
                                  fontWeight: 700,
                                }}
                              >
                                Low
                              </span>
                            )}
                            <button
                              type="button"
                              title="Decrease stock by 1"
                              onClick={() => handleStockAdjust(product, -1)}
                              disabled={product.stockQuantity <= 0}
                              style={{
                                width: "20px",
                                height: "20px",
                                padding: 0,
                                border: "1px solid var(--border)",
                                background: "#ffffff",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                lineHeight: "1",
                              }}
                            >
                              -
                            </button>
                            <button
                              type="button"
                              title="Increase stock by 1"
                              onClick={() => handleStockAdjust(product, 1)}
                              style={{
                                width: "20px",
                                height: "20px",
                                padding: 0,
                                border: "1px solid var(--border)",
                                background: "#ffffff",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                lineHeight: "1",
                              }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="admin-table-subtext">Not tracked</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="admin-inline-button"
                            type="button"
                            onClick={() => startEditing(product)}
                          >
                            Edit
                          </button>
                          <a
                            className="admin-inline-button"
                            href={`/products/${product.id}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "var(--text)" }}
                          >
                            View
                          </a>
                          <button
                            className="admin-inline-button is-danger"
                            type="button"
                            onClick={() => handleDelete(product)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-inline">
            <p>No products match these filters.</p>
            <span>Try searching with a different term, clearing the category filter, or resetting stock filters.</span>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminProducts;
