import { useState, useEffect } from "react";
import { useBookDemoModal } from "../context/useBookDemoModal";
import "./Footer.css";

const SOCIALS = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/personlyze-ai/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.9 8.65 22 10.6 22 13.9V21h-4v-6.3c0-1.5-.54-2.53-1.9-2.53-1.03 0-1.64.7-1.91 1.37-.1.24-.12.58-.12.92V21h-4V9z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/19NdEKAcUf/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0022 12z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/personlyze.ai",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.8 3.8 0 01-1.38-.9 3.8 3.8 0 01-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5.01-4.73.07-.94.04-1.4.2-1.72.32-.34.13-.58.29-.83.54-.25.25-.41.49-.54.83-.13.33-.28.78-.32 1.72C3.8 8.5 3.8 8.86 3.8 12s.01 3.5.07 4.73c.04.94.2 1.4.32 1.72.13.34.29.58.54.83.25.25.49.41.83.54.33.13.78.28 1.72.32 1.23.06 1.59.07 4.72.07s3.5-.01 4.73-.07c.94-.04 1.4-.2 1.72-.32.34-.13.58-.29.83-.54.25-.25.41-.49.54-.83.13-.33.28-.78.32-1.72.06-1.23.07-1.59.07-4.73s-.01-3.5-.07-4.73c-.04-.94-.2-1.4-.32-1.72a2.2 2.2 0 00-.54-.83 2.2 2.2 0 00-.83-.54c-.33-.13-.78-.28-1.72-.32C15.5 4.01 15.14 4 12 4zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 1.8a3.1 3.1 0 100 6.2 3.1 3.1 0 000-6.2zm5.15-2.1a1.15 1.15 0 110 2.3 1.15 1.15 0 010-2.3z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/NitinSh71963305",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.96 6.82H1.69l7.5-8.58L1.03 2.25H7.85l4.9 6.47 5.49-6.47zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64z" />
      </svg>
    ),
  },
];

const PRIVACY_POLICY = {
  title: "Privacy Policy",
  meta: "Effective Date: August 2026",
  sections: [
    {
      body: [
        'Personlyze AI ("we," "us," "our") values your privacy. This Privacy Policy explains how we collect, use, and protect information when you use our website https://personlyze.ai and our services, including integrations with Meta (Facebook and Instagram).',
      ],
    },
    {
      heading: "1. Information We Collect",
      body: ["We may collect and process the following types of information:"],
      list: [
        "Contact Data — name, email address, company details submitted via forms or onboarding.",
        "Usage Data — pages visited, time on site, browser type, IP address.",
        "Communication Data — responses to campaigns, emails, or support requests.",
        "Payment Data — billing and transaction details when applicable.",
      ],
      afterBody: ["Meta Platform Data: If you connect your Facebook or Instagram account, we may collect:"],
      afterList: [
        "Page name, page ID, and associated metadata",
        "Instagram account ID and profile information",
        "Content data such as posts, comments, insights, and engagement metrics",
        "Advertising data including campaign performance and analytics",
      ],
      footer: ["We only collect data necessary to provide and improve our services."],
    },
    {
      heading: "2. How We Use Information",
      body: ["We use collected data to:"],
      list: [
        "Provide, operate, and improve our services",
        "Create and manage marketing campaigns",
        "Analyze performance and generate insights",
        "Communicate with users (updates, support, notifications)",
        "Comply with legal obligations",
      ],
      footer: ["We do not sell your personal data to third parties."],
    },
    {
      heading: "3. How We Share Information",
      body: ["We may share data with:"],
      list: [
        "Service providers (hosting, analytics, infrastructure)",
        "Meta Platforms, Inc. as required for API functionality",
        "Legal authorities if required by law",
      ],
      footer: ["We do not share user data for unauthorized purposes."],
    },
    {
      heading: "4. Data Storage & Security",
      list: [
        "Data is stored on secure servers (including AWS or equivalent infrastructure)",
        "Encryption is used in transit and at rest",
        "Access is restricted to authorized personnel only",
      ],
    },
    {
      heading: "5. Cookies & Tracking",
      body: [
        "We use cookies and tracking technologies (including Meta Pixel and analytics tools) to:",
      ],
      list: ["Improve user experience", "Measure campaign effectiveness", "Analyze traffic"],
      footer: ["Users can manage cookies via browser settings."],
    },
    {
      heading: "6. Data Retention",
      body: ["We retain data only as long as necessary to:"],
      list: ["Provide services", "Meet legal obligations", "Resolve disputes"],
      footer: ["Users may request deletion at any time."],
    },
    {
      heading: "7. User Rights",
      body: ["You have the right to:"],
      list: [
        "Access your data",
        "Correct inaccurate data",
        "Request deletion of your data",
        "Withdraw consent",
      ],
      footer: ["To exercise your rights, contact: info@personlyze.ai"],
    },
    {
      heading: "8. Data Deletion Instructions",
      body: ["If you want us to delete your data, you can:"],
      list: ["Send an email to: info@personlyze.ai", "Include your account details and request"],
      footer: ["We will process deletion within a reasonable timeframe."],
    },
    {
      heading: "9. Facebook & Instagram Data Usage",
      body: [
        "personlyze.ai complies with Meta Platform Terms and Developer Policies. We only use data obtained from Facebook and Instagram APIs to:",
      ],
      list: [
        "Provide requested features",
        "Improve user experience",
        "Generate analytics and reports",
      ],
      footer: ["We do not misuse or retain data beyond permitted use."],
    },
    {
      heading: "10. Children's Privacy",
      body: [
        "Our services are not intended for users under 18. We do not knowingly collect data from minors.",
      ],
    },
    {
      heading: "11. International Data Transfers",
      body: [
        "Data may be transferred and processed in India and the United States in compliance with applicable laws.",
      ],
    },
    {
      heading: "12. Changes to This Policy",
      body: [
        "We may update this Privacy Policy periodically. Updates will be posted on this page.",
      ],
    },
    {
      heading: "13. Contact Us",
      body: [
        "For privacy-related questions or requests:",
        "Email: info@personlyze.ai",
        "Website: https://personlyze.ai",
      ],
    },
  ],
};

