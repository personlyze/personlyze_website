import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Routes, Route, useLocation } from "react-router-dom";

import Hero from "./components/Hero";
import Workspace from "./components/Workspace";
import Results from "./components/Results";
import Industries from "./components/Industries";
import CardTransitionSection from "./components/CardTransitionSection";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";

import IndustryLanding from "./pages/IndustryLanding";

import { BookDemoModalProvider } from "./context/BookDemoModalContext";

import "./App.css";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH FOR INITIAL SCROLL POSITION
//
// On a real browser reload, `history.scrollRestoration` defaults to
// "auto" — the browser restores whatever scrollY you were at on your
// previous visit. Setting scrollRestoration = "manual" from inside a
// React effect runs too late: the browser has already committed its
// first restore attempt by the time any effect fires. Doing it here,
// at module-evaluation time (before React has even rendered), is the
// earliest point our code can run, and it reliably wins the race.
//
// This is the ONLY unconditional scroll-to-top on load. It's skipped
// when the URL is explicitly `/#solutions` (the "Back to Industries"
// case below), so we don't visibly flash to the top and then jump back
// down — but every other load (including a plain refresh of `/`) still
// starts at 0 exactly as before.
// ---------------------------------------------------------------------
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
if (typeof window !== "undefined" && window.location.hash !== "#solutions") {
  window.scrollTo(0, 0);
}

