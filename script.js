(() => {
  const welcome = document.querySelector("[data-welcome]");
  if (!welcome) return;
  const root = document.documentElement;
  const percentage = welcome.querySelector("[data-welcome-percentage]");
  const fill = welcome.querySelector(".welcome-loading-track > span");
  let progressFrame;
  const updateProgress = () => {
    if (!percentage || !fill) return;
    const transform = getComputedStyle(fill).transform;
    const scale = transform === "none" ? 1 : new DOMMatrixReadOnly(transform).a;
    const progress = Math.round(Math.max(0, Math.min(1, scale)) * 100);
    percentage.textContent = `${progress} %`;
    welcome.classList.toggle("is-loaded", progress >= 99);
    progressFrame = requestAnimationFrame(updateProgress);
  };
  const startProgress = () => {
    cancelAnimationFrame(progressFrame);
    if (percentage) percentage.textContent = "0 %";
    welcome.classList.remove("is-loaded");
    progressFrame = requestAnimationFrame(updateProgress);
  };
  let cycleTimer;
  let finished = false;
  window.clearTimeout(window.ewtvWelcomeFallback);
  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(progressFrame);
    window.clearTimeout(cycleTimer);
    root.classList.remove("show-welcome");
    welcome.remove();
  };
  if (!root.classList.contains("show-welcome")) {
    finish();
    return;
  }
  welcome.addEventListener("animationend", (event) => {
    if (event.target === welcome) finish();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) finish();
  });
  startProgress();
  cycleTimer = window.setTimeout(finish, 3600);
})();

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll("[data-filter]");
const scheduleRows = document.querySelectorAll("[data-schedule] .schedule-row");
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
document.body.classList.add("js-enabled");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const setMenuOpen = (open) => {
  nav.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
};
menuToggle.addEventListener("click", () => setMenuOpen(!nav.classList.contains("is-open")));
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!header.contains(event.target)) setMenuOpen(false);
});
window.matchMedia("(max-width: 920px)").addEventListener("change", () => setMenuOpen(false));

document.querySelector(".brand")?.addEventListener("click", (event) => {
  event.preventDefault();
  setMenuOpen(false);
  history.replaceState(null, "", "#start");
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
});

const offerTabs = Array.from(document.querySelectorAll("#angebot .offer-choice"));
const selectOffer = (selected, focus = false) => {
  offerTabs.forEach((tab) => {
    const active = tab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
  });
  if (focus) selected.focus();
};
offerTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectOffer(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % offerTabs.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + offerTabs.length) % offerTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = offerTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectOffer(offerTabs[next], true);
  });
});

const selectScheduleDay = (button) => {
  const day = button.dataset.filter;
  let visibleCount = 0;

  filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  scheduleRows.forEach((row) => {
    const isVisible = row.dataset.day === day;
    row.classList.toggle("is-hidden", !isVisible);
    if (isVisible) visibleCount += 1;
  });

  scheduleEmpty?.classList.toggle("is-hidden", visibleCount > 0);

};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => selectScheduleDay(button));
});

if (filterButtons.length > 0) {
  selectScheduleDay(document.querySelector("[data-filter].is-active") ?? filterButtons[0]);
}

const updateMailLink = (group) => {
  if (!mailLink) return;
  if (group === 'Allgemeine Anfrage') {
    mailLink.href = 'mailto:office@ewtv.at?subject=' + encodeURIComponent('Allgemeine Anfrage');
    mailLink.textContent = 'Allgemeine Anfrage senden';
    return;
  }
  const waitlist = ['Kleinkinderturnstunde', 'Kinderturnen', 'Jugendturnen'].includes(group);
  const subject = (waitlist ? 'Wartelisten-Anfrage ' : 'Anfrage ') + group;
  const body = [
    'Liebes EWTV-Team,', '',
    waitlist ? 'ich möchte mich bzw. mein Kind gerne auf die Warteliste setzen lassen.'
      : 'ich interessiere mich für das folgende Training und möchte gerne weitere Informationen erhalten.',
    '', 'Name:', ...(waitlist ? ['Alter:'] : []), 'Gewünschte Gruppe: ' + group, '', 'Vielen Dank!'
  ].join('\r\n');
  mailLink.href = 'mailto:office@ewtv.at?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  mailLink.textContent = waitlist ? 'Warteliste anfragen' : 'Training anfragen';
};
const selectContact = button => {
  contactButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  updateMailLink(button.dataset.subject);
};
contactButtons.forEach(button => button.addEventListener('click', () => selectContact(button)));
const selectContactFromHash = () => {
  const button = Array.from(contactButtons).find(item => '#' + item.id === window.location.hash);
  if (button) selectContact(button);
  else if (window.location.hash === '#kontakt' && contactButtons.length) selectContact(contactButtons[0]);
};
document.querySelectorAll('#angebot .offer-contact, [data-finder-mail]').forEach(link => {
  link.addEventListener('click', () => {
    const button = Array.from(contactButtons).find(item => '#' + item.id === link.getAttribute('href'));
    if (!button) return;
    selectContact(button);
    button.focus({preventScroll: true});
    button.scrollIntoView({block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
});
window.addEventListener('hashchange', selectContactFromHash);
if (contactButtons.length) selectContact(contactButtons[0]);
selectContactFromHash();

const faqTabs = Array.from(document.querySelectorAll("[data-faq] [role='tab']"));
const selectFaqTopic = (selected, focus = false) => {
  faqTabs.forEach((tab) => {
    const active = tab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
  });
  if (focus) selected.focus();
};

faqTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectFaqTopic(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % faqTabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + faqTabs.length) % faqTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = faqTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectFaqTopic(faqTabs[next], true);
  });
});

