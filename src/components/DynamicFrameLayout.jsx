// DynamicFrameLayout.jsx  ·  DESKTOP ONLY
import { useState, useCallback, useMemo, memo, useEffect, useRef } from "react";
import "./DynamicFrameLayout.css";
import { FaExpand, FaPlay, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import realEstateVideo from "../assets/real-estate.mp4";
import bfsiVideo from "../assets/bfsi.mp4";
import travelVideo from "../assets/travel.mp4";
import healthVideo from "../assets/health.mp4";
import retailVideo from "../assets/Retail.mp4";
import automotiveVideo from "../assets/automotive.mp4";
import b2bVideo from "../assets/b2b.mp4";
import fashionVideo from "../assets/fashion.mp4";
import internalCommsVideo from "../assets/internal-comms.mp4";

import realEstateImg from "../assets/real-estateimg.png";
import bfsiImg from "../assets/bfsi-img.png";
import travelImg from "../assets/travelimg.png";
import healthImg from "../assets/healthimg.png";
import retailImg from "../assets/Retailimg.png";
import automotiveImg from "../assets/automotiveimg.png";
import b2bImg from "../assets/b2bimg.png";
import fashionImg from "../assets/fashionimg.png";
import internalCommsImg from "../assets/internal-commsimg.png";
import govtPoliticsImg from "../assets/govt-politics.png";

const industries = [
  { name: "Real Estate",            video: realEstateVideo, image: realEstateImg,    className: "real-estate",            slug: "real-estate"            },
  { name: "BFSI",                   video: bfsiVideo,       image: bfsiImg,          className: "bfsi",                   slug: "bfsi"                   },
  { name: "Travel & Hospitality",   video: travelVideo,     image: travelImg,        className: "travel",                 slug: "travel"                 },
  { name: "Health & Wellness",      video: healthVideo,     image: healthImg,        className: "health",                 slug: "health"                 },
  { name: "Retail & D2C",           video: retailVideo,     image: retailImg,        className: "retail",                 slug: "retail"                 },
  { name: "Automotive",             video: automotiveVideo, image: automotiveImg,    className: "automotive",             slug: "automotive"             },
  { name: "B2B & SaaS",             video: b2bVideo,        image: b2bImg,           className: "saas",                   slug: "b2b"                    },
  { name: "Fashion & Lifestyle",    video: fashionVideo,    image: fashionImg,       className: "fashion",                slug: "fashion"                },
  { name: "Internal Communication", video: internalCommsVideo,            image: internalCommsImg, className: "internal-communication", slug: "internal-communication" },
  { name: "Govt & Politics",        video: null,            image: govtPoliticsImg,  className: "govt-politics",          slug: "govt-politics"          },
];

const getPos = (index) => ({ row: Math.floor(index / 3), col: index % 3 });

/* ── Letter-eraser hook (hover title effect) ──────────────── */
function useLetterErase(fullText, active) {
  // Number of leading letters erased so far; only meaningful while active.
  const [erased, setErased] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    timerRef.current = setInterval(() => {
      setErased((n) => n + 1);
    }, 40);
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setErased(0);
    };
  }, [active, fullText]);

  return active ? fullText.slice(erased) : fullText;
}

/* ============================================================
   DESKTOP CARD  ·  unchanged behavior
   ============================================================ */
const IndustryCard = memo(function IndustryCard({
  industry, index, isHovered, isDimmed, setHovered, onCardClick,
}) {
  // eslint-disable-next-line no-unused-vars
  const displayedName = useLetterErase(industry.name, isHovered);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHovered) {
      v.muted = true;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }, [isHovered]);

  const bgStyle = useMemo(
    () => ({ backgroundImage: `url(${industry.image})` }),
    [industry.image]
  );

  const handleEnter = useCallback(() => setHovered(index), [index, setHovered]);
  const handleLeave = useCallback(() => setHovered(null), [setHovered]);
  const handleClick = useCallback(() => onCardClick(index), [index, onCardClick]);

  const cardClass =
    `dfl-card ${industry.className}` +
    (isHovered ? " is-hovered" : "") +
    (isDimmed ? " is-dimmed" : "");

  return (
    <div
      className={cardClass}
      style={bgStyle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {industry.video && (
        <video
          ref={videoRef}
          className={`dfl-video${isHovered ? " dfl-video--visible" : ""}`}
          src={industry.video}
          muted loop playsInline preload="auto" disablePictureInPicture
        />
      )}
      <div className="dfl-overlay" />
      <div className={`dfl-controls${isHovered ? " dfl-controls--visible" : ""}`}>
        <button className="dfl-ctrl-btn" aria-label="Expand"><FaExpand size={10} /></button>
        <button className="dfl-ctrl-btn" aria-label="Play"><FaPlay size={10} /></button>
        <button className="dfl-ctrl-btn" aria-label="Open"><FaExternalLinkAlt size={10} /></button>
      </div>
      <div className="dfl-title-block">
        <h3 className="dfl-name">{industry.name}</h3>
        <div className="dfl-sep" />
      </div>
    </div>
  );
});

/* ============================================================
   ROOT  ·  DESKTOP ONLY
   ============================================================ */
export default function DynamicFrameLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [renderedPath, setRenderedPath] = useState(location.pathname);

  // Reset the expanded/hovered card whenever this route becomes active again.
  // Fixes: navigating to an Industry page and back left the grid showing the
  // previously hovered/clicked card's expanded layout instead of the default
  // 3x3 grid, because `hovered` is component state that survives if this
  // component stays mounted across the route change.
  if (renderedPath !== location.pathname) {
    setRenderedPath(location.pathname);
    setHovered(null);
  }

  const { colTemplate, rowTemplate } = useMemo(() => {
    if (hovered === null) return { colTemplate: "repeat(3, 1fr)", rowTemplate: "repeat(3, 1fr)" };
    const { row: hRow, col: hCol } = getPos(hovered);
    return {
      colTemplate: [0, 1, 2].map(c => c === hCol ? "2.1fr" : "0.7fr").join(" "),
      rowTemplate: [0, 1, 2].map(r => r === hRow ? "2.1fr" : "0.7fr").join(" "),
    };
  }, [hovered]);

  const gridStyle = useMemo(
    () => ({ gridTemplateColumns: colTemplate, gridTemplateRows: rowTemplate }),
    [colTemplate, rowTemplate]
  );

  const handleCardClick = useCallback((index) => {
    navigate(`/industry/${industries[index].slug}`);
  }, [navigate]);

  return (
    <div className="dfl-grid" style={gridStyle}>
      {industries.map((industry, index) => (
        <IndustryCard
          key={industry.slug}
          industry={industry}
          index={index}
          isHovered={hovered === index}
          isDimmed={hovered !== null && hovered !== index}
          setHovered={setHovered}
          onCardClick={handleCardClick}
        />
      ))}
    </div>
  );
}