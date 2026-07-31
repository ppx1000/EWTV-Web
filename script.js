const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");
const filterButtons = document.querySelectorAll("[data-filter]");
const scheduleRows = document.querySelectorAll("[data-schedule] .schedule-row");
const scheduleNote = document.querySelector("[data-schedule-note]");
const scheduleEmpty = document.querySelector("[data-day-empty]");
const contactButtons = document.querySelectorAll("[data-contact-picker] button");
const mailLink = document.querySelector("[data-mail-link]");
const faqItems = document.querySelectorAll("[data-faq] .faq-item");
const ageGroupButtons = document.querySelectorAll("[data-age-group]");
const goalButtons = document.querySelectorAll("[data-goal]");
const experienceButtons = document.querySelectorAll("[data-experience]");
const finderTitle = document.querySelector("[data-finder-title]");
const finderCopy = document.querySelector("[data-finder-copy]");
const finderExtra = document.querySelector("[data-finder-extra]");
const finderMail = document.querySelector("[data-finder-mail]");
const quizSteps = document.querySelectorAll("[data-quiz-step]");
const quizTrack = document.querySelector("[data-quiz-track]");
const quizProgressItems = document.querySelectorAll("[data-quiz-progress]");
const quizNextButtons = document.querySelectorAll("[data-quiz-next]");
const quizRestart = document.querySelector("[data-quiz-restart]");
const finderResult = document.querySelector("[data-finder-result]");
const finderPlaceholder = document.querySelector("[data-finder-placeholder]");
const apparatusButtons = document.querySelectorAll("[data-apparatus-key]");
const apparatusTitle = document.querySelector("[data-apparatus-title]");
const apparatusCopy = document.querySelector("[data-apparatus-copy]");
const motionSymbol = document.querySelector("[data-motion-symbol]");
const apparatusImage = document.querySelector("[data-apparatus-image]");
const apparatusDetail = document.querySelector("[data-apparatus-detail]");
const apparatusLab = document.querySelector("[data-apparatus]");
const timelineButtons = document.querySelectorAll("[data-year]");
const timelineYear = document.querySelector("[data-timeline-year]");
const timelineTitle = document.querySelector("[data-timeline-title]");
const timelineCopy = document.querySelector("[data-timeline-copy]");
const trainerCards = document.querySelectorAll("[data-trainer-card]");
const trainerProfile = document.querySelector("[data-trainer-profile]");
const profilePhoto = document.querySelector("[data-profile-photo]");
const profileLabel = document.querySelector("[data-profile-label]");
const profileName = document.querySelector("[data-profile-name]");
const profileText = document.querySelector("[data-profile-text]");
const profileFocus = document.querySelector("[data-profile-focus]");
const profileSwitcher = document.querySelector("[data-profile-switcher]");

document.body.classList.add("js-enabled");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", document.body.classList.contains("trainer-page") || window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const next = button.dataset.tab;

    tabButtons.forEach((tab) => {
      const isActive = tab === button;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === next);
    });
  });
});

const selectScheduleDay = (button) => {
  const day = button.dataset.filter;
  let visibleCount = 0;

  filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  scheduleRows.forEach((row) => {
    const isVisible = row.dataset.day === day;
    row.classList.toggle("is-hidden", !isVisible);
    row.classList.remove("is-selected");
    if (isVisible) visibleCount += 1;
  });

  scheduleEmpty?.classList.toggle("is-hidden", visibleCount > 0);

  if (scheduleNote) {
    scheduleNote.textContent = `${button.textContent} ausgewählt: Wähle eine Stunde, um Details zu sehen.`;
  }
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => selectScheduleDay(button));
});

if (filterButtons.length > 0) {
  selectScheduleDay(document.querySelector("[data-filter].is-active") ?? filterButtons[0]);
}

scheduleRows.forEach((row) => {
  row.addEventListener("click", () => {
    scheduleRows.forEach((item) => item.classList.remove("is-selected"));
    row.classList.add("is-selected");
    if (scheduleNote) {
      scheduleNote.textContent = row.dataset.note ?? "Details zu dieser Stunde.";
    }
  });
});

