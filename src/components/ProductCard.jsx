
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state) =>
    state.wishlist.some((item) => item.id === product.id),
  );

  const toggleWishlist = () => {
    dispatch(
      isWishlisted
        ? removeFromWishlist(product.id)
        : addToWishlist(product),
    );
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.nextElementSibling.style.display = "block";
          }}
        />
        <div className="image-fallback">Image unavailable</div>
        <button
          className={`wishlist-toggle${isWishlisted ? " is-active" : ""}`}
          type="button"
          aria-label={
            isWishlisted
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          aria-pressed={isWishlisted}
          onClick={toggleWishlist}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
        </button>
      </div>
      {product.imageCredit && (
        <p className="image-credit">
          <a href={product.imageCredit.href} target="_blank" rel="noreferrer">
            {product.imageCredit.label}
          </a>
        </p>
      )}

      <div className="product-card-content">
        <p className="product-company">{product.company}</p>
        <h2>{product.title}</h2>
        <p className="product-type">{product.vehicleType}</p>
        <p
          className="product-rating"
          aria-label={
            Number.isFinite(product.rating)
              ? `Rated ${product.rating} out of 5`
              : "Rating not provided"
          }
        >
          {Number.isFinite(product.rating)
            ? `★ ${product.rating} / 5`
            : "Not rated"}
        </p>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${product.price.toLocaleString()}</p>

        <div className="product-card-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={() => dispatch(addToCart(product))}
          >
            Add to Cart
          </button>
          <a
            className="button button-secondary"
            href={`/products/${product.id}`}
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

// system designing 