const TERMS = {
  title: "Terms & Conditions",
  meta: "Effective Date: August 2026 · Last Updated: August 2026",
  sections: [
    {
      body: [
        'Welcome to Personlyze AI ("we," "us," or "our"). These Terms & Conditions ("Terms") govern your access to and use of our website https://personlyze.ai, related subdomains, and any services, products, or pilot programs we offer (collectively, the "Services").',
        "By accessing or using our Services, you agree to these Terms. If you do not agree, please do not use our Services.",
      ],
    },
    {
      heading: "1. Use of Services",
      list: [
        "You may use our Services only for lawful business purposes and in accordance with these Terms.",
        "You agree not to misuse, disrupt, or interfere with the proper functioning of our website, AI systems, or data pipelines.",
        "We reserve the right to modify, suspend, or discontinue any part of our Services without notice.",
      ],
    },
    {
      heading: "2. Intellectual Property",
      list: [
        "All content, creative outputs, models, algorithms, trademarks, and materials available through personlyze.ai remain the exclusive property of personlyze AI Inc. or its licensors.",
        "You may not copy, modify, reproduce, or distribute our assets without written permission.",
        "Client-generated assets created using our AI tools remain the property of the client, subject to payment of applicable fees.",
      ],
    },
    {
      heading: "3. Accounts & Pilot Access",
      list: [
        "Certain Services may require registration or pilot approval. You agree to provide accurate, up-to-date information.",
        "personlyze.ai reserves the right to approve, limit, or terminate pilot access at any time.",
        "All fees and payments for pilot programs are governed by your order form or separate agreement.",
      ],
    },
    {
      heading: "4. Confidentiality",
      body: [
        "We maintain strict confidentiality for client data, creative briefs, and marketing insights shared through our platform. You agree not to disclose any non-public information about our platform or pricing.",
      ],
    },
    {
      heading: "5. Limitation of Liability",
      body: [
        'Personlyze AI provides its Services on an "as is" and "as available" basis. We do not guarantee uninterrupted or error-free operation.',
        "To the maximum extent permitted by law, personlyze.ai shall not be liable for indirect, incidental, or consequential damages arising from your use of our Services.",
      ],
    },
    {
      heading: "6. Indemnification",
      body: [
        "You agree to indemnify and hold harmless personlyze.ai, its directors, employees, and partners from any claim, loss, or expense arising from your misuse of the Services or violation of these Terms.",
      ],
    },
    {
      heading: "7. Governing Law",
      body: [
        "For users based in India, they are governed by the laws of India, with jurisdiction in Mumbai, Maharashtra.",
      ],
    },
    {
      heading: "8. Changes to Terms",
      body: [
        "We may update these Terms periodically. Continued use of our Services after such updates constitutes acceptance of the revised Terms.",
      ],
    },
    {
      heading: "9. Contact Us",
      body: [
        "If you have any questions, please contact: info@personlyze.ai",
        "Personlyze Technology Solutions LLP, B-2403, Videocon Towers, Thakur Complex, Kandivali East, Mumbai-400101",
      ],
    },
  ],
};

