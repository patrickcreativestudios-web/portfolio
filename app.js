(() => {
  const WORKS = window.WORKS || [];
  const CATS = {
    luxury: "Luxury Real Estate",
    reshorts: "Real Estate Shorts",
    realestate: "Real Estate YouTube",
    shortform: "Short Form",
    ugc: "UGC / TikTok / Meta",
  };
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover)").matches;

  const src = {
    web: (w) => `media/web/${w.id}.mp4`,
    prev: (w) => `media/previews/${w.id}.mp4`,
    poster: (w) => `media/posters/${w.id}.jpg`,
  };
  const timecode = (s) => {
    s = Math.round(s);
    const p = (n) => String(n).padStart(2, "0");
    return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
  };
  const ratio = (w) => {
    const r = w.w / w.h;
    if (r > 1.5) return "16:9";
    if (r > 0.95) return "1:1";
    if (r > 0.7) return "4:5";
    return "9:16";
  };
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* ---------- hero letters ---------- */
  document.querySelectorAll(".title span").forEach((s, i) => s.style.setProperty("--i", i));

  /* ---------- fan of cards ---------- */
  const fan = document.getElementById("fan");
  const pick = (id) => WORKS.find((w) => w.id === id);
  const fanItems = [
    { work: pick("ugc-ugc-alexis-billo-1") },
    { work: pick("luxury-luxuryedit-patrick"), tag: "LUXURY<br>LISTING" },
    { red: true },
    { portrait: true },
    { work: pick("reshorts-reel-80-nantucket"), tag: "REAL<br>ESTATE" },
    { work: pick("ugc-aerre-v1-video-editor-aptitude-test"), tag: "BRAND<br>AD" },
    { work: pick("shortform-leif-jacobson") },
  ];
  const n = fanItems.length;
  const spread = innerWidth < 560 ? 52 : 40;
  fanItems.forEach((item, i) => {
    const card = el("div", "fan-card");
    const a = -spread + (2 * spread * i) / (n - 1);
    card.style.setProperty("--a", `${a}deg`);
    card.style.setProperty("--i", i);
    card.style.zIndex = n - Math.abs(i - Math.floor(n / 2));
    if (item.red) {
      card.classList.add("red");
      card.innerHTML = `<img src="assets/mark.svg" alt="">`;
    } else if (item.portrait) {
      card.classList.add("portrait");
      card.innerHTML = `<img src="assets/me.jpg" alt=""><span class="tag">PF<br>2026</span>`;
    } else if (item.work) {
      const v = el("video");
      Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: !reduceMotion, poster: src.poster(item.work) });
      v.setAttribute("muted", "");
      v.src = src.prev(item.work);
      card.append(v);
      if (item.tag) card.append(el("span", "tag", item.tag));
      card.addEventListener("click", () => openLightbox(WORKS.indexOf(item.work)));
      card.style.cursor = "pointer";
    }
    fan.append(card);
  });

  /* ---------- filters ---------- */
  const filters = document.getElementById("filters");
  let current = "all";
  const counts = WORKS.reduce((m, w) => ((m[w.cat] = (m[w.cat] || 0) + 1), m), {});
  const filterList = [["all", "All", WORKS.length], ...Object.entries(CATS).map(([k, v]) => [k, v, counts[k] || 0])];
  filterList.forEach(([key, label, count]) => {
    const b = el("button", "chip", `${label} <small>${count}</small>`);
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", key === "all");
    b.addEventListener("click", () => {
      current = key;
      filters.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-selected", c === b));
      tiles.forEach((t) => t.classList.toggle("hide", key !== "all" && t.dataset.cat !== key));
      layout();
    });
    filters.append(b);
  });

  /* ---------- grid ---------- */
  const grid = document.getElementById("grid");
  const tiles = WORKS.map((w, i) => {
    const t = el("button", "tile");
    const r = ratio(w);
    if (r === "16:9") t.classList.add("wide");
    t.dataset.cat = w.cat;
    t.dataset.ar = w.h / w.w;
    t.setAttribute("aria-label", `Play ${w.title}`);
    t.innerHTML = `
      <img src="${src.poster(w)}" alt="" loading="lazy" decoding="async">
      <video muted loop playsinline preload="none"></video>
      <div class="badges"><span class="badge">${timecode(w.dur)}</span><span class="badge red">${r}</span></div>
      <span class="play" aria-hidden="true"></span>
      <div class="tile-info"><h3>${w.title}</h3><p>${w.client ? w.client + " | " : ""}${CATS[w.cat]}</p></div>`;
    t.addEventListener("click", () => openLightbox(i));
    grid.append(t);
    return t;
  });

  // masonry: each tile spans rows proportional to its aspect ratio
  function layout() {
    const cols = parseInt(getComputedStyle(grid).getPropertyValue("--cols")) || 1;
    const gap = 18, row = 8;
    const colW = (grid.clientWidth - gap * (cols - 1)) / cols;
    tiles.forEach((t) => {
      if (t.classList.contains("hide")) return;
      const span = t.classList.contains("wide") && cols > 1 ? 2 : 1;
      const w = colW * span + gap * (span - 1);
      const h = Math.min(w * parseFloat(t.dataset.ar), cols === 1 ? innerHeight * 0.8 : Infinity);
      t.style.gridRowEnd = `span ${Math.ceil((h + gap) / row)}`;
      t.style.height = `${h}px`;
    });
  }
  new ResizeObserver(layout).observe(grid);

  // hover / in-view previews, only one at a time
  let active = null;
  const startPreview = (t) => {
    if (reduceMotion || active === t) return;
    stopPreview();
    const v = t.querySelector("video");
    if (!v.src) v.src = src.prev(WORKS[tiles.indexOf(t)]);
    v.play().then(() => t.classList.add("playing")).catch(() => {});
    active = t;
  };
  const stopPreview = () => {
    if (!active) return;
    active.querySelector("video").pause();
    active.classList.remove("playing");
    active = null;
  };
  if (canHover) {
    tiles.forEach((t) => {
      t.addEventListener("mouseenter", () => startPreview(t));
      t.addEventListener("mouseleave", stopPreview);
    });
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) startPreview(e.target);
        else if (e.target === active) stopPreview();
      }),
      { threshold: 0.75 }
    );
    tiles.forEach((t) => io.observe(t));
  }

  /* ---------- lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbVideo = document.getElementById("lbVideo");
  let idx = 0;
  const visible = () => WORKS.map((_, i) => i).filter((i) => !tiles[i].classList.contains("hide"));
  function openLightbox(i) {
    idx = i;
    stopPreview();
    const w = WORKS[i];
    document.getElementById("lbTitle").textContent = w.title;
    document.getElementById("lbCat").textContent = `${CATS[w.cat]} | ${ratio(w)} | ${timecode(w.dur)}`;
    lbVideo.poster = src.poster(w);
    lbVideo.src = src.web(w);
    if (!lb.open) lb.showModal();
    lbVideo.play().catch(() => {});
  }
  const step = (d) => {
    const list = visible();
    const pos = list.indexOf(idx);
    openLightbox(list[(pos + d + list.length) % list.length]);
  };
  document.getElementById("lbPrev").addEventListener("click", () => step(-1));
  document.getElementById("lbNext").addEventListener("click", () => step(1));
  document.getElementById("lbClose").addEventListener("click", () => lb.close());
  lb.addEventListener("close", () => { lbVideo.pause(); lbVideo.removeAttribute("src"); lbVideo.load(); });
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-inner")) lb.close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.open) return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  /* ---------- scroll reveal ---------- */
  const rio = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((n) => rio.observe(n));
})();
