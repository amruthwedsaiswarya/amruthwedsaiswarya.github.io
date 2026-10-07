(function () {
  "use strict";

  const config = window.WEDDING;
  const params = new URLSearchParams(window.location.search);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);

  function fill(selector, text) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = text;
    });
  }

  function toast(message) {
    const element = $("toast");
    element.textContent = message;
    element.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => element.classList.remove("show"), 2200);
  }

  async function copyText(text, message) {
    try {
      await navigator.clipboard.writeText(text);
      toast(message);
    } catch (error) {
      window.prompt("Copy this:", text);
    }
  }

  function cleanName(value) {
    return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60)
      // "rahul and family" -> "Rahul and Family"
      .replace(/(^|[\s.(-])(\p{L})/gu, (match, before, letter) => before + letter.toUpperCase())
      .replace(/(\s)And(?=\s)/g, "$1and");
  }

  function baseUrl() {
    return config.siteUrl || window.location.origin + window.location.pathname;
  }

  // Keeps line breaks, unlike cleanName.
  function cleanText(value) {
    return String(value || "")
      .replace(/\r\n?/g, "\n")
      .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 500);
  }

  // Links made on the /invite page carry ?guest= (name) and ?msg= (invitation text).
  const guest = cleanName(params.get("guest") || params.get("to"));
  const inviteText = cleanText(params.get("msg"));

  function guestUrl(name) {
    const url = new URL(baseUrl());
    if (name) {
      url.searchParams.set("guest", name);
    }
    if (inviteText) {
      url.searchParams.set("msg", inviteText);
    }
    return url.toString();
  }

  function whatsappUrl(name) {
    const greeting = name ? `Dear ${name}, ` : "";
    return `https://wa.me/?text=${encodeURIComponent(`${greeting}${inviteText || config.shareMessage}\n${guestUrl(name)}`)}`;
  }

  /* ----- Text from config ----- */
  const fullDate = `${config.date.weekday}, ${config.date.day} ${config.date.month} ${config.date.year}`;

  function initText() {
    const { couple, date } = config;
    fill("[data-names]", `${couple.one} and ${couple.two}`);
    fill("[data-name-one]", couple.one);
    fill("[data-name-two]", couple.two);
    fill("[data-monogram]", couple.monogram);
    fill("[data-family-one]", couple.familyOne);
    fill("[data-family-two]", couple.familyTwo);
    fill("[data-place]", config.place);
    fill("[data-malayalam-date]", config.malayalamDate || "");
    fill("[data-weekday]", date.weekday);
    fill("[data-day]", date.day);
    fill("[data-month]", date.month);
    fill("[data-year]", date.year);
    fill("[data-full-date]", fullDate);
    fill("[data-date-range]", config.dateRange || fullDate);
    fill("[data-full-one]", couple.fullOne || couple.one);
    fill("[data-full-two]", couple.fullTwo || couple.two);
    $("ringText").textContent = `${couple.one} weds ${couple.two} · ${date.day} ${date.month} ${date.year} · `.repeat(2);

    if (guest) {
      $("coverGuest").textContent = guest;
      $("letterDear").textContent = `Dear ${guest},`;
      $("letterDear").hidden = false;
      document.title = `${guest} — you're invited · ${couple.one} weds ${couple.two}`;
    }
    if (inviteText) {
      const lines = inviteText.split("\n").filter((line) => line.trim());
      $("letterBody").replaceChildren(...lines.map((line) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = line;
        return paragraph;
      }));
    }
  }

  /* ----- Mandala ornament ----- */
  const MANDALA_RINGS = [[32, 80, 95, 5], [16, 52, 78, 10], [16, 58, 72, 4], [12, 26, 47, 8], [8, 8, 24, 6]];
  const MANDALA_CIRCLES = [99, 96, 79, 51, 48, 25, 7];

  function petalPath(inner, outer, width) {
    const mid = (inner + outer) / 2;
    return `M0,${-inner} C${width},${-mid} ${width},${-mid} 0,${-outer} C${-width},${-mid} ${-width},${-mid} 0,${-inner}Z`;
  }

  function petalRing(count, inner, outer, width) {
    const d = petalPath(inner, outer, width);
    let out = "";
    for (let i = 0; i < count; i += 1) {
      out += `<path d="${d}" transform="rotate(${(360 / count) * i})"/>`;
    }
    return out;
  }

  function initMandalas() {
    const svg =
      '<svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" stroke-width=".35">' +
      '<circle r="99"/><circle r="96"/>' +
      petalRing(32, 80, 95, 5) +
      '<circle r="79"/>' +
      petalRing(16, 52, 78, 10) +
      petalRing(16, 58, 72, 4) +
      '<circle r="51"/><circle r="48"/>' +
      petalRing(12, 26, 47, 8) +
      '<circle r="25"/>' +
      petalRing(8, 8, 24, 6) +
      '<circle r="7"/></svg>';
    document.querySelectorAll("[data-mandala]").forEach((element) => {
      element.innerHTML = svg;
    });
  }

  /* ----- Couple emblem ----- */
  function numericDate() {
    const [year, month, day] = config.date.iso.slice(0, 10).split("-");
    return `${day} · ${month} · ${year}`;
  }

  function initEmblems() {
    const initial = (name) => (String(name).match(/\p{L}/u) || ["•"])[0].toUpperCase();
    const one = initial(config.couple.one);
    const two = initial(config.couple.two);
    const svg =
      '<svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" stroke-width=".7">' +
      '<circle r="97"/><circle r="93" stroke-dasharray="1 3"/>' +
      petalRing(24, 73, 91, 5) +
      '<circle r="71"/><circle r="67" stroke-width=".35"/>' +
      '<g stroke="none" fill="currentColor" text-anchor="middle">' +
      `<text class="emblem-letters" y="12" font-size="64">${one}<tspan font-size="30" dy="-6" dx="2">&amp;</tspan><tspan dy="6" dx="2">${two}</tspan></text>` +
      `<text class="emblem-date" y="40" font-size="7.5">${numericDate()}</text>` +
      "</g></svg>";
    document.querySelectorAll("[data-emblem]").forEach((element) => {
      element.innerHTML = svg;
    });
  }

  /* ----- Photos ----- */
  function placeholder(label) {
    const box = document.createElement("div");
    box.className = "ph";
    const mark = document.createElement("b");
    mark.textContent = config.couple.monogram;
    const note = document.createElement("small");
    note.textContent = label;
    box.append(mark, note);
    return box;
  }

  function image(src, alt) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    return img;
  }

  function initPhotos() {
    const names = `${config.couple.one} and ${config.couple.two}`;
    $("heroPhoto").append(config.heroPhoto ? image(config.heroPhoto, names) : placeholder("Your photo"));

    const samples = ["Where it began", "The yes", "Our people", "Little adventures", "And now, forever"];
    const photos = config.photos.length ? config.photos : samples.map((caption) => ({ caption }));
    const strip = $("strip");
    photos.forEach((photo) => {
      const figure = document.createElement("figure");
      figure.className = "polaroid";
      const frame = document.createElement("div");
      frame.className = "polaroid-img";
      frame.append(photo.src ? image(photo.src, photo.caption || names) : placeholder("Photo"));
      figure.append(frame);
      const caption = document.createElement("figcaption");
      caption.textContent = photo.caption || "";
      figure.append(caption);
      strip.append(figure);
    });
  }

  /* ----- Calendar helpers ----- */
  function utcStamp(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  function eventTitle(event) {
    return `${config.couple.one} & ${config.couple.two} — ${event.title}`;
  }

  function googleCalendarUrl(event) {
    const query = new URLSearchParams({
      action: "TEMPLATE",
      text: eventTitle(event),
      dates: `${utcStamp(event.startIso)}/${utcStamp(event.endIso)}`,
      details: event.note || "",
      location: `${event.venue}, ${event.address}`
    });
    return `https://calendar.google.com/calendar/render?${query}`;
  }

  function saveBlob(blob, filename) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function downloadIcs(events, filename) {
    const escape = (text) => String(text).replace(/([,;\\])/g, "\\$1");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN"];
    events.forEach((event) => {
      lines.push(
        "BEGIN:VEVENT",
        `UID:${event.id}-${utcStamp(event.startIso)}@wedding`,
        `DTSTAMP:${utcStamp(new Date().toISOString())}`,
        `DTSTART:${utcStamp(event.startIso)}`,
        `DTEND:${utcStamp(event.endIso)}`,
        `SUMMARY:${escape(eventTitle(event))}`,
        `LOCATION:${escape(`${event.venue}, ${event.address}`)}`,
        `DESCRIPTION:${escape(event.note || "")}`,
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    saveBlob(new Blob([lines.join("\r\n")], { type: "text/calendar" }), filename);
  }

  /* ----- Timeline ----- */
  function el(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function linkButton(className, text, href) {
    const link = el("a", className, text);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function initTimeline() {
    const timeline = $("timeline");
    const calendarChips = $("calendarChips");

    config.events.forEach((event) => {
      const place = encodeURIComponent(event.mapQuery || `${event.venue}, ${event.address}`);

      const time = el("div", "ticket-time");
      time.append(el("small", "", event.label), el("em", "", event.day), el("strong", "", event.time), el("span", "", event.timeNote));

      const chips = el("div", "chips");
      chips.append(
        linkButton("btn btn--solid", "Open map", event.mapUrl || `https://www.google.com/maps/search/?api=1&query=${place}`),
        linkButton("btn btn--line", "Directions", `https://www.google.com/maps/dir/?api=1&destination=${event.mapCoords || place}`)
      );
      const copyVenue = el("button", "btn btn--text", "Copy address");
      copyVenue.type = "button";
      copyVenue.addEventListener("click", () => copyText(`${event.venue}, ${event.address}`, "Address copied"));
      chips.append(copyVenue);

      const body = el("div", "ticket-body");
      body.append(
        el("h3", "", event.title),
        el("p", "ticket-venue", event.venue),
        el("p", "ticket-addr", event.address),
        chips
      );
      if (event.note) {
        chips.before(el("p", "ticket-note", event.note));
      }

      const ticket = el("article", "ticket");
      ticket.append(time, body);
      const stop = el("li", "stop reveal");
      stop.append(ticket);
      timeline.append(stop);

      calendarChips.append(linkButton("btn btn--solid", event.title, googleCalendarUrl(event)));
      const ics = el("button", "btn btn--line", `${event.title} .ics`);
      ics.type = "button";
      ics.addEventListener("click", () => downloadIcs([event], `${event.id}.ics`));
      calendarChips.append(ics);
    });

    if (config.events.length > 1) {
      const all = el("button", "btn btn--text", config.events.length === 2 ? "Add both events" : "Add all events");
      all.type = "button";
      all.addEventListener("click", () => downloadIcs(config.events, "wedding-events.ics"));
      calendarChips.append(all);
    }
  }

  /* ----- Save-the-date card (drawn on a canvas so it can be downloaded) ----- */
  function drawSaveCard(canvas) {
    const context = canvas.getContext("2d");
    const { width, height } = canvas;
    const centre = width / 2;

    const glow = context.createRadialGradient(centre, 380, 60, centre, 600, 1000);
    glow.addColorStop(0, "#1c4a40");
    glow.addColorStop(0.6, "#0f2f29");
    glow.addColorStop(1, "#0a211d");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(centre, 600);
    context.scale(5.8, 5.8);
    context.strokeStyle = "rgba(220, 196, 141, .14)";
    context.lineWidth = 0.35;
    MANDALA_CIRCLES.forEach((radius) => {
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.stroke();
    });
    MANDALA_RINGS.forEach(([count, inner, outer, petalWidth]) => {
      const petal = new Path2D(petalPath(inner, outer, petalWidth));
      for (let i = 0; i < count; i += 1) {
        context.stroke(petal);
        context.rotate((Math.PI * 2) / count);
      }
    });
    context.restore();

    context.strokeStyle = "#dcc48d";
    context.lineWidth = 2;
    context.strokeRect(40, 40, width - 80, height - 80);
    context.lineWidth = 1;
    context.strokeRect(56, 56, width - 112, height - 112);

    const text = (value, y, font, colour, spacing) => {
      context.font = font;
      context.fillStyle = colour;
      context.textAlign = "center";
      if ("letterSpacing" in context) context.letterSpacing = spacing || "0px";
      context.fillText(value, centre, y, width - 180);
    };

    const { couple, date } = config;
    text("SAVE THE DATE", 230, '500 28px "Jost", sans-serif', "#dcc48d", "12px");
    text(couple.one, 440, '190px "Pinyon Script", cursive', "#f8f2e6");
    text("WEDS", 525, '500 26px "Jost", sans-serif', "#e59a80", "14px");
    text(couple.two, 700, '190px "Pinyon Script", cursive', "#f8f2e6");

    context.fillStyle = "#dcc48d";
    context.fillRect(centre - 60, 790, 120, 1.5);

    text(`${date.weekday} · ${date.day} ${date.month} ${date.year}`, 870, '46px "Marcellus", serif', "#f8f2e6", "1px");
    if (config.malayalamDate) {
      text(config.malayalamDate, 925, '30px "Marcellus", serif', "#dcc48d", "2px");
    }

    let y = 1030;
    config.events.slice(0, 2).forEach((event) => {
      text(`${event.title} · ${event.day} · ${event.time} ${event.timeNote}`.toUpperCase(), y, '500 22px "Jost", sans-serif', "#dcc48d", "4px");
      text(`${event.venue}, ${event.address}`, y + 44, '300 32px "Jost", sans-serif', "#f8f2e6", "0px");
      y += 120;
    });
  }

  function initSaveCard() {
    const canvas = $("saveCard");
    const fonts = ['190px "Pinyon Script"', '46px "Marcellus"', '300 32px "Jost"', '500 28px "Jost"'];
    const ready = document.fonts ? Promise.all(fonts.map((font) => document.fonts.load(font))) : Promise.resolve();
    ready.catch(() => {}).then(() => drawSaveCard(canvas));
    drawSaveCard(canvas);

    $("downloadCard").addEventListener("click", () => {
      canvas.toBlob((blob) => {
        if (blob) saveBlob(blob, "save-the-date.png");
      }, "image/png");
    });
  }

  /* ----- QR code ----- */
  function initQr() {
    const canvas = $("qrCanvas");
    const url = guestUrl(guest);
    $("qrUrl").textContent = url;
    if (typeof window.qrcode !== "function") {
      return;
    }
    const qr = window.qrcode(0, "M");
    qr.addData(url);
    qr.make();
    const count = qr.getModuleCount();
    const cell = 12;
    const margin = 3;
    canvas.width = canvas.height = (count + margin * 2) * cell;
    const context = canvas.getContext("2d");
    context.fillStyle = "#fffaf0";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#0a211d";
    for (let row = 0; row < count; row += 1) {
      for (let column = 0; column < count; column += 1) {
        if (qr.isDark(row, column)) {
          context.fillRect((column + margin) * cell, (row + margin) * cell, cell, cell);
        }
      }
    }
    $("downloadQr").addEventListener("click", () => {
      canvas.toBlob((blob) => {
        if (blob) saveBlob(blob, "wedding-qr.png");
      }, "image/png");
    });
  }

  /* ----- Countdown ----- */
  function initCountdown() {
    const target = Date.parse(config.date.iso);
    const dials = $("dials");
    const circumference = 276.46;
    const units = {};
    dials.querySelectorAll(".dial").forEach((dial) => {
      units[dial.dataset.unit] = { value: dial.querySelector("strong"), arc: dial.querySelector(".dial-arc") };
    });

    function set(unit, value, max) {
      units[unit].value.textContent = String(value).padStart(2, "0");
      units[unit].arc.style.strokeDashoffset = String(circumference * (1 - Math.min(value / max, 1)));
    }

    let timer = 0;
    function tick() {
      const left = target - Date.now();
      if (!Number.isFinite(target) || left <= 0) {
        window.clearInterval(timer);
        const sameDay = Number.isFinite(target) && Date.now() - target < 86_400_000;
        $("countdownTitle").textContent = sameDay ? "Today is the day" : "Happily married";
        dials.replaceChildren(el("p", "dials-done", sameDay ? "See you there" : `Since ${config.date.day} ${config.date.month} ${config.date.year}`));
        return;
      }
      set("days", Math.floor(left / 86_400_000), 365);
      set("hours", Math.floor(left / 3_600_000) % 24, 24);
      set("minutes", Math.floor(left / 60_000) % 60, 60);
      set("seconds", Math.floor(left / 1000) % 60, 60);
    }

    timer = window.setInterval(tick, 1000);
    tick();
  }

  /* ----- Share + host mode ----- */
  function initShare() {
    $("whatsappShare").href = whatsappUrl(guest);
    $("copyLink").addEventListener("click", () => copyText(guestUrl(guest), "Link copied"));
    $("shareNative").addEventListener("click", async () => {
      const url = guestUrl(guest);
      if (!navigator.share) {
        copyText(url, "Link copied");
        return;
      }
      try {
        await navigator.share({ title: document.title, text: `${guest ? `Dear ${guest}, ` : ""}${inviteText || config.shareMessage}`, url });
      } catch (error) {
        // Share sheet dismissed.
      }
    });
  }

  /* ----- Scroll: reveal, rail, progress ----- */
  function initScroll() {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((element) => revealer.observe(element));

    const links = [...document.querySelectorAll(".dock a")];
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => link.classList.toggle("is-active", link.hash === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    links.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) spy.observe(section);
    });

    const bar = $("progressBar");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- Falling petals ----- */
  function initPetals() {
    const canvas = $("petals");
    if (reducedMotion) {
      canvas.remove();
      return () => {};
    }
    const context = canvas.getContext("2d");
    const colours = ["#f3e6c4", "#dcc48d", "#e9a86a", "#fff8ea"];
    let petals = [];
    let running = false;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function frame() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      petals = petals.filter((petal) => petal.y < canvas.height + 30);
      petals.forEach((petal) => {
        petal.y += petal.speed;
        petal.x += Math.sin(petal.y / 40 + petal.phase) * 0.9;
        petal.spin += petal.turn;
        context.save();
        context.translate(petal.x, petal.y);
        context.rotate(petal.spin);
        context.globalAlpha = 0.85;
        context.fillStyle = petal.colour;
        context.beginPath();
        context.ellipse(0, 0, petal.size, petal.size * 0.55, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });
      if (petals.length) {
        window.requestAnimationFrame(frame);
      } else {
        running = false;
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    window.addEventListener("resize", resize);
    resize();

    return function shower(count) {
      for (let i = 0; i < count; i += 1) {
        petals.push({
          x: Math.random() * canvas.width,
          y: -20 - Math.random() * canvas.height * 0.6,
          size: 5 + Math.random() * 6,
          speed: 1.4 + Math.random() * 2.2,
          phase: Math.random() * 6,
          spin: Math.random() * 6,
          turn: (Math.random() - 0.5) * 0.06,
          colour: colours[i % colours.length]
        });
      }
      if (!running) {
        running = true;
        window.requestAnimationFrame(frame);
      }
    };
  }

  /* ----- Music ----- */
  function initMusic() {
    const button = $("music");
    const audio = $("audio");
    if (!config.music) {
      return () => {};
    }
    audio.src = config.music;
    audio.volume = 0.4;
    button.hidden = false;
    const sync = () => {
      const playing = !audio.paused;
      button.setAttribute("aria-pressed", String(playing));
      button.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    };
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    button.addEventListener("click", () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()));
    return () => audio.play().catch(() => {});
  }

  /* ----- Envelope ----- */
  function initCover(shower, startMusic) {
    const cover = $("cover");
    // Always start from the top, even if the browser remembers an older scroll position.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();

    const unseal = () => {
      toTop();
      document.body.classList.remove("is-sealed");
      toTop();
      cover.classList.add("is-gone");
      window.setTimeout(() => cover.remove(), 1200);
    };

    // ?open=1 skips the envelope (handy while editing).
    if (params.get("open") === "1") {
      document.body.classList.remove("is-sealed");
      cover.remove();
      return;
    }

    const seal = $("openSeal");
    seal.addEventListener("click", () => {
      cover.classList.add("is-opening");
      startMusic();
      shower(46);
      window.setTimeout(unseal, reducedMotion ? 0 : 1500);
    }, { once: true });
    seal.focus({ preventScroll: true });
  }

  initText();
  initMandalas();
  initPhotos();
  initTimeline();
  initCountdown();
  initEmblems();
  initSaveCard();
  initQr();
  initShare();
  initScroll();
  initCover(initPetals(), initMusic());
})();
