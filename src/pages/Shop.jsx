import ProductCard from "../components/ProductCard";

function Shop({ products, searchTerm }) {
  const query = searchTerm.toLowerCase();
  const filteredProducts = products.filter((product) =>
    `${product.title} ${product.company} ${product.vehicleType} ${product.description}`
      .toLowerCase()
      .includes(query),
  );

  return (
    <main>
      <div className="page-heading">
        <p className="eyebrow">THE SCOOTER COLLECTION</p>
        <h1>Shop all scooters</h1>
        <p>
          {searchTerm
            ? `Showing results for “${searchTerm}”`
            : "Find the right electric ride for your everyday."}
        </p>
      </div>
      {filteredProducts.length ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No scooters found</h2>
          <p>Try another search to find the ride you’re looking for.</p>
          <a className="button button-primary" href="/shop">Browse all scooters</a>
        </div>
      )}
    </main>
  );
}

export default Shop;