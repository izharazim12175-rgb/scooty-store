import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../features/cart/cartSlice";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";

function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist);

  const moveToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
  };

  return (
    <main>
      <div className="page-heading">
        <p className="eyebrow">SAVED FOR LATER</p>
        <h1>Your wishlist</h1>
        <p>All the scooters you’ve got your eye on.</p>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <h2>Your wishlist is empty</h2>
          <p>Tap the heart on a scooter to save it here.</p>
          <a className="button button-primary" href="/shop">Discover scooters</a>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((product) => (
            <article className="wishlist-card" key={product.id}>
              <ProductCard product={product} />
              <div className="wishlist-card-actions">
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => moveToCart(product)}
                >
                  Move to Cart
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => dispatch(removeFromWishlist(product.id))}
                >
                  Remove from Wishlist
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;