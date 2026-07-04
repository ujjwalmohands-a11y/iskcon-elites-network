"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  // Number of dots in the trail
  const numDots = 10;

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = 0;
    let mouseY = 0;

    const dots: { x: number; y: number; el: HTMLDivElement }[] = [];

    // Initialize dots data
    for (let i = 0; i < numDots; i++) {
      if (dotsRef.current[i]) {
        dots.push({
          x: 0,
          y: 0,
          el: dotsRef.current[i]!
        });
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const renderLoop = () => {
      dots.forEach((dot, index) => {
        // Main cursor (index 0) instantly follows the mouse
        if (index === 0) {
          dot.x = mouseX;
          dot.y = mouseY;
        } else {
          // Trail dots interpolate position for a smooth delay effect
          const prevDot = dots[index - 1];
          // Easing value determines the speed/smoothness of the trail
          dot.x += (prevDot.x - dot.x) * 0.4;
          dot.y += (prevDot.y - dot.y) * 0.4;
        }

        if (dot.el) {
          // Use translate3d to force hardware acceleration
          dot.el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
        }
      });

      requestAnimationFrame(renderLoop);
    };

    window.addEventListener("mousemove", onMouseMove);
    const animationId = requestAnimationFrame(renderLoop);

    // Hover state management
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const attachListeners = () => {
      const interactiveSelector = 'a, button, input, textarea, select, [role="button"], .interactive-target';
      
      const observer = new MutationObserver(() => {
        document.querySelectorAll(interactiveSelector).forEach((el) => {
          el.removeEventListener("mouseenter", handleMouseEnter);
          el.removeEventListener("mouseleave", handleMouseLeave);
          el.addEventListener("mouseenter", handleMouseEnter);
          el.addEventListener("mouseleave", handleMouseLeave);
        });
      });
      
      observer.observe(document.body, { childList: true, subtree: true });

      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
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
    <div style={{ zIndex: 999999 }} className="fixed top-0 left-0 pointer-events-none hidden lg:block">
      {Array.from({ length: numDots }).map((_, i) => {
        const isMain = i === 0;
        return (
          <div
            key={i}
            ref={(el) => {
              if (el) dotsRef.current[i] = el;
            }}
            className={`fixed top-0 left-0 rounded-full pointer-events-none will-change-transform ${
              isMain
                ? "transition-all duration-300 ease-out"
                : ""
            }`}
            style={{
              // Hover state transitions for the main dot
              width: isMain ? (isHovering ? "40px" : "6px") : `${6 - i * 0.4}px`,
              height: isMain ? (isHovering ? "40px" : "6px") : `${6 - i * 0.4}px`,
              backgroundColor: isMain && isHovering ? "transparent" : "#cfa04f",
              border: isMain && isHovering ? "1.5px solid #cfa04f" : "none",
              
              // Fade out the trail
              opacity: isMain ? 1 : 0.4 - i * 0.03,
              
              // Add a soft glow to the trail dots
              boxShadow: isMain ? "none" : "0 0 4px rgba(207, 160, 79, 0.4)",
              
              // Hide the trail dots when hovering so only the hollow circle shows
              display: isHovering && !isMain ? "none" : "block",
            }}
          />
        );
      })}
    </div>
  );
}
