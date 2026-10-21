import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const {
    cartItemCount,
    wishlistCount,
  } = useShop();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nova-navbar">
      <div className="nova-navbar-container">

        <Link
          to="/"
          className="nova-logo"
        >
          NOVA
        </Link>

        <nav className="nova-nav-links">
          <NavLink
            to="/"
            end
          >
            Home
          </NavLink>

          <NavLink to="/shop">
            Shop
          </NavLink>

          <NavLink to="/shop?category=women">
            Women
          </NavLink>

          <NavLink to="/shop?category=men">
            Men
          </NavLink>

          <NavLink to="/shop?category=accessories">
            Accessories
          </NavLink>
        </nav>

        <div className="nova-nav-actions">

          <Link
            to="/wishlist"
            className="nova-nav-action"
            aria-label="Wishlist"
          >
            ♡

            {wishlistCount > 0 && (
              <span className="nova-nav-count">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="nova-nav-action"
            aria-label="Shopping cart"
          >
            🛍

            {cartItemCount > 0 && (
              <span className="nova-nav-count">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="nova-login-button"
              >
                Account
              </Link>

              <button
                type="button"
                className="nova-nav-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nova-login-button"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nova-nav-signup"
              >
                Join
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;