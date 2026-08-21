import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./MobileIndustryLanding.css";
import { useBookDemoModal } from "../context/useBookDemoModal";

import realEstateVideo from "../assets/real-estate.mp4";
import bfsiVideo from "../assets/bfsi.mp4";
import travelVideo from "../assets/travel.mp4";
import healthVideo from "../assets/health.mp4";
import retailVideo from "../assets/Retail.mp4";
import automotiveVideo from "../assets/automotive.mp4";
import b2bVideo from "../assets/b2b.mp4";
import fashionVideo from "../assets/fashion.mp4";
import internalCommsVideo from "../assets/internal-comms.mp4";
import govtPoliticsVideo from "../assets/govt-politics.mp4";

/* --------------------------------------------------------------------------
 * Image lookups (shared prefix map for both card photos and problem photos)
 * -------------------------------------------------------------------------- */

const cardPhotos = {
  ...import.meta.glob("../card-photos/*.jpg", { eager: true, import: "default" }),
  ...import.meta.glob("../card-photos/*.png", { eager: true, import: "default" }),
};

/* Only needed when an industry's image-file prefix differs from its slug.
 * Anything not listed falls back to using the slug itself as the prefix,
 * so new industries work automatically as long as filenames match the slug. */
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

/* Hero background video per industry slug. Industries with no entry (or no
 * .mp4 asset yet) simply fall back to the `image` poster below — no
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
  "internal-communication": internalCommsVideo,
  "govt-politics": govtPoliticsVideo,
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

/* Dedicated background photo for the CTA slide, following the same
 * `{prefix}-...` naming convention as the other card/problem photos
 * (e.g. "real-cta.jpg"). Optional — if a given industry doesn't have one
 * yet, the caller falls back to the hero image so the slide still gets
 * the same full-bleed photo treatment as every other card. */
function getCtaImage(slug) {
  try {
    const prefix = getPrefix(slug);
    if (!prefix) return null;
    const png = `../card-photos/${prefix}-cta.png`;
    const jpg = `../card-photos/${prefix}-cta.jpg`;
    return cardPhotos[png] ?? cardPhotos[jpg] ?? null;
  } catch {
    return null;
  }
}

/* For each challenge, how many cards came before it across all prior
 * challenges — gives the correct global image number regardless of how many
 * challenges exist or how many cards are in each one. */
function getChallengeCardOffsets(challenges) {
  const offsets = [];
  let running = 0;
  for (const challenge of challenges) {
    offsets.push(running);
    running += Array.isArray(challenge?.cards) ? challenge.cards.length : 0;
  }
  return offsets;
}

/* A card is the "Video" card if the data marks it explicitly. Legacy
 * fallback: a challenge with exactly 5 cards treats the 3rd (index 2) as
 * video, matching the original fixed 5-card layout. */
function isVideoCard(card, cardIndexInChallenge, totalCardsInChallenge) {
  if (!card) return false;
  const type = (card.type || card.cardType || "").toString().toLowerCase();
  if (type === "video") return true;
  if (card.videoUrl || card.video) return true;
  if ((card.title || "").toLowerCase().includes("video")) return true;
  if (totalCardsInChallenge === 5 && cardIndexInChallenge === 2) return true;
  return false;
}

/* --------------------------------------------------------------------------
 * GlassArrowIcon
 *
 * Purely decorative (aria-hidden) minimal arrow rendered inside the glass
 * circle indicator. All floating/breathing motion, blur, and glow live in
 * CSS via `.mobile-challenge-card__indicator`; this just draws the glyph.
 * -------------------------------------------------------------------------- */
function GlassArrowIcon() {
  return (
    <svg
      className="mobile-challenge-card__indicator-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 16 16 8M16 8H9.5M16 8V14.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ==========================================================================
 * MOBILE-ONLY COMPONENTS
 * ========================================================================== */
function MobileIndustryLanding({
  slug,
  image, // used as the hero video's poster frame while it loads
  video, // optional explicit override for the hero video source
  heroTitle,
  heroDescription,
  challenges, // any number of { problem, cards: [...] }
}) {
  const navigate = useNavigate();
  const { openBookDemo } = useBookDemoModal();
  const [openChallengeIndex, setOpenChallengeIndex] = useState(null);
  const cardRefs = useRef({});

  const heroVideo = video || HERO_VIDEO_BY_SLUG[slug] || null;

  // Any number of challenges, each with any number of cards. Only falls
  // back to a single placeholder challenge if the data is missing/invalid.
  const safeChallenges =
    Array.isArray(challenges) && challenges.length > 0
      ? challenges
      : [{ problem: "Challenge 1", cards: [] }];

  const challengeCardOffsets = getChallengeCardOffsets(safeChallenges);

  const handleOpen = (i) => setOpenChallengeIndex(i);
  const handleClose = () => setOpenChallengeIndex(null);
  const selectedChallenge =
    openChallengeIndex !== null ? safeChallenges[openChallengeIndex] : null;

const handleBackToIndustries = () => {
  navigate("/#solutions");
};
  return (
    <div className="industry-landing industry-landing--mobile">
      {/* Hero */}
      <div className="industry-hero">
        <button
          type="button"
          className="industry-back-button"
          onClick={handleBackToIndustries}
        >
          <span className="industry-back-button__arrow" aria-hidden="true">
            ←
          </span>
          <span className="industry-back-button__label">Back to Industries</span>
        </button>

        {heroVideo && (
          <video
            className="industry-hero__video"
            src={heroVideo}
            poster={image}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        )}
        <div className="industry-hero__overlay" />
        <div className="industry-hero__content">
          <h1 className={`industry-hero__title industry-hero__title--${slug}`}>
            {heroTitle}
          </h1>
          <p className="industry-hero__description">{heroDescription}</p>
        </div>
      </div>

      {/* Challenge cards — any number, stacked vertically */}
      <div className="mobile-challenges">
        {safeChallenges.map((challenge, i) => {
          const n = i + 1;
          const bg = getProblemImage(slug, n);
          const hasImage = Boolean(bg);
          return (
            <button
              key={n}
              ref={(el) => (cardRefs.current[n] = el)}
              className={`mobile-challenge-card ${
                hasImage ? "mobile-challenge-card--image" : "mobile-challenge-card--blank"
              }`}
              onClick={() => handleOpen(i)}
              type="button"
              style={{
                ...(hasImage ? { backgroundImage: `url(${bg})` } : {}),
                "--card-index": i,
              }}
            >
              {hasImage && <span className="mobile-challenge-card__overlay" />}
              <span className="mobile-challenge-card__inner">
                <span className="mobile-challenge-card__label">Challenge {n}</span>
                <span className="mobile-challenge-card__problem">
                  {challenge.problem}
                </span>
                <span className="mobile-challenge-card__indicator">
                  <GlassArrowIcon />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selectedChallenge && (
        <MobileChallengeOverlay
          slug={slug}
          cards={selectedChallenge.cards}
          cardNumberOffset={challengeCardOffsets[openChallengeIndex]}
          originRefs={cardRefs}
          originKey={openChallengeIndex + 1}
          onClose={handleClose}
          fallbackImage={image}
          onBookDemo={openBookDemo}
        />
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Fullscreen "Instagram-style" overlay with GSAP open/close.
 * Every slide shows its full image + title + description immediately —
 * there is no intermediate preview state.
 *
 * A 6th synthetic "Book a Demo" CTA slide is always appended after the real
 * cards (`cards` from data stays untouched — the CTA is not part of the
 * data model). `totalSlides = cards.length + 1` drives dots / prev-next /
 * auto-advance / swipe clamping so the CTA participates in the exact same
 * scroll-snap carousel behavior as the first 5 cards.
 * -------------------------------------------------------------------------- */
function MobileChallengeOverlay({
  slug,
  cards,
  cardNumberOffset,
  originRefs,
  originKey,
  onClose,
  fallbackImage,
  onBookDemo,
}) {
  const scrimRef = useRef(null);
  const sheetRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // +1 for the synthetic CTA slide appended after the real cards.
  const totalSlides = cards.length + 1;

  // Dedicated CTA photo if one exists for this industry, else fall back to
  // the hero image so the CTA slide always gets the same full-bleed photo
  // treatment as the other cards — never a flat/plain background.
  const ctaBackgroundImage = getCtaImage(slug) ?? fallbackImage ?? null;

  /* Open animation from origin card */
  useLayoutEffect(() => {
    const scrim = scrimRef.current;
    const sheet = sheetRef.current;
    const track = trackRef.current;
    if (!sheet || !scrim) return;

    // Force a synchronous layout flush of the scroll-snap track BEFORE GSAP
    // applies any transform to its ancestor (the sheet). Each slide is
    // `flex: 0 0 100%` inside `.mobile-overlay__track` (overflow-x: auto +
    // scroll-snap-type: x mandatory). On first mount, mobile WebKit/Chrome
    // can compute those slide widths while the sheet is mid-transform,
    // collapsing every slide to ~0 width — the cards are in the DOM but
    // never painted. Reading offsetWidth here forces the browser to resolve
    // layout at the track's real (untransformed) size first, which fixes
    // the "cards missing on first open, fine on reopen" symptom without
    // touching the animation, timing, or design in any way.
    if (track) void track.offsetWidth;

    const ctx = gsap.context(() => {
      const originRect = originRefs.current[originKey]?.getBoundingClientRect();
      const vw = window.innerWidth;
      gsap.set(scrim, { autoAlpha: 0 });
      if (originRect) {
        const startScale = Math.max(originRect.width / vw, 0.6);
        gsap.set(sheet, {
          transformOrigin: `${originRect.left + originRect.width / 2}px ${
            originRect.top + originRect.height / 2
          }px`,
          scale: startScale,
          y: 24,
          autoAlpha: 0,
        });
      } else {
        gsap.set(sheet, { scale: 0.92, y: 24, autoAlpha: 0 });
      }
      gsap
        .timeline()
        .to(scrim, { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, 0)
        .to(sheet, { scale: 1, y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" }, 0);
    });
    return () => ctx.revert();
  }, [originRefs, originKey]);

  /* Close animation (reverse) */
  const runClose = () => {
    const scrim = scrimRef.current;
    const sheet = sheetRef.current;
    if (!sheet || !scrim) {
      onClose();
      return;
    }
    const originRect = originRefs.current[originKey]?.getBoundingClientRect();
    const vw = window.innerWidth;
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(
      sheet,
      {
        scale: originRect ? Math.max(originRect.width / vw, 0.6) : 0.92,
        y: 24,
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      0
    ).to(scrim, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0.05);
  };

  /* Swipe pagination tracking */
  const handleScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    const idx = Math.round(t.scrollLeft / t.clientWidth);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  const goToSlide = (i) => {
    const t = trackRef.current;
    if (!t) return;
    const clamped = Math.max(0, Math.min(i, totalSlides - 1));
    t.scrollTo({ left: clamped * t.clientWidth, behavior: "smooth" });
  };

  const handlePrev = () => goToSlide(activeIndex - 1);
  const handleNext = () => goToSlide(activeIndex + 1);

  const currentCard = cards[activeIndex];
  const currentIsVideo =
    activeIndex < cards.length &&
    isVideoCard(currentCard, activeIndex, cards.length);

  /* Auto-advance for normal (non-video) slides, including the CTA slide.
   * The Video card is intentionally excluded here — it advances only via
   * its own onEnded event (see handleVideoEnded / MobileIndustryCard),
   * so it plays out its full length (e.g. 18s) instead of cutting off
   * at a fixed 10s.
   * Keyed on activeIndex, so any manual navigation (swipe, arrows, dots)
   * — which all update activeIndex — automatically clears the previous
   * timer and starts a fresh one for the new slide. */
  useEffect(() => {
    if (totalSlides <= 1) return undefined;
    if (currentIsVideo) return undefined;

    const timer = setTimeout(() => {
      goToSlide((activeIndex + 1) % totalSlides);
    }, 10000);

    return () => clearTimeout(timer);
  }, [activeIndex, totalSlides, currentIsVideo]);

  /* Video-only advance: called from the active video card's onEnded.
   * Wraps around the same way the timer-based advance does. */
  const handleVideoEnded = () => {
    goToSlide((activeIndex + 1) % totalSlides);
  };

  /* Lock body scroll while open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="mobile-overlay" role="dialog" aria-modal="true">
      <div ref={scrimRef} className="mobile-overlay__scrim" onClick={runClose} />
      <div ref={sheetRef} className="mobile-overlay__sheet">
        <button
          type="button"
          className="mobile-overlay__close"
          onClick={runClose}
          aria-label="Close"
        >
          ×
        </button>

        <div ref={trackRef} className="mobile-overlay__track" onScroll={handleScroll}>
          {cards.map((card, i) => {
            const cardNumber = cardNumberOffset + i + 1;
            return (
              <div className="mobile-overlay__slide" key={i}>
                <MobileIndustryCard
                  card={card}
                  backgroundImage={getCardImage(slug, cardNumber)}
                  isVideo={isVideoCard(card, i, cards.length)}
                  isActive={i === activeIndex}
                  onVideoEnded={handleVideoEnded}
                />
              </div>
            );
          })}

          {/* 6th slide — premium "Book a Demo" CTA, identical for every
              industry/challenge. Not part of the data model. Uses the same
              full-bleed background image + overlay treatment as the other
              5 cards so it reads as a natural continuation, not a plain
              CTA section. */}
          <div className="mobile-overlay__slide" key="cta">
            <IndustryCTACard backgroundImage={ctaBackgroundImage} onBookDemo={onBookDemo} />
          </div>
        </div>

        {activeIndex > 0 && (
          <button
            type="button"
            className="mobile-overlay__nav mobile-overlay__nav--prev"
            onClick={handlePrev}
            aria-label="Previous"
          >
            ‹
          </button>
        )}
        {activeIndex < totalSlides - 1 && (
          <button
            type="button"
            className="mobile-overlay__nav mobile-overlay__nav--next"
            onClick={handleNext}
            aria-label="Next"
          >
            ›
          </button>
        )}

        <div className="mobile-overlay__dots">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`mobile-overlay__dot ${i === activeIndex ? "is-active" : ""}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Mobile card — reuses desktop card design. Background image/video, dark
 * overlay, title, and full description are all visible immediately; there
 * is no preview/reveal step.
 * -------------------------------------------------------------------------- */
function MobileIndustryCard({ card, backgroundImage, isVideo, isActive, onVideoEnded }) {
  // Video card: only thumbnail + play icon. No title / description ever.
  if (isVideo) {
    const videoSrc = card?.videoUrl || card?.video || null;
    return (
      <div
        className="industry-card industry-card--mobile industry-card--video"
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
        {/* Invisible driver for the onEnded-based auto-advance. Only
            mounted/playing while this is the active slide, so we don't
            play every video in the overlay at once. Purely functional —
            no visual change to the card; the thumbnail + play icon below
            are still the only things the user sees. */}
        {isActive && videoSrc && (
          <video
            key={videoSrc}
            src={videoSrc}
            autoPlay
            muted
            playsInline
            onEnded={onVideoEnded}
            style={{ display: "none" }}
          />
        )}
        <div className="industry-card__bg-overlay" />
        <div className="industry-card__play" aria-hidden="true">
          <svg viewBox="0 0 60 60" width="72" height="72">
            <circle cx="30" cy="30" r="30" fill="rgba(0,0,0,0.55)" />
            <polygon points="24,18 44,30 24,42" fill="#fff" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      className="industry-card industry-card--mobile"
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
      <div className="industry-card__detail">
        <h3 className="industry-card__detail-title">{card.title}</h3>
        <p className="industry-card__detail-text">{card.content}</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * CTA card — always the final slide in every challenge overlay.
 * Not part of the data model in industries.js — rendered synthetically so
 * the first 5 cards, their content, numbering, and image lookups stay
 * completely untouched.
 *
 * Deliberately mirrors MobileIndustryCard's structure 1:1 — same
 * `industry-card industry-card--mobile` shell, same full-bleed
 * `backgroundImage` treatment, same `.industry-card__bg-overlay` dark
 * overlay — so it reads as a natural 6th slide in the same photo carousel,
 * not a separate plain CTA section. Only the content layer swaps the
 * title/description for a centered "Book a Demo" CTA. Opens the shared
 * Book Demo modal via BookDemoModalContext (same as NavMenu.jsx) instead
 * of the old WhatsApp deep-link.
 * -------------------------------------------------------------------------- */
function IndustryCTACard({ backgroundImage, onBookDemo }) {
  return (
    <div
      className="industry-card industry-card--mobile industry-card--cta"
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
      <div className="industry-card__detail industry-card__detail--cta">
        <span className="industry-card__cta-eyebrow">Ready to see it in action?</span>
        <h3 className="industry-card__detail-title industry-card__cta-title">
          Let&apos;s build your first campaign
        </h3>
        <button
          type="button"
          className="book-demo-btn industry-card__cta-button"
          onClick={onBookDemo}
        >
          Book a Demo
        </button>
      </div>
    </div>
  );
}

export default MobileIndustryLanding;