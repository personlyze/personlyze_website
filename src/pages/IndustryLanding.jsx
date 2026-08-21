import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import industries from "../data/industries";
import MobileIndustryLanding from "./MobileIndustryLanding";
import { useBookDemoModal } from "../context/BookDemoModalContext";
import "./IndustryLanding.css";

import realEstateVideo from "../assets/real-estate.mp4";
import bfsiVideo from "../assets/bfsi.mp4";
import travelVideo from "../assets/travel.mp4";
import healthVideo from "../assets/health.mp4";
import retailVideo from "../assets/Retail.mp4";
import automotiveVideo from "../assets/automotive.mp4";
import b2bVideo from "../assets/b2b.mp4";
import fashionVideo from "../assets/fashion.mp4";

const cardPhotos = {
  ...import.meta.glob("../card-photos/*.jpg", { eager: true, import: "default" }),
  ...import.meta.glob("../card-photos/*.png", { eager: true, import: "default" }),
};

/* Hero background video per industry slug. Industries with no entry (or no
 * .mp4 asset yet) simply fall back to the existing `image` poster — no
 * industry ever inherits another industry's video. */
const HERO_VIDEO_BY_SLUG = {
  "real-estate": realEstateVideo,
  bfsi: bfsiVideo,
  travel: travelVideo,
  health: healthVideo,
  retail: retailVideo,
  automotive: automotiveVideo,
  b2b: b2bVideo,
  saas: b2bVideo,
  fashion: fashionVideo,
  // "internal-communication" and "govt-politics" intentionally omitted —
  // no video asset exists yet, so they correctly fall back to `image`.
};

/* Only needed when an industry's image-file prefix differs from its slug
 * (e.g. slug "real-estate" -> files named "real-card-1.jpg"). Any industry
 * NOT listed here automatically falls back to using its own slug as the
 * prefix, so brand-new industries work with zero code changes as long as
 * their image files are named `${slug}-card-${n}.jpg` / `${slug}-problem${n}.png`. */
const IMAGE_PREFIX_BY_SLUG = {
  "real-estate": "real",
  bfsi: "bfsi",
  travel: "travel",
  health: "health",
  retail: "retail",
  automotive: "automotive",
  saas: "saas",
  b2b: "saas",
  tech: "tech",
  fashion: "fashion",

  "internal-communication": "internal-comms",
  "govt-politics": "govt-politics",
};

function getPrefix(slug) {
  return IMAGE_PREFIX_BY_SLUG[slug] || slug;
}

function getCardImage(slug, cardNumber) {
  const prefix = getPrefix(slug);
  if (!prefix) return null;
  const key = `../card-photos/${prefix}-card-${cardNumber}.jpg`;
  return cardPhotos[key] ?? null;
}

/* Large hero image for each Step-1 challenge card. Works for any number of
 * challenges — challengeNumber is just that challenge's 1-based position. */
function getProblemImage(slug, challengeNumber) {
  try {
    const prefix = getPrefix(slug);
    if (!prefix) return null;
    const png = `../card-photos/${prefix}-problem${challengeNumber}.png`;
    const jpg = `../card-photos/${prefix}-problem${challengeNumber}.jpg`;
    return cardPhotos[png] ?? cardPhotos[jpg] ?? null;
  } catch {
    return null;
  }
}

/* Default labels applied in order to a challenge's cards. A card can always
 * override this with an explicit `card.label` field in the data — that takes
 * priority. Challenges with more cards than there are default labels simply
 * get no label on the extra cards (no guessing). */
const CARD_LABELS = [
  "What This Means",
  "Personlyze Intervention",
  "Video",
  "Why This Works",
  "Expected Outcome",
];

function getCardLabel(card, indexInChallenge) {
  if (card && card.label) return card.label;
  return CARD_LABELS[indexInChallenge] ?? null;
}

/* A card is treated as the "Video" card if the data says so explicitly
 * (type/videoUrl/video/title). As a legacy fallback — for data that hasn't
 * been updated to mark video cards explicitly — a challenge with exactly
 * 5 cards still treats the 3rd card (index 2) as video, matching the
 * original fixed 5-card layout. New/variable-length challenges should just
 * mark their video card explicitly in the data. */
function isVideoCard(card, cardIndexInChallenge, totalCardsInChallenge) {
  if (!card) return false;
  const type = (card.type || card.cardType || "").toString().toLowerCase();
  if (type === "video") return true;
  if (card.videoUrl || card.video) return true;
  if ((card.title || "").toLowerCase().includes("video")) return true;
  if (totalCardsInChallenge === 5 && cardIndexInChallenge === 2) return true;
  return false;
}

/* Computes, for each challenge, how many cards came before it across all
 * prior challenges. challengeCardOffsets[i] + cardIndexInChallenge + 1 gives
 * the correct *global* image number for that card, however many challenges
 * or cards-per-challenge exist. */
function getChallengeCardOffsets(challenges) {
  const offsets = [];
  let running = 0;
  for (const challenge of challenges) {
    offsets.push(running);
    running += Array.isArray(challenge?.cards) ? challenge.cards.length : 0;
  }
  return offsets;
}

/* Number of detail cards visible at once in the carousel viewport. */
const VISIBLE_CARDS_IN_CAROUSEL = 3;

/* The Industries/Solutions grid lives inside HomePage at <section
 * id="solutions">, not on its own route. HomePage already has logic that
 * watches for location.hash === "#solutions" and scrolls that section into
 * view, so navigating here is what actually gets the user back to it. */
const SOLUTIONS_ROUTE = "/#solutions";

/* -------------------------------------------------------------------------- */
/*  Mobile detection                                                          */
/* -------------------------------------------------------------------------- */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

