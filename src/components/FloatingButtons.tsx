"use client";

import { useEffect, useState } from "react";
import { ChevronUp, MessageCircle } from "lucide-react";

export default function FloatingButtons() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Support Button */}
      <button
        aria-label="الدعم الفني"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          insetInlineEnd: "1.5rem",
          zIndex: 999,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "var(--primary-500)",
          color: "#fff",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          transition: "all var(--transition-fast)",
          animation: "float 3s ease-in-out infinite",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(99,102,241,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)";
        }}
      >
        <MessageCircle size={22} />
      </button>

      {/* Scroll to top */}
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="العودة للأعلى"
          style={{
            position: "fixed",
            bottom: "5rem",
            insetInlineEnd: "1.5rem",
            zIndex: 999,
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "var(--color-surface)",
            color: "var(--primary-500)",
            border: "1.5px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "var(--shadow-lg)",
            animation: "fadeIn 0.2s ease",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--primary-500)";
            (e.currentTarget as HTMLElement).style.color = "#fff";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-500)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--color-surface)";
            (e.currentTarget as HTMLElement).style.color = "var(--primary-500)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
          }}
        >
          <ChevronUp size={20} />
        </button>
      )}
    </>
  );
}
