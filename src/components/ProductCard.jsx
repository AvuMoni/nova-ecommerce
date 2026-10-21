import { Link } from "react-router-dom";

import { useShop } from "../context/ShopContext";

function ProductCard({ product }) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useShop();

  const discountPercentage =
    product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice -
            product.price) /
            product.compareAtPrice) *
            100
        )
      : 0;

  const saved = isInWishlist(
    product.id
  );

  /*
    =========================
    ADD TO CART
    =========================
  */

  const handleAddToCart = () => {
    addToCart(
      product.id,
      1,
      product.sizes?.[0] || null,
      product.colors?.[0] || null
    );
  };

  /*
    =========================
    WISHLIST
    =========================
  */

  const handleWishlist = () => {
    toggleWishlist(product.id);
  };

  return (
    <article className="product-card">
      {/* =========================
          PRODUCT IMAGE
      ========================= */}

      <div className="product-image-wrapper">
        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}

        {discountPercentage > 0 && (
          <span className="discount-badge">
            -{discountPercentage}%
          </span>
        )}

        <button
          className={
            saved
              ? "wishlist-button active"
              : "wishlist-button"
          }
          type="button"
          aria-label={
            saved
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={handleWishlist}
        >
          {saved ? "♥" : "♡"}
        </button>

        <Link
          to={`/product/${product.id}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </Link>
      </div>

      {/* =========================
          PRODUCT CONTENT
      ========================= */}

      <div className="product-content">
        <span className="product-category">
          {product.category}
        </span>

        <Link
          to={`/product/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        {/* =========================
            RATING
        ========================= */}

        <div className="product-rating">
          <span>★</span>

          <strong>
            {product.rating}
          </strong>

          <small>
            ({product.reviewCount})
          </small>
        </div>

        {/* =========================
            PRICE
        ========================= */}

        <div className="product-price">
          <strong>
            R
            {product.price.toLocaleString(
              "en-ZA"
            )}
          </strong>

          {product.compareAtPrice && (
            <del>
              R
              {product.compareAtPrice.toLocaleString(
                "en-ZA"
              )}
            </del>
          )}
        </div>

        {/* =========================
            STOCK
        ========================= */}

        <p
          className={
            product.stock > 0
              ? "stock-status"
              : "stock-status out-of-stock"
          }
        >
          {product.stock > 0
            ? `${product.stock} in stock`
            : "Out of stock"}
        </p>

        {/* =========================
            ACTIONS
        ========================= */}

        <div className="product-card-actions">
          <Link
            to={`/product/${product.id}`}
            className="product-button secondary"
          >
            View product
          </Link>

          <button
            type="button"
            className="product-button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0
              ? "Add to cart"
              : "Out of stock"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
