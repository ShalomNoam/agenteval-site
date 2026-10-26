/*
  AgentEval — scroll & motion layer.

  Progressive enhancement only: every page is fully readable without this file.
  A tiny inline script in each <head> adds `motion` + `motion-pending` to <html>
  (skipped under prefers-reduced-motion); motion.css hides the elements marked
  below until this script takes over, and a head-side failsafe drops both classes
  if this script never reports ready.

  Markup hooks:
    data-split            headline revealed word by word (data-split="chars" for one-word marks)
    data-reveal           single block: fade + rise when it enters the viewport
    data-reveal-stagger   container: its direct children rise in one after another
    data-magnetic         desktop-only subtle pull toward the cursor

  All tuning lives in MOTION below.
*/
(function () {
  "use strict";

  var MOTION = {
    ease: "power3.out",
    // headline split
    splitDuration: 0.9,
    splitStagger: { words: 0.06, chars: 0.035 },
    // fade + rise
    revealDuration: 0.8,
    revealDistance: 18,     // px
    revealStagger: 0.08,
    revealStart: "top 88%", // ScrollTrigger start for scroll reveals
    // smooth scroll (desktop pointer only)
    lenis: { lerp: 0.1, wheelMultiplier: 1 },
    // magnetic pull
    magneticStrength: 0.06, // fraction of the cursor offset from the element centre
    magneticMax: 4,         // px clamp — the home cards are wide, so this is usually the reach
    magneticDuration: 0.5,
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

  /* ---------- headline split ---------- */
  function initSplits() {
    gsap.utils.toArray("[data-split]").forEach(function (el) {
      var type = el.getAttribute("data-split") === "chars" ? "chars" : "words";
      if (!window.SplitText) {
        gsap.fromTo(el, { opacity: 0, y: MOTION.revealDistance }, { opacity: 1, y: 0, duration: MOTION.revealDuration, ease: MOTION.ease });
        return;
      }
      // Keep the readable text for assistive tech; the split spans are presentational.
      el.setAttribute("aria-label", el.textContent.trim());
      var split = new window.SplitText(el, { type: type, mask: type, aria: "hidden" });
      gsap.from(split[type], {
        yPercent: 110,
        opacity: 0,
        duration: MOTION.splitDuration,
        ease: MOTION.ease,
        stagger: MOTION.splitStagger[type],
        scrollTrigger: { trigger: el, start: MOTION.revealStart, once: true },
        onComplete: function () { split.revert(); el.removeAttribute("aria-label"); }
      });
    });
  }

  /* ---------- fade + rise ----------
     fromTo, not from: the targets are still hidden by .motion-pending when these
     tweens are created, so their computed opacity can't be the end state. */
  function initReveals() {
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: MOTION.revealDistance }, {
        opacity: 1,
        y: 0,
        duration: MOTION.revealDuration,
        ease: MOTION.ease,
        clearProps: "transform",
        scrollTrigger: { trigger: el, start: MOTION.revealStart, once: true }
      });
    });

    gsap.utils.toArray("[data-reveal-stagger]").forEach(function (group) {
      gsap.fromTo(group.children, { opacity: 0, y: MOTION.revealDistance }, {
        opacity: 1,
        y: 0,
        duration: MOTION.revealDuration,
        ease: MOTION.ease,
        stagger: MOTION.revealStagger,
        clearProps: "transform",
        scrollTrigger: { trigger: group, start: MOTION.revealStart, once: true }
      });
    });
  }

  /* ---------- magnetic (desktop only) ---------- */
  function initMagnetic() {
    if (!finePointer) return;
    gsap.utils.toArray("[data-magnetic]").forEach(function (el) {
      var toX = gsap.quickTo(el, "x", { duration: MOTION.magneticDuration, ease: MOTION.ease });
      var toY = gsap.quickTo(el, "y", { duration: MOTION.magneticDuration, ease: MOTION.ease });
      var clamp = gsap.utils.clamp(-MOTION.magneticMax, MOTION.magneticMax);
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        toX(clamp((e.clientX - (r.left + r.width / 2)) * MOTION.magneticStrength));
        toY(clamp((e.clientY - (r.top + r.height / 2)) * MOTION.magneticStrength));
      });
      el.addEventListener("pointerleave", function () { toX(0); toY(0); });
    });
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
      initSplits();
      initReveals();
      initMagnetic();
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
