(function () {
  "use strict";

  document.documentElement.classList.add("js");

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

  /* Estado de atendimento real: 8h–22h em Europe/Lisbon. */
  var statusLabels = Array.prototype.slice.call(
    document.querySelectorAll("[data-status-label]")
  );
  var statusDots = Array.prototype.slice.call(
    document.querySelectorAll("[data-open-dot]")
  );

  var isOpenNow = function () {
    try {
      var parts = new Intl.DateTimeFormat("pt-PT", {
        timeZone: "Europe/Lisbon",
        hour: "2-digit",
        hourCycle: "h23"
      }).formatToParts(new Date());
      var hours = parts.filter(function (part) {
        return part.type === "hour";
      })[0];
      var hour = Number(hours && hours.value);
      return hour >= 8 && hour < 22;
    } catch (error) {
      var now = new Date();
      return now.getHours() >= 8 && now.getHours() < 22;
    }
  };

  var syncStatus = function () {
    var open = isOpenNow();

    statusLabels.forEach(function (label) {
      label.textContent = open
        ? "Online agora"
        : "Fora de horário · respondemos às 8h";
    });

    statusDots.forEach(function (dot) {
      dot.classList.toggle("is-off", !open);
    });
  };

  if (statusLabels.length) {
    syncStatus();
    window.setInterval(syncStatus, 60000);
  }

  /* O atalho flutuante só aparece depois do CTA do hero e sai do caminho do CTA final. */
  var floatLink = document.querySelector(".whatsapp-float");
  var heroActions = document.querySelector(".hero-actions");
  var finalCta = document.querySelector(".cta-final");

  if (
    floatLink &&
    heroActions &&
    finalCta &&
    "IntersectionObserver" in window
  ) {
    var floatState = { heroVisible: true, ctaVisible: false };

    var syncFloat = function () {
      var hide = floatState.heroVisible || floatState.ctaVisible;
      if (floatLink === document.activeElement) hide = false;
      floatLink.classList.toggle("is-hidden", hide);
    };

    new IntersectionObserver(
      function (entries) {
        floatState.heroVisible = entries[0].isIntersecting;
        syncFloat();
      },
      { threshold: 0.6 }
    ).observe(heroActions);

    new IntersectionObserver(
      function (entries) {
        floatState.ctaVisible = entries[0].isIntersecting;
        syncFloat();
      },
      { threshold: 0.25 }
    ).observe(finalCta);
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
