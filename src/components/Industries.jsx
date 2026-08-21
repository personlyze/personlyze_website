import { useEffect, useState } from "react";
import DynamicFrameLayout from "./DynamicFrameLayout";
import DynamicFrameLayoutMobile from "./DynamicFrameLayoutMobile";
import "./Industries.css";

function Industries() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="industries">
      <div className="industries-header">
        <h2>PERSONALIZATION FOR EVERY BUSINESS</h2>
      </div>

      {isMobile ? (
        <DynamicFrameLayoutMobile />
      ) : (
        <DynamicFrameLayout />
      )}
    </section>
  );
}

export default Industries;