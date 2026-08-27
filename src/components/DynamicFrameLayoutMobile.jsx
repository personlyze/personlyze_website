// DynamicFrameLayoutMobile.jsx  ·  v7  ·  simple premium vertical card list (mobile)
//
// No stacked deck, no sticky, no overlap, no expand/collapse, no hover, no video.
// 10 full-width cards, one below another, 180–220px tall.
// Image fills the card + numbered label top-center + industry name centered
// + ">" arrow bottom-right + iOS-style touch ripple on tap.
// Tap anywhere on a card navigates straight to the industry page.
//
// v7 change: fixes mobile back-navigation scroll reset (Back button, Android
// gesture back, iPhone swipe back) not actually resetting to the 1st card.
//
// ROOT CAUSE (why v6 failed on mobile specifically):
// Mobile browsers restore scroll for interactive back gestures (iOS
// edge-swipe, Android predictive-back) using a native, browser-owned
// "live snapshot" restore that runs during/after the same paint cycle our
// `pageshow`/`popstate` handlers fire in — NOT before it. So our previous
// scroll reset executed, then the browser's own native restoration
// overwrote it a frame later. `history.scrollRestoration = "manual"` does
// NOT suppress this — that flag only affects standard history-restoration,
// not the gesture-driven snapshot restore mobile browsers use for
// swipe/predictive back. Adding more listeners doesn't fix a race; the
// reset has to run AFTER the browser's own restoration has settled, which
// means deferring to actual paint frames (double requestAnimationFrame)
// instead of running inside the event callback itself.
import { memo, useCallback, useEffect, useRef, useState } from "react";
import "./DynamicFrameLayoutMobile.css";
import { useNavigate } from "react-router-dom";

import realEstateImg from "../assets/real-estateimg.webp";
import financeImg from "../assets/bfsi-img.webp";
import travelImg from "../assets/travelimg.webp";
import healthImg from "../assets/healthimg.webp";
import retailImg from "../assets/Retailimg.webp";
import automotiveImg from "../assets/automotiveimg.webp";
import b2bImg from "../assets/b2bimg.webp";
import fashionImg from "../assets/fashionimg.webp";
import internalCommsImg from "../assets/internal-commsimg.webp";
import govtPoliticsImg from "../assets/govt-politics.webp";

const industries = [
  { name: "Real Estate", image: realEstateImg, slug: "real-estate" },
  { name: "Finance", image: financeImg, slug: "bfsi" },
  { name: "Travel & Hospitality", image: travelImg, slug: "travel" },
  { name: "Health & Wellness", image: healthImg, slug: "health" },
  { name: "Retail & D2C", image: retailImg, slug: "retail" },
  { name: "Automotive", image: automotiveImg, slug: "automotive" },
  { name: "B2B & SaaS", image: b2bImg, slug: "b2b" },
  { name: "Fashion & Lifestyle", image: fashionImg, slug: "fashion" },
  {
    name: "Internal Communication",
    image: internalCommsImg,
    slug: "internal-communication",
  },
  {
    name: "Govt & Politics",
    image: govtPoliticsImg,
    video: null, // placeholder — swap in real asset when video previews are added back
    slug: "govt-politics",
  },
];

/* Only real touch devices get the ripple — mouse/pen pointers are skipped. */
const isTouchPointer = (e) => e.pointerType === "touch";

const IndustryCard = memo(function IndustryCard({ industry, index, onOpen }) {
  const cardRef = useRef(null);
  const rippleIdRef = useRef(0);
  const [ripples, setRipples] = useState([]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen(industry.slug);
      }
    },
    [industry.slug, onOpen],
  );

  const spawnRipple = useCallback((e) => {
    if (!isTouchPointer(e)) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Size the ripple so it always covers the full card from the tap point.
    const maxDist = Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y),
    );
    const size = maxDist * 2;

    const id = rippleIdRef.current++;
    setRipples((prev) => [...prev, { id, x, y, size }]);

    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  }, []);

  const label = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={cardRef}
      role="link"
      tabIndex={0}
      aria-label={`Open ${industry.name} industry page`}
      className="dfl-m-card"
      onClick={() => onOpen(industry.slug)}
      onKeyDown={handleKeyDown}
      onPointerDown={spawnRipple}
    >
      <div
        className="dfl-m-card-bg"
        style={{ backgroundImage: `url(${industry.image})` }}
      />
      <div className="dfl-m-card-scrim" />

      <span className="dfl-m-number">
        {label} 
      </span>

      <h3 className="dfl-m-name">{industry.name}</h3>

      <span className="dfl-m-arrow" aria-hidden="true">
        &gt;
      </span>

      <span className="dfl-m-ripple-layer" aria-hidden="true">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="dfl-m-ripple"
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
              marginLeft: -r.size / 2,
              marginTop: -r.size / 2,
            }}
          />
        ))}
      </span>
    </article>
  );
});

export default function DynamicFrameLayoutMobile() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const handleOpen = useCallback(
    (slug) => {
      navigate(`/industry/${slug}`);
    },
    [navigate],
  );

  useEffect(() => {
    // Stop the browser from auto-restoring scroll offsets on standard
    // history navigation. Kept for correctness on desktop / non-gesture
    // back, but — see the note at the top of this file — this flag does
    // NOT govern the native snapshot-restore used by mobile swipe/gesture
    // back, which is the actual source of the bug.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollToFirstCard = () => {
      const el = sectionRef.current;
      if (el) {
        el.scrollIntoView({ block: "start", behavior: "auto" });
      } else {
        window.scrollTo(0, 0);
      }
    };

    // Deferred reset: waits for TWO animation frames before scrolling.
    // This is not an arbitrary delay (no setTimeout / magic ms value) —
    // it's tied to actual paint frames, and its purpose is specific: give
    // the browser's own native gesture/bfcache scroll restoration a chance
    // to finish first, so our reset runs LAST and wins the race instead of
    // being silently overwritten a frame later. One rAF covers "restoration
    // already happened before this frame"; the second covers restoration
    // that lands exactly on the first frame after pageshow/popstate.
    const deferredScrollToFirstCard = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToFirstCard);
      });
    };

    // Case 1: normal SPA remount when navigating back to Home. Run
    // immediately (no need to defer — there's no prior native restoration
    // to race against on a genuine fresh mount) and again deferred, in
    // case the browser applies a gesture-snapshot restore right after
    // mount on this navigation too.
    scrollToFirstCard();
    deferredScrollToFirstCard();

    // Case 2: bfcache restore — component isn't remounted, browser fires
    // `pageshow` with `persisted: true` instead.
    const handlePageShow = (event) => {
      if (event.persisted) {
        deferredScrollToFirstCard();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    // Case 3: Back button / Android gesture back / iOS swipe back all
    // trigger `popstate`. Deferred so we run after the browser's own
    // gesture-driven scroll restoration has settled, not before it.
    const handlePopState = () => {
      deferredScrollToFirstCard();
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <section className="dfl-m-section" aria-label="Industries" ref={sectionRef}>
      <div className="dfl-m-list">
        {industries.map((industry, index) => (
          <IndustryCard
            key={industry.slug}
            industry={industry}
            index={index}
            onOpen={handleOpen}
          />
        ))}
      </div>
    </section>
  );
}