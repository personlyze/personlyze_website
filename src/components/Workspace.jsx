import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Workspace.css";
import workspaceImg from "../assets/workspace.webp";
import workspaceMobileImg from "../assets/workspace-mobile.jpeg";
import { useBookDemoModal } from "../context/BookDemoModalContext";

gsap.registerPlugin(ScrollTrigger);

const YOUTUBE_ID = "qPMJL64Qvq0";
const YOUTUBE_WATCH_URL = "https://youtu.be/qPMJL64Qvq0?feature=shared";
const MOBILE_MP4_SRC =
  "https://res.cloudinary.com/t4s8m2hn/video/upload/v1784788885/Personlyze_AI_-_Intro_9_16_1_ndznph.mp4";
const MOBILE_BREAKPOINT = "(max-width: 640px)";

export default function Workspace() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const videoRef = useRef(null); // outer container — GSAP fade target + IntersectionObserver target (mobile + desktop)
  const mp4Ref = useRef(null); // mobile inline <video> element — unchanged
  const desktopIframeRef = useRef(null); // desktop YouTube <iframe> element
  const desktopPlayerRef = useRef(null); // YT.Player instance bound to desktopIframeRef

  const [modalOpen, setModalOpen] = useState(false);
  const { openBookDemo } = useBookDemoModal();

  /* ── Mobile-only state (UNCHANGED) ──────────────────────────────
     Screen 3 (video) is fully manual:
       isPlaying === false → poster/cover image + centered transparent
                              play button are shown, video is paused.
       isPlaying === true  → cover fades out, video plays.
     There is no auto-play and no timer anywhere in this component —
     the user is always the one who starts playback. ── */
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_BREAKPOINT).matches
  );
  const [isPlaying, setIsPlaying] = useState(false);

  /* ── Desktop-only state ─────────────────────────────────────────
     Mirrors the mobile inline-video state above, one-for-one, but the
     desktop stage now plays the real YouTube video
     (https://youtu.be/qPMJL64Qvq0) through the official YouTube
     IFrame Player API instead of a local mp4. Same rules apply:
     isDesktopPlaying === false → poster/cover image + centered
     transparent play button; true → cover fades out, YouTube player
     plays. Resuming after a pause is always a manual click. ── */
  const [isDesktopPlaying, setIsDesktopPlaying] = useState(false);

  /* ── GSAP entrance + word-by-word scroll reveal (unchanged) ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headingRef.current?.querySelectorAll(".reveal-word") ?? [];
      const aiSpans = headingRef.current?.querySelectorAll(".workspace-ai") ?? [];

      if (words.length) {
        gsap.set(words, {
          color: "#CFCFCF",
          willChange: "color",
        });
      }

      if (aiSpans.length) {
        gsap.set(aiSpans, {
          color: "#CFCFCF",
          willChange: "color",
        });
      }

      if (videoRef.current && sectionRef.current) {
        gsap.fromTo(
          videoRef.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
              end: "top 55%",
              scrub: 1,
            },
          }
        );
      }

      if (sectionRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 15%",
            scrub: 1,
          },
        });

        words.forEach((word, i) => {
          tl.to(
            word,
            {
              color: "#111111",
              duration: 1,
              ease: "none",
            },
            i === 0 ? 0 : "-=0.25"
          );

          const aiSpan = word.querySelector(".workspace-ai");
          if (aiSpan) {
            tl.to(
              aiSpan,
              {
                color: "#d10000",
                duration: 1,
                ease: "none",
              },
              "<"
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Close modal on Escape (unchanged — modal is mobile-only now) ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Track mobile breakpoint ── */
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);
    const handler = (e) => setIsMobile(e.matches);
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, []);

  /* ── Auto-pause the mobile video whenever it scrolls (mostly) out
     of view. UNCHANGED. ── */
  useEffect(() => {
    if (!isMobile) return undefined;

    const node = videoRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) {
          setIsPlaying((wasPlaying) => {
            if (wasPlaying && mp4Ref.current) {
              mp4Ref.current.pause();
            }
            return false;
          });
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobile]);

  /* ── Load the YouTube IFrame Player API (desktop only) and bind it
     to the desktop iframe once it's ready. This gives us real
     playVideo()/pauseVideo() control plus an onStateChange callback,
     instead of relying on the iframe's own (hidden) native controls. ── */
  useEffect(() => {
    if (isMobile) return undefined;

    let cancelled = false;

    const initPlayer = () => {
      if (cancelled || !desktopIframeRef.current) return;
      if (!window.YT || !window.YT.Player) return;

      desktopPlayerRef.current = new window.YT.Player(desktopIframeRef.current, {
        events: {
          onStateChange: (event) => {
            if (!window.YT) return;
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsDesktopPlaying(false);
              if (desktopPlayerRef.current) {
                desktopPlayerRef.current.seekTo(0, true);
              }
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsDesktopPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsDesktopPlaying(false);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      if (!document.getElementById("youtube-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousCallback === "function") previousCallback();
        initPlayer();
      };
    }

    return () => {
      cancelled = true;
      if (desktopPlayerRef.current && typeof desktopPlayerRef.current.destroy === "function") {
        desktopPlayerRef.current.destroy();
      }
      desktopPlayerRef.current = null;
    };
  }, [isMobile]);

  /* ── Auto-pause the desktop YouTube player whenever it scrolls
     (mostly) out of view — same rule as mobile above. Re-checks on
     every visibility change, only ever pauses; resuming is always a
     manual click on the transparent play/pause button. ── */
  useEffect(() => {
    if (isMobile) return undefined;

    const node = videoRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) {
          setIsDesktopPlaying((wasPlaying) => {
            if (wasPlaying && desktopPlayerRef.current) {
              desktopPlayerRef.current.pauseVideo();
            }
            return false;
          });
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobile]);

  /* ── Pause inline video while the (mobile-only) modal is open. ── */
  useEffect(() => {
    if (!isMobile || !mp4Ref.current) return;
    if (modalOpen && isPlaying) {
      mp4Ref.current.pause();
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, isMobile]);

  /* ── When the mobile clip finishes naturally, reset to the
     poster/cover state instead of holding on the last frame.
     UNCHANGED. ── */
  useEffect(() => {
    const el = mp4Ref.current;
    if (!isMobile || !el) return undefined;

    const onEnded = () => {
      setIsPlaying(false);
      el.currentTime = 0;
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, [isMobile]);

  /* ── Direct, gesture-synchronous play/pause toggle for the mobile
     mp4. UNCHANGED. ── */
  const toggleMobilePlayback = (e) => {
    if (e) e.stopPropagation();
    const el = mp4Ref.current;
    if (!el) return;

    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => setIsPlaying(false));
      }
      setIsPlaying(true);
    }
  };

  /* ── Play/pause toggle for the desktop YouTube player, driven
     through the IFrame API instead of a local <video> element. ── */
  const toggleDesktopPlayback = (e) => {
    if (e) e.stopPropagation();
    const player = desktopPlayerRef.current;
    if (!player) return;

    if (isDesktopPlaying) {
      player.pauseVideo();
      setIsDesktopPlaying(false);
    } else {
      player.playVideo();
      setIsDesktopPlaying(true);
    }
  };

  const openModal = (e) => {
    if (e) e.stopPropagation();
    setModalOpen(true);
  };

  /* ── Book a Demo → same WhatsApp deep link used site-wide (Hero /
     Footer), so the action is identical everywhere. ── */
const handleBookDemo = () => {
  openBookDemo();
};
  return (
    <>
      <section className="workspace-section" ref={sectionRef}>
        {/* ══════════════════ Screen 1 — "Who We Are" ══════════════════
            Unchanged. */}
        <section
          id="workspace-screen-1"
          className={`workspace-title${isMobile ? " mobile-whoweare-card" : " desktop-whoweare-screen"}`}
        >
          <div className="workspace-heading" ref={headingRef}>
            <p className="heading-statement">
              <span className="reveal-word">We</span>{" "}
              <span className="reveal-word">are</span>{" "}
              <span className="reveal-word">your</span>{" "}
              <span className="reveal-word">strategy-first,</span>{" "}
              <span className="reveal-word">AI-powered,</span>{" "}
              <span className="reveal-word">personalization</span>{" "}
              <span className="reveal-word">partner.</span>
            </p>

            <p className="heading-support">
              <span className="reveal-word">We</span>{" "}
              <span className="reveal-word">build</span>{" "}
              <span className="reveal-word">and</span>{" "}
              <span className="reveal-word">scale</span>{" "}
              <span className="reveal-word">marketing,</span>{" "}
              <span className="reveal-word">communication</span>{" "}
              <span className="reveal-word">and</span>{" "}
              <span className="reveal-word">content</span>{" "}
              <span className="reveal-word">for</span>{" "}
              <span className="reveal-word">businesses</span>{" "}
              <span className="reveal-word">and</span>{" "}
              <span className="reveal-word">brands</span>{" "}
              <span className="reveal-word">around</span>{" "}
              <span className="reveal-word">the</span>{" "}
              <span className="reveal-word">world.</span>{" "}
              <span className="reveal-word">From</span>{" "}
              <span className="reveal-word">customer</span>{" "}
              <span className="reveal-word">strategy</span>{" "}
              <span className="reveal-word">to</span>{" "}
              <span className="reveal-word">production</span>{" "}
              <span className="reveal-word">to</span>{" "}
              <span className="reveal-word">deployment—</span>{" "}
              <span className="reveal-word">we</span>{" "}
              <span className="reveal-word">run</span>{" "}
              <span className="reveal-word">the</span>{" "}
              <span className="reveal-word">entire</span>{" "}
              <span className="reveal-word">process</span>{" "}
              <span className="reveal-word">end-to-end.</span>
            </p>
          </div>

          {isMobile ? (
            <button
              type="button"
              className="mobile-book-demo-btn"
              onClick={handleBookDemo}
            >
              Book a Demo
            </button>
          ) : (
            <button
              type="button"
              className="desktop-book-demo-btn"
              onClick={handleBookDemo}
            >
              Book a Demo
            </button>
          )}
        </section>

        {isMobile ? (
          /* ══════════════════ Screen 3 — MOBILE VIDEO (UNCHANGED) ══════════════════
             Full-viewport stage, local mp4, poster/cover, modal — exactly
             as before. ─── */
          <div
            id="workspace-screen-2"
            className="workspace-video mobile-video-stage"
            ref={videoRef}
            onClick={toggleMobilePlayback}
            role="button"
            aria-label={isPlaying ? "Pause video" : "Play platform walkthrough video"}
          >
            <div
              className={`mobile-cover-wrap${isPlaying ? " is-fading-out" : ""}`}
              aria-hidden={isPlaying}
            >
              <img
                src={workspaceMobileImg}
                alt="Workspace"
                className="workspace-video-media"
              />
            </div>

            <video
              ref={mp4Ref}
              className="mobile-inline-video"
              src={MOBILE_MP4_SRC}
              playsInline
              preload="metadata"
            />

            <button
              type="button"
              className="mobile-playpause-btn"
              onClick={toggleMobilePlayback}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <polygon points="6,4 20,12 6,20" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="glass-pill youtube-btn mobile-youtube-btn"
              onClick={openModal}
            >
              <svg viewBox="0 0 28 20" className="youtube-icon" aria-hidden="true">
                <rect x="0" y="0" width="28" height="20" rx="6" fill="#FF0000" />
                <polygon points="11,6 20,10 11,14" fill="#fff" />
              </svg>
              Watch on YouTube
            </button>
          </div>
        ) : (
          /* ══════════════════ DESKTOP — Screen 2, full 100vh YouTube stage ══════════════════
             Poster/cover shows until the user clicks the transparent
             centered play/pause button (or the stage itself), at which
             point the real YouTube embed (youtu.be/qPMJL64Qvq0) plays
             inline via the IFrame API. Scrolling the stage out of view
             auto-pauses it; resuming is always a manual click. The
             "Watch on YouTube" pill, bottom-right, now opens the video
             on youtube.com in a new tab instead of the modal. ── */
          <div
            id="workspace-screen-2"
            className="workspace-video desktop-video-screen"
            ref={videoRef}
            onClick={toggleDesktopPlayback}
            role="button"
            aria-label={isDesktopPlaying ? "Pause video" : "Play platform walkthrough video"}
          >
            <div
              className={`desktop-cover-wrap${isDesktopPlaying ? " is-fading-out" : ""}`}
              aria-hidden={isDesktopPlaying}
            >
              <picture>
                <source
                  media="(max-width: 640px)"
                  srcSet={workspaceMobileImg}
                />

                <img
                  src={workspaceImg}
                  alt="Workspace"
                  className="workspace-video-media"
                />
              </picture>
            </div>

            <iframe
              ref={desktopIframeRef}
              className="desktop-inline-iframe"
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?enablejsapi=1&playsinline=1&rel=0&modestbranding=1&controls=0${
                typeof window !== "undefined"
                  ? `&origin=${window.location.origin}`
                  : ""
              }`}
              title="Personlyze Platform Demo"
              allow="autoplay; encrypted-media"
              frameBorder="0"
            />

            <button
              type="button"
              className="desktop-playpause-btn"
              onClick={toggleDesktopPlayback}
              aria-label={isDesktopPlaying ? "Pause video" : "Play video"}
            >
              {isDesktopPlaying ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <polygon points="6,4 20,12 6,20" />
                </svg>
              )}
            </button>

            <a
              href={YOUTUBE_WATCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill youtube-btn desktop-youtube-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <svg viewBox="0 0 28 20" className="youtube-icon" aria-hidden="true">
                <rect x="0" y="0" width="28" height="20" rx="6" fill="#FF0000" />
                <polygon points="11,6 20,10 11,14" fill="#fff" />
              </svg>
              Watch on YouTube
            </a>
          </div>
        )}
      </section>

      {/* Modal is mobile-only now — desktop's "Watch on YouTube" opens
          youtube.com directly instead. */}
      {modalOpen && (
        <div
          className="video-modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="video-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close video"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`}
              title="Personlyze Platform Demo"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}