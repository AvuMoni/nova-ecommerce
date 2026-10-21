import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";

function Wishlist() {
  const { wishlist } = useShop();

  return (
    <main className="wishlist-page">
      <div className="container">
        {/* PAGE HEADER */}
        <div className="page-header">
          <p className="eyebrow">
            YOUR SAVED ITEMS
          </p>

          <h1>Wishlist</h1>

          <p>
            Keep track of the pieces you're
            thinking about buying.
          </p>
        </div>

        {/* EMPTY WISHLIST */}
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-cart-icon">
              ♡
            </div>

            <h2>Your wishlist is empty</h2>

            <p>
              Save products you love and find
              them here later.
            </p>

            <Link
              to="/shop"
              className="primary-button"
            >
              Explore products
            </Link>
          </div>
        ) : (
          /* WISHLIST PRODUCTS */
          <div className="product-grid">
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;

