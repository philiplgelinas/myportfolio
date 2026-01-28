/* =========================
   Portfolio — app.js
   ========================= */

(() => {
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  function setNav(open) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("open", open);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("open");
      setNav(!isOpen);
    });

    // Close when clicking a link
    $$(".nav-link", navMenu).forEach(a => {
      a.addEventListener("click", () => setNav(false));
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.classList.contains("open")) return;
      const target = e.target;
      const clickedInside = navMenu.contains(target) || navToggle.contains(target);
      if (!clickedInside) setNav(false);
    });
  }

  // Active section highlight
  const links = $$(".nav-link");
  const sections = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === id));
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });

  sections.forEach(sec => observer.observe(sec));

  // Toast
  const toast = $("#toast");
  let toastTimer = null;
  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  // Copy email
  const copyBtn = $("#copyEmailBtn");
  const email = "philiplgelinas@gmail.com";
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        showToast("Email copied to clipboard");
      } catch {
        // Fallback
        const ta = document.createElement("textarea");
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        showToast("Email copied");
      }
    });
  }

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const from = document.getElementById("from").value.trim();
      const message = document.getElementById("message").value.trim();

      const subject = encodeURIComponent(`Portfolio Contact — ${name || "Website"}`);
      const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${from}\n\n` +
        `${message}`
      );

      window.location.href =
        `mailto:philiplgelinas@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
