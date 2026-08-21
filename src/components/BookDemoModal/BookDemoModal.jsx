import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./BookDemoModal.css";
import { submitBookDemoRequest } from "../../../api/bookDemo";

const INITIAL_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  agree: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function BookDemoModal({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  // Mount immediately on open; keep mounted briefly on close so the
  // exit transition (defined in BookDemoModal.css) can play out.
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    if (isOpen || !shouldRender) return undefined;
    const timer = setTimeout(() => {
      setShouldRender(false);
      setForm(INITIAL_FORM);
      setErrors({});
      setStatus("idle");
    }, 280);
    return () => clearTimeout(timer);
  }, [isOpen, shouldRender]);

  // ESC to close.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Focus the first field when it opens.
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => firstFieldRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleChange = (field) => (e) => {
    const value = field === "agree" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.company.trim()) next.company = "Company is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) next.phone = "Phone is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree || status === "submitting") return;
    if (!validate()) return;

    setStatus("submitting");
    try {
      await submitBookDemoRequest({
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        submittedAt: new Date().toISOString(),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const isSubmitDisabled = !form.agree || status === "submitting";

  return createPortal(
    <div
      className={`bdm-overlay ${isOpen ? "is-open" : ""}`}
      onMouseDown={handleOverlayClick}
    >
      <div
        className={`bdm-dialog ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bdm-title"
        ref={dialogRef}
      >
        <button
          type="button"
          className="bdm-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {status === "success" ? (
          <div className="bdm-success">
            <h2 className="bdm-success__title">Thank you!</h2>
            <p className="bdm-success__text">
              We&apos;ll contact you soon.
            </p>
            <button type="button" className="bdm-submit" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 id="bdm-title" className="bdm-title">
              Book a Demo
            </h2>
            <p className="bdm-subtitle">
              Tell us a bit about you and we&apos;ll be in touch.
            </p>

            <form className="bdm-form" onSubmit={handleSubmit} noValidate>
              <div className="bdm-field">
                <label htmlFor="bdm-name">Name *</label>
                <input
                  id="bdm-name"
                  ref={firstFieldRef}
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  aria-invalid={Boolean(errors.name)}
                  autoComplete="name"
                />
                {errors.name && <span className="bdm-error">{errors.name}</span>}
              </div>

              <div className="bdm-field">
                <label htmlFor="bdm-company">Company *</label>
                <input
                  id="bdm-company"
                  type="text"
                  value={form.company}
                  onChange={handleChange("company")}
                  aria-invalid={Boolean(errors.company)}
                  autoComplete="organization"
                />
                {errors.company && (
                  <span className="bdm-error">{errors.company}</span>
                )}
              </div>

              <div className="bdm-field">
                <label htmlFor="bdm-email">Email *</label>
                <input
                  id="bdm-email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                />
                {errors.email && <span className="bdm-error">{errors.email}</span>}
              </div>

              <div className="bdm-field">
                <label htmlFor="bdm-phone">Phone *</label>
                <input
                  id="bdm-phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  aria-invalid={Boolean(errors.phone)}
                  autoComplete="tel"
                />
                {errors.phone && <span className="bdm-error">{errors.phone}</span>}
              </div>

              <label className="bdm-checkbox">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={handleChange("agree")}
                />
                <span>
                  I agree to the{" "}
                  <a href="/terms" target="_blank" rel="noreferrer">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {status === "error" && (
                <p className="bdm-error bdm-error--submit">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                className="bdm-submit"
                disabled={isSubmitDisabled}
              >
                {status === "submitting" ? "Submitting…" : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export default BookDemoModal;