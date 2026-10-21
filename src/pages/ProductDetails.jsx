import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import products from "../data/products";
import { useShop } from "../context/ShopContext";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useShop();

  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || ""
  );

  const [selectedColor, setSelectedColor] =
    useState(product?.colors?.[0] || "");

  if (!product) {
    return (
      <main className="not-found-page">
        <div className="container">
          <h1>Product not found</h1>

          <p>
            The product you're looking for doesn't exist.
          </p>

          <Link
            to="/shop"
            className="primary-button"
          >
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const saved = isInWishlist(product.id);

  const discountPercentage =
    product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice -
            product.price) /
            product.compareAtPrice) *
            100
        )
      : 0;

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(current + 1, product.stock)
    );
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(current - 1, 1)
    );
  };

  const handleAddToCart = () => {
    addToCart(
      product.id,
      quantity,
      selectedSize || null,
      selectedColor || null
    );
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
  };

  return (
    <main className="product-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>

          <span>/</span>

          <Link to="/shop">Shop</Link>

          <span>/</span>

          <span>{product.name}</span>
        </div>

        {/* Product */}
        <section className="product-details">
          {/* Product Image */}
          <div className="product-details-image">
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

            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="product-details-info">
            <span className="product-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            {/* Rating */}
            <div className="details-rating">
              <span>★</span>

              <strong>{product.rating}</strong>

              <span>
                {product.reviewCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="details-price">
              <strong>
                R
                {product.price.toLocaleString(
                  "en-ZA"
                )}
              </strong>

              {product.compareAtPrice && (
                <>
                  <del>
                    R
                    {product.compareAtPrice.toLocaleString(
                      "en-ZA"
                    )}
                  </del>

                  <span className="sale-label">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="details-description">
              {product.description}
            </p>

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="details-option">
                <div className="option-header">
                  <strong>Size</strong>

                  <span>{selectedSize}</span>
                </div>

                <div className="option-list">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={
                        selectedSize === size
                          ? "option-button active"
                          : "option-button"
                      }
                      onClick={() =>
                        setSelectedSize(size)
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="details-option">
                <div className="option-header">
                  <strong>Color</strong>

                  <span>{selectedColor}</span>
                </div>

                <div className="option-list">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={
                        selectedColor === color
                          ? "option-button active"
                          : "option-button"
                      }
                      onClick={() =>
                        setSelectedColor(color)
                      }
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase */}
            <div className="details-purchase">
              <div className="quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= product.stock
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="add-cart-button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {product.stock > 0
                  ? "Add to cart"
                  : "Out of stock"}
              </button>
            </div>

            {/* Wishlist */}
            <button
              type="button"
              className={
                saved
                  ? "details-wishlist active"
                  : "details-wishlist"
              }
              onClick={handleWishlist}
            >
              {saved
                ? "♥ Remove from wishlist"
                : "♡ Add to wishlist"}
            </button>

            {/* Benefits */}
            <div className="product-benefits">
              <div>
                <strong>Free delivery</strong>

                <span>
                  On qualifying orders
                </span>
              </div>

              <div>
                <strong>Secure checkout</strong>

                <span>
                  Protected payments
                </span>
              </div>

              <div>
                <strong>Easy returns</strong>

                <span>
                  30-day return window
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="product-description-block">
              <h3>Product features</h3>

              {product.features?.length > 0 ? (
                <ul>
                  {product.features.map(
                    (feature) => (
                      <li key={feature}>
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  Product features will be
                  available soon.
                </p>
              )}
            </div>

            {/* Specifications */}
            <div className="product-description-block">
              <h3>Specifications</h3>

              {product.specifications &&
              Object.keys(product.specifications)
                .length > 0 ? (
                <div className="specifications">
                  {Object.entries(
                    product.specifications
                  ).map(([key, value]) => (
                    <div
                      className="specification-row"
                      key={key}
                    >
                      <span>{key}</span>

                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p>
                  Specifications will be
                  available soon.
                </p>
              )}
            </div>

            {/* Product Meta */}
            <div className="product-meta">
              <span>
                SKU:{" "}
                <strong>{product.sku}</strong>
              </span>

              <span>
                Availability:{" "}
                <strong>
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </strong>
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetails;

