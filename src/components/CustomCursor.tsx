"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const renderLoop = () => {
      // Fast interpolation (0.3) makes it incredibly snappy and responsive
      currentX += (mouseX - currentX) * 0.3;
      currentY += (mouseY - currentY) * 0.3;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(renderLoop);
    };

    window.addEventListener("mousemove", onMouseMove);
    const animationId = requestAnimationFrame(renderLoop);

    // State switching on hover
    const handleMouseEnter = (e: Event) => {
      if (cursorRef.current) {
        const target = e.target as HTMLElement;
        const isClerk = target.closest('.cl-rootBox') !== null;

        // Shrink and remove lens
        cursorRef.current.classList.remove("w-4", "h-4", "bg-white", "mix-blend-difference");
        
        if (isClerk) {
          cursorRef.current.classList.add("w-2", "h-2", "bg-[#FF6B00]", "shadow-[0_0_10px_#FF6B00]");
        } else {
          cursorRef.current.classList.add("w-2", "h-2", "bg-[#45F3FF]", "shadow-[0_0_10px_#45F3FF]");
        }
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        // Return to inverted lens
        cursorRef.current.classList.add("w-4", "h-4", "bg-white", "mix-blend-difference");
        cursorRef.current.classList.remove(
          "w-2", "h-2", 
          "bg-[#45F3FF]", "shadow-[0_0_10px_#45F3FF]",
          "bg-[#FF6B00]", "shadow-[0_0_10px_#FF6B00]"
        );
      }
    };

    const attachListeners = () => {
      // Create a MutationObserver to attach listeners to dynamically added elements
      const observer = new MutationObserver(() => {
        document.querySelectorAll('a, button, input, textarea, [role="button"], .interactive-target, .cl-rootBox button').forEach((el) => {
          // Remove to avoid duplicates, then add
          el.removeEventListener("mouseenter", handleMouseEnter as EventListener);
          el.removeEventListener("mouseleave", handleMouseLeave as EventListener);
          el.addEventListener("mouseenter", handleMouseEnter as EventListener);
          el.addEventListener("mouseleave", handleMouseLeave as EventListener);
        });
      });
      
      observer.observe(document.body, { childList: true, subtree: true });

      // Initial attachment
      document.querySelectorAll('a, button, input, textarea, [role="button"], .interactive-target, .cl-rootBox button').forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter as EventListener);
        el.addEventListener("mouseleave", handleMouseLeave as EventListener);
      });
      
      return observer;
    };

    const observer = attachListeners();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{ zIndex: 999999 }}
      className="fixed top-0 left-0 w-4 h-4 bg-white mix-blend-difference rounded-full pointer-events-none will-change-transform transition-all duration-200 ease-out"
    />
  );
}
