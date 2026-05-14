const sections = Array.from(document.querySelectorAll(".observe-section"));
const navLinks = Array.from(document.querySelectorAll("[data-nav-target]"));
const scrollColumn = document.querySelector(".scroll-column");
const opening = document.querySelector("[data-opening]");
const openingSkip = document.querySelector("[data-opening-skip]");
const progressBar = document.querySelector(".scroll-progress span");
const productStage = document.querySelector(".product-stage");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finishOpening = () => {
  document.body.classList.remove("is-opening");
  if (!opening) return;
  opening.classList.add("is-skipped");
  window.setTimeout(() => {
    opening.setAttribute("hidden", "");
  }, 320);
};

if (opening && !prefersReducedMotion) {
  document.body.classList.add("is-opening");
  const openingTimer = window.setTimeout(finishOpening, 5400);
  openingSkip?.addEventListener("click", () => {
    window.clearTimeout(openingTimer);
    finishOpening();
  });
} else {
  opening?.setAttribute("hidden", "");
}

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
