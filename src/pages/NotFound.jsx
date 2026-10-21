import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>

      <h1>Page not found</h1>

      <p>
        The page you're looking for doesn't exist.
      </p>

      <Link to="/" className="primary-button">
        Back to home
      </Link>
    </main>
  );
}

export default NotFound;