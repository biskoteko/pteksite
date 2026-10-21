(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var nav = document.querySelector("[data-nav]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var yearTarget = document.querySelector("[data-year]");
  var mobileQuery = window.matchMedia("(max-width: 880px)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  /* Header: sombra ligeira assim que a página deixa de estar no topo. */
  var syncHeader = function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  /* Menu mobile */
  var setNav = function (open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };

  var isNavOpen = function () {
    return Boolean(nav && nav.classList.contains("is-open"));
  };

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      setNav(!isNavOpen());
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isNavOpen()) {
        setNav(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!isNavOpen()) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setNav(false);
    });

    var onBreakpointChange = function (event) {
      if (!event.matches) setNav(false);
    };

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", onBreakpointChange);
    } else if (typeof mobileQuery.addListener === "function") {
      mobileQuery.addListener(onBreakpointChange);
    }
  }

  /* Revelação suave das secções ao entrar no ecrã. */
  var revealTargets = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal]")
  );

  var showAll = function () {
    revealTargets.forEach(function (element) {
      element.classList.add("is-visible");
    });
  };

  if (!revealTargets.length) return;

  if (!("IntersectionObserver" in window) || reducedMotion.matches) {
    showAll();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  revealTargets.forEach(function (element) {
    observer.observe(element);
  });

  /* Se o utilizador passar a preferir menos movimento, mostra tudo. */
  var onMotionChange = function (event) {
    if (!event.matches) return;
    if (observer) observer.disconnect();
    showAll();
  };

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", onMotionChange);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(onMotionChange);
  }
})();
