// GSAP animation configurations
// Import gsap in components that use these configs
// All animations are client-side only

// Hero load sequence
// Call from Hero.tsx useEffect after mount
export const heroLoadSequence = (gsap: any) => {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  tl.fromTo(
    "[data-anim='nav']",
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
    0,
  )
    .fromTo(
      "[data-anim='eyebrow']",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.2,
    )
    .fromTo(
      "[data-anim='headline-1']",
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.35,
    )
    .fromTo(
      "[data-anim='headline-2']",
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      0.55,
    )
    .fromTo(
      "[data-anim='hero-sub']",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      1.2,
    )
    .fromTo(
      "[data-anim='portrait']",
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      0.9,
    )
    .fromTo(
      "[data-anim='nav-link']",
      { opacity: 0 },
      { opacity: 1, duration: 0.4, stagger: 0.04 },
      1.1,
    );

  return tl;
};

// Scroll reveal — attach to any element
// Usage: scrollReveal(gsap, ScrollTrigger, ".my-element")
export const scrollReveal = (
  gsap: any,
  ScrollTrigger: any,
  selector: string,
  options?: {
    stagger?: number;
    delay?: number;
  },
) => {
  gsap.fromTo(
    selector,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: options?.stagger ?? 0.2,
      delay: options?.delay ?? 0,
      scrollTrigger: {
        trigger: selector,
        start: "top 85%",
        once: true,
      },
    },
  );
};

// About section color wipe
export const aboutWipe = (gsap: any, ScrollTrigger: any, element: string) => {
  gsap.fromTo(
    element,
    { clipPath: "inset(0 100% 0 0)" },
    {
      clipPath: "inset(0 0% 0 0)",
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        once: true,
      },
    },
  );
};

// Portrait parallax
export const portraitParallax = (
  gsap: any,
  ScrollTrigger: any,
  element: string,
) => {
  gsap.to(element, {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
};

// Cursor follower
// Call once from root.tsx or CursorFollower.tsx
export const initCursorFollower = () => {
  if (typeof window === "undefined") return;

  const dot = document.getElementById("cursor-dot");
  if (!dot) return;

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  const lag = 0.15;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Expand on hoverable elements
  const hoverTargets = document.querySelectorAll("[data-cursor-expand]");
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => dot.classList.add("expanded"));
    el.addEventListener("mouseleave", () => dot.classList.remove("expanded"));
  });

  const animate = () => {
    dotX += (mouseX - dotX) * lag;
    dotY += (mouseY - dotY) * lag;
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;
    requestAnimationFrame(animate);
  };
  animate();
};
