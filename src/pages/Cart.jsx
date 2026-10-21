import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function Cart() {
  const {
    cart,
    cartItemCount,
    cartSubtotal,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    clearCart,
  } = useShop();

  const deliveryFee =
    cartSubtotal >= 1000 || cartSubtotal === 0
      ? 0
      : 99;

  const cartTotal = cartSubtotal + deliveryFee;

  // Empty cart
  if (!cart || cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <span className="cart-empty-icon">
            🛒
          </span>

          <h1>Your Cart Is Empty</h1>

          <p>
            You haven't added any products to your
            cart yet.
          </p>

          <Link
            to="/shop"
            className="primary-button"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">

        {/* HEADER */}
        <div className="cart-header">
          <div>
            <span className="section-label">
              NOVA STORE
            </span>

            <h1>Your Cart</h1>

            <p>
              {cartItemCount}{" "}
              {cartItemCount === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>
          </div>

          <button
            type="button"
            className="cart-clear-button"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">

          {/* CART ITEMS */}
          <section className="cart-items">
            {cart.map((item) => (
              <article
                className="cart-item"
                key={
                  item.cartItemId ||
                  item.productId
                }
              >

                {/* IMAGE */}
                <div className="cart-item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                {/* INFO */}
                <div className="cart-item-info">
                  <span className="cart-item-category">
                    {item.category}
                  </span>

                  <h2>{item.name}</h2>

                  {item.size && (
                    <p>
                      <strong>
                        Size:
                      </strong>{" "}
                      {item.size}
                    </p>
                  )}

                  {item.color && (
                    <p>
                      <strong>
                        Color:
                      </strong>{" "}
                      {item.color}
                    </p>
                  )}

                  <p className="cart-item-price">
                    R
                    {Number(
                      item.price
                    ).toLocaleString(
                      "en-ZA"
                    )}
                  </p>

                  {/* ACTIONS */}
                  <div className="cart-item-actions">

                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() =>
                          decreaseCartQuantity(
                            item.cartItemId
                          )
                        }
                        disabled={
                          item.quantity <= 1
                        }
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseCartQuantity(
                            item.cartItemId
                          )
                        }
                        disabled={
                          item.quantity >=
                          item.stock
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="remove-cart-item"
                      onClick={() =>
                        removeFromCart(
                          item.cartItemId
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* ITEM TOTAL */}
                <div className="cart-item-total">
                  R
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString(
                    "en-ZA"
                  )}
                </div>

              </article>
            ))}
          </section>

          {/* ORDER SUMMARY */}
          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                R
                {cartSubtotal.toLocaleString(
                  "en-ZA"
                )}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <strong>
                {deliveryFee === 0
                  ? "FREE"
                  : `R${deliveryFee.toLocaleString(
                      "en-ZA"
                    )}`}
              </strong>
            </div>

            {/* FREE DELIVERY MESSAGE */}
            {cartSubtotal > 0 &&
              cartSubtotal < 1000 && (
                <p className="free-delivery-note">
                  Add R
                  {(
                    1000 - cartSubtotal
                  ).toLocaleString(
                    "en-ZA"
                  )}{" "}
                  more for free delivery.
                </p>
              )}

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                R
                {cartTotal.toLocaleString(
                  "en-ZA"
                )}
              </strong>
            </div>

            {/* CHECKOUT */}
            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="continue-shopping"
            >
              Continue Shopping
            </Link>
          </aside>

        </div>
      </div>
    </main>
  );
}

export default Cart;

