const projects = [
  {
    title: "Personal Portfolio Website",
    description: "A responsive portfolio website that presents my background, skills, and work. It has a mobile menu, a resume viewer, and a contact form that opens the visitor's email app. Projects and certificates are loaded with JavaScript, so I can add new entries without editing the HTML. I built it to practice CSS Grid, Flexbox, and accessibility.",
    tech: ["HTML", "CSS", "JavaScript"]
  }
];
const certificates = [];
/* ================================================================ */

const list = document.getElementById("work-list");
const tabs = document.querySelectorAll(".tabs button");

function el(tag, text, cls) {
  const n = document.createElement(tag);
  if (text) n.textContent = text;
  if (cls) n.className = cls;
  return n;
}

function emptyState(kind) {
  const box = el("div", "", "empty");
  box.append(el("h3", kind === "projects" ? "Projects are on the way" : "Certificates are on the way"));
  box.append(el("p", kind === "projects"
    ? "I’m working on my first portfolio projects. Check back soon, or send me a message to hear what I’m building."
    : "I’m working toward my first certifications. This space will fill up as I complete them."));
  return box;
}

function card(item, kind) {
  const c = el("article", "", "card");
  c.append(el("h3", item.title));
  if (kind === "projects") {
    c.append(el("p", item.description));
    if (item.tech && item.tech.length) {
      const t = el("div", "", "tags");
      item.tech.forEach(x => t.append(el("span", x)));
      c.append(t);
    }
  } else {
    c.append(el("p", item.issuer));
    c.append(el("p", item.date));
  }
  if (item.link) {
    const a = el("a", kind === "projects" ? "View project" : "View certificate");
    a.href = item.link; a.target = "_blank"; a.rel = "noopener noreferrer";
    c.append(a);
  }
  return c;
}

function render(kind) {
  const data = kind === "projects" ? projects : certificates;
  list.replaceChildren();
  if (!data.length) list.append(emptyState(kind));
  else data.forEach(i => list.append(card(i, kind)));
}

tabs.forEach(b => b.addEventListener("click", () => {
  tabs.forEach(x => x.setAttribute("aria-selected", x === b));
  render(b.dataset.tab);
}));
render("projects");

/* Mobile menu */
const btn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
btn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => {
  if (e.target.tagName === "A") { menu.classList.remove("open"); btn.setAttribute("aria-expanded", false); }
});

/* Close menu when tapping outside or pressing Escape */
document.addEventListener("click", e => {
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", false);
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { menu.classList.remove("open"); btn.setAttribute("aria-expanded", false); }
});

/* Highlight current section in nav */
const links = [...menu.querySelectorAll("a")];
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section").forEach(s => io.observe(s));

/* Contact form: validates, then opens the visitor's email app */
const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
  note.className = "form-note";
  if (!name || !email || !msg) { note.textContent = "Please fill in your name, email, and message."; return; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { note.textContent = "Please enter a valid email address."; return; }
  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent(msg + "\n\nFrom: " + name + " (" + email + ")");
  window.location.href = "mailto:nickobabaran65@gmail.com?subject=" + subject + "&body=" + body;
  note.className = "form-note ok";
  note.textContent = "Opening your email app. Thank you!";
  form.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();

/* Resume viewer */
const modal = document.getElementById("resume-modal");
const closeBtn = modal.querySelector(".modal-close");
function openResume() { modal.hidden = false; document.body.style.overflow = "hidden"; closeBtn.focus(); }
function closeResume() { modal.hidden = true; document.body.style.overflow = ""; }
document.querySelectorAll("[data-resume]").forEach(b => b.addEventListener("click", openResume));
closeBtn.addEventListener("click", closeResume);
modal.addEventListener("click", e => { if (e.target === modal) closeResume(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeResume(); });

/* Scroll reveal */
const revealTargets = document.querySelectorAll(
  ".section h2, .about-text, .skills, .info-grid > div, .tabs, .plan, .contact-grid > *"
);
const reveal = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
  });
}, { threshold: 0.15 });
revealTargets.forEach(t => { t.classList.add("reveal"); reveal.observe(t); });

/* Navbar shadow on scroll */
const navBar = document.querySelector(".nav");
addEventListener("scroll", () => navBar.classList.toggle("scrolled", scrollY > 10), { passive: true });

/* Scroll progress bar */
const progress = document.querySelector(".progress");
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = "scaleX(" + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ")";
}
addEventListener("scroll", updateProgress, { passive: true });
addEventListener("resize", updateProgress);
updateProgress();

/* Timeline line draws when visible */
const tlObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".timeline").forEach(t => tlObserver.observe(t));

/* Typing effect in hero */
const typedEl = document.getElementById("typed");
const phrases = [
  "Web developer in the making",
  "BSCS student at CvSU Bacoor",
  "Problem solver",
  "Fast learner"
];
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let p = 0, i = 0, deleting = false;
  (function tick() {
    const word = phrases[p];
    i += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, i);
    let delay = deleting ? 35 : 70;
    if (!deleting && i === word.length) { deleting = true; delay = 1600; }
    else if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 350; }
    setTimeout(tick, delay);
  })();
}