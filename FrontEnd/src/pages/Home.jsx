import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => (
  <header className="header">
    <div className="header-inner container">
      <Link to="/" className="brand">
        <img className="brand-logo" src={logo} alt="Food Scanner logo" />
        <span className="brand-name">Food Scanner</span>
      </Link>

      <nav className="nav">
        <a href="#app">App</a>
        <a href="#independence">Approach</a>
        <a href="#features">Features</a>
        <a href="#faq">FAQ</a>
      </nav>

      <Link to="/login" className="btn btn-outline">
        Login
      </Link>
    </div>
  </header>
);

const Hero = () => (
  <section id="app" className="hero">
    <div className="container hero-grid">
      <div className="hero-text">
        <div className="pill">Food scanning · Allergy detection · Label clarity</div>
        <h1>
          Scan food fast.
          <br />
          Spot allergens faster.
        </h1>
        <p className="hero-subtitle">
          Food Scanner helps you interpret ingredients and flags common allergens
          in seconds—so you can shop with confidence.
        </p>
        <div className="hero-ctas">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <button className="btn btn-ghost" type="button">
            How it works
          </button>
        </div>
      </div>

      <div className="hero-card">
        <div className="phone-mock" aria-hidden="true">
          <div className="phone-notch" />
          <div className="phone-screen">
            <div className="product-score score-average">Allergen check</div>
            <div className="product-card">
              <h3>Example Product</h3>
              <div className="divider" />
              <ul>
                <li>Contains: milk</li>
                <li>May contain: nuts</li>
                <li>Notes: added flavoring</li>
              </ul>
            </div>
            <div className="scan-hint">Log in to scan and save results</div>
          </div>
        </div>
        <div className="glow" />
      </div>
    </div>
  </section>
);

const IndependenceSection = () => (
  <section id="independence" className="section section-alt">
    <div className="container">
      <h2>Built for clarity, not marketing</h2>
      <p className="section-intro">
        The goal is simple: help you recognize allergens and interpret labels
        without hype, ads, or “sponsored” products.
      </p>

      <div className="grid-3">
        <div className="card">
          <h3>Allergen-first</h3>
          <p>Surface common and hidden allergens clearly and consistently.</p>
        </div>
        <div className="card">
          <h3>Explainable</h3>
          <p>Show “why” something was flagged—not just a scary warning.</p>
        </div>
        <div className="card">
          <h3>Designed for real life</h3>
          <p>Fast checks while shopping, saved history when you need it.</p>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="section">
    <div className="container">
      <div className="two-cols">
        <div>
          <h2>Ingredient scanning that’s useful</h2>
          <p>
            Quickly parse an ingredient list and highlight what matters for your
            dietary needs.
          </p>
          <ul className="feature-list">
            <li>Common allergens highlighted</li>
            <li>“May contain” and cross-contamination notes</li>
            <li>Save scans for repeat purchases</li>
          </ul>
        </div>
        <div className="feature-mock">
          <div className="product-score score-poor">Flagged items</div>
          <div className="product-badges">
            <span>Milk</span>
            <span>Peanuts</span>
            <span>Gluten</span>
          </div>
        </div>
      </div>

      <div className="two-cols reverse">
        <div>
          <h2>Personalized allergy profile</h2>
          <p>
            Set what you avoid and get results tailored to you—no generic
            nonsense.
          </p>
          <ul className="feature-list">
            <li>Choose allergies / intolerances</li>
            <li>Adjust sensitivity level</li>
            <li>Clear recommendations and alternatives later</li>
          </ul>
        </div>
        <div className="feature-mock">
          <div className="product-score score-average">Your profile</div>
          <div className="product-badges">
            <span>No dairy</span>
            <span>No nuts</span>
            <span>No soy</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FAQSection = () => (
  <section id="faq" className="section section-alt">
    <div className="container">
      <h2>Questions?</h2>
      <div className="faq-list">
        <details>
          <summary>Is this a medical diagnosis tool?</summary>
          <p>
            No. It’s for informational support while shopping. For medical
            advice, talk to a clinician.
          </p>
        </details>
        <details>
          <summary>Do I need an account?</summary>
          <p>
            To save scans and keep a personal allergy profile, yes—login is
            required.
          </p>
        </details>
        <details>
          <summary>Do you track or sell my data?</summary>
          <p>No selling data. Keep it simple, keep it private.</p>
        </details>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-left">
        <div className="brand brand-footer">
          <img className="brand-logo" src={logo} alt="Food Scanner logo" />
          <span className="brand-name">Food Scanner</span>
        </div>
        <p className="footer-text">
          Scan ingredients. Flag allergens. Shop with confidence.
        </p>
      </div>

      <div className="footer-columns">
        <div>
          <h4>App</h4>
          <a href="#features">Features</a>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <h4>Info</h4>
          <a href="#faq">FAQ</a>
          <a href="#independence">Approach</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <IndependenceSection />
        <FeaturesSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