function LegalDoc({ doc }) {
  return (
    <div className="legal-doc">
      <p className="legal-meta">{doc.meta}</p>

      {doc.sections.map((section, i) => (
        <div className="legal-section" key={i}>
          {section.heading && <h4>{section.heading}</h4>}

          {section.body &&
            section.body.map((p, j) => <p key={`b${j}`}>{p}</p>)}

          {section.list && (
            <ul>
              {section.list.map((item, j) => (
                <li key={`l${j}`}>{item}</li>
              ))}
            </ul>
          )}

          {section.afterBody &&
            section.afterBody.map((p, j) => <p key={`ab${j}`}>{p}</p>)}

          {section.afterList && (
            <ul>
              {section.afterList.map((item, j) => (
                <li key={`al${j}`}>{item}</li>
              ))}
            </ul>
          )}

          {section.footer &&
            section.footer.map((p, j) => (
              <p className="legal-note" key={`f${j}`}>
                {p}
              </p>
            ))}
        </div>
      ))}
    </div>
  );
}

export default function Footer() {
  const [legalDoc, setLegalDoc] = useState(null);
  const { openBookDemo } = useBookDemoModal();

  const handleBookDemo = () => {
    openBookDemo();
  };

  useEffect(() => {
    if (!legalDoc) return;

    const onKey = (e) => {
      if (e.key === "Escape") setLegalDoc(null);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [legalDoc]);

  return (
    <footer className="footer">
      <div className="footer-glow"></div>

      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left">
            <h2 className="footer-title">
              Ready to Create <br />
              Personalized Customer Experiences?
            </h2>

            <p className="footer-text">
              Transform every customer interaction into a unique,
              AI-powered personalized experience that increases
              engagement, conversions, and loyalty.
            </p>

            <button className="footer-btn" onClick={handleBookDemo}>
              Book a Demo
            </button>

            <div className="footer-socials">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  className="footer-social"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <div>
              <h4>Company</h4>

              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </div>

            <div>
              <h4>Solutions</h4>

              <a href="/industries/real-estate">Real Estate</a>
              <a href="/industries/bfsi">BFSI</a>
              <a href="/industries/travel">Travel</a>
              <a href="/industries/healthcare">Healthcare</a>
              <a href="/industries/retail">Retail</a>
              <a href="/industries/automotive">Automotive</a>
              <a href="/industries/b2b-saas">B2B & SaaS</a>
              <a href="/industries/tech-startups">Tech & Startups</a>
              <a href="/industries/fashion">Fashion</a>
            </div>

            <div>
              <h4>Contact</h4>

              <a href="mailto:nitin@personlyze.ai">
                nitin@personlyze.ai
              </a>

              <a href="tel:+919819104471">
                +91 98191 04471
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>© 2026 Personlyze AI. All rights reserved.</p>

          <button
            className="footer-top-btn"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            ↑ Back to Top
          </button>
        </div>

        <div className="footer-legal">
          <button
            type="button"
            className="footer-legal-link"
            onClick={() => setLegalDoc(PRIVACY_POLICY)}
          >
            Privacy Policy
          </button>

          <span className="footer-legal-sep">|</span>

          <button
            type="button"
            className="footer-legal-link"
            onClick={() => setLegalDoc(TERMS)}
          >
            Terms &amp; Conditions
          </button>
        </div>
      </div>

      {legalDoc && (
        <div
          className="legal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={legalDoc.title}
          onClick={() => setLegalDoc(null)}
        >
          <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="legal-modal-head">
              <h3>{legalDoc.title}</h3>

              <button
                type="button"
                className="legal-close"
                aria-label="Close"
                onClick={() => setLegalDoc(null)}
              >
                ✕
              </button>
            </div>

            <div className="legal-modal-body">
              <LegalDoc doc={legalDoc} />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
