import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Results.css";

// Update these import paths to match wherever the images live in your project
import bgConversions from "../assets/Higher Conversions.png";
import bgCPA from "../assets/Lower CPA.jpg";
import bgCTR from "../assets/marketing performance.jpg";
import bgROAS from "../assets/ROAS Improvement.jpg";

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  {
    number: "150%",
    label: "More Conversions",
    footnote: "vs industry benchmark",
    image: bgConversions,
  },
  {
    number: "2×",
    label: "Higher CTR",
    footnote: "vs control creative",
    image: bgCTR,
  },
 {

    number: "50%",

    label: "Lower CPA",

    footnote: "across all funnels",

    image: bgCPA,

  }, 
  {
    number: "12×",
    label: "ROAS Improvement",
    footnote: "average across cohorts",
    image: bgROAS,
  },
];

// Simple inline chevron icons for the mobile nav arrows — no extra
// dependency needed, and they inherit color via `currentColor` so the
// CSS opacity/hover rules just work.
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 18l6-6-6-6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Results() {
  const sectionRef    = useRef(null);
  const pinSectionRef = useRef(null); // wraps heading + cards. Kept only for
                                       // the mobile display:contents CSS rule
                                       // (.results-pin-section) — it is no
                                       // longer used as a GSAP pin target on
                                       // desktop, see the effect below.
  const cardsStripRef = useRef(null);
  const cardsAreaRef  = useRef(null);
  const cardsPinRef   = useRef(null);
  const headingRef    = useRef(null); // used for the mobile scroll-reveal

  // Tracks which card is centered in the mobile carousel, drives the dots.
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ── Desktop / tablet-landscape: pinned horizontal scroll ──
    // Below 769px this block never runs — cards become the Instagram-style
    // native scroll-snap carousel handled entirely by CSS + the effect below.
    mm.add("(min-width: 769px)", () => {
      const strip     = cardsStripRef.current;
      const cardsPin  = cardsPinRef.current;
      const cardsArea = cardsAreaRef.current;

      // IMPORTANT: only the cards block (`cardsPin`) is pinned here — the
      // heading is intentionally left OUT of the pin target. It stays in
      // normal document flow above the cards, so as the user keeps
      // scrolling past the point where the cards lock in place, the
      // heading keeps moving up and off the top of the viewport on its
      // own, cropping naturally. The cards, being the only pinned
      // element, don't move with it and stay fully visible.
      if (!strip || !cardsPin || !cardsArea) return;

      const GAP = 24;

      // Read the ACTUAL left padding on the viewport instead of assuming 0.
      // This is the piece that was missing — the strip starts inside the
      // padding box, but clientWidth includes the padding, so the last
      // `paddingLeft` pixels of the strip were being pushed offscreen right.
      const cs = getComputedStyle(cardsArea);
      const padLeft  = parseFloat(cs.paddingLeft)  || 0;
      const padRight = parseFloat(cs.paddingRight) || 0;

      const viewportWidth  = cardsArea.clientWidth;
      const effectiveWidth = viewportWidth - padLeft - padRight;

      const cardW = (effectiveWidth - 2 * GAP) / 2.5;

      strip.querySelectorAll(".metric-card").forEach((card) => {
        card.style.width = `${cardW}px`;
        card.style.flexShrink = "0";
      });

      const stripWidth  = strip.scrollWidth;
      // Travel must land the strip's right edge at the viewport's right edge
      // INSIDE the padding box, not at the padding edge.
      const totalTravel = stripWidth - effectiveWidth;

      // Scroll budget reduced from the previous 4x multiplier so the
      // animation resolves in noticeably fewer wheel-scrolls, while
      // scrub: 1 keeps the motion smooth rather than snappy/jumpy.
      const SCROLL_BUDGET = totalTravel * 1.2;

      gsap.set(strip, { x: 0 });

      // Pin ONLY the cards block. "top top+=64" means the pin engages once
      // the cards block's top has scrolled up to 64px from the viewport
      // top. Because the heading sits directly above the cards in normal
      // flow and is NOT part of the pin target, at that exact moment the
      // heading has scrolled up so only its bottom ~64px sliver is still
      // visible/cropped at the very top edge — and the cards, now pinned,
      // settle fully visible starting right where the pin caught them
      // (i.e. slightly lower than y=0, not flush with the top).
      //
      // Tune this single number up/down to match your reference exactly:
      // higher = less heading cropped + cards sit lower; lower = more
      // heading cropped + cards sit higher.
      const tween = gsap.to(strip, {
        x: -totalTravel,
        ease: "none",
        scrollTrigger: {
          trigger: cardsPin,
          start: "top top+=64",
          end: `+=${SCROLL_BUDGET}`,
          pin: cardsPin,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();

      // gsap.matchMedia cleans up automatically on context revert / breakpoint
      // change, but we also reset inline widths so nothing leaks into mobile.
      return () => {
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
        strip.querySelectorAll(".metric-card").forEach((card) => {
          card.style.width = "";
        });
        gsap.set(strip, { clearProps: "x" });
      };
    });

    return () => mm.revert();
  }, []);

  // ── Mobile-only heading scroll-scrub color reveal ──
  // Premium Apple/Linear-style effect: the heading sits fixed in place
  // (no movement, no opacity change) and only text color animates, from
  // a light gray to solid black, scrubbed directly to scroll position.
  // Because it's `scrub` (not a one-shot play), the color tracks the
  // scrollbar exactly — scroll up and it lightens back toward gray.
  // Desktop is untouched — this matchMedia block only ever registers
  // below 769px.
  //
  // IMPORTANT: .results-brand and .results-ai each have their own CSS
  // color rule, which has higher specificity than an inherited color on
  // the parent <h2> — so animating heading.color alone never reaches
  // those spans. To make the whole heading reveal as one piece, all
  // three pieces (the "Why" text via the h2 itself, the brand span, and
  // the accent span) are set to the SAME starting gray with gsap.set
  // BEFORE the tween is created (this kills the flash-of-black you'd
  // otherwise see from the plain CSS color painting first), then tweened
  // together on the SAME timeline + SAME ScrollTrigger so they move in
  // perfect sync as one scrubbed animation. The accent span animates to
  // its final red instead of black, so the ".ai" accent color is
  // preserved once the reveal completes.
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 768px)", () => {
      const heading = headingRef.current;
      if (!heading) return;

      const brandEl = heading.querySelector(".results-brand");
      const aiEl    = heading.querySelector(".results-ai");

      const LIGHT  = "#CFCFCF";
      const DARK   = "#111111";
      const ACCENT = "#d10000";

      const targets = [heading, brandEl, aiEl].filter(Boolean);

      // Force the starting gray immediately, before ScrollTrigger even
      // measures anything — prevents any flash of the CSS-default black
      // on first paint.
      gsap.set(targets, { color: LIGHT });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top 90%",
          end: "top 35%",
          scrub: 0.5,
        },
      });

      tl.fromTo(heading, { color: LIGHT }, { color: DARK, ease: "none" }, 0);
      if (brandEl) {
        tl.fromTo(brandEl, { color: LIGHT }, { color: DARK, ease: "none" }, 0);
      }
      if (aiEl) {
        tl.fromTo(aiEl, { color: LIGHT }, { color: ACCENT, ease: "none" }, 0);
      }

      return () => {
        tl.scrollTrigger && tl.scrollTrigger.kill();
        tl.kill();
        gsap.set(targets, { clearProps: "color" });
      };
    });

    return () => mm.revert();
  }, []);

  // ── Mobile carousel: track which card is centered so the dots stay in
  // sync while the user swipes. Native scroll-snap does the actual paging;
  // this just observes scrollLeft and reports the nearest card's index.
  // Harmless on desktop — that viewport never scrolls horizontally there,
  // so this listener simply never fires.
  useEffect(() => {
    const viewport = cardsAreaRef.current;
    if (!viewport) return;

    let ticking = false;

    const updateActiveFromScroll = () => {
      const cards = viewport.querySelectorAll(".metric-card");
      if (!cards.length) return;

      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveFromScroll();
        ticking = false;
      });
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
    };
  }, []);

  const scrollToCard = (index) => {
    const viewport = cardsAreaRef.current;
    if (!viewport) return;

    // Clamp so arrow clicks at the ends are harmless no-ops instead of
    // scrolling to an out-of-range card.
    const clamped = Math.max(0, Math.min(index, METRICS.length - 1));

    const card = viewport.querySelectorAll(".metric-card")[clamped];
    if (!card) return;

    const target =
      card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;

    viewport.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <section className="results-section" ref={sectionRef}>

      {/* Wraps heading + cards. On desktop this is now a plain layout div —
          it is NOT the GSAP pin target anymore (see effect above), so the
          heading scrolls normally and crops off on its own while only the
          cards block below pins in place.
          On mobile this becomes display:contents (see media query in the
          CSS), removing it from the layout tree entirely — mobile is
          unaffected either way. */}
      <div className="results-pin-section" ref={pinSectionRef}>

        <div className="results-heading-block">
          <h2 className="results-heading" ref={headingRef}>
            WHY <span className="results-brand">PERSONLYZE</span><span className="results-ai">.ai</span>
          </h2>
        </div>

        <div className="results-cards-pin" ref={cardsPinRef}>
          {/* Mobile-only wrapper (display:contents on desktop) so the nav
              arrows can be positioned relative to the carousel without
              altering the desktop DOM/layout at all. */}
          <div className="results-cards-carousel-wrap">
            <div className="results-cards-viewport" ref={cardsAreaRef}>
              <div className="results-cards-strip" ref={cardsStripRef}>
                {METRICS.map((m) => (
                  <div
                    key={m.label}
                    className="metric-card"
                    style={{ backgroundImage: `url(${m.image})` }}
                  >
                    <div className="metric-card-overlay" />
                    <div className="metric-card-content">

                      {/* Mobile-only floating badge (glass pill). Hidden on
                          desktop via display:none — reuses the footnote text
                          so no new copy is introduced. */}
                      <div className="metric-card-badge">{m.footnote}</div>

                      {/* Mobile-only glass panel wrapping the stat + heading +
                          description. On desktop this is display:contents, so
                          its children (.metric-card-top + .metric-card-description)
                          behave as plain flex children exactly like before. */}
                      <div className="metric-card-mobile-panel">
                        <div className="metric-card-top">
                          <div className="metric-card-number">{m.number}</div>
                          <div className="metric-card-label">{m.label}</div>
                        </div>
                        <div className="metric-card-description">
                          As established by industry data from personalized video campaigns
                          across categories and markets across the world.
                        </div>
                      </div>

                      {/* Group 2: footnote + disclaimer — this is the ORIGINAL
                          desktop layout, unchanged. Hidden on mobile, where the
                          badge + description above take over that same content. */}
                      <div className="metric-card-bottom">
                        <div className="metric-card-footnote">{m.footnote}</div>
                        <div className="metric-card-disclaimer">
                          As established by industry data from personalized video campaigns
                          across categories and markets across the world.
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Invisible spacer — creates one final `gap` after the last
                    card, identical in size to the gaps between cards, so the
                    pin doesn't release until that trailing gap has scrolled by.
                    On mobile this is hidden — scroll-snap needs the last real
                    card to be the final snap point, not an empty spacer. */}
                <div className="results-cards-spacer" aria-hidden="true" />
              </div>
            </div>

            {/* Mobile-only transparent nav arrows. Hidden entirely on desktop.
                Disabled (and visually hidden) at the ends so they never imply
                navigation that isn't possible. */}
            <button
              type="button"
              className="results-nav-arrow results-nav-arrow--prev"
              onClick={() => scrollToCard(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous result"
            >
              <ChevronLeft />
            </button>

            <button
              type="button"
              className="results-nav-arrow results-nav-arrow--next"
              onClick={() => scrollToCard(activeIndex + 1)}
              disabled={activeIndex === METRICS.length - 1}
              aria-label="Next result"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Instagram-style pagination dots — mobile only (display:none on
              desktop). Tapping a dot jumps to that card. */}
          <div className="results-dots" role="tablist" aria-label="Results carousel pagination">
            {METRICS.map((m, i) => (
              <button
                key={m.label}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Show result ${i + 1} of ${METRICS.length}`}
                className={`results-dot${i === activeIndex ? " is-active" : ""}`}
                onClick={() => scrollToCard(i)}
              />
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}