faqItems.forEach((item) => {
  const button = item.querySelector("button");
  const answer = item.querySelector(".faq-answer");
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    answer.hidden = !open;
    item.classList.toggle("is-open", open);
    item.querySelector(".faq-icon").textContent = open ? "−" : "+";
  });
});

const getFinderGroup = () => {
  const ageGroup = document.querySelector("[data-age-group].is-active")?.dataset.ageGroup ?? "4-6";

  if (ageGroup === "4-6") return "kleinkinder";
  if (ageGroup === "6-9") return "kinder";
  if (ageGroup === "10-14") return "jugend";
  return document.querySelector('[data-goal].is-active:not([hidden])')?.dataset.goal ?? 'erwachsene';
};

const syncQuizGoals = () => {
  const adult = document.querySelector('[data-age-group].is-active')?.dataset.ageGroup === '15+';
  goalButtons.forEach(button => {
    button.hidden = button.dataset.quizAudience !== (adult ? 'adults' : 'kids');
    if (button.hidden) {
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
    }
  });
};

let activeQuizStep = 0;
let quizIsComplete = false;

const quizPromptByStep = [
  "Wählen Sie zuerst das Alter aus.",
  "Wählen Sie aus, was beim Training im Vordergrund stehen soll.",
  "Geben Sie an, wie viel Trainingserfahrung Sie oder Ihr Kind mitbringen."
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
    step.inert = stepIndex !== activeQuizStep || quizIsComplete;
    step.setAttribute('aria-hidden', String(stepIndex !== activeQuizStep || quizIsComplete));
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
  buttons.forEach((item) => {
    item.classList.toggle("is-active", item === selectedButton);
    item.setAttribute('aria-pressed', String(item === selectedButton));
  });
  if (buttons === ageGroupButtons) syncQuizGoals();
  updateFinder();
  updateQuizNextButton(activeQuizStep);
};

const resetQuiz = () => {
  quizIsComplete = false;
  [...ageGroupButtons, ...goalButtons, ...experienceButtons].forEach((button) => {
    button.classList.remove("is-active");
    button.setAttribute('aria-pressed', 'false');
  });
  quizNextButtons.forEach((button) => {
    button.disabled = true;
  });
  syncQuizGoals();
  updateFinder();
  setQuizStep(0);
};

const updateFinder = () => {
  if (!finderTitle || !finderCopy || !finderMail) return;
  const key = getFinderGroup();
  const panel = document.getElementById(`offer-${key}-panel`);
  if (!panel) return;
  finderTitle.textContent = panel.querySelector('h3').textContent;
  finderCopy.textContent = Array.from(panel.querySelectorAll('.offer-copy p')).map(p => p.textContent.trim()).join(' ');
  const times = Array.from(panel.querySelectorAll('.offer-times p')).map(p => Array.from(p.children).map(item => item.textContent.trim()).join(', ')).join(' · ');
  const condition = panel.querySelector('.offer-condition')?.textContent.trim();
  const experience = document.querySelector('[data-experience].is-active')?.dataset.experience;
  const competitionNote = key === 'jugend' && experience === 'regelmaessig'
    ? ' Wettkampfturnen ist ausschließlich nach Absprache mit dem Trainerteam möglich.' : '';
  if (finderExtra) {
    finderExtra.hidden = false;
    finderExtra.textContent = times + (condition ? ' · ' + condition : '') + competitionNote;
  }
  finderMail.href = `#kontakt-${key}`;
  finderMail.textContent = ['kleinkinder', 'kinder', 'jugend'].includes(key) ? 'Warteliste anfragen' : 'Training anfragen';
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

// Highlight the navigation entry for the section currently being viewed.
const sectionLinks = Array.from(document.querySelectorAll("[data-nav] a[href^='#']"));
const navigationSections = sectionLinks.map((link) => ({
  link,
  section: document.getElementById(link.hash.slice(1)),
})).filter(({ section }) => section);
let navigationFramePending = false;
const updateCurrentSection = () => {
  navigationFramePending = false;
  const marker = header.getBoundingClientRect().bottom + 48;
  let current = null;
  navigationSections.forEach((entry) => {
    if (entry.section.getBoundingClientRect().top <= marker) current = entry;
  });
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
    current = navigationSections[navigationSections.length - 1];
  }
  navigationSections.forEach(({ link }) => {
    if (current?.link === link) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};
const scheduleCurrentSection = () => {
  if (navigationFramePending) return;
  navigationFramePending = true;
  requestAnimationFrame(updateCurrentSection);
};
window.addEventListener("scroll", scheduleCurrentSection, { passive: true });
window.addEventListener("resize", scheduleCurrentSection);
window.addEventListener("load", scheduleCurrentSection);
new ResizeObserver(scheduleCurrentSection).observe(document.body);
scheduleCurrentSection();
