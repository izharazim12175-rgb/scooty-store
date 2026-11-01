function SearchBar({ searchTerm, onSearch, onSearchChange }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleChange = (event) => {
    onSearchChange(event.target.value);
  };

  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="store-search">
        Search scooters
      </label>
      <input
        id="store-search"
        type="search"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search scooters"
      />
      {searchTerm && (
        <button
          className="search-clear"
          type="button"
          aria-label="Clear search"
          onClick={clearSearch}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
      <button type="submit" aria-label="Submit search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      </button>
    </form>
  );
}

export default SearchBar;