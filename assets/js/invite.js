(function () {
  "use strict";

  const config = window.WEDDING;
  const $ = (id) => document.getElementById(id);
  const DEFAULT_TEXT = [
    "With the blessings of our elders and hearts full of joy, we invite you to be with us as we begin our life together.",
    "Your presence will make the day complete."
  ];

  document.querySelectorAll("[data-name-one]").forEach((element) => { element.textContent = config.couple.one; });
  document.querySelectorAll("[data-name-two]").forEach((element) => { element.textContent = config.couple.two; });

  function toast(message) {
    const element = $("toast");
    element.textContent = message;
    element.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => element.classList.remove("show"), 2200);
  }

  function cleanName(value) {
    return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60)
      // "rahul and family" -> "Rahul and Family"
      .replace(/(^|[\s.(-])(\p{L})/gu, (match, before, letter) => before + letter.toUpperCase())
      .replace(/(\s)And(?=\s)/g, "$1and");
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/\r\n?/g, "\n")
      .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 500);
  }

  // The invitation lives one folder above this page.
  function siteUrl() {
    // Opened straight from a folder there is no web server, so the file has to be named.
    const home = window.location.protocol === "file:" ? "../index.html" : "../";
    return config.siteUrl || new URL(home, window.location.href.split(/[?#]/)[0]).toString();
  }

  function inviteUrl(name, text) {
    const url = new URL(siteUrl());
    if (name) url.searchParams.set("guest", name);
    if (text) url.searchParams.set("msg", text);
    return url.toString();
  }

  const nameInput = $("guestName");
  const textInput = $("inviteText");

  function preview() {
    const name = cleanName(nameInput.value);
    const text = cleanText(textInput.value);
    $("previewDear").textContent = name ? `Dear ${name},` : "";
    $("previewDear").hidden = !name;
    const lines = text ? text.split("\n").filter((line) => line.trim()) : DEFAULT_TEXT;
    $("previewBody").replaceChildren(...lines.map((line) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      return paragraph;
    }));
    $("textCount").textContent = String(textInput.value.length);
    $("result").hidden = true;
  }

  nameInput.addEventListener("input", preview);
  textInput.addEventListener("input", preview);
  preview();

  $("makerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = cleanName(nameInput.value);
    const text = cleanText(textInput.value);
    nameInput.value = name;
    const link = inviteUrl(name, text);
    const message = `${name ? `Dear ${name},\n` : ""}${text || config.shareMessage}\n\n${link}`;
    $("resultLink").value = link;
    $("whatsappResult").href = `https://wa.me/?text=${encodeURIComponent(message)}`;
    $("openResult").href = link;
    $("result").hidden = false;
    $("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  $("copyResult").addEventListener("click", async () => {
    const link = $("resultLink").value;
    try {
      await navigator.clipboard.writeText(link);
      toast("Link copied");
    } catch (error) {
      $("resultLink").select();
      toast("Press Ctrl+C to copy");
    }
  });
})();
