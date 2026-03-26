export function createRipple(event: React.TouchEvent<HTMLElement>) {
  const element = event.currentTarget;
  const ripple = document.createElement("span");
  const rect = element.getBoundingClientRect();
  const touch = event.touches[0];

  const size = Math.max(rect.width, rect.height);
  const x = touch.clientX - rect.left - size / 2;
  const y = touch.clientY - rect.top - size / 2;

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 183, 125, 0.25);
    transform: scale(0);
    pointer-events: none;
    z-index: 10;
  `;

  element.style.position = "relative";
  element.style.overflow = "hidden";
  ripple.className = "circle";
  element.appendChild(ripple);

  // Double rAF ensures the browser commits the initial scale(0) paint
  // before starting the animation — void offsetWidth is not reliable on
  // mobile Safari / Android Chrome
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ripple.style.animation = "ripple-expand 0.6s ease-out forwards";
    });
  });

  setTimeout(() => ripple.remove(), 700);
}
