import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./MobileCardTransitionSection.css";

import strategicImg from "../assets/Strategic.png";
import creativeImg from "../assets/Creative.png";
import aiImg from "../assets/AI.png";

const CARD_IMAGES = [strategicImg, creativeImg, aiImg];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CARDS = [
  {
    num: "01",
    title: "STRATEGY",
    desc: [
      {
        heading: "Build Consumer Personas",
        body: "Bringing the customer alive through rich profiles that go beyond demographics by capturing motivations, behaviours, anxieties and aspirations.",
      },
      {
        heading: "Craft Consumer Decision Journeys",
        body: "Mapping every touchpoint, trigger and barrier from discovery to purchase so that you know exactly what to say, when to say it and where it matters the most.",
      },
      {
        heading: "Identify High-Impact Personalization Opportunities",
        body: "Finding the moments where personalization creates the biggest impact on conversion, loyalty and advocacy.",
      },
    ],
  },

  {
    num: "02",
    title: "DESIGN",
    desc: [
      {
        heading: "Create Content Frameworks",
        body: "Design the narrative, script, tone of voice, visual language and storytelling structure that makes every personalized video feel authentic and memorable.",
      },
      {
        heading: "Produce Video Assets",
        body: "End-to-end production from planning and filming to editing in order to create premium video assets that are both brand-ready and AI-ready for personalization.",
      },
    ],
  },

  {
    num: "03",
    title: "ARTIFICIAL\nINTELLIGENCE",
    desc: [
      {
        heading: "Create Hyper-Personalized Videos",
        body: "Using customer data, our AI creates a unique video for every individual while keeping your brand story consistent across every interaction.",
      },
      {
        heading: "Deploy to Marketing Channels",
        body: "Automatically deliver personalized videos across your existing marketing platforms, ensuring every customer receives the right message at the right moment.",
      },
      {
        heading: "Measure, Review & Calibrate",
        body: "Continuously monitor performance, optimize campaigns and improve results in real time - making every future interaction smarter than the last.",
      },
    ],
  },
];

// ---- Scroll choreography constants -----------------------------------
// The "What We Do" heading now lives in its own plain, normal-flow section
// (see the JSX below) that scrolls away like ordinary content — it is no
// longer part of the pinned/scrubbed timeline at all. The pinned section
// that follows starts pinning exactly when the heading section has fully
// scrolled past (that's just how ScrollTrigger's `start: "top top"` lines
// up against the element directly above it in the flow), and by then card
// 01 is already sitting in its normal full-screen layout — there's nothing
// left to animate into place, so there's no slide-up/expand to worry
// about. The strategy cards (01 / 02 / 03) still transition purely on
// scroll via GSAP + ScrollTrigger, exactly as before. The three bullet
// points inside a card are swipe/drag/arrow controlled (see the React
// state + pointer handlers below), so the timeline only needs to (a)
// bring a card in, (b) hold it on screen long enough to swipe through its
// points, and (c) send it back out.
const HERO_IN = 0.55; // screens - entrance for cards 02/03 (unchanged pace)
const HOLD = 1.0; // screens - dwell time per card, for swiping through points
const OUT = 0.4; // screens - exit fade for all but the last card
const GAP = 0.35; // screens - overlap/gap between one card's exit and the next's entrance

const perCardScroll = (i) =>
  (i === 0 ? 0 : HERO_IN) + HOLD + (i < CARDS.length - 1 ? OUT : 0.5);

const totalScreens = CARDS.reduce((a, _c, i) => a + perCardScroll(i), 0);
const SECTION_HEIGHT = `${Math.round(totalScreens * 100)}vh`;

const SWIPE_THRESHOLD_PX = 50;

export default function MobileCardTransitionSection() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const headlineRef = useRef(null);

  const cardRefs = useRef([]);
  const descWrapRefs = useRef([]);
  const trackRefs = useRef([]);
  const dragRefs = useRef(CARDS.map(() => ({ dragging: false, startX: 0, dx: 0, pointerId: null })));

  const setCardRef = (i) => (el) => {
    cardRefs.current[i] = el;
  };
  const setDescWrapRef = (i) => (el) => {
    descWrapRefs.current[i] = el;
  };
  const setTrackRef = (i) => (el) => {
    trackRefs.current[i] = el;
  };

  // Which point (0/1/2) is showing per card. Purely a swipe/drag/arrow
  // concern - scroll never touches this.
  const [pointIndex, setPointIndex] = useState(() => CARDS.map(() => 0));

  const goToPoint = (cardIdx, nextIndex) => {
    const max = CARDS[cardIdx].desc.length - 1;
    const clamped = Math.max(0, Math.min(max, nextIndex));
    setPointIndex((prev) => {
      if (prev[cardIdx] === clamped) return prev;
      const next = [...prev];
      next[cardIdx] = clamped;
      return next;
    });
  };

  // ---- Pointer handlers (mouse + touch + pen, unified) ----
  const handlePointerDown = (cardIdx) => (e) => {
    const dr = dragRefs.current[cardIdx];
    dr.dragging = true;
    dr.startX = e.clientX;
    dr.dx = 0;
    dr.pointerId = e.pointerId;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const track = trackRefs.current[cardIdx];
    if (track) track.style.transition = "none";
  };

  const handlePointerMove = (cardIdx) => (e) => {
    const dr = dragRefs.current[cardIdx];
    if (!dr.dragging) return;
    dr.dx = e.clientX - dr.startX;
    const track = trackRefs.current[cardIdx];
    if (track) {
      const basePercent = -pointIndex[cardIdx] * 100;
      track.style.transform = `translateX(calc(${basePercent}% + ${dr.dx}px))`;
    }
  };

  const endDrag = (cardIdx) => () => {
    const dr = dragRefs.current[cardIdx];
    if (!dr.dragging) return;
    dr.dragging = false;
    const track = trackRefs.current[cardIdx];
    if (track) track.style.transition = ""; // restore CSS transition for the snap

    if (dr.dx <= -SWIPE_THRESHOLD_PX) {
      goToPoint(cardIdx, pointIndex[cardIdx] + 1);
    } else if (dr.dx >= SWIPE_THRESHOLD_PX) {
      goToPoint(cardIdx, pointIndex[cardIdx] - 1);
    } else if (track) {
      // Not enough movement - snap back to the current point.
      track.style.transform = "";
    }
    dr.dx = 0;
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const E_OUT = "power2.out";
    const E_IN = "power2.in";

    const ctx = gsap.context(() => {
      const applyInitial = () => {
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            // Card 01 is fully visible, full-screen, from the moment the
            // pinned section engages — no fade, no slide-up, no scale, no
            // special positioning. It's already in its final layout; the
            // heading above it (in its own section) is what moves, via
            // ordinary page scroll, not this one.
            gsap.set(el, { opacity: 1, y: 0, zIndex: 10 + i, pointerEvents: "auto" });
          } else {
            gsap.set(el, { opacity: 0, y: 40, zIndex: 10 + i, pointerEvents: "none" });
          }
        });

        descWrapRefs.current.forEach((el, i) => {
          if (!el) return;
          // Card 01's description/points block is visible immediately,
          // matching the card itself. Others fade in with their card.
          gsap.set(el, { opacity: i === 0 ? 1 : 0 });
        });
      };

      applyInitial();

      const tl = gsap.timeline({
        defaults: { ease: E_OUT },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.25,
          pin: stickyRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      let t = 0;

      CARDS.forEach((_card, i) => {
        const cardEl = cardRefs.current[i];
        const descWrap = descWrapRefs.current[i];

        const heroInDuration = i === 0 ? 0 : HERO_IN;

        if (i !== 0 && cardEl) {
          tl.set(cardEl, { pointerEvents: "auto" }, t);
          tl.to(cardEl, { opacity: 1, y: 0, duration: heroInDuration, ease: E_OUT }, t);
          if (descWrap) {
            tl.to(descWrap, { opacity: 1, duration: 0.4 }, t + 0.15);
          }
        }

        const heroInEnd = t + heroInDuration;
        const holdEnd = heroInEnd + HOLD;

        if (i < CARDS.length - 1) {
          if (cardEl && descWrap) {
            tl.to([cardEl, descWrap], { opacity: 0, duration: OUT, ease: E_IN }, holdEnd);
          }
          if (cardEl) {
            tl.to(cardEl, { y: -30, duration: OUT, ease: E_IN }, holdEnd);
            tl.set(cardEl, { pointerEvents: "none" }, holdEnd);
          }
          t = holdEnd + GAP;
        } else {
          tl.to({}, { duration: 0.5 }, holdEnd);
          t = holdEnd + 0.5;
        }
      });

      // --- Heading scroll reveal ------------------------------------
      // Independent of the pinned card timeline above (own trigger, own
      // scrub). The headline's CSS paints its text with a two-tone
      // gradient (light gray -> black) clipped to the text via
      // background-clip: text; here we just scrub that gradient's
      // horizontal position as the heading scrolls through view, so the
      // fill sweeps left-to-right from light gray to solid black.
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { backgroundPosition: "100% 0" },
          {
            backgroundPosition: "0% 0",
            ease: "none",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 85%",
              end: "bottom 45%",
              scrub: true,
            },
          }
        );
      }

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);
      window.visualViewport?.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        window.visualViewport?.removeEventListener("resize", handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Keep the viewport height in sync with mobile browser chrome
  // (address bar show/hide on iOS/Android) via a CSS custom property.
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--mcts-vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  return (
    <>
      {/* Plain white/cream intro section, in normal document flow - it
          scrolls away exactly like any other content. It's deliberately
          shorter than a full viewport so that Strategy 01 (already
          rendered full-screen, right below it) peeks up from the bottom
          edge while the heading is still on screen. Once this section has
          fully scrolled past, the pinned section below it takes over -
          and by then card 01 is simply *already* in its full-screen
          layout, so there's nothing left to animate. */}
      <div className="mcts-heading-section">
        <h1 ref={headlineRef} className="mcts-headline">What we do</h1>
      </div>

      <section
        ref={sectionRef}
        className="mcts-section"
        style={{ height: SECTION_HEIGHT }}
      >
        <div ref={stickyRef} className="mcts-sticky">
          {CARDS.map((card, i) => (
            <div
              key={card.num}
              ref={setCardRef(i)}
              className={`mcts-card mcts-card--${i + 1}`}
              style={{
                backgroundImage: `url(${CARD_IMAGES[i]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="mcts-card__top">
                <span className="mcts-card__num">{card.num}</span>
                <h2 className="mcts-card__title">
                  {(card.title || "").split("\n").map((l, li) => (
                    <span key={li} className="mcts-card__title-line">
                      {l}
                    </span>
                  ))}
                </h2>
              </div>

              <div ref={setDescWrapRef(i)} className="mcts-desc">
                <div
                  className="mcts-desc__slider"
                  style={{ touchAction: "pan-y" }}
                  onPointerDown={handlePointerDown(i)}
                  onPointerMove={handlePointerMove(i)}
                  onPointerUp={endDrag(i)}
                  onPointerCancel={endDrag(i)}
                >
                  <div
                    ref={setTrackRef(i)}
                    className="mcts-desc__track"
                    style={{ transform: `translateX(-${pointIndex[i] * 100}%)` }}
                  >
                    {card.desc.map((s, si) => (
                      <div key={si} className="mcts-desc__slide">
                        <h3 className="mcts-desc__heading">{s.heading}</h3>
                        <p className="mcts-desc__body">{s.body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mcts-desc__nav">
                  <button
                    type="button"
                    className="mcts-desc__arrow mcts-desc__arrow--prev"
                    aria-label="Previous point"
                    onClick={() => goToPoint(i, pointIndex[i] - 1)}
                    disabled={pointIndex[i] === 0}
                  >
                    ‹
                  </button>

                  <div className="mcts-desc__dots" role="tablist" aria-label="Points">
                    {card.desc.map((_s, si) => (
                      <button
                        key={si}
                        type="button"
                        className={`mcts-desc__dot${si === pointIndex[i] ? " is-active" : ""}`}
                        aria-label={`Go to point ${si + 1}`}
                        aria-selected={si === pointIndex[i]}
                        onClick={() => goToPoint(i, si)}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    className="mcts-desc__arrow mcts-desc__arrow--next"
                    aria-label="Next point"
                    onClick={() => goToPoint(i, pointIndex[i] + 1)}
                    disabled={pointIndex[i] === card.desc.length - 1}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}