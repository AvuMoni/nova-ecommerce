import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

function Shop() {
  const [searchParams] = useSearchParams();

  const initialCategory = searchParams.get("category") || "All";

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const categories = [
    "All",
    "Audio",
    "Wearables",
    "Accessories",
    "Smart Home",
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [category, search, sort]);

  return (
    <main className="shop-page">
      <section className="shop-header">
        <span>THE COLLECTION</span>

        <h1>Shop all products</h1>

        <p>
          Discover technology designed for modern living.
        </p>
      </section>

      <section className="shop-content">
        <div className="shop-toolbar">
          <div className="category-filters">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="shop-controls">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="rating">Top rated</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
            </select>
          </div>
        </div>

        <div className="shop-results">
          <p>
            Showing <strong>{filteredProducts.length}</strong> products
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty-products">
            <h2>No products found</h2>

            <p>
              Try changing your search or category.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Shop;