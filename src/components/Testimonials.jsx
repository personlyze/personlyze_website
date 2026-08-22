import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import "./Testimonials.css";

const testimonials = [
  {
    quote:
      "Everyone buys MarTech stacks, but Personlyze AI gets the order right: first strategy, then technology.",
    title: "Strategy before technology.",
    name: "Chief Marketing Officer",
    position: "CMO",
    company: "Leading Real Estate Brand",
    initials: "C",
    bg: "#dbdce8",
    dark: false,
  },
  {
    quote:
      "Unlike black-box algorithmic firms, Personlyze AI has strategists, creators and techies in the room at every step.",
    title: "Humans in the room, always.",
    name: "VP Marketing",
    position: "VP Marketing",
    company: "B2B SaaS company",
    initials: "V",
    bg: "#aaa3b4",
    dark: false,
  },
  {
    quote:
      "Personlyze AI prioritizes the person - personas, journeys, and mapping - before applying any targeting rules.",
    title: "The person comes first.",
    name: "Chief Business Officer",
    position: "Head of Brand",
    company: "Fortune 500 company",
    initials: "H",
    bg: "#463848",
    dark: true,
  },
  {
    quote:
      "Finally, someone that treats personalization as a strategic discipline rather than just a tech feature. Thank you, Personlyze AI.",
    title: "Personalization as a discipline.",
    name: "Head of Growth",
    position: "Head of Growth",
    company: "Retail/D2C Startup",
    initials: "G",
    bg: "#976775",
    dark: true,
  },
  {
    quote:
      "Personlyze AI doesn't outsource everything to algorithms; They offer rigorous, human-led strategies that start with the customer, not the campaign.",
    title: "Human-led, never automated judgment.",
    name: "Chief Revenue Officer",
    position: "CXO",
    company: "Major Hotel Chain",
    initials: "C",
    bg: "#c8c1cf",
    dark: false,
  },
];

const AUTOPLAY_DELAY = 10000;
const SWIPE_THRESHOLD = 50;

export default function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = testimonials.length;

  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const autoplayRef = useRef(null);

  const goTo = useCallback(
    (index) => {
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  /* =========================================================
     AUTOPLAY
     ========================================================= */

  useEffect(() => {
    if (isPaused) return undefined;

    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, AUTOPLAY_DELAY);

    return () => {
      clearInterval(autoplayRef.current);
    };
  }, [isPaused, total]);

  /* =========================================================
     MOBILE SWIPE
     ========================================================= */

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;

    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current =
      e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      goPrev();
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      goNext();
    }

    touchDeltaX.current = 0;

    setTimeout(() => {
      setIsPaused(false);
    }, 300);
  };

  /* =========================================================
     DESKTOP CARD INDEXES
     ========================================================= */

  const previousIndex =
    (activeIndex - 1 + total) % total;

  const nextIndex =
    (activeIndex + 1) % total;

  const current = testimonials[activeIndex];

  return (
    <section className="testimonials-section">

      {/* HEADER */}
      <div className="testimonials-header">
        <h2 className="testimonials-heading">
          Trusted by industry leaders
        </h2>
      </div>

      {/* TESTIMONIAL STAGE */}
      <div className="testimonial-stage">
        <div
          className="testimonial-phones"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >

          {/* DESKTOP LEFT CARD */}
          <div
            className="desktop-testimonial-card desktop-testimonial-card--side desktop-testimonial-card--left"
            onClick={goPrev}
          >
            <PhoneCard item={testimonials[previousIndex]} />
          </div>

          {/* DESKTOP CENTER CARD */}
          <div className="desktop-testimonial-card desktop-testimonial-card--center">
            <PhoneCard item={current} />
          </div>

          {/* DESKTOP RIGHT CARD */}
          <div
            className="desktop-testimonial-card desktop-testimonial-card--side desktop-testimonial-card--right"
            onClick={goNext}
          >
            <PhoneCard item={testimonials[nextIndex]} />
          </div>

          {/* MOBILE CARD */}
          <div
            className="phone-slot phone-slot-primary"
            key={activeIndex}
          >
            <PhoneCard item={current} />
          </div>

          {/* PREVIOUS BUTTON */}
          <button
            type="button"
            className="testimonial-nav-btn testimonial-nav-prev"
            onClick={goPrev}
            aria-label="Previous testimonial"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* NEXT BUTTON */}
          <button
            type="button"
            className="testimonial-nav-btn testimonial-nav-next"
            onClick={goNext}
            aria-label="Next testimonial"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

        </div>

        {/* DOTS */}
        <div className="testimonial-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`testimonial-dot ${
                i === activeIndex ? "is-active" : ""
              }`}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}

/* =========================================================
   TESTIMONIAL CARD
   ========================================================= */

function PhoneCard({ item }) {
  return (
    <article
      className={`phone-card${item.dark ? " phone-card--on-dark" : ""}`}
      style={{ backgroundColor: item.bg }}
    >
      <div className="phone-card-content">
        {item.title && (
          <h3 className="phone-card-title">
            {item.title}
          </h3>
        )}

        <p className="phone-card-quote">
          “{item.quote}”
        </p>
      </div>

      <div className="phone-divider" />

      <div className="phone-author">
        <div className="phone-avatar">
          {item.initials}
        </div>

        <div className="phone-author-text">
          <span className="phone-author-name">
            {item.name}
          </span>

          <span className="phone-author-role">
            {item.company}
          </span>
        </div>

        {item.tag && (
          <span className="phone-tag">
            {item.tag}
          </span>
        )}
      </div>
    </article>
  );
}