import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    question: "What is Personlyze AI?",
    answer:
      "Personlyze is a strategy-first, AI-powered, hyper-personalization service that helps B2C and B2B brands understand their customers deeply and market to them with precision. Our domain experts masterfully combine strategy, creative, and technology to turn generic marketing into communication, content and experiences tailored to real buyer behavior.",
  },
  {
    question: "What is the CLASS Framework?",
    answer:
      'CLASS ("Customer Lifecycle Analysis for Strategy and Scale") is our proprietary methodology for building rich, decision-ready customer personas, going beyond demographics to map how people actually think, decide, and buy. It is the foundation for every persona, journey map, strategy and creative we develop.',
  },
  {
    question: "How does a typical engagement work?",
    answer:
      "We work in the following inter-dependent phases: \n 0. CLASS Workshop (onboarding and pre-prep); \n 1. STRATEGY (understanding your customers and market), \n 2. DESIGN (building personas, messaging, and campaign concepts), and \n 3. ARITIFICIAL INTELLIGENCE (personalization scaling with technology, deployment and optimization). Clients can engage us for one phase or the full journey.",
  },
  {
    question: "Do you build your own technology, or use existing tools?",
    answer:
      "The Strategy and Creative milestones are entirely led by our domain experts. Certain parts of the engagement are offered as a managed-service model using best-in-class execution partners. This gives clients proven solutions today without waiting on a product roadmap. Important to note that, at every stage of the engagement, the end-to-end ownership lies with Personlyze AI.",
  },
  {
    question: "What markets do you serve?",
    answer:
      "We offer strategic personalization to clients across India, Middle East, US and Canada, bringing deep cultural and linguistic context to each market - from vernacular strategy in India to region-specific buyer dynamics elsewhere.",
  },
  {
    question: "What industries do you work with?",
    answer:
      "We deliver strategy-first personalization to partners across Real estate, BFSI & Finance, Automotive & Mobility, Retail & D2C, Health & Wellness, Travel & Hospitality, B2B & SaaS, Fashion & Lifestyle among several other consumer-facing industries where understanding the buyer's decision journey drives revenue. This is addition to category-agnostic  Internal Communication mandates across geographies.Explore our Services section for more details.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "We offer three engagement models:\n1. Phase-Gated (pay as each phase completes),\n2. Packaged Project Fee (fixed scope and fixed price), and \n3. Retainer + Variable (ongoing partnership with performance-based components). Pricing is available in multiple currencies including USD, AED, and INR.",
  },
  {
    question: "What do we get at the end of a persona/strategy engagement?",
    answer:
      "Our clients typically receive detailed buyer personas, a decision journey maps for each persona, comparative market analysis, and a market-ready narrative/assets designed to plug directly into your sales and marketing execution.",
  },
  {
    question: "How long does an engagement take?",
    answer:
      "Timelines vary depending on the scope, but most Strategy-phase deliverables, including personas and journey mapping, are completed within 4–6 weeks. Followed by design & development of master  assets, which would take another 4 weeks. Lastly, there's scaling, deployment that happens over 2-3 weeks. Every timeline is personalized based on your business goals.",
  },
  {
    question: "How do we get started?",
    answer:
      "Simply book a demo or contact us for an initial consultation. We'll understand your goals, recommend the right engagement model, and outline the next steps.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  const renderFaqItem = (item, index) => {
    const isOpen = openIndex === index;
    return (
      <div key={index} className={`faq-item ${isOpen ? "is-open" : ""}`}>
        <button
          type="button"
          className="faq-question"
          onClick={() => handleToggle(index)}
          aria-expanded={isOpen}
        >
          <span className="faq-question-left">
            <span className="faq-badge" aria-hidden="true">
              {isOpen ? "−" : "+"}
            </span>
            <span className="faq-question-text">{item.question}</span>
          </span>
          <span className="faq-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <div className="faq-answer-wrapper">
          <div className="faq-answer-inner">
            <p className="faq-answer">{item.answer}</p>
          </div>
        </div>
      </div>
    );
  };

  // Same 10 items, same order — only split in two for the desktop
  // 2-column grid. On mobile/tablet this split is invisible: the
  // wrapper columns collapse via `display: contents`, so questions
  // still render as one continuous stack in original order.
  const midpoint = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, midpoint);
  const rightColumn = faqs.slice(midpoint);

  return (
    <section className="faq-section">
      <div className="faq-inner">
        <div className="faq-top">
          <div className="faq-intro">
            <span className="faq-eyebrow">FAQ</span>

            {/* Desktop-only heading (hidden on mobile/tablet via CSS) */}
            <h2 className="faq-heading">Everything you need to know</h2>

            <p className="faq-subtext">
              Everything you need to know before starting a project with us.
              Can&rsquo;t find your answer? Reach out any time.
            </p>
          </div>

          {/* Desktop-only illustration (hidden on mobile/tablet via CSS) */}
          <div className="faq-illustration" aria-hidden="true">
            <div className="faq-illustration-dots" />
            <div className="faq-illustration-ring" />
            <div className="faq-illustration-platform">
              <div className="faq-bubble faq-bubble-main">
                <span>?</span>
              </div>
              <div className="faq-bubble faq-bubble-small">
                <span className="faq-bubble-dot" />
                <span className="faq-bubble-dot" />
                <span className="faq-bubble-dot" />
              </div>
            </div>
          </div>
        </div>

        <div className="faq-list">
          <div className="faq-list-col">
            {leftColumn.map((item, i) => renderFaqItem(item, i))}
          </div>
          <div className="faq-list-col">
            {rightColumn.map((item, i) => renderFaqItem(item, i + midpoint))}
          </div>
        </div>
      </div>
    </section>
  );
}