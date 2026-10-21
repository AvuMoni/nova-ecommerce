import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await forgotPassword(email);

      setSuccess(result.message);
    } catch (forgotPasswordError) {
      setError(forgotPasswordError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="nova-auth-page">
      <section className="nova-auth-card">
        <div className="nova-auth-header">
          <span className="nova-auth-eyebrow">
            ACCOUNT RECOVERY
          </span>

          <h1>Forgot your password?</h1>

          <p>
            Enter your email address and we'll help you
            recover access to your NOVA account.
          </p>
        </div>

        {error && (
          <div className="nova-auth-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="nova-auth-success" role="status">
            {success}
          </div>
        )}

        <form
          className="nova-auth-form"
          onSubmit={handleSubmit}
        >
          <div className="nova-form-group">
            <label htmlFor="forgot-email">
              Email address
            </label>

            <input
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              autoComplete="email"
              required
            />
          </div>

          <button
            type="submit"
            className="nova-auth-submit"
            disabled={loading}
          >
            {loading
              ? "Checking..."
              : "Reset Password"}
          </button>
        </form>

        <Link
          to="/login"
          className="nova-auth-back-link"
        >
          ← Back to Sign In
        </Link>
      </section>
    </main>
  );
}

export default ForgotPassword;