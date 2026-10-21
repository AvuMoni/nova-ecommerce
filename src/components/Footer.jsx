function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>NOVA<span>.</span></h2>

          <p>
            Technology, lifestyle and smart products designed for modern
            living.
          </p>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>
          <a href="/shop">All Products</a>
          <a href="/shop">Audio</a>
          <a href="/shop">Wearables</a>
          <a href="/shop">Accessories</a>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <a href="/">Contact Us</a>
          <a href="/">Shipping</a>
          <a href="/">Returns</a>
          <a href="/">FAQ</a>
        </div>

        <div className="footer-column">
          <h3>Follow</h3>
          <a href="/">Instagram</a>
          <a href="/">Facebook</a>
          <a href="/">TikTok</a>
          <a href="/">LinkedIn</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 NOVA. All rights reserved.</p>

        <p>Built as a full-stack e-commerce portfolio project.</p>
      </div>
    </footer>
  );
}

export default Footer;