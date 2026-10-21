import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from || "/account";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData);

      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="nova-auth-page">
      <section className="nova-auth-card">
        <div className="nova-auth-header">
          <span className="nova-auth-eyebrow">
            WELCOME BACK
          </span>

          <h1>Sign in to NOVA</h1>

          <p>
            Access your account, orders, wishlist and
            personalized shopping experience.
          </p>
        </div>

        {error && (
          <div className="nova-auth-error" role="alert">
            {error}
          </div>
        )}

        <form
          className="nova-auth-form"
          onSubmit={handleSubmit}
        >
          <div className="nova-form-group">
            <label htmlFor="login-email">
              Email address
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="nova-form-group">
            <div className="nova-password-label">
              <label htmlFor="login-password">
                Password
              </label>

              <Link to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <div className="nova-password-input">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="nova-password-toggle"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="nova-auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="nova-auth-divider">
          <span>New to NOVA?</span>
        </div>

        <Link
          to="/register"
          className="nova-auth-secondary-button"
        >
          Create an Account
        </Link>
      </section>
    </main>
  );
}

export default Login;