// 古都華のしずく LP 2026-10: メニュー、固定ヘッダー、旬の帯の表示
(() => {
  document.documentElement.classList.add("js");

  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");
  const fv = document.getElementById("top");

  const setMenu = (open) => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });
  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuButton.focus();
    }
  });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });

  if (header && fv && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle("is-fixed", !entry.isIntersecting);
    }, { rootMargin: "-80px 0px 0px 0px" }).observe(fv);
  }

  const timeline = document.querySelector("[data-timeline]");
  if (timeline && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        timeline.classList.add("is-in");
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(timeline);
  } else {
    timeline?.classList.add("is-in");
  }
})();
