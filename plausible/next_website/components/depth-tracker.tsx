"use client";

import { useEffect, useState } from "react";
import { usePlausible } from "next-plausible";

const ScrollDepthTracker = () => {
  const [maxDepth, setMaxDepth] = useState(0);
  const plausible = usePlausible();
  const [eventSent, setEventSent] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window === "undefined") return;

    const path = window.location.pathname;

    const handleScroll = () => {
      // Clear the previous timeout if it exists
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set a new timeout to update the max depth after a delay
      // This is a debounce to address the edge case where the user scrolls quickly
      // and doesn't really read the content.
      setScrollTimeout(
        setTimeout(() => {
          const scrollTop = window.scrollY;
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;
          const totalScroll = (scrollTop + windowHeight) / docHeight;

          const depth = Math.floor(totalScroll * 100 / 10) * 10; // Floor to nearest 10%

          if (depth > maxDepth) {
            setMaxDepth(depth);
          }
        }, 2000) // 2-second debounce
      );
    };

    const sendEvent = () => {
      if (!eventSent && maxDepth > 0) {
        plausible("scrollDepth", {
          props: {
            path: path,
            depth: `${maxDepth}%`,
            tag: `${path}|${maxDepth}%`, // Combine path and depth into a tag
          },
        });
        setEventSent(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeunload", sendEvent);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", sendEvent);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [maxDepth, eventSent, plausible, scrollTimeout]);

  return null;
};

export default ScrollDepthTracker;