import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./Hero.desktop.css";
import "./Hero.mobile.css";
import backgroundVideo from "../assets/hero-video.mp4";
import LogoAnimation from "../assets/final-logo-desktop.webm";
import logoStatic from "../assets/logo2.webp";
import { hasIntroPlayed, markIntroPlayed } from "./introSession";
import { useBookDemoModal } from "../context/BookDemoModalContext";

function App() {
  return (
    <div className="app-container">
      <Hero />
      {/* other components */}
    </div>
  );
}

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
if (typeof window !== "undefined" && window.location.hash !== "#solutions") {
  window.scrollTo(0, 0);
}

const mobileHeroVideo =
  "https://res.cloudinary.com/t4s8m2hn/video/upload/f_auto,q_auto,w_800/v1784388112/hero-mobile_ewaryl.mp4";

const NAV_ITEMS = [
  { label: "Home", id: "home", sectionId: "home" },
  { label: "About", id: "about", sectionId: "who-we-are" },
  { label: "Services", id: "services", sectionId: "what-we-do" },
  { label: "Solutions", id: "solutions", sectionId: "solutions" },
  { label: "Connect", id: "book-demo", action: "book-demo" },
];

function getIsMobile() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

function NavMenu({ revealed, isMenuOpen, setIsMenuOpen }) {
  const { openBookDemo } = useBookDemoModal();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("nav-open");

      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.dataset.scrollY = String(scrollY);
    } else {
      document.body.classList.remove("nav-open");

      const scrollY = document.body.dataset.scrollY || "0";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY, 10));
    }

    return () => {
      document.body.classList.remove("nav-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsMenuOpen]);

  const handleNavClick = (item) => {
    setIsMenuOpen(false);

    if (item.action === "book-demo") {
      setTimeout(() => openBookDemo(), 250);
      return;
    }

    setTimeout(() => {
      document.getElementById(item.sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  };

  return (
    <>
      {!isMenuOpen &&
        createPortal(
          <button
            className={`nav-hamburger-btn reveal-item ${revealed ? "is-revealed" : ""}`}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={false}
          >
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
          </button>,
          document.body
        )}

      <div
        className={`nav-overlay ${isMenuOpen ? "is-visible" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      <nav
        className={`nav-panel ${isMenuOpen ? "is-open" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          className="nav-panel-close"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          &times;
        </button>
        <ul className="nav-panel-list">
          {NAV_ITEMS.map((item, index) => (
            <li
              key={item.id}
              className="nav-panel-item"
              style={{ transitionDelay: isMenuOpen ? `${0.08 * index + 0.15}s` : "0s" }}
            >
              <button
                className="nav-panel-link"
                onClick={() => handleNavClick(item)}
              >
                <span className="nav-panel-link__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="nav-panel-link__label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="nav-panel-footer">
          <span className="nav-panel-footer__brand">personlyze.ai</span>
        </div>
      </nav>
    </>
  );
}

function DesktopNav({ revealed }) {
  const { openBookDemo } = useBookDemoModal();

  const handleNavClick = (item) => {
    if (item.action === "book-demo") {
      openBookDemo();
      return;
    }

    document.getElementById(item.sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav
      className={`desktop-nav reveal-item ${revealed ? "is-revealed" : ""}`}
      aria-label="Primary"
    >
      <ul className="desktop-nav-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.id} className="desktop-nav-item">
            <button
              type="button"
              className="desktop-nav-link"
              onClick={() => handleNavClick(item)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function LogoMedia() {
  const [videoFailed, setVideoFailed] = useState(false);

  if (videoFailed) {
    return <img src={logoStatic} alt="" aria-hidden="true" className="hero-logo-video" />;
  }

  return (
    <video
      className="hero-logo-video"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      fetchpriority="low"
      onError={() => setVideoFailed(true)}
    >
      <source src={LogoAnimation} type="video/webm" />
    </video>
  );
}

function Hero({ onReveal }) {
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [introDecided, setIntroDecided] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showMobileIntro, setShowMobileIntro] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [mobileIntroStep, setMobileIntroStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const didStartRef = useRef(false);
  const videoRef = useRef(null);
  const videoEffectRanOnceRef = useRef(false);
  const prevIsMobileRef = useRef(isMobile);
  const sectionRef = useRef(null);

  const { openBookDemo } = useBookDemoModal();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const checkScreen = () => {
      setIsMobile((prev) => (prev === mediaQuery.matches ? prev : mediaQuery.matches));
    };
    checkScreen();
    mediaQuery.addEventListener("change", checkScreen);
    return () => mediaQuery.removeEventListener("change", checkScreen);
  }, []);

  useEffect(() => {
    const alreadyPlayed = hasIntroPlayed();
    if (alreadyPlayed) {
      setShowIntro(false);
      setShowMobileIntro(false);
      setRevealed(true);
      onReveal?.();
    } else {
      if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }

      const mobile = getIsMobile();
      setShowIntro(!mobile);
      setShowMobileIntro(mobile);
      setRevealed(false);
    }
    setIntroDecided(true);
  }, []);

  useEffect(() => {
    if (!introDecided) return;

    const root = document.documentElement;
    const body = document.body;

    if (revealed) {
      root.classList.remove("intro-scroll-lock");
      body.classList.remove("intro-scroll-lock");

      try {
        window.lenis?.start?.();
      } catch {}
      try {
        window.ScrollTrigger?.getAll?.().forEach((st) => st.enable());
        window.ScrollTrigger?.refresh?.();
      } catch {}

      return;
    }

    root.classList.add("intro-scroll-lock");
    body.classList.add("intro-scroll-lock");

    try {
      window.lenis?.stop?.();
    } catch {}
    try {
      window.ScrollTrigger?.getAll?.().forEach((st) => st.disable(false));
    } catch {}

    const SCROLL_KEYS = new Set([
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
      "Spacebar",
    ]);

    const blockWheel = (e) => e.preventDefault();
    const blockTouch = (e) => e.preventDefault();
    const blockKeys = (e) => {
      if (SCROLL_KEYS.has(e.key) || e.code === "Space") {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", blockWheel, { passive: false });
    window.addEventListener("touchmove", blockTouch, { passive: false });
    window.addEventListener("keydown", blockKeys, { passive: false });

    return () => {
      window.removeEventListener("wheel", blockWheel);
      window.removeEventListener("touchmove", blockTouch);
      window.removeEventListener("keydown", blockKeys);
    };
  }, [introDecided, revealed]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (!videoEffectRanOnceRef.current) {
      videoEffectRanOnceRef.current = true;
      prevIsMobileRef.current = isMobile;
      return;
    }

    if (prevIsMobileRef.current === isMobile) return;

    prevIsMobileRef.current = isMobile;
    try {
      el.load();
      el.play().catch(() => {});
    } catch {}
  }, [isMobile]);

  useEffect(() => {
    if (!introDecided) return;
    if (!showIntro) return;
    if (didStartRef.current) return;
    didStartRef.current = true;

    markIntroPlayed();

    const LINE1_APPEAR = 100;
    const LINE1_HOLD = 3000;
    const BOTH_HOLD = 1500;
    const FADE_OUT = 800;

    const timers = [
      setTimeout(() => setIntroStep(1), LINE1_APPEAR),
      setTimeout(() => setIntroStep(2), LINE1_APPEAR + LINE1_HOLD),
      setTimeout(
        () => setIntroStep(3),
        LINE1_APPEAR + LINE1_HOLD + BOTH_HOLD,
      ),
      setTimeout(() => {
        setShowIntro(false);
        setRevealed(true);
        onReveal?.();
      }, LINE1_APPEAR + LINE1_HOLD + BOTH_HOLD + FADE_OUT),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [introDecided, showIntro]);

  useEffect(() => {
    if (!introDecided) return;
    if (!showMobileIntro) return;
    if (didStartRef.current) return;
    didStartRef.current = true;

    markIntroPlayed();

    const TOP_APPEAR = 100;
    const TOP_HOLD = 3000;
    const BOTTOM_HOLD = 2000;
    const FADE_OUT = 900;

    const timers = [
      setTimeout(() => setMobileIntroStep(1), TOP_APPEAR),
      setTimeout(() => setMobileIntroStep(2), TOP_APPEAR + TOP_HOLD),
      setTimeout(
        () => setMobileIntroStep(3),
        TOP_APPEAR + TOP_HOLD + BOTTOM_HOLD,
      ),
      setTimeout(() => {
        setShowMobileIntro(false);
        setRevealed(true);
        onReveal?.();
      }, TOP_APPEAR + TOP_HOLD + BOTTOM_HOLD + FADE_OUT),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [introDecided, showMobileIntro]);

  const handleScrollToNextSection = () => {
    document.getElementById("who-we-are")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const videoHiddenForMobileIntro = isMobile && !revealed;

  return (
    <section
      ref={sectionRef}
      className={`hero ${revealed ? "is-revealed" : "is-intro"}`}
    >
      <video
        ref={videoRef}
        className={`hero-video ${videoHiddenForMobileIntro ? "is-preloading" : "is-ready"}`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        fetchpriority="high"
      >
        <source src={isMobile ? mobileHeroVideo : backgroundVideo} type="video/mp4" />
      </video>
      <div className="overlay"></div>

      {!isMobile && showIntro && (
        <div className={`hero-intro step-${introStep}`}>
          <div className="hero-intro__inner">
            <p className="hero-intro__line hero-intro__line--1">
              The future of marketing<br />is not loud.
            </p>
            <p className="hero-intro__line hero-intro__line--2">It's human.</p>
          </div>
        </div>
      )}

      {isMobile && showMobileIntro && (
        <div className={`mobile-split-intro step-${mobileIntroStep}`}>
          <div className="mobile-split-intro__half mobile-split-intro__half--top">
            <p className="mobile-split-intro__top-text">
              <span className="mobile-split-intro__line mobile-split-intro__line--1">
                THE
              </span>
              <span className="mobile-split-intro__line mobile-split-intro__line--2">
                FUTURE OF
              </span>
              <span className="mobile-split-intro__line mobile-split-intro__line--3">
                MARKETING IS
              </span>
              <span className="mobile-split-intro__line mobile-split-intro__line--4">
                NOT LOUD
              </span>
            </p>
          </div>

          <div className="mobile-split-intro__half mobile-split-intro__half--bottom">
            <p className="mobile-split-intro__bottom-word">its human</p>
          </div>
        </div>
      )}

      {isMobile && !isMenuOpen &&
        createPortal(
          <button
            className={`hero-book-demo-btn reveal-item ${revealed ? "is-revealed" : ""}`}
            onClick={openBookDemo}
          >
            Book a Demo
          </button>,
          document.body
        )}

      {isMobile ? (
        <NavMenu
          revealed={revealed}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      ) : (
        <DesktopNav revealed={revealed} />
      )}

      {isMobile ? (
        <div className="hero-center hero-center--mobile">
          <div className={`hero-mobile-stack reveal-item ${revealed ? "is-revealed" : ""}`}>
            <div className="hero-logo-wrap">
              <LogoMedia />
            </div>
            <h1 className="hero-brand">
              <span className="brand-name">personlyze</span>
              <span className="brand-dot">.</span>
              <span className="brand-ai">ai</span>
            </h1>
            <button
              className="hero-demo-btn"
              onClick={handleScrollToNextSection}
              aria-label="Scroll to next section"
            >
              <span className="hero-demo-btn__arrow">⌄</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="hero-center">
          <div className={`hero-left reveal-item ${revealed ? "is-revealed" : ""}`}>
            <LogoMedia />
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;