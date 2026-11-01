import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";

function ProductDetails({ productId, products }) {
  const dispatch = useDispatch();
  const product = products.find((item) => item.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const isWishlisted = useSelector((state) =>
    state.wishlist.some((item) => item.id === productId),
  );

  if (!product) {
    return (
      <main>
        <div className="empty-state">
          <h1>Scooter not found</h1>
          <a className="button button-primary" href="/shop">Browse scooters</a>
        </div>
      </main>
    );
  }

  const images = [
    ...new Set([
      ...(Array.isArray(product.images) ? product.images : []),
      product.thumbnail,
    ].filter(Boolean)),
  ];
  const selectedImage = images.includes(activeImage) ? activeImage : images[0];
  const specifications = product.specifications ?? {};
  const specificationRows = [
    ["Battery capacity", specifications.batteryCapacity],
    ["Maximum speed", specifications.maximumSpeed],
    ["Motor power", specifications.motorPower],
    ["Maximum range", specifications.maximumRange],
    ["Product weight", specifications.weight],
  ];
  const stockCount = Number.isInteger(product.stockQuantity)
    ? product.stockQuantity
    : null;
  const stockLabel =
    stockCount !== null
      ? stockCount > 0
        ? `${stockCount} available`
        : "Out of stock"
      : product.stockStatus || "Stock status not provided";
  const isOutOfStock =
    stockCount === 0 || product.stockStatus?.toLowerCase() === "out of stock";
  const isStockUnknown = stockCount === null && !product.stockStatus;
  const rating = Number.isFinite(product.rating) ? product.rating : null;
  const reviewLabel = Number.isInteger(product.reviewCount)
    ? `${product.reviewCount} ${product.reviewCount === 1 ? "review" : "reviews"}`
    : "Review count not provided";

  return (
    <main>
      <section className="details-layout">
        <div className="details-gallery">
          {selectedImage ? (
            <img
              className="details-image"
              src={selectedImage}
              alt={product.title}
            />
          ) : (
            <div className="details-image details-image-placeholder">
              Image unavailable
            </div>
          )}
          {images.length > 1 && (
            <div className="details-thumbnails" aria-label="Product images">
              {images.map((image, index) => (
                <button
                  className={`details-thumbnail${image === selectedImage ? " is-active" : ""}`}
                  key={image}
                  type="button"
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={image === selectedImage}
                  onClick={() => setActiveImage(image)}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
          {product.imageCredit && (
            <p className="image-credit details-image-credit">
              <a
                href={product.imageCredit.href}
                target="_blank"
                rel="noreferrer"
              >
                {product.imageCredit.label}
              </a>
            </p>
          )}
        </div>
        <div className="details-copy">
          <p className="eyebrow">{product.company}</p>
          <h1>{product.title}</h1>
          <div className="details-rating">
            <p
              className="product-rating"
              aria-label={rating === null ? "Rating not provided" : `Rated ${rating} out of 5`}
            >
              {rating === null ? "Rating not provided" : `★ ${rating} / 5`}
            </p>
            <span>{reviewLabel}</span>
          </div>
          <p className="product-type">{product.vehicleType}</p>
          <section
            className="details-description"
            aria-labelledby="details-description-heading"
          >
            <h2 id="details-description-heading">About this scooter</h2>
            <p>{product.description || "Description not provided."}</p>
          </section>
          <p className="product-price">${product.price.toLocaleString()}</p>
          <p
            className={`stock-status${isOutOfStock ? " is-out-of-stock" : ""}${isStockUnknown ? " is-unknown" : ""}`}
          >
            <span aria-hidden="true">●</span> {stockLabel}
          </p>
          <div className="details-purchase">
            <div className="details-quantity">
              <label htmlFor="product-quantity">Quantity</label>
              <div className="quantity-control">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  −
                </button>
                <input
                  id="product-quantity"
                  aria-label="Quantity"
                  type="number"
                  min="1"
                  max={stockCount ?? undefined}
                  value={quantity}
                  onChange={(event) => {
                    const nextQuantity = Number(event.target.value);
                    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) return;
                    setQuantity(
                      stockCount === null
                        ? nextQuantity
                        : Math.min(stockCount, nextQuantity),
                    );
                  }}
                />
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={stockCount !== null && quantity >= stockCount}
                  onClick={() =>
                    setQuantity((current) =>
                      stockCount === null
                        ? current + 1
                        : Math.min(stockCount, current + 1),
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
            <div className="details-actions">
              <button
                className="button button-primary"
                type="button"
                disabled={isOutOfStock}
                onClick={() => dispatch(addToCart({ product, quantity }))}
              >
                Add to Cart
              </button>
              <button
                className="button button-secondary"
                type="button"
                aria-pressed={isWishlisted}
                onClick={() =>
                  dispatch(
                    isWishlisted
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product),
                  )
                }
              >
                {isWishlisted ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}
              </button>
            </div>
          </div>
          <section
            className="details-specifications"
            aria-labelledby="specifications-heading"
          >
            <h2 id="specifications-heading">
              {product.specificationsDemo
                ? "Sample specifications (demo only)"
                : "Specifications"}
            </h2>
            {product.specificationsDemo && (
              <p className="demo-specifications-notice">
                These are illustrative demo values, not verified manufacturer
                specifications.
              </p>
            )}
            <dl>
              {specificationRows.map(([label, value]) => (
                <div className="specification-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value || "Not provided"}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