/* ========================================================================== */
/*  MAIN COMPONENT                                                            */
/* ========================================================================== */
export default function IndustryLanding() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const industry = industries.find((item) => item.slug === slug);
  const isMobile = useIsMobile();
  const { openBookDemo } = useBookDemoModal();

  /* ---- desktop reveal state ---------------------------------------------
   * stage: "challenges" (step 1) -> "detail" (step 2, sliding carousel)
   * All hooks are declared unconditionally, before any early return, so the
   * mobile branch below never violates the rules of hooks. */
  const [stage, setStage] = useState("challenges");
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const challengeCardRefs = useRef([]);
  const detailHeaderRef = useRef(null);
  const detailCardRefs = useRef([]);
  const carouselTrackRef = useRef(null);
  const carouselViewportRef = useRef(null);

  // Track the currently-running entrance timelines so a re-fire of the
  // entrance effect (React Strict Mode double-invoking useLayoutEffect in
  // dev, or the user re-triggering "detail" quickly) can never leave two
  // GSAP timelines fighting over the same opacity/filter styles on the
  // same elements — see the fix note above the entrance effect below.
  const challengesEntranceTlRef = useRef(null);
  const detailEntranceTlRef = useRef(null);

  // Reset ref buckets every render so stale nodes from a previous stage
  // never linger in the array GSAP animates against.
  challengeCardRefs.current = [];
  detailCardRefs.current = [];

  /* --------------------------------------------------------------------
   * ROOT CAUSE OF THE "hero cut off / already scrolled" BUG:
   *
   * This route is `/industry/:slug`. React Router reuses the SAME
   * IndustryLanding component instance when the user navigates from one
   * industry page straight to another (e.g. clicking a different industry
   * link) — it does not unmount/remount just because `slug` changed. That
   * means two things silently carried over from the previous industry page:
   *
   *   1. Scroll position: nothing ever reset `window.scrollY`, so if the
   *      user had scrolled down (or was deep in the Step-2 carousel) on the
   *      previous industry, the browser kept that same scroll offset when
   *      the new industry's content swapped in underneath it — making the
   *      new page's hero appear partially cut off / already scrolled.
   *   2. Component state: `stage`, `activeChallengeIndex`, and
   *      `carouselIndex` are only initialized once via useState and were
   *      never reset on navigation, so a user could land on a brand new
   *      industry already sitting in the "detail" carousel stage from the
   *      previous one.
   *
   * FIX: whenever `slug` changes, synchronously (before paint, via
   * useLayoutEffect) reset the desktop stage/carousel state back to the
   * initial "challenges" view and force the window to scroll to the top.
   * Using useLayoutEffect (not useEffect) avoids any visible flash of the
   * wrong scroll position or wrong stage. This only touches this
   * component's own state and window.scrollTo — it doesn't alter
   * history.scrollRestoration or push/pop history entries, so normal
   * browser back/forward navigation is unaffected.
   * -------------------------------------------------------------------- */
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    setStage("challenges");
    setActiveChallengeIndex(null);
    setCarouselIndex(0);
    setIsTransitioning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  /* Entrance animation whenever we land on a stage (challenges or detail). */
  /* --------------------------------------------------------------------
   * ROOT CAUSE OF THE "Back button not visible / hidden" BUG:
   *
   * The "challenges" branch below always called gsap.set(cards, { clearProps
   * ... }) before starting its entrance tween, wiping any leftover inline
   * opacity/filter/transform a previous tween might have left behind. The
   * "detail" branch did NOT do this for `header` (which wraps the Back
   * button) or `cards`, and the gsap.timeline() it created was never stored
   * or killed.
   *
   * If this effect fires more than once for the same "detail" stage — e.g.
   * React Strict Mode double-invoking useLayoutEffect in dev, or the user
   * re-entering "detail" quickly enough that a previous tween hadn't
   * finished — two separate GSAP timelines ended up animating opacity/
   * filter on the very same header element simultaneously, with no reset
   * in between. Whichever inline style "won" that race could freeze the
   * header at partial/zero opacity or mid-blur — the Back button was still
   * in the DOM, just rendered invisible.
   *
   * FIX: store each entrance timeline in a ref and kill any previous one
   * before creating a new one, and gsap.set(..., { clearProps }) the
   * header/cards first (mirroring the existing "challenges" pattern) so
   * every entrance always starts from a clean, known style state. The
   * effect's cleanup also kills the timeline if the effect re-runs or the
   * component unmounts mid-animation, so a stray tween can never keep
   * running in the background and stomp styles afterward.
   * -------------------------------------------------------------------- */
  useLayoutEffect(() => {
    if (isMobile || !industry) return;

    if (stage === "challenges") {
      const cards = challengeCardRefs.current.filter(Boolean);
      if (!cards.length) return;

      challengesEntranceTlRef.current?.kill();
      gsap.set(cards, { clearProps: "transform,opacity,filter" });
      const tl = gsap.fromTo(
        cards,
        { opacity: 0, y: 44, scale: 0.96, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
      challengesEntranceTlRef.current = tl;
      return () => tl.kill();
    } else if (stage === "detail") {
      const header = detailHeaderRef.current;
      const cards = detailCardRefs.current.filter(Boolean);

      // Kill any still-running entrance timeline from a previous fire of
      // this effect before touching these elements again.
      detailEntranceTlRef.current?.kill();

      // Always start from a clean, known style state — this is the same
      // safeguard the "challenges" branch already had, now applied here too.
      if (header) gsap.set(header, { clearProps: "opacity,transform,filter" });
      if (cards.length) gsap.set(cards, { clearProps: "opacity,transform,filter" });

      const tl = gsap.timeline();
      detailEntranceTlRef.current = tl;
      if (header) {
        tl.fromTo(
          header,
          { opacity: 0, y: -24, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power2.out" }
        );
      }
      if (cards.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.94, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.65,
            stagger: 0.09,
            ease: "power3.out",
          },
          header ? "-=0.25" : 0
        );
      }
      return () => tl.kill();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, activeChallengeIndex, isMobile, industry]);

  /* Slide the carousel track whenever the window position changes. Measures
   * the real card width each time so it stays correct at any viewport size
   * and any number of cards. */
  useLayoutEffect(() => {
    if (isMobile || !industry || stage !== "detail") return;
    const track = carouselTrackRef.current;
    const firstCard = detailCardRefs.current[0];
    if (!track || !firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 24;
    const distance = (cardWidth + gap) * carouselIndex;
    gsap.to(track, { x: -distance, duration: 0.65, ease: "power3.inOut" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carouselIndex, stage, activeChallengeIndex, isMobile, industry]);

  /* Keep the carousel aligned if the window resizes (no animation, just snap). */
  useEffect(() => {
    if (isMobile || !industry) return;
    function handleResize() {
      if (stage !== "detail") return;
      const track = carouselTrackRef.current;
      const firstCard = detailCardRefs.current[0];
      if (!track || !firstCard) return;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = 24;
      gsap.set(track, { x: -(cardWidth + gap) * carouselIndex });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [stage, carouselIndex, isMobile, industry]);

  /* --------------------------------------------------------------------
   * Challenge page = one screen, no scrolling.
   * While the "detail" (challenge) stage is active on desktop, the hero
   * is not rendered (see the JSX below) and the cards section is sized to
   * exactly fill the viewport. As a hard guarantee against any vertical
   * scrollbar appearing (e.g. from a stray sub-pixel overflow), also lock
   * body scrolling for the duration of that stage, restoring it the
   * moment we leave "detail" (back button, unmount, or slug change).
   * -------------------------------------------------------------------- */
  useEffect(() => {
    if (isMobile || !industry) return;
    if (stage !== "detail") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [stage, isMobile, industry]);

  if (!industry) {
    return (
      <div className="industry-landing__not-found">
        <h1>Industry Not Found</h1>
      </div>
    );
  }

  const { heroTitle, heroDescription, challenges, image } = industry;
  const heroVideo = HERO_VIDEO_BY_SLUG[slug] || null;

  /* Works for any number of challenges, each with any number of cards. */
  const challengeCardOffsets = getChallengeCardOffsets(challenges);

  /* ====================================================================== */
  /*  MOBILE BRANCH — untouched                                            */
  /* ====================================================================== */
  if (isMobile) {
    return (
      <MobileIndustryLanding
        slug={slug}
        image={image}
        heroTitle={heroTitle}
        heroDescription={heroDescription}
        challenges={challenges}
      />
    );
  }

  /* ====================================================================== */
  /*  DESKTOP BRANCH — continuous two-stage GSAP reveal + carousel          */
  /* ====================================================================== */
  function handleOpenChallenge(index) {
    if (isTransitioning || stage === "detail") return;
    const clickedCard = challengeCardRefs.current[index];
    const otherCards = challengeCardRefs.current.filter(
      (el, i) => el && i !== index
    );

    if (!clickedCard && !otherCards.length) {
      setActiveChallengeIndex(index);
      setCarouselIndex(0);
      setStage("detail");
      return;
    }

    setIsTransitioning(true);

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        setActiveChallengeIndex(index);
        setCarouselIndex(0);
        setStage("detail");
        setIsTransitioning(false);
      },
    });

    // Neutralize the CSS hover transition so it doesn't fight the tween.
    tl.set([clickedCard, ...otherCards].filter(Boolean), { transition: "none" }, 0);

    if (clickedCard) {
      // 1. Selected card lifts and scales slightly — feels "chosen".
      tl.to(clickedCard, { scale: 1.045, duration: 0.32, ease: "power2.out" }, 0);
    }
    if (otherCards.length) {
      // 2. Everything else softly recedes.
      tl.to(
        otherCards,
        { opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)", duration: 0.5 },
        0.08
      );
    }
    if (clickedCard) {
      // 3. Selected card "expands" toward the viewer and dissolves into the
      //    incoming detail view, so the two stages read as one continuous move.
      tl.to(
        clickedCard,
        { opacity: 0, scale: 1.14, filter: "blur(14px)", duration: 0.55 },
        0.26
      );
    }
  }

  function handleBackToSolutions() {
    navigate(SOLUTIONS_ROUTE);
  }

  function handleBack() {
    if (isTransitioning || stage === "challenges") return;
    const header = detailHeaderRef.current;
    const cards = detailCardRefs.current.filter(Boolean);
    setIsTransitioning(true);
    const tl = gsap.timeline({
      defaults: { ease: "power2.in" },
      onComplete: () => {
        setStage("challenges");
        setActiveChallengeIndex(null);
        setCarouselIndex(0);
        setIsTransitioning(false);
      },
    });
    if (cards.length) {
      tl.to(cards, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        filter: "blur(6px)",
        duration: 0.4,
        stagger: 0.04,
      });
    }
    if (header) {
      tl.to(
        header,
        { opacity: 0, y: -18, filter: "blur(4px)", duration: 0.3 },
        cards.length ? "-=0.22" : 0
      );
    }
    if (!cards.length && !header) {
      tl.to({}, { duration: 0.01 });
    }
  }

  function handleCarouselPrev() {
    if (isTransitioning) return;
    setCarouselIndex((i) => Math.max(0, i - 1));
  }

  function handleCarouselNext(maxIndex) {
    if (isTransitioning) return;
    setCarouselIndex((i) => Math.min(maxIndex, i + 1));
  }

  const activeChallenge =
    activeChallengeIndex !== null ? challenges[activeChallengeIndex] : null;

  /* Carousel bounds are computed from the *actual* number of cards in the
   * active challenge — works whether a challenge has 3, 5, 8, or any other
   * number of cards. */
  const activeCardsCount = (activeChallenge?.cards?.length ?? 0) + 1;
  const carouselMaxIndex = Math.max(0, activeCardsCount - VISIBLE_CARDS_IN_CAROUSEL);

  return (
    <div
      className={`industry-landing${stage === "detail" ? " industry-landing--detail" : ""}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      {stage !== "detail" && (
        <div className="industry-hero" style={{ backgroundImage: `url(${image})` }}>
          <button
            type="button"
            className="industry-hero__back-to-solutions"
            onClick={handleBackToSolutions}
            style={{ position: "absolute", zIndex: 30, pointerEvents: "auto" }}
          >
            <span aria-hidden="true">&larr;</span> Back to Solutions
          </button>
          {heroVideo && (
            <video
              className="industry-hero__video"
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
            />
          )}
          <div className="industry-hero__overlay" />
          <div className="industry-hero__content">
            <h1 className="industry-hero__title">{heroTitle}</h1>
            <p className="industry-hero__description">{heroDescription}</p>
          </div>
        </div>
      )}

      <div
        className={`industry-cards-section${
          stage === "detail" ? " industry-cards-section--detail" : ""
        }`}
      >
        <div className="industry-cards-section__overlay" />

        {stage === "challenges" && (
          <div className="industry-challenges-grid">
            {challenges.map((challenge, index) => {
              const bgImage = getProblemImage(slug, index + 1);
              return (
                <button
                  type="button"
                  key={index}
                  className="industry-challenge-card"
                  onClick={() => handleOpenChallenge(index)}
                  ref={(el) => {
                    challengeCardRefs.current[index] = el;
                  }}
                >
                  <div
                    className="industry-challenge-card__media"
                    style={
                      bgImage
                        ? { backgroundImage: `url(${bgImage})` }
                        : undefined
                    }
                  />
                  <div className="industry-challenge-card__overlay" />
                  <div className="industry-challenge-card__inner">
                    <span className="industry-challenge-card__label">
                      Challenge {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="industry-challenge-card__problem">{challenge.problem}</p>
                    <span className="industry-challenge-card__cta">
                      Explore <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {stage === "detail" && activeChallenge && (
          <div className="industry-detail">
            <div
              className="industry-detail__header"
              ref={detailHeaderRef}
              // Defensive stacking guarantee: this header (and the Back
              // button inside it) must never end up visually covered by
              // the always-present .industry-cards-section__overlay or any
              // other sibling, regardless of how those are styled in CSS.
              style={{ position: "relative", zIndex: 20 }}
            >
              <button
                type="button"
                className="industry-detail__back"
                onClick={handleBack}
                style={{ position: "relative", zIndex: 21, pointerEvents: "auto" }}
              >
                <span aria-hidden="true">&larr;</span> Back
              </button>
            </div>

            <div className="industry-carousel">
              <button
                type="button"
                className="industry-carousel__arrow industry-carousel__arrow--left"
                onClick={handleCarouselPrev}
                disabled={carouselIndex === 0}
                aria-label="Show previous card"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5 4L6.5 10L12.5 16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="industry-carousel__viewport" ref={carouselViewportRef}>
                <div className="industry-carousel__track" ref={carouselTrackRef}>
                  {activeChallenge.cards.map((card, cardIndex) => {
                    const cardNumber =
                      challengeCardOffsets[activeChallengeIndex] + cardIndex + 1;
                    return (
                      <div
                        className="industry-carousel__slot"
                        key={cardIndex}
                        ref={(el) => {
                          detailCardRefs.current[cardIndex] = el;
                        }}
                      >
                        <IndustryCard
                          card={card}
                          backgroundImage={getCardImage(slug, cardNumber)}
                          label={getCardLabel(card, cardIndex)}
                          isVideo={isVideoCard(card, cardIndex, activeCardsCount)}
                        />
                      </div>
                    );
                  })}
                  <div

  className="industry-carousel__slot"
  key="book-demo"
  ref={(el) => {
    detailCardRefs.current[activeChallenge.cards.length] = el;
  }}
>
  <div
    className="industry-card"
    style={{
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="industry-card__bg-overlay" />

    <div className="industry-card__placeholder">
      <span className="industry-card__placeholder-title">Book a Demo</span>
    </div>

    <div className="industry-card__detail">
      <span className="industry-card__detail-label">Book a Demo</span>
      <div className="industry-card__demo-btn-wrap">
        <button
          type="button"
          className="industry-card__demo-btn"
          onClick={openBookDemo}
        >
          Book a Demo <span>→</span>
        </button>
      </div>
    </div>
  </div>
</div>
                </div>
              </div>

              <button
                type="button"
                className="industry-carousel__arrow industry-carousel__arrow--right"
                onClick={() => handleCarouselNext(carouselMaxIndex)}
                disabled={carouselIndex === carouselMaxIndex}
                aria-label="Show next card"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7.5 4L13.5 10L7.5 16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="industry-carousel__dots">
              {Array.from({ length: carouselMaxIndex + 1 }).map((_, dotIndex) => (
                <button
                  type="button"
                  key={dotIndex}
                  className={`industry-carousel__dot${
                    carouselIndex === dotIndex ? " is-active" : ""
                  }`}
                  onClick={() => setCarouselIndex(dotIndex)}
                  aria-label={`Go to card position ${dotIndex + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  DESKTOP CARD (hover-driven overlay, plus optional video face)           */
/* ========================================================================== */
function IndustryCard({ card, backgroundImage, label, isVideo }) {
  return (
    <div
      className={`industry-card${isVideo ? " industry-card--video" : ""}`}
      tabIndex={0}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="industry-card__bg-overlay" />
      {isVideo && (
        <div className="industry-card__play" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.45)" />
            <path d="M26 20L46 32L26 44V20Z" fill="#fff" />
          </svg>
        </div>
      )}
      <div className="industry-card__placeholder">
        <span className="industry-card__placeholder-title">{card.title}</span>
      </div>
      <div className="industry-card__detail">
        {/* The label slot is always rendered (even if empty) so the title
            sits at the exact same vertical position on every card. */}
        <span
          className="industry-card__detail-label"
          style={{ visibility: label ? "visible" : "hidden" }}
        >
          {label || "\u00A0"}
        </span>
        <p className="industry-card__detail-text">{card.content}</p>
      </div>
    </div>
  );
}