import { Link } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";

function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-eyebrow">
            THE FUTURE OF SHOPPING
          </span>

          <h1>
            Technology
            <br />
            <strong>for modern life.</strong>
          </h1>

          <p>
            Discover carefully selected technology, smart devices and
            lifestyle products designed to make everyday life better.
          </p>

          <div className="hero-actions">
            <Link to="/shop" className="primary-button">
              Shop collection
            </Link>

            <a href="#featured" className="secondary-button">
              Explore products
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature">
          <div className="feature-icon">🚚</div>

          <div>
            <h3>Fast delivery</h3>
            <p>Reliable delivery across South Africa.</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon">🔒</div>

          <div>
            <h3>Secure checkout</h3>
            <p>Your payment information stays protected.</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon">↩️</div>

          <div>
            <h3>Easy returns</h3>
            <p>Simple and transparent return process.</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon">💬</div>

          <div>
            <h3>Customer support</h3>
            <p>We're here when you need us.</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories" id="categories">
        <SectionTitle
          eyebrow="EXPLORE"
          title="Shop by category"
          description="Find the technology that fits your lifestyle."
        />

        <div className="category-grid">
          <Link to="/shop?category=Audio" className="category-card audio">
            <div>
              <span>01</span>
              <h3>Audio</h3>
              <p>Sound without limits.</p>
            </div>
          </Link>

          <Link
            to="/shop?category=Wearables"
            className="category-card wearables"
          >
            <div>
              <span>02</span>
              <h3>Wearables</h3>
              <p>Technology on you.</p>
            </div>
          </Link>

          <Link
            to="/shop?category=Accessories"
            className="category-card accessories"
          >
            <div>
              <span>03</span>
              <h3>Accessories</h3>
              <p>Complete your setup.</p>
            </div>
          </Link>

          <Link
            to="/shop?category=Smart Home"
            className="category-card smart-home"
          >
            <div>
              <span>04</span>
              <h3>Smart Home</h3>
              <p>Smarter spaces.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* FEATURED */}
      <section className="featured" id="featured">
        <SectionTitle
          eyebrow="CURATED FOR YOU"
          title="Featured products"
          description="Our most popular products, selected for modern living."
        />

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="center-button">
          <Link to="/shop" className="outline-button">
            View all products
          </Link>
        </div>
      </section>

      {/* PROMO */}
      <section className="promo">
        <div className="promo-content">
          <span>NEW ARRIVALS</span>

          <h2>
            Upgrade
            <br />
            your everyday.
          </h2>

          <p>
            Discover our newest collection of smart technology and
            lifestyle products.
          </p>

          <Link to="/shop" className="primary-button">
            Discover what's new
          </Link>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="about-content">
          <span className="section-eyebrow">WHY NOVA?</span>

          <h2>
            Better products.
            <br />
            Better living.
          </h2>

          <p>
            NOVA is built around a simple idea: technology should feel
            useful, beautiful and accessible.
          </p>

          <p>
            Every product in our store is selected with quality,
            functionality and modern design in mind.
          </p>

          <Link to="/shop" className="text-link">
            Explore the collection →
          </Link>
        </div>

        <div className="about-stat">
          <strong>100+</strong>
          <span>Products coming to the collection</span>
        </div>
      </section>
    </main>
  );
}

export default Home;