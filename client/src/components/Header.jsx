import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { trackCTAClick } from "../services/analyticsService";
import "../styles/header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isBookPage = location.pathname === "/start-your-experience";

  // Header scroll effect
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  return (
    <header
      className={`header 
    ${scrolled ? "scrolled" : ""} 
    ${isBookPage ? "book-page-header" : ""}
  `}
    >
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img
            src="/assets/images/coker-creative-logo.png"
            alt="Coker Creative Logo"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-links">
          <Link to="/who-we-are">WHO WE ARE</Link>
          <Link to="/experiences">EXPERIENCES</Link>
          <Link
            to="/start-your-experience"
            onClick={() =>
              trackCTAClick({
                buttonName: "Start Your Experience",
                section: "Header",
              }).catch(console.error)
            }
          >
            START YOUR EXPERIENCE
          </Link>
        </nav>

        {/* Hamburger */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          role="button"
        >
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/who-we-are" onClick={() => setMenuOpen(false)}>
          WHO WE ARE
        </Link>
        <Link to="/experiences" onClick={() => setMenuOpen(false)}>
          EXPERIENCES
        </Link>
        <Link
          to="/start-your-experience"
          onClick={() => {
            trackCTAClick({
              buttonName: "Start Your Experience",
              section: "Mobile Menu",
            }).catch(console.error);

            setMenuOpen(false);
          }}
        >
          START YOUR EXPERIENCE
        </Link>
      </div>
    </header>
  );
};

export default Header;