const updateMailLink = (group) => {
  if (!mailLink) return;

  const isWaitlistGroup = ["Kleinkinderturnstunde", "Kinderturnen", "Jugendturnen"].includes(group);
  const subject = `${isWaitlistGroup ? "Wartelisten-Anfrage" : "Anfrage"} ${group}`;
  const body = [
    "Liebes EWTV-Team,",
    "",
    isWaitlistGroup
      ? "ich möchte mich bzw. mein Kind gerne auf die Warteliste setzen lassen."
      : "ich interessiere mich für das Erwachsenentraining und möchte gerne weitere Informationen erhalten.",
    "",
    "Name:",
    "Alter:",
    `Gewünschte Gruppe: ${group}`,
    "Mögliche Trainingstage:",
    "Telefonnummer:",
    "",
    "Vielen Dank!"
  ].join("\r\n");

  mailLink.href = `mailto:office@ewtv.at?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

contactButtons.forEach((button) => {
  button.addEventListener("click", () => {
    contactButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    updateMailLink(button.dataset.subject ?? "Turnstunde");
  });
});

faqItems.forEach((item) => {
  const button = item.querySelector("button");

  button?.addEventListener("click", () => {
    const shouldOpen = !item.classList.contains("is-open");

    faqItems.forEach((faq) => {
      faq.classList.remove("is-open");
      faq.querySelector("button")?.setAttribute("aria-expanded", "false");
    });

    item.classList.toggle("is-open", shouldOpen);
    button.setAttribute("aria-expanded", String(shouldOpen));
  });
});

const finderCopyByGroup = {
  "Kleinkinderturnstunde": "Für 4-6 Jahre: spielerischer Einstieg, Koordination und erste Turngrundlagen.",
  Kinderturnen: "Für 6-9 Jahre: klare Grundlagen, Bewegungssicherheit und Freude am Turnen.",
  Jugendturnen: "Für 10-14 Jahre: mehr Technik, Kraft und selbstständiges Training in der Gruppe.",
  Erwachsene: "Ab 15 Jahren: Kraft, Mobilität und turnerische Basics ohne Leistungsdruck. Diese Gruppe ist aktuell nicht voll."
};

const getFinderGroup = () => {
  const ageGroup = document.querySelector("[data-age-group].is-active")?.dataset.ageGroup ?? "4-6";

  if (ageGroup === "4-6") return "Kleinkinderturnstunde";
  if (ageGroup === "6-9") return "Kinderturnen";
  if (ageGroup === "10-14") return "Jugendturnen";
  return "Erwachsene";
};

let activeQuizStep = 0;
let quizIsComplete = false;

const quizPromptByStep = [
  "Wähle zuerst das Alter aus.",
  "Wähle aus, was beim Training im Vordergrund stehen soll.",
  "Sag noch kurz, wie viel Turnerfahrung schon vorhanden ist."
];

const getQuizButtonsForStep = (stepIndex) => {
  if (stepIndex === 0) return ageGroupButtons;
  if (stepIndex === 1) return goalButtons;
  return experienceButtons;
};

const updateQuizNextButton = (stepIndex) => {
  const step = document.querySelector(`[data-quiz-step="${stepIndex}"]`);
  const nextButton = step?.querySelector("[data-quiz-next]");
  if (!nextButton) return;

  const hasAnswer = Array.from(getQuizButtonsForStep(stepIndex)).some((button) => button.classList.contains("is-active"));
  nextButton.disabled = !hasAnswer;
};

const setQuizStep = (nextStep) => {
  activeQuizStep = Math.min(Math.max(nextStep, 0), quizSteps.length - 1);

  quizSteps.forEach((step) => {
    const stepIndex = Number(step.dataset.quizStep ?? 0);
    step.classList.toggle("is-active", stepIndex === activeQuizStep && !quizIsComplete);
    step.classList.toggle("is-complete", stepIndex < activeQuizStep || quizIsComplete);
  });

  quizProgressItems.forEach((item) => {
    const progressIndex = Number(item.dataset.quizProgress ?? 0);
    const activeProgressIndex = quizIsComplete ? quizSteps.length : activeQuizStep;
    item.classList.toggle("is-active", progressIndex === activeProgressIndex);
    item.classList.toggle("is-done", progressIndex < activeProgressIndex);
  });

  if (finderPlaceholder && !quizIsComplete) {
    finderPlaceholder.querySelector("strong").textContent = `Frage ${activeQuizStep + 1} von ${quizSteps.length}`;
    finderPlaceholder.querySelector("span").textContent = quizPromptByStep[activeQuizStep] ?? "";
  }

  finderResult?.classList.toggle("is-complete", quizIsComplete);
  quizTrack?.classList.toggle("is-complete", quizIsComplete);
  updateQuizNextButton(activeQuizStep);
};

const completeQuiz = () => {
  quizIsComplete = true;
  updateFinder();
  setQuizStep(activeQuizStep);
};

const answerQuizStep = (buttons, selectedButton) => {
  buttons.forEach((item) => item.classList.toggle("is-active", item === selectedButton));
  updateFinder();
  updateQuizNextButton(activeQuizStep);
};

const resetQuiz = () => {
  quizIsComplete = false;
  [...ageGroupButtons, ...goalButtons, ...experienceButtons].forEach((button) => {
    button.classList.remove("is-active");
  });
  quizNextButtons.forEach((button) => {
    button.disabled = true;
  });
  updateFinder();
  setQuizStep(0);
};

const updateFinder = () => {
  if (!finderTitle || !finderCopy || !finderMail) return;

  const group = getFinderGroup();
  const activeGoalButton = document.querySelector("[data-goal].is-active");
  const activeExperienceButton = document.querySelector("[data-experience].is-active");
  const activeGoal = activeGoalButton?.textContent?.trim() ?? "Spielerisch bewegen und Turngrundlagen lernen";
  const activeExperience = activeExperienceButton?.textContent?.trim() ?? "Noch keine";
  const experienceKey = activeExperienceButton?.dataset.experience ?? "keine";
  const canMentionCompetition = experienceKey === "regelmaessig" && ["Kinderturnen", "Jugendturnen"].includes(group);

  finderTitle.textContent = group;
  finderCopy.textContent = finderCopyByGroup[group];
  if (finderExtra) {
    finderExtra.hidden = !canMentionCompetition;
    finderExtra.textContent = canMentionCompetition
      ? "Wettkampfturnen wird von unseren TrainerInnen empfohlen, wenn es zum Kind und zum Trainingsstand passt."
      : "";
  }
  finderMail.textContent =
    group === "Erwachsene"
      ? "Erwachsenentraining anfragen"
      : "Diese Warteliste anfragen";
  const isFinderWaitlistGroup = ["Kleinkinderturnstunde", "Kinderturnen", "Jugendturnen"].includes(group);
  const subject = `${isFinderWaitlistGroup ? "Wartelisten-Anfrage" : "Anfrage"} ${group}`;
  const bodyParts = [
    "Liebes EWTV-Team,",
    "",
    "ich interessiere mich für ein passendes Turnangebot und möchte mich beziehungsweise mein Kind gerne auf die Warteliste setzen lassen.",
    "",
    "Aufgrund unserer Angaben wurde folgende Gruppe empfohlen:",
    "",
    `Empfohlene Gruppe: ${group}`,
    `Gewünschter Trainingsschwerpunkt: ${activeGoal}`,
    `Turnerfahrung: ${activeExperience}`,
    "",
    "Name:",
    "Alter:",
    "Telefonnummer:",
    "",
    "Vielen Dank! Wir freuen uns über eine Rückmeldung, sobald ein passender Platz frei wird.",
    "Liebe Grüße",
    "NAME"
  ];
  finderMail.href = `mailto:office@ewtv.at?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyParts.join("\r\n"))}`;
};

ageGroupButtons.forEach((button) => {
  button.addEventListener("click", () => {
    answerQuizStep(ageGroupButtons, button);
  });
});

goalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    answerQuizStep(goalButtons, button);
  });
});

experienceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    answerQuizStep(experienceButtons, button);
  });
});

quizNextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) return;
    if (activeQuizStep >= quizSteps.length - 1) {
      completeQuiz();
      return;
    }
    setQuizStep(activeQuizStep + 1);
  });
});

quizRestart?.addEventListener("click", resetQuiz);

updateFinder();
setQuizStep(0);

const apparatusContent = {
  boden: {
    symbol: "B",
    title: "Boden",
    image: "assets/apparatus-boden.jpg?v=3",
    alt: "Stilisierte Turnszene am Gerät Boden",
    copy: "Rollen, Stützen, Körperspannung und sichere Landungen bilden die Basis für vieles, was später an Geräten gebraucht wird."
  },
  reck: {
    symbol: "R",
    title: "Reck",
    image: "assets/apparatus-reck.jpg?v=3",
    alt: "Stilisierte Turnszene am Reck",
    copy: "Am Reck geht es um Griffkraft, Körperspannung und kontrolliertes Schwingen. Saubere Grundlagen machen hier den Unterschied."
  },
  barren: {
    symbol: "Ba",
    title: "Barren",
    image: "assets/apparatus-barren.jpg?v=3",
    alt: "Stilisierte Turnszene am Barren",
    copy: "Stützen, Schwingen und Halten verbinden Kraft mit Technik. Der Barren zeigt schnell, wie wichtig stabile Grundlagen sind."
  },
  balken: {
    symbol: "Bl",
    title: "Balken",
    image: "assets/apparatus-balken.jpg?v=3",
    alt: "Stilisierte Turnszene am Balken",
    copy: "Am Balken stehen Gleichgewicht, Körperspannung und konzentrierte Bewegungen im Mittelpunkt. Kleine Schritte werden hier sehr bewusst trainiert."
  },
  sprung: {
    symbol: "S",
    title: "Sprung",
    image: "assets/apparatus-sprung.jpg?v=3",
    alt: "Stilisierte Turnszene am Sprung",
    copy: "Anlauf, Abdruck und Landung werden Schritt für Schritt aufgebaut. Sicherheit und Rhythmus stehen immer vor Tempo."
  },
  minitramp: {
    symbol: "M",
    title: "Minitramp",
    image: "assets/apparatus-minitramp.jpg?v=3",
    alt: "Stilisierte Turnszene am Minitramp",
    copy: "Beim Minitramp zählen Spannung, Absprung und eine kontrollierte Landung. Es bringt Dynamik ins Training, bleibt aber klar angeleitet."
  }
};

const scrollToApparatus = () => {
  const target = apparatusLab ?? apparatusDetail;
  if (!target) return;

  const headerOffset = 120;
  const top = target.offsetTop - headerOffset;
  window.scrollTo({ top: Math.max(top, 0), behavior: "auto" });
};

apparatusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = apparatusContent[button.dataset.apparatusKey];
    if (!item || !apparatusTitle || !apparatusCopy || !motionSymbol) return;

    apparatusButtons.forEach((entry) => entry.classList.toggle("is-active", entry === button));
    if (apparatusImage) {
      apparatusImage.src = item.image;
      apparatusImage.alt = item.alt;
    }
    motionSymbol.textContent = item.symbol;
    apparatusTitle.textContent = item.title;
    apparatusCopy.textContent = item.copy;
    motionSymbol.style.animation = "none";
    button.blur();
    requestAnimationFrame(() => {
      motionSymbol.style.animation = "";
      window.setTimeout(scrollToApparatus, 40);
    });
  });
});

const trainerContent = [
  {
    key: "christopher",
    name: "Christopher",
    label: "Kleinkinder, Kinder & Wettkampfturnen",
    photo: "trainer-a",
    text: "Christopher begleitet die Kinder mit klarer Struktur und viel Ruhe durch die Stunde. Wichtig ist ihm, dass sich jedes Kind sicher fühlt, mutiger wird und Freude an Bewegung entwickelt.",
    focus: ["Klare Abläufe", "Sichere Hilfestellung", "Motivation"]
  },
  {
    key: "julia",
    name: "Julia",
    label: "Kleinkinder & Kinder",
    photo: "trainer-b",
    text: "Julia achtet darauf, dass Kinder gut ankommen, Übungen verstehen und sich Schritt für Schritt etwas zutrauen. Ihre Stunden sind ruhig geführt, freundlich und verlässlich.",
    focus: ["Geduld", "Grundlagen", "Ruhige Begleitung"]
  },
  {
    key: "friedericke",
    name: "Friedericke",
    label: "Jugend & Wettkampf",
    photo: "trainer-c",
    text: "Friedericke arbeitet gerne an Technik, Körperspannung und sauberem Aufbau. Sie hilft den Jugendlichen, Übungen genauer zu verstehen und mit mehr Selbstvertrauen zu turnen.",
    focus: ["Technik", "Körperspannung", "Präzision"]
  },
  {
    key: "tobias",
    name: "Tobias",
    label: "Kleinkinder & Kinder",
    photo: "trainer-d",
    text: "Tobias bringt viel Energie in die Halle und behält trotzdem den Überblick. Er mag Stunden, in denen Kinder in Bewegung bleiben, lachen und nebenbei wichtige Grundlagen lernen.",
    focus: ["Bewegungsfreude", "Übersicht", "Aktive Gruppen"]
  },
  {
    key: "felix",
    name: "Felix",
    label: "Jugend & Wettkampf",
    photo: "trainer-e",
    text: "Felix legt Wert auf Kraft, saubere Progressionen und sichere Landungen. Er baut Übungen so auf, dass die Jugendlichen merken, warum jeder Zwischenschritt wichtig ist.",
    focus: ["Kraftaufbau", "Progression", "Sicherheit"]
  },
  {
    key: "lisa",
    name: "Lisa",
    label: "Kleinkinder & Kinder",
    photo: "trainer-f",
    text: "Lisa hat einen spielerischen Zugang und viel Geduld. Sie schafft eine angenehme Stimmung, in der Kinder Neues ausprobieren können, ohne sich gedrängt zu fühlen.",
    focus: ["Spielerisch", "Geduld", "Vertrauen"]
  },
  {
    key: "christina",
    name: "Christina",
    label: "Damengymnastik",
    photo: "trainer-g",
    text: "Christina gestaltet die Damengymnastik klar, wohltuend und aktiv. Im Mittelpunkt stehen Beweglichkeit, Stabilität und ein Training, das gut in den Alltag passt.",
    focus: ["Beweglichkeit", "Stabilität", "Wohlbefinden"]
  },
  {
    key: "patrick",
    name: "Patrick",
    label: "Kinder & Jugend",
    photo: "trainer-h",
    text: "Patrick begleitet Kinder und Jugendliche mit ruhigem Aufbau, klaren Erklärungen und sicherer Hilfestellung. Ihm ist wichtig, dass Übungen verständlich bleiben und Fortschritte Schritt für Schritt entstehen.",
    focus: ["Hilfestellung", "Technikaufbau", "Sicherheit"]
  }
];

const getTrainerUrl = (key) => `trainer.html?person=${encodeURIComponent(key)}`;

trainerCards.forEach((card) => {
  if (card instanceof HTMLAnchorElement) {
    card.setAttribute("aria-label", `${card.querySelector("h3")?.textContent ?? "Trainerprofil"} ansehen`);
  }
});

const renderTrainerProfile = () => {
  if (!trainerProfile || !profilePhoto || !profileLabel || !profileName || !profileText || !profileFocus || !profileSwitcher) return;

  const requestedKey = new URLSearchParams(window.location.search).get("person") ?? "christopher";
  const activeIndex = Math.max(
    0,
    trainerContent.findIndex((item) => item.key === requestedKey)
  );
  const item = trainerContent[activeIndex];
  document.title = `${item.name} | Trainerteam | Erster Wiener Turnverein`;
  profilePhoto.className = `trainer-profile-photo ${item.photo}`;
  profilePhoto.dataset.initial = item.name.slice(0, 1);
  profileLabel.textContent = item.label;
  profileName.textContent = item.name;
  profileText.textContent = item.text;

  profileFocus.replaceChildren(
    ...item.focus.map((focus) => {
      const tag = document.createElement("span");
      tag.textContent = focus;
      return tag;
    })
  );

  profileSwitcher.replaceChildren(
    ...trainerContent.map((entry) => {
      const link = document.createElement("a");
      link.href = getTrainerUrl(entry.key);
      link.textContent = entry.name;
      link.classList.toggle("is-active", entry.key === item.key);
      if (entry.key === item.key) {
        link.setAttribute("aria-current", "page");
      }
      return link;
    })
  );
};

renderTrainerProfile();

const timelineContent = {
  tradition: {
    year: "Tradition",
    title: "Ein Verein mit Haltung",
    copy: "Turnen bedeutet Gemeinschaft, Verlässlichkeit und die Freude daran, sich Schritt für Schritt weiterzuentwickeln."
  },
  training: {
    year: "Training",
    title: "Struktur für jede Stunde",
    copy: "Gute Turnstunden brauchen klare Abläufe: ankommen, aufwärmen, üben, sichern, abschließen. Genau das macht Fortschritt sichtbar."
  },
  heute: {
    year: "Heute",
    title: "Wartelisten mit Überblick",
    copy: "Weil die Kinder- und Jugendgruppen voll sind, hilft eine klare Vormerkung. So bleiben Gruppen stabil und neue Plätze können passend vergeben werden."
  }
};

timelineButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = timelineContent[button.dataset.year];
    if (!item || !timelineYear || !timelineTitle || !timelineCopy) return;

    timelineButtons.forEach((entry) => entry.classList.toggle("is-active", entry === button));
    timelineYear.textContent = item.year;
    timelineTitle.textContent = item.title;
    timelineCopy.textContent = item.copy;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

const revealVisibleItems = () => {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      item.classList.add("is-visible");
      revealObserver.unobserve(item);
    }
  });
};

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(item);
});

requestAnimationFrame(revealVisibleItems);
window.addEventListener("scroll", revealVisibleItems, { passive: true });
