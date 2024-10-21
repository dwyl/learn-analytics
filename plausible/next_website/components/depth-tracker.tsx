"use client";

import { useEffect, useState } from "react";
import { usePlausible } from "next-plausible";

const ScrollDepthTracker = () => {
  const [maxDepth, setMaxDepth] = useState(0);
  const plausible = usePlausible();
  const [eventSent, setEventSent] = useState(false);

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window === "undefined") return;

    const path = window.location.pathname;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScroll = (scrollTop + windowHeight) / docHeight;

      const depth = Math.floor(totalScroll * 100 / 10) * 10; // Floor to nearest 10%

      if (depth > maxDepth) {
        setMaxDepth(depth);
      }
    };

    const sendEvent = () => {
      if (!eventSent) {
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
    };
  }, [maxDepth, eventSent, plausible]);

  return null;
};

export default ScrollDepthTracker;