const sections = Array.from(document.querySelectorAll(".observe-section"));
const navLinks = Array.from(document.querySelectorAll("[data-nav-target]"));
const scrollColumn = document.querySelector(".scroll-column");
const opening = document.querySelector("[data-opening]");
const openingSkip = document.querySelector("[data-opening-skip]");
const openingPackshot = document.querySelector(".opening-packshot");
const progressBar = document.querySelector(".scroll-progress span");
const productStage = document.querySelector(".product-stage");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobileOpening = window.matchMedia("(max-width: 900px)").matches;
const openingDuration = isMobileOpening ? 5900 : 8000;

const syncOpeningDock = () => {
  if (!opening || !openingPackshot || !productStage) return;

  if (!productStage.offsetParent) {
    opening.style.removeProperty("--opening-dock-x");
    opening.style.removeProperty("--opening-dock-y");
    opening.style.removeProperty("--opening-dock-scale");
    return;
  }

  const targetRect = productStage.getBoundingClientRect();
  const sourceSize = openingPackshot.offsetWidth;
  const targetSize = productStage.offsetWidth;

  if (!targetRect.width || !sourceSize || !targetSize) return;

  const sourceCenterX = window.innerWidth / 2;
  const sourceCenterY = window.innerHeight / 2;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  opening.style.setProperty("--opening-dock-x", `${(targetCenterX - sourceCenterX).toFixed(2)}px`);
  opening.style.setProperty("--opening-dock-y", `${(targetCenterY - sourceCenterY).toFixed(2)}px`);
  opening.style.setProperty("--opening-dock-scale", (targetSize / sourceSize).toFixed(4));
};

const finishOpening = () => {
  document.body.classList.remove("is-opening");
  document.body.classList.add("is-opening-complete");
  if (!opening) return;
  opening.classList.add("is-skipped");
  window.setTimeout(() => {
    opening.setAttribute("hidden", "");
  }, 620);
};

if (opening && !prefersReducedMotion) {
  syncOpeningDock();
  document.body.classList.add("is-opening");
  const openingTimer = window.setTimeout(finishOpening, openingDuration);
  openingSkip?.addEventListener("click", () => {
    window.clearTimeout(openingTimer);
    finishOpening();
  });
} else {
  opening?.setAttribute("hidden", "");
  document.body.classList.add("is-opening-complete");
}

window.addEventListener("load", syncOpeningDock);
window.addEventListener("resize", syncOpeningDock);

const markActive = (id) => {
  document.body.dataset.activeSection = id;
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.navTarget === id);
  });
};

const updateScrollProgress = () => {
  if (!scrollColumn || !progressBar) return;
  const maxScroll = scrollColumn.scrollHeight - scrollColumn.clientHeight;
  const progress = maxScroll > 0 ? (scrollColumn.scrollTop / maxScroll) * 100 : 0;
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(2));
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        markActive(entry.target.id);
      }
    });
  },
  {
    root: scrollColumn,
    threshold: 0.42,
  }
);

sections.forEach((section) => observer.observe(section));
if (sections[0]) {
  sections[0].classList.add("is-visible");
  markActive(sections[0].id);
}

scrollColumn?.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

if (productStage && !window.matchMedia("(pointer: coarse)").matches) {
  productStage.addEventListener("pointermove", (event) => {
    const rect = productStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    productStage.style.setProperty("--tilt-x", `${(x * 9).toFixed(2)}deg`);
    productStage.style.setProperty("--tilt-y", `${(-y * 9).toFixed(2)}deg`);
  });

  productStage.addEventListener("pointerleave", () => {
    productStage.style.setProperty("--tilt-x", "0deg");
    productStage.style.setProperty("--tilt-y", "0deg");
  });
}
