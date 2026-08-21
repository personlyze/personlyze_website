import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBookDemoModal } from "../context/BookDemoModalContext";
import "./DesktopBurgerMenu.css";

const NAV_ITEMS = [
  { label: "Home", id: "home", sectionId: "home" },
  { label: "About", id: "about", sectionId: "who-we-are" },
  { label: "Services", id: "services", sectionId: "what-we-do" },
  { label: "Solutions", id: "solutions", sectionId: "solutions" },
  { label: "Connect", id: "book-demo", action: "book-demo" },
];

function DesktopBurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openBookDemo } = useBookDemoModal();

  // Detect if desktop or mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    mediaQuery.addEventListener("change", checkMobile);
    return () => mediaQuery.removeEventListener("change", checkMobile);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (e.target.closest(".desktop-burger-menu") === null) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  // Handle navigation
  const handleNavClick = (item) => {
    setIsOpen(false);

    // If on a different page (e.g., industry page), navigate to home first
    if (location.pathname !== "/") {
      navigate("/");
      // Use a small delay to allow navigation to complete
      setTimeout(() => {
        handleNavigate(item);
      }, 100);
      return;
    }

    handleNavigate(item);
  };

  const handleNavigate = (item) => {
    if (item.action === "book-demo") {
      openBookDemo();
      return;
    }

    const section = document.getElementById(item.sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  return (
    <div className="desktop-burger-menu">
      {/* Burger Button */}
      <button
        className={`desktop-burger-btn ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <span className="burger-line burger-line--1" />
        <span className="burger-line burger-line--2" />
        <span className="burger-line burger-line--3" />
      </button>

      {/* Menu Panel */}
      {isOpen && (
        <div className="desktop-burger-panel">
          <nav className="desktop-burger-nav">
            <ul className="desktop-burger-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.id} className="desktop-burger-item">
                  <button
                    className="desktop-burger-link"
                    onClick={() => handleNavClick(item)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="desktop-burger-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default DesktopBurgerMenu;