/* =========================
   HOME PAGE
========================= */
function HomePage() {
  const location = useLocation();
  const containerRef = useRef(null);
  const [heroReady, setHeroReady] = useState(false);

  // Purely visual — keeps #solutions invisible (visibility only, layout
  // untouched) until layout has settled, so it can never flash on
  // screen while CardTransitionSection's pin is still resolving.
  const [solutionsVisible, setSolutionsVisible] = useState(false);

  // Shared flag: has the user actually driven a scroll themselves yet?
  // Every "should we move the scroll position" decision below checks
  // this first, so layout settling / GSAP refresh / section mounting
  // can never move the page — only a real user action can.
  const hasUserScrolledRef = useRef(false);

  useEffect(() => {
    const markScrolled = () => {
      hasUserScrolledRef.current = true;
    };
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
    const markScrolledByKey = (e) => {
      if (SCROLL_KEYS.has(e.key) || e.code === "Space") markScrolled();
    };

    window.addEventListener("wheel", markScrolled, { passive: true });
    window.addEventListener("touchstart", markScrolled, { passive: true });
    window.addEventListener("keydown", markScrolledByKey, { passive: true });

    return () => {
      window.removeEventListener("wheel", markScrolled);
      window.removeEventListener("touchstart", markScrolled);
      window.removeEventListener("keydown", markScrolledByKey);
    };
  }, []);

  /* =========================
     LAYOUT SETTLE: single, one-shot ScrollTrigger refresh.
     Runs once after all sections have mounted below the Hero. Does
     NOT loop, does NOT poll layout via rAF/ResizeObserver, and only
     touches scroll position if the user has not already started
     scrolling on their own (requirement: never fight the user).
  ========================= */
  useEffect(() => {
    if (!heroReady) return;

    // "Back to Industries" navigates to `/#solutions`. That's the ONLY
    // case where we intentionally land away from the top — every other
    // load (`/`, or a refresh of `/`) keeps landing at the Hero. This
    // is a one-time, explicit navigation intent, not a guess based on
    // layout timing, so it's safe to branch on here.
    const returningToSolutions = location.hash === "#solutions";

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      if (!hasUserScrolledRef.current) {
        if (returningToSolutions) {
          const solutions = document.getElementById("solutions");
          if (solutions) {
            window.scrollTo({ top: solutions.offsetTop, left: 0, behavior: "auto" });
          }
        } else {
          window.scrollTo(0, 0);
        }
      }

      setSolutionsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [heroReady, location.hash]);

  useEffect(() => {
    if (!heroReady) return;
    const sections = gsap.utils.toArray(".panel");

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleClass: "active",
      })
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [heroReady]);

  /* =========================
     SECTION-LOCKED SCROLL
     Workspace Screen 1 → Workspace Screen 2 (video) → Results.
     Only intercepts scroll while inside that zone; everything before
     (Hero) and everything from CardTransitionSection onward keeps
     native/GSAP-driven scrolling.

     NOTE: this must live inside HomePage (not App), because it looks
     up #workspace-screen-1, #workspace-screen-2, and .results-section,
     all of which are rendered by HomePage's JSX below.
  ========================= */
  useEffect(() => {
    if (!heroReady) return;
    const LOCK_RESUME_MS = 900;
    let isAnimating = false;
    let unlockTimer = null;
    let touchStartY = null;

    const getSectionTops = () => {
      const screen1 = document.getElementById("workspace-screen-1");
      const screen2 = document.getElementById("workspace-screen-2");
      const results = document.querySelector(".results-section");
      if (!screen1 || !screen2 || !results) return null;

      const topOf = (el) => el.getBoundingClientRect().top + window.scrollY;
      return { tops: [topOf(screen1), topOf(screen2), topOf(results)] };
    };

    const isInLockedZone = (tops) => {
      const currentY = window.scrollY;
      const buffer = 2;

      // If still at Workspace Screen 1, let Hero->Workspace scroll natively.
      if (currentY <= tops[0] + 10) return false;

      return currentY >= tops[0] - buffer && currentY < tops[2] - buffer;
    };

    const goToIndex = (tops, index) => {
      const clamped = Math.max(0, Math.min(index, tops.length - 1));
      isAnimating = true;
      window.scrollTo({ top: tops[clamped], behavior: "smooth" });
      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(() => {
        isAnimating = false;
      }, LOCK_RESUME_MS);
    };

    const navigate = (direction) => {
      const data = getSectionTops();
      if (!data) return;
      const { tops } = data;

      const currentY = window.scrollY;
      let currentIndex = 0;
      let minDist = Infinity;
      tops.forEach((t, i) => {
        const d = Math.abs(currentY - t);
        if (d < minDist) {
          minDist = d;
          currentIndex = i;
        }
      });

      goToIndex(tops, currentIndex + direction);
    };

    const handleWheel = (e) => {
      const data = getSectionTops();
      if (!data || !isInLockedZone(data.tops)) return;

      e.preventDefault();
      if (isAnimating) return;

      navigate(e.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (e) => {
      const data = getSectionTops();
      if (!data || !isInLockedZone(data.tops)) {
        touchStartY = null;
        return;
      }
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (touchStartY === null) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      if (touchStartY === null) return;
      const endY = e.changedTouches[0].clientY;
      const delta = touchStartY - endY;
      touchStartY = null;

      const SWIPE_THRESHOLD = 40;
      if (Math.abs(delta) < SWIPE_THRESHOLD || isAnimating) return;

      navigate(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(unlockTimer);
    };
  }, [heroReady]);

  /* =========================
     SOLUTIONS SINGLE-STOP LOCK
     Independent from the Workspace→Results lock above, and from
     CardTransitionSection's own pinning/horizontal scroll — this
     effect never intercepts scroll anywhere before Solutions, so
     "What We Do" scrolls 100% natively, unmodified.

     Deliberately event-driven (wheel/touchmove only) rather than
     IntersectionObserver-driven: an observer can fire from layout
     shifts (fonts, images, video, GSAP pin-spacer height changes)
     that have nothing to do with the user scrolling, which is what
     caused Solutions to auto-snap on load. Checking scroll position
     only inside real wheel/touch handlers means this can never fire
     from mounting, hero-reveal, or ScrollTrigger.refresh().
  ========================= */
  useEffect(() => {
    if (!heroReady) return;
    const LOCK_RESUME_MS = 900;
    let locked = false;
    let hasSnappedForThisApproach = false;
    let unlockTimer = null;

    const getBounds = () => {
      const solutions = document.getElementById("solutions");
      const testimonials = document.getElementById("testimonials");
      if (!solutions || !testimonials) return null;
      return {
        solutionsTop: solutions.offsetTop,
        testimonialsTop: testimonials.offsetTop,
      };
    };

    const inZone = (bounds) => {
      const currentY = window.scrollY;
      const buffer = 2;
      return (
        currentY >= bounds.solutionsTop - buffer &&
        currentY < bounds.testimonialsTop - buffer
      );
    };

    const snap = (bounds) => {
      locked = true;
      hasSnappedForThisApproach = true;

      window.scrollTo({
        top: bounds.solutionsTop,
        left: 0,
        behavior: "smooth",
      });

      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(() => {
        locked = false;
      }, LOCK_RESUME_MS);
    };

    const handleWheel = (e) => {
      if (locked) {
        e.preventDefault();
        return;
      }

      const bounds = getBounds();
      if (!bounds) return;

      if (!inZone(bounds)) {
        // Fully left the section (either direction) — allow the
        // single-stop snap to re-trigger on the next real approach.
        hasSnappedForThisApproach = false;
        return;
      }

      if (!hasSnappedForThisApproach) {
        e.preventDefault();
        snap(bounds);
      }
    };

    const handleTouchMove = (e) => {
      if (locked) e.preventDefault();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      clearTimeout(unlockTimer);
    };
  }, [heroReady]);

  return (
    <div ref={containerRef} className="app">
      <section id="home" className="panel hero">
        <Hero onReveal={() => setHeroReady(true)} />
      </section>

      {/* Everything below the Hero mounts ONLY after the Hero intro/reveal
          finishes. Before that, #solutions & co. simply do not exist in the
          DOM, so none of the scroll logic above can fire against a
          half-laid-out page. */}
      {heroReady && (
        <>
          <section id="who-we-are" className="panel">
            <Workspace />
          </section>

          <section id="why-personlyze" className="panel">
            <Results />
          </section>

          <section id="what-we-do" className="panel large">
            <CardTransitionSection />
          </section>

          <section
            id="solutions"
            className="panel"
            style={{ visibility: solutionsVisible ? "visible" : "hidden" }}
          >
            <Industries />
          </section>

          <section id="testimonials" className="panel">
            <Testimonials />
          </section>
          <section id="faq" className="panel">
            <FAQ />
          </section>

          <section id="contact" className="panel">
            <Footer />
          </section>
        </>
      )}
    </div>
  );
}

/* =========================
   MAIN APP
========================= */
function App() {
  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";

    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <BookDemoModalProvider>

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route 
          path="/industry/:slug" 
          element={<IndustryLanding />} 
        />
      </Routes>

    </BookDemoModalProvider>
  );
}

export default App;