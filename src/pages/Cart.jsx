import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main>
      <div className="page-heading">
        <p className="eyebrow">YOUR NEXT RIDE</p>
        <h1>Shopping cart</h1>
        <p>{itemCount} {itemCount === 1 ? "item" : "items"} in your cart</p>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is ready for a ride</h2>
          <p>Add an electric scooter and it will show up here.</p>
          <a className="button button-primary" href="/shop">Explore scooters</a>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Cart items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.thumbnail} alt={item.title} />
                <div className="cart-item-info">
                  <p className="product-company">{item.company}</p>
                  <h2><a href={`/products/${item.id}`}>{item.title}</a></h2>
                  <p className="cart-item-price">${item.price.toLocaleString()}</p>
                  <div className="cart-item-controls">
                    <div className="quantity-control" aria-label={`Quantity for ${item.title}`}>
                      <button
                        type="button"
                        aria-label={`Decrease ${item.title} quantity`}
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                      >−</button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.title} quantity`}
                        onClick={() => dispatch(increaseQuantity(item.id))}
                      >+</button>
                    </div>
                    <button
                      className="remove-link"
                      type="button"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <strong className="cart-line-total">
                  ${(item.price * item.quantity).toLocaleString()}
                </strong>
              </article>
            ))}
          </section>
          <aside className="cart-summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <p><span>Subtotal ({itemCount} items)</span><strong>${total.toLocaleString()}</strong></p>
            <p><span>Shipping</span><strong>Free</strong></p>
            <div className="summary-total"><span>Total</span><strong>${total.toLocaleString()}</strong></div>
            <a
              className="button button-primary"
              href="/checkout"
              style={{ display: "block", textAlign: "center", marginTop: "16px", textDecoration: "none" }}
            >
              Proceed to Checkout →
            </a>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;