/*
  AgentEval — scroll & motion layer.

  Progressive enhancement only: every page is fully readable without this file.
  A tiny inline script in each <head> adds `motion` + `motion-pending` to <html>
  (skipped under prefers-reduced-motion); motion.css hides the elements marked
  below until this script takes over, and a head-side failsafe drops both classes
  if this script never reports ready.

  Markup hooks:
    data-intro            above-the-fold wrapper: the hooks inside it play once on load as one
                          sequenced timeline (MOTION.intro) instead of on scroll
    data-split            headline revealed word by word (data-split="chars" for one-word marks)
    data-reveal           single block: fade + rise when it enters the viewport
    data-reveal-stagger   container: its direct children rise in one after another
    data-reveal-each      container: each direct child rises on its own as it enters
    data-scrub            container: each child brightens from faint to full as it scrolls
                          through the reading zone (tied to scroll position, not a one-off)
    data-parallax         drifts down slower than the page while its section scrolls away
    data-magnetic         desktop-only pull toward the cursor

  Page chrome handled here: reading-progress bar and side rail (pages with an
  <article>), and the fixed back link + language switch hiding on scroll down.

  All tuning lives in MOTION below.
*/
(function () {
  "use strict";

  var MOTION = {
    ease: "power3.out",
    // headline split (on scroll)
    splitDuration: 1.1,
    splitStagger: { words: 0.08, chars: 0.035 },
    // fade + rise (on scroll)
    revealDuration: 1,
    revealDistance: 48,     // px
    revealStagger: 0.1,
    revealStart: "top 88%", // ScrollTrigger start for scroll reveals
    // above-the-fold intro ([data-intro]): one sequenced timeline, bolder than scroll reveals
    intro: {
      ease: "expo.out",
      splitDuration: 1.6,
      splitStagger: { words: 0.12, chars: 0.08 },
      splitFlip: -100,      // deg on X: letters flip up from lying flat
      splitRise: 60,        // yPercent the letters start below their line
      perspective: 600,     // px, depth for the flip
      distance: 90,         // px the blocks rise
      sideShift: 48,        // px, cards alternate in from either side
      scaleFrom: 0.86,
      duration: 1.4,
      stagger: 0.14,
      overlap: "-=1.1"      // each step starts before the previous one ends
    },
    // scroll-linked brightening ([data-scrub])
    scrubFrom: 0.14,        // starting opacity
    scrubStart: "top 85%",
    scrubEnd: "top 50%",
    // hero parallax
    parallaxYPercent: 35,
    // smart chrome
    chromeHideAfter: 140,   // px scrolled before the chrome may hide
    chromeDuration: 0.45,
    // smooth scroll (desktop pointer only)
    lenis: { lerp: 0.09, wheelMultiplier: 1 },
    // magnetic pull
    magneticStrength: 0.35, // fraction of the cursor offset from the element centre
    magneticMax: 18,        // px clamp
    magneticDuration: 0.6,
    // wait at most this long for web fonts before splitting text
    fontWait: 700
  };

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function release() {
    root.classList.remove("motion-pending");
  }

  if (reduced || !root.classList.contains("motion") || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove("motion");
    release();
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(window.SplitText);

  // Live splits, so a language switch can restore plain text before i18n.js rewrites it.
  var liveSplits = [];

  /* ---------- smooth scroll ---------- */
  function initLenis() {
    if (!finePointer || !window.Lenis) return null;
    var lenis = new window.Lenis({
      lerp: MOTION.lenis.lerp,
      wheelMultiplier: MOTION.lenis.wheelMultiplier,
      anchors: true
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    return lenis;
  }

  // Elements inside [data-intro] are played by initIntro, not by the scroll reveals.
  function outsideIntro(el) { return !el.closest("[data-intro]"); }

  // Splits a headline; returns the pieces to animate and a cleanup, or null without SplitText.
  // Unmasked pieces can travel outside their line box (used by the intro's 3D flip).
  function splitHeadline(el, unmasked) {
    if (!window.SplitText) return null;
    var type = el.getAttribute("data-split") === "chars" ? "chars" : "words";
    // Keep the readable text for assistive tech; the split spans are presentational.
    el.setAttribute("aria-label", el.textContent.trim());
    var split = new window.SplitText(el, unmasked ? { type: type, aria: "hidden" } : { type: type, mask: type, aria: "hidden" });
    var entry = {
      type: type,
      pieces: split[type],
      tween: null,
      revert: function () {
        if (entry.done) return;
        entry.done = true;
        if (entry.tween) entry.tween.kill();
        split.revert();
        el.removeAttribute("aria-label");
        gsap.set(el, { clearProps: "opacity" });
      }
    };
    liveSplits.push(entry);
    return entry;
  }

  /* ---------- headline split (on scroll) ---------- */
  function initSplits() {
    gsap.utils.toArray("[data-split]").filter(outsideIntro).forEach(function (el) {
      var split = splitHeadline(el);
      if (!split) {
        gsap.fromTo(el, { opacity: 0, y: MOTION.revealDistance }, { opacity: 1, y: 0, duration: MOTION.revealDuration, ease: MOTION.ease,
          scrollTrigger: { trigger: el, start: MOTION.revealStart, once: true } });
        return;
      }
      split.tween = gsap.fromTo(split.pieces, { yPercent: 110, opacity: 0 }, {
        yPercent: 0,
        opacity: 1,
        duration: MOTION.splitDuration,
        ease: MOTION.ease,
        stagger: MOTION.splitStagger[split.type],
        scrollTrigger: { trigger: el, start: MOTION.revealStart, once: true },
        onComplete: split.revert
      });
    });
  }

  /* ---------- above-the-fold intro ----------
     Headline, then each reveal block, then staggered groups, as one timeline in DOM order. */
  function initIntro() {
    var scope = document.querySelector("[data-intro]");
    if (!scope) return;
    var cfg = MOTION.intro;
    var tl = gsap.timeline({ defaults: { ease: cfg.ease } });
    scope.querySelectorAll("[data-split], [data-reveal], [data-reveal-stagger]").forEach(function (el, i) {
      var at = i === 0 ? 0 : cfg.overlap;
      if (el.hasAttribute("data-split")) {
        var split = splitHeadline(el, true);
        if (split) {
          split.tween = gsap.fromTo(split.pieces,
            { yPercent: cfg.splitRise, rotationX: cfg.splitFlip, opacity: 0, transformOrigin: "50% 100%", transformPerspective: cfg.perspective },
            { yPercent: 0, rotationX: 0, opacity: 1, ease: cfg.ease, duration: cfg.splitDuration, stagger: cfg.splitStagger[split.type], onComplete: split.revert });
          tl.add(split.tween, at);
          return;
        }
      }
      var group = el.hasAttribute("data-reveal-stagger");
      tl.fromTo(group ? el.children : el,
        {
          opacity: 0,
          y: cfg.distance,
          // Groups alternate sides; the sign flip is symmetric, so it reads the same in RTL and LTR.
          x: group ? function (n) { return n % 2 ? cfg.sideShift : -cfg.sideShift; } : 0,
          scale: cfg.scaleFrom
        },
        { opacity: 1, y: 0, x: 0, scale: 1, duration: cfg.duration, stagger: cfg.stagger, clearProps: "transform" },
        at);
    });
  }

  /* ---------- fade + rise ----------
     fromTo, not from: the targets are still hidden by .motion-pending when these
     tweens are created, so their computed opacity can't be the end state. */
  function rise(targets, trigger, stagger) {
    gsap.fromTo(targets, { opacity: 0, y: MOTION.revealDistance }, {
      opacity: 1,
      y: 0,
      duration: MOTION.revealDuration,
      ease: MOTION.ease,
      stagger: stagger || 0,
      clearProps: "transform",
      scrollTrigger: { trigger: trigger, start: MOTION.revealStart, once: true }
    });
  }

  function initReveals() {
    gsap.utils.toArray("[data-reveal]").filter(outsideIntro).forEach(function (el) { rise(el, el); });
    gsap.utils.toArray("[data-reveal-stagger]").filter(outsideIntro).forEach(function (group) {
      rise(group.children, group, MOTION.revealStagger);
    });
    gsap.utils.toArray("[data-reveal-each]").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child) {
        if (!child.hasAttribute("data-split")) rise(child, child);
      });
    });
  }

  /* ---------- scroll-linked brightening ---------- */
  function initScrub() {
    gsap.utils.toArray("[data-scrub]").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child) {
        gsap.fromTo(child, { opacity: MOTION.scrubFrom }, {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: child, start: MOTION.scrubStart, end: MOTION.scrubEnd, scrub: true }
        });
      });
    });
  }

  /* ---------- hero parallax ---------- */
  function initParallax() {
    gsap.utils.toArray("[data-parallax]").forEach(function (el) {
      var section = el.closest("header") || el;
      gsap.to(el, {
        yPercent: MOTION.parallaxYPercent,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true }
      });
    });
  }

  /* ---------- reading progress: top bar + side rail ---------- */
  function initProgress() {
    var article = document.querySelector("article");
    if (!article) return;
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var fill = document.querySelector(".rail-fill");
    var targets = fill ? [bar, fill] : [bar];
    ScrollTrigger.create({
      trigger: article,
      start: "top 80%",
      end: "bottom bottom",
      onUpdate: function (self) {
        gsap.set(bar, { scaleX: self.progress });
        if (fill) gsap.set(fill, { scaleY: self.progress });
      }
    });
    gsap.set(targets, { willChange: "transform" });
  }

  /* ---------- smart chrome: hide on scroll down, return on scroll up ---------- */
  function initChrome() {
    var chrome = gsap.utils.toArray(".back, .lang-switch");
    if (!chrome.length) return;
    var hidden = false;
    function show(v) {
      if (v === !hidden) return;
      hidden = !v;
      gsap.to(chrome, { yPercent: v ? 0 : -180, duration: MOTION.chromeDuration, ease: MOTION.ease, overwrite: true });
    }
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: function (self) {
        show(self.direction < 0 || self.scroll() < MOTION.chromeHideAfter);
      }
    });
    // Keyboard users tabbing into the chrome always get it back.
    chrome.forEach(function (el) { el.addEventListener("focusin", function () { show(true); }); });
  }

  /* ---------- magnetic (desktop only) ---------- */
  function initMagnetic() {
    if (!finePointer) return;
    gsap.utils.toArray("[data-magnetic]").forEach(function (el) {
      // Track the pointer over the whole row/link, so the pull starts before the cursor reaches the icon.
      var zone = el.closest("a") || el;
      var toX = gsap.quickTo(el, "x", { duration: MOTION.magneticDuration, ease: MOTION.ease });
      var toY = gsap.quickTo(el, "y", { duration: MOTION.magneticDuration, ease: MOTION.ease });
      var clamp = gsap.utils.clamp(-MOTION.magneticMax, MOTION.magneticMax);
      zone.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        toX(clamp((e.clientX - (r.left + r.width / 2)) * MOTION.magneticStrength));
        toY(clamp((e.clientY - (r.top + r.height / 2)) * MOTION.magneticStrength));
      });
      zone.addEventListener("pointerleave", function () { toX(0); toY(0); });
    });
  }

  /* ---------- language switch ----------
     Capture phase runs before i18n.js's own click handler: finish every split first,
     so i18n.js swaps plain text, then re-measure once the new language has laid out. */
  function initLangSafety() {
    document.addEventListener("click", function (e) {
      if (!e.target.closest || !e.target.closest(".lang-switch button")) return;
      liveSplits.forEach(function (s) { s.revert(); });
      requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    }, true);
  }

  function fontsReady() {
    if (!document.fonts || !document.fonts.ready) return Promise.resolve();
    return Promise.race([
      document.fonts.ready,
      new Promise(function (resolve) { setTimeout(resolve, MOTION.fontWait); })
    ]);
  }

  function start() {
    fontsReady().then(function () {
      initLenis();
      initIntro();
      initSplits();
      initReveals();
      initScrub();
      initParallax();
      initProgress();
      initChrome();
      initMagnetic();
      initLangSafety();
      root.classList.add("motion-ready");
      release();
      // Layout can still shift once late fonts land; re-measure trigger positions.
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
      window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
