import categories from "../data/categories";

function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="product-filters">
      <div className="filter-search">
        <label htmlFor="product-search">Search products</label>

        <input
          id="product-search"
          type="text"
          placeholder="Search fashion, accessories..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category-filter">Category</label>

        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value)
          }
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-products">Sort by</label>

        <select
          id="sort-products"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

export default ProductFilters;