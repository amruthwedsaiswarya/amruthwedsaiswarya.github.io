// Everything guests read on the site comes from this file.
window.WEDDING = {
  // Shared links, WhatsApp messages and the QR code point here. Keep the trailing slash.
  siteUrl: "https://amruthwedsaiswarya.github.io/",

  couple: {
    one: "Amruth",
    two: "Aiswarya",
    monogram: "A & A",
    fullOne: "Amruth Rajan",
    fullTwo: "Aiswarya Raj C",
    familyOne: "S/o Rajan C & Sreeranjini K",
    familyTwo: "D/o Rajan C & Lisa C"
  },

  place: "Guruvayur · Kerala",

  // The wedding start drives the hero date and the countdown.
  date: {
    iso: "2026-11-22T07:30:00+05:30",
    weekday: "Sunday",
    day: "22",
    month: "November",
    year: "2026"
  },
  // Shown above the schedule.
  dateRange: "22 & 23 November 2026",
  malayalamDate: "Vrischikam 7, 1202",

  // Add, remove or reorder freely.
  events: [
    {
      id: "muhurtham",
      label: "The wedding",
      title: "Muhurtham",
      day: "Sunday · 22 Nov",
      startIso: "2026-11-22T07:30:00+05:30",
      endIso: "2026-11-22T09:30:00+05:30",
      time: "7:30 AM",
      timeNote: "to 9:30 AM",
      venue: "Guruvayur Sree Krishna Temple",
      address: "Guruvayur, Kerala",
      mapQuery: "Guruvayur Sree Krishna Temple, Guruvayur, Kerala",
      mapUrl: "https://maps.app.goo.gl/LXwUfnVjnASLAuyp7",
      mapCoords: "10.5946914,76.0394266",
      note: ""
    },
    {
      id: "ceremonies",
      calendar: false, // shown in the schedule, left out of "Add to your calendar"
      label: "The celebration",
      title: "Wedding Ceremonies",
      day: "Sunday · 22 Nov",
      startIso: "2026-11-22T10:00:00+05:30",
      endIso: "2026-11-22T13:00:00+05:30",
      time: "10:00 AM",
      timeNote: "to 1:00 PM",
      venue: "Devanganam Residency",
      address: "Guruvayur, Kerala",
      mapQuery: "Devanganam Residency, Guruvayur, Kerala",
      mapUrl: "https://maps.app.goo.gl/FempNwHEQXC9k1m89",
      mapCoords: "10.5959146,76.0414339",
      note: ""
    },
    {
      id: "reception",
      label: "The reception",
      title: "Reception",
      day: "Monday · 23 Nov",
      startIso: "2026-11-23T17:00:00+05:30",
      endIso: "2026-11-23T20:30:00+05:30",
      time: "5:00 PM",
      timeNote: "to 8:30 PM",
      venue: "Neelambari Auditorium",
      address: "Kannur, Kerala",
      mapQuery: "Neelambari Auditorium, Kannur, Kerala",
      mapUrl: "https://maps.app.goo.gl/qXXa8g1DbGgaFhMp6",
      mapCoords: "11.9116166,75.3576326",
      note: ""
    }
  ],

  heroPhoto: "./assets/images/hero.jpg",
  photos: [
    { src: "./assets/images/moment-01.jpg", caption: "Where it began" },
    { src: "./assets/images/moment-02.jpg", caption: "The yes" },
    { src: "./assets/images/moment-03.jpg", caption: "Our people" },
    { src: "./assets/images/moment-04.jpg", caption: "Little adventures" },
    { src: "./assets/images/moment-05.jpg", caption: "And now, forever" }
  ],

  // Leave empty to hide the music button.
  music: "./assets/audio/theme.mp3",

  shareMessage: "With great joy, we invite you to the wedding of Amruth & Aiswarya on Sunday, 22 November 2026 at Guruvayur."
};
