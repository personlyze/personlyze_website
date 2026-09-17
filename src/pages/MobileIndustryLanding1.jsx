import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./MobileIndustryLanding.css";
import { useBookDemoModal } from "../context/BookDemoModalContext";

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
  ...import.meta.glob("../card-photos/*.webp", { eager: true, import: "default" }),
  ...import.meta.glob("../card-photos/*.webp", { eager: true, import: "default" }),
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
  const key = `../card-photos/\({prefix}-card-\){cardNumber}.webp`;
  return cardPhotos[key] ?? null;
}

function getProblemImage(slug, challengeNumber) {
  try {
    const prefix = getPrefix(slug);
    if (!prefix) return null;
    const png = `../card-photos/\({prefix}-problem\){challengeNumber}.webp`;
    const jpg = `../card-photos/\({prefix}-problem\){challengeNumber}.webp`;
    return cardPhotos[png] ?? cardPhotos[jpg] ?? null;
  } catch {
    return null;
  }
}

/* Dedicated background photo for the CTA slide, following the same
 * `{prefix}-...` naming convention as the other card/problem photos
 * (e.g. "real-cta.webp"). Optional — if a given industry doesn't have one
 * yet, the caller falls back to the hero image so the slide still gets
 * the same full-bleed photo treatment as every other card. */
function getCtaImage(slug) {
  try {
    const prefix = getPrefix(slug);
    if (!prefix) return null;
    const png = `../card-photos/${prefix}-cta.webp`;
    const jpg = `../card-photos/${prefix}-cta.webp`;
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
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
    </svg>
  );