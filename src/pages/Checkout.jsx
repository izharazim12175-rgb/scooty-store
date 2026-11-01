import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { addOrder } from "../features/orders/ordersSlice";
import { deductStock } from "../features/products/productsSlice";
import formatPrice from "../utils/formatPrice";

function Checkout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [completedOrder, setCompletedOrder] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "Credit Card (Demo)",
  });

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) return;

    const orderId = `ORD-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 900 + 100)}`;
    const newOrder = {
      id: orderId,
      customer: {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
      },
      items: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
      })),
      total: cartTotal,
      status: "Order Placed",
      orderDate: new Date().toISOString(),
    };

    // 1. Add order to Redux orders
    dispatch(addOrder(newOrder));

    // 2. Deduct inventory stock
    dispatch(
      deductStock(
        cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      ),
    );

    // 3. Clear cart
    dispatch(clearCart());

    // 4. Show confirmation
    setCompletedOrder(newOrder);
  };

  if (completedOrder) {
    return (
      <main>
        <div
          className="empty-state"
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            padding: "40px 24px",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "var(--shadow)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 16px",
              borderRadius: "50%",
              background: "var(--accent-bg)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            ✓
          </div>
          <p className="eyebrow">ORDER CONFIRMED</p>
          <h1>Thank you for your order!</h1>
          <p style={{ marginTop: "8px" }}>
            We've received your order and are getting your electric scooter ready for delivery.
          </p>

          <div
            style={{
              margin: "24px 0",
              padding: "16px",
              background: "#fffaf6",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            <p><strong>Order ID:</strong> {completedOrder.id}</p>
            <p><strong>Recipient:</strong> {completedOrder.customer.fullName} ({completedOrder.customer.email})</p>
            <p><strong>Shipping to:</strong> {completedOrder.customer.address}, {completedOrder.customer.city} {completedOrder.customer.postalCode}</p>
            <p style={{ marginTop: "8px", fontWeight: 700, color: "var(--price)" }}>
              Total Paid: {formatPrice(completedOrder.total)}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a className="button button-primary" href="/shop">
              Continue Shopping
            </a>
            <a
              className="button button-secondary"
              href={`/admin/orders?order=${encodeURIComponent(completedOrder.id)}`}
            >
              View in Admin Dashboard ↗
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main>
        <div className="empty-state">
          <p className="eyebrow">CHECKOUT</p>
          <h1>Your cart is currently empty</h1>
          <p>Please add an electric scooter to your cart before proceeding to checkout.</p>
          <a className="button button-primary" href="/shop" style={{ marginTop: "16px" }}>
            Explore Scooters
          </a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="page-heading">
        <p className="eyebrow">FAST & SECURE</p>
        <h1>Checkout</h1>
        <p>Complete your delivery and payment details to confirm your order.</p>
      </div>

      <div className="cart-layout" style={{ alignItems: "start" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "24px",
            background: "#ffffff",
            boxShadow: "var(--shadow)",
          }}
        >
          <h2 style={{ marginBottom: "16px" }}>Customer & Shipping Details</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <label style={{ display: "grid", gap: "6px", fontSize: "13px", fontWeight: 700 }}>
              Full Name *
              <input
                required
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Jane Doe"
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "13px", fontWeight: 700 }}>
              Email Address *
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "13px", fontWeight: 700 }}>
              Phone Number *
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "13px", fontWeight: 700 }}>
              Street Address *
              <input
                required
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Main St, Apt 4"
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "13px", fontWeight: 700 }}>
              City *
              <input
                required
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="New York"
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "13px", fontWeight: 700 }}>
              Postal Code *
              <input
                required
                type="text"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                placeholder="10001"
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                }}
              />
            </label>
          </div>

          <h2 style={{ marginTop: "24px", marginBottom: "12px" }}>Payment Method</h2>
          <div style={{ display: "grid", gap: "8px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "#fffaf6",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={form.paymentMethod === "Credit Card (Demo)"}
                onChange={() => setForm({ ...form, paymentMethod: "Credit Card (Demo)" })}
              />
              <span>Demo Credit Card (Instant checkout simulation)</span>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "#ffffff",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={form.paymentMethod === "Cash on Delivery"}
                onChange={() => setForm({ ...form, paymentMethod: "Cash on Delivery" })}
              />
              <span>Cash on Delivery</span>
            </label>
          </div>

          <button
            className="button button-primary"
            type="submit"
            style={{ width: "100%", marginTop: "24px", padding: "14px", fontSize: "16px" }}
          >
            Place Order ({formatPrice(cartTotal)})
          </button>
        </form>

        <aside className="cart-summary" aria-label="Order summary">
          <h2>Order Summary</h2>
          <div style={{ maxHeight: "280px", overflowY: "auto", margin: "12px 0", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  fontSize: "13px",
                }}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.title}
                  </div>
                  <div style={{ color: "var(--text)", fontSize: "11px" }}>
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </div>
                </div>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <p>
            <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </p>
          <p>
            <span>Estimated Shipping</span>
            <strong style={{ color: "var(--accent)" }}>FREE</strong>
          </p>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;

