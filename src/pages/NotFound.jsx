function NotFound() {
  return (
    <main>
      <div className="empty-state">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>That page isn’t part of this ride.</p>
        <a className="button button-primary" href="/">Back to ScootStore</a>
      </div>
    </main>
  );
}

export default NotFound;