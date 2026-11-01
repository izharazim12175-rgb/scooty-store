import ProductCard from "../components/ProductCard";

function Home({ products }) {
  return (
    <main>
      <section aria-labelledby="featured-heading">
        <div className="page-heading">
          <p className="eyebrow">RIDE ELECTRIC</p>
          <h1>ScootStore</h1>
          <p>Explore electric scooters for every kind of city ride.</p>
        </div>
        <div className="section-heading">
          <div>
            <h2 id="featured-heading">Featured scooters</h2>
            <p>Find your next favorite ride.</p>
          </div>
          <a className="text-link" href="/shop">Shop all scooters <span aria-hidden="true">→</span></a>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;