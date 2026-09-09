// Sanskruti Plumbing Services — mockup interactions

(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a") && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle("scrolled", window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Count-up ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count-to"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }

    var duration = 1100;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }
    window.requestAnimationFrame(step);
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = [];

  // Section headings (also drive the underline accent + star fill)
  document.querySelectorAll(".section h2").forEach(function (el) {
    revealTargets.push(el);
  });

  // Grouped items with a small stagger
  [
    ".services-grid .service",
    ".review-highlights .review",
    ".rating-score",
    ".pricing-card",
    ".contact-main",
    ".contact-details li"
  ].forEach(function (selector) {
    var group = document.querySelectorAll(selector);
    group.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", i * 0.08 + "s");
      revealTargets.push(el);
    });
  });

  // Eyebrow + intro paragraphs per section
  document.querySelectorAll(".section .eyebrow").forEach(function (el) {
    el.classList.add("reveal");
    revealTargets.push(el);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    document.querySelectorAll(".stars").forEach(function (el) {
      el.classList.add("is-visible");
    });
    document.querySelectorAll("[data-count-to]").forEach(countUp);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-visible");

        // Trigger star fill for any stars inside a revealed block
        el.querySelectorAll &&
          el.querySelectorAll(".stars").forEach(function (s) {
            s.classList.add("is-visible");
          });
        if (el.classList.contains("stars")) {
          el.classList.add("is-visible");
        }

        // Trigger count-up for numbers inside a revealed block
        el.querySelectorAll &&
          el.querySelectorAll("[data-count-to]").forEach(countUp);

        observer.unobserve(el);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach(function (el) {
    observer.observe(el);
  });

  // Observe the rating block's stars directly too
  document.querySelectorAll(".stars").forEach(function (el) {
    observer.observe(el);
  });
})();
