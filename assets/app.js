const sections = Array.from(document.querySelectorAll(".observe-section"));
const navLinks = Array.from(document.querySelectorAll("[data-nav-target]"));

const markActive = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.navTarget === id);
  });
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
    root: document.querySelector(".scroll-column"),
    threshold: 0.42,
  }
);

sections.forEach((section) => observer.observe(section));
if (sections[0]) {
  sections[0].classList.add("is-visible");
  markActive(sections[0].id);
}
