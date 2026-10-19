
const output = document.querySelector("#output");
const form = document.querySelector("#command-form");
const input = document.querySelector("#command-input");

const welcome = document.querySelector("#welcome");
const hint = document.querySelector("#hint");
const prompt = document.querySelector("#prompt");
const welcomeForm = document.querySelector("#welcome-form");
const visitorNameInput = document.querySelector("#visitor-name");
const namePlaceholder = document.querySelector("#name-placeholder");
const enterButton = document.querySelector("#enter-button");
const languageToggle = document.querySelector("#language-toggle");
const languageLabel = document.querySelector(".changelanguage");
const visitChart = document.querySelector("#visit-chart");
const artScreens = [...document.querySelectorAll(".art_screen")];
const goatCounterSite = "danieleciafrei";
const goatCounterUrl = `https://${goatCounterSite}.goatcounter.com`;
const artScreenNames = {
  "kyoto-dusk": "kyoto",
  "edge-orbit": "edge",
  "storm-plains": "storm",
  "planet-scale": "planet",
  "cloud-sea": "cloud",
  "desert-night": "desert",
  "aurora-fjord": "aurora",
  "black-hole": "blackhole",
  eclipse: "eclipse",
  galaxy: "galaxy",
  "solar-system": "solar",
  "double-pendulum": "pendulum",
  "newtons-cradle": "cradle",
  butterfly: "butterfly",
  cat: "cat",
  owl: "owl",
  spider: "spider",
  fireworks: "fireworks"
};

let language = "it";
let visitorName = "";
let initialCommandPending = true;
let commandResponse;
let welcomeObserver;
let namePlaceholderObserver;
let visitChartData;
let visitChartFailed = false;
let visitChartObserver;
let selectedVisitWeek = "thisWeek";
const history = [];
let historyIndex = 0;

const translations = {
  it: {
    changelanguage: "switch language",
    switchLanguage: "Passa all'inglese",
    namePlaceholder: "Il tuo nome",
    enter: "Entra",
    welcome: (name) => ({
      prefix: `Benvenuto/a nel mio portfolio, `,
      phrases: [`${name}`]
    }),
    help: "COMANDI DISPONIBILI",
    about: "Sono Daniele Ciafrei, studente di Informatica e sviluppatore interessato a tecnologia, web e videogiochi.",
    skills: [
      {
        title: "INFORMATICA E SVILUPPO SOFTWARE",
        items: [
          "Sviluppo web: Python, JavaScript, Java, HTML e CSS per applicazioni, interfacce e logica lato client,",
          "Backend e API: FastAPI e REST API; integrazione con servizi esterni,",
          "Database: SQL e MySQL per interrogare e gestire database relazionali,",
          "Strumenti e pubblicazione: Git, GitHub e deployment di applicazioni."
        ]
      },
      {
        title: "GAME DEVELOPMENT E QA TESTING",
        items: [
          "Sviluppo di videogiochi con Unity e implementazione di meccaniche di gioco,",
          "Beta testing di videogiochi e software: verifica di gameplay, meccaniche e interfacce,",
          "Individuazione e riproduzione dei bug, con preparazione di segnalazioni strutturate, essendo nella top 01% dei gametester",
          "Esperienza di test anche su progetti riservati e in ambienti che integrano funzionalità AI."
        ]
      },
      {
        title: "CREATIVITÀ DIGITALE",
        items: [
          "suite adobe: Photoshop, Lightroom, Premiere Pro, After Effects, Illustrator.",
          "Montaggio video e realizzazione di trailer e contenuti promozionali, fotoritocco, fotografia e astrofotografia.",
          "Creazione e gestione di contenuti digitali / account e pagine di presentazione per progetti"
        ]
      }
    ],
    work: [
      [
        "ORBIT",
        "Sito web che combina il meteo locale e dati astronomici calcolati in base alla posizione dell’utente. Mostra la visibilità e la posizione degli oggetti celesti, una visualizzazione del cielo e i principali eventi planetari.",
        "https://github.com/Antareskrrt/ORBIT"
      ],
      [
        "FLORA",
        "Gioco top down 2D, Flora è sviluppata attorno ai temi dell’inquinamento e della sostenibilità per un contest all' università di camerino. Attraverso esplorazione, enigmi e momenti di sfida, il giocatore attraversa un mondo alterato in cui l’ambiente racconta le conseguenze dello squilibrio naturale.",
        "https://matterder.itch.io/flora"
      ]
    ],
    contact: "Puoi contattarmi qui:",
    artscreen: "Mostra comandi x ASCII.",
    artscreenList: "COMANDI ILLUSTRAZIONI",
    unknown: "Comando non riconosciuto.",
    language: "Lingua impostata su Italiano.",
    clear: "Terminale pulito.",
    visitStatsError: "Visite non disponibili: abilita il contatore pubblico nelle impostazioni GoatCounter.",
    visitChartTitle: "Visite",
    thisWeek: "QUESTA SETTIMANA",
    lastWeek: "SETTIMANA SCORSA",
    selectVisitWeek: "Seleziona la settimana da mostrare",
    themeSet: (theme, name) => `Tema ${theme} (${name}) applicato.`,
    themes: ["Originale", "Verde terminale", "Ambra", "Ciano"],
    themeList: "TEMI DISPONIBILI"
  },
  en: {
    changelanguage: "cambia lingua",
    switchLanguage: "Switch to Italian",
    namePlaceholder: "Your name",
    enter: "Enter",
    welcome: (name) => ({
      prefix: `Welcome to my portfolio, `,
      phrases: [`${name}`]
    }),
    help: "AVAILABLE COMMANDS",
    about: "I'm Daniele Ciafrei, an Informatics student and developer interested in technology, web development, and games.",
    skills: [
      {
        title: "IT & SOFTWARE DEVELOPMENT",
        items: [
          "Web development: Python, JavaScript, Java, HTML, and CSS for applications, interfaces, and client-side logic.",
          "Backend and APIs: FastAPI and REST APIs, with integrations to external services.",
          "Databases: SQL and MySQL for querying and managing relational databases.",
          "Tools and deployment: Git, GitHub, and application deployment."
        ]
      },
      {
        title: "GAME DEVELOPMENT & QA TESTING",
        items: [
          "Game development with Unity and implementation of gameplay mechanics.",
          "Beta testing for games and software, covering gameplay, mechanics, and interfaces.",
          "Identifying and reproducing bugs, then writing structured bug reports; ranked in the top 1% of game testers.",
          "Testing experience with confidential projects and in environments that include AI features."
        ]
      },
      {
        title: "DIGITAL CREATIVITY",
        items: [
          "Adobe suite: Photoshop, Lightroom, Premiere Pro, After Effects, and Illustrator.",
          "Video editing and production of trailers and promotional content, photo editing, photography, and astrophotography.",
          "Creating and managing digital content and accounts/pages for projects."
        ]
      }
    ],
    work: [
      [
        "ORBIT",
        "A website combining local weather with astronomical data calculated for the user's location. It shows the position and visibility of celestial objects, a visualization of the sky, and upcoming planetary events.",
        "https://github.com/Antareskrrt/ORBIT"
      ],
      [
        "FLORA",
        "A top-down 2D game developed around pollution and sustainability for a contest at the University of Camerino. Through exploration, puzzles, and challenges, players travel through an altered world where the environment reveals the consequences of ecological imbalance.",
        "https://matterder.itch.io/flora"
      ]
    ],
    contact: "You can contact me here:",
    artscreen: "Show the ASCII artwork commands.",
    artscreenList: "ARTWORK COMMANDS",
    unknown: "Command not recognized.",
    language: "Language set to English.",
    clear: "Terminal cleared.",
    visitStatsError: "Visits are unavailable: enable the public visitor counter in GoatCounter settings.",
    visitChartTitle: "Visits",
    thisWeek: "THIS WEEK",
    lastWeek: "LAST WEEK",
    selectVisitWeek: "Select the week to display",
    themeSet: (theme, name) => `Theme ${theme} (${name}) applied.`,
    themes: ["Original", "Terminal green", "Amber", "Cyan"],
    themeList: "AVAILABLE THEMES"
  }
};

function loadGoatCounter() {
  if (!/^[a-z0-9-]+$/i.test(goatCounterSite)) return;

  const tracker = document.createElement("script");
  tracker.src = "https://gc.zgo.at/count.js";
  tracker.async = true;
  tracker.dataset.goatcounter = `https://${goatCounterSite}.goatcounter.com/count`;
  if (["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)) {
    tracker.dataset.goatcounterSettings = JSON.stringify({ allow_local: true });
  }
  document.head.appendChild(tracker);
}

function formatVisitDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function fetchDailyVisits(date) {
  const dateString = formatVisitDate(date);
  const url = new URL(`${goatCounterUrl}/counter/TOTAL.json`);
  url.searchParams.set("start", dateString);
  url.searchParams.set("end", dateString);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Visit count request failed with status ${response.status}`);
  }

  const data = await response.json();
  const count = typeof data.count === "string"
    ? Number(data.count.replace(/,/g, ""))
    : data.count;
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error("Visit count response has an invalid count");
  }
  return count;
}

function renderVisitChart() {
  if (!visitChart) return;
  visitChartObserver?.disconnect();
  visitChartObserver = null;
  if (visitChartFailed) {
    visitChart.textContent = translations[language].visitStatsError;
    return;
  }
  if (!visitChartData) return;

  const { dates, thisWeekCounts, lastWeekCounts } = visitChartData;
  const labels = dates.map((date) =>
    date.toLocaleDateString(language === "it" ? "it-IT" : "en-US", {
      weekday: "short"
    }).toLowerCase()
  );
  const datasets = [
    { key: "thisWeek", values: thisWeekCounts },
    { key: "lastWeek", values: lastWeekCounts }
  ];
  const selectedDataset = datasets.find(({ key }) => key === selectedVisitWeek);
  const controls = document.createElement("div");
  controls.className = "visit-chart-controls";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", translations[language].selectVisitWeek);
  const chartContainer = document.createElement("div");

  datasets.forEach(({ key }) => {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "visit-chart-toggle";
    toggle.textContent = translations[language][key];
    toggle.setAttribute("aria-pressed", String(key === selectedVisitWeek));
    toggle.addEventListener("click", () => {
      selectedVisitWeek = key;
      renderVisitChart();
    });
    controls.appendChild(toggle);
  });

  const chart = document.createElement("ascii-art");
  chart.className = "visit-chart-art";
  chart.setAttribute("piece", "bar-chart");
  chart.setAttribute("options", JSON.stringify({
    title: translations[language].visitChartTitle,
    labels,
    datasets: [{
      name: "",
      values: selectedDataset.values
    }]
  }));
  const removeEmptySeriesLabel = () => {
    const artwork = chart.querySelector("pre");
    if (!artwork) return;

    const cleanedText = artwork.textContent.replace(/\[\s*(?:undefined)?\s*\]/g, "");
    if (artwork.textContent !== cleanedText) artwork.textContent = cleanedText;
  };
  visitChartObserver = new MutationObserver(removeEmptySeriesLabel);
  visitChartObserver.observe(chart, { childList: true, characterData: true, subtree: true });
  removeEmptySeriesLabel();
  chartContainer.appendChild(chart);
  visitChart.replaceChildren(controls, chartContainer);
}

async function loadVisitChart() {
  if (!visitChart) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7));
  window.setTimeout(loadVisitChart, nextWeek.getTime() - Date.now());

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const thisWeekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const lastWeekDates = thisWeekDates.map((date) => {
    const lastWeekDate = new Date(date);
    lastWeekDate.setDate(date.getDate() - 7);
    return lastWeekDate;
  });

  try {
    const [thisWeekCounts, lastWeekCounts] = await Promise.all([
      Promise.all(thisWeekDates.map((date) =>
        date <= today ? fetchDailyVisits(date) : 0
      )),
      Promise.all(lastWeekDates.map(fetchDailyVisits))
    ]);
    visitChartData = { dates: thisWeekDates, thisWeekCounts, lastWeekCounts };
    visitChartFailed = false;
    renderVisitChart();
  } catch (error) {
    console.error("Unable to load visit statistics:", error);
    visitChartFailed = true;
    renderVisitChart();
  }
}

function initializeText() {
  document.documentElement.lang = language;
  visitorNameInput.setAttribute("aria-label", translations[language].namePlaceholder);
  namePlaceholder.setAttribute("options", JSON.stringify({
    phrases: [translations[language].namePlaceholder.toLowerCase()]
  }));
  alignNamePlaceholder();
  enterButton.textContent = translations[language].enter;
  languageLabel.textContent = translations[language].changelanguage;
  languageToggle.textContent = language === "it" ? "EN" : "IT";
  languageToggle.setAttribute("aria-label", translations[language].switchLanguage);
  welcomeObserver?.disconnect();
  const welcomeArt = document.createElement("ascii-art");
  welcomeArt.setAttribute("piece", "typewriter");
  welcomeArt.setAttribute("options", JSON.stringify(translations[language].welcome(visitorName)));
  welcome.replaceChildren(welcomeArt);
  const alignWelcomeArt = () => {
    const art = welcomeArt.querySelector("pre");
    if (!art) return;

    const alignedText = art.textContent
      .split("\n")
      .map((line) => line.trimStart())
      .join("\n");
    if (art.textContent !== alignedText) art.textContent = alignedText;
  };

  alignWelcomeArt();
  welcomeObserver = new MutationObserver(alignWelcomeArt);
  welcomeObserver.observe(welcomeArt, { childList: true, characterData: true, subtree: true });
  hint.textContent = translations[language].hint;
  prompt.textContent = "$";
  input.placeholder = language === "it" ? "/aiuto o /help" : "/help";
  renderVisitChart();
}

function alignNamePlaceholder() {
  const art = namePlaceholder.querySelector("pre");
  if (!art) return;

  const alignedText = art.textContent
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n");
  if (art.textContent !== alignedText) art.textContent = alignedText;
}

function addLine(text, className = "") {
  const p = document.createElement("p");
  p.className = className;
  p.textContent = text;
  (commandResponse || output).appendChild(p);
  return p;
}

function keepCommandPromptVisible() {
  requestAnimationFrame(() => {
    form.scrollIntoView({ behavior: "smooth", block: "end" });
  });
}

function addOutput(node) {
  (commandResponse || output).appendChild(node);
}

function addSection(title) {
  addLine(`// ${title}`, "section-title");
}

function addContactDetails() {
  const details = document.createElement("p");
  details.className = "command-result contact-details";

  const contacts = [
    ["GitHub", "https://github.com/Antareskrrt"],
    ["Email", "mailto:daniele.ciafrei07@gmail.com"],
    ["LinkedIn", "https://www.linkedin.com/in/daniele-ciafrei-87786630a"]
  ];

  contacts.forEach(([label, href], index) => {
    if (index > 0) details.append(" · ");
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label === "Email" ? "daniele.ciafrei07@gmail.com" : label;
    if (!href.startsWith("mailto:")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    details.appendChild(link);
  });

  addOutput(details);
}

function addProjects() {
  translations[language].work.forEach(([name, description, url]) => {
    const project = document.createElement("p");
    project.className = "command-result project-entry";

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = name;

    project.append(link, ` — ${description}`);
    addOutput(project);
  });
}

function addSkills() {
  translations[language].skills.forEach(({ title, items }) => {
    const group = document.createElement("section");
    group.className = "skill-group";

    const heading = document.createElement("h3");
    heading.className = "skill-heading";
    heading.textContent = title;

    const list = document.createElement("ul");
    list.className = "skill-list";
    items.forEach((item) => {
      const entry = document.createElement("li");
      entry.textContent = item;
      list.appendChild(entry);
    });

    group.append(heading, list);
    addOutput(group);
  });
}

function addCommand(name, description, command = name, parent) {
  const row = document.createElement("div");
  row.className = "command-entry";

  const button = document.createElement("button");
  button.className = "command-link";
  button.type = "button";
  button.dataset.command = command;
  button.textContent = name;

  const desc = document.createElement("span");
  desc.textContent = description;

  row.append(button);
  if (description) row.append(desc);
  (parent || commandResponse || output).appendChild(row);
}

function showHelp() {
  addSection(translations[language].help);

  const groups = language === "it"
    ? [
        {
          title: "PERSONALI",
          commands: [
            ["/me", "Chi sono"],
            ["/skills", "Le mie competenze"],
            ["/work", "I miei progetti"],
            ["/contact", "Come contattarmi"],
            ["/artscreen", translations.it.artscreen]
          ]
        },
        {
          title: "SISTEMA",
          commands: [
            ["/help", "Mostra tutti i comandi"],
            ["/lang it | eng", "Imposta la lingua indicata"],
            ["/theme", "Mostra e seleziona un tema"],
            ["/clear", "Pulisce il terminale"]
          ]
        }
      ]
    : [
        {
          title: "PERSONAL",
          commands: [
            ["/me", "Who I am"],
            ["/skills", "My skills"],
            ["/work", "My projects"],
            ["/contact", "Get in touch"],
            ["/artscreen", translations.en.artscreen]
          ]
        },
        {
          title: "SYSTEM",
          commands: [
            ["/help", "Show all commands"],
            ["/lang it | eng", "Set language"],
            ["/theme", "Show and select a theme"],
            ["/clear", "Clear the terminal"]
          ]
        }
      ];

  const columns = document.createElement("div");
  columns.className = "help-columns";

  groups.forEach(({ title, commands }) => {
    const column = document.createElement("section");
    column.className = "help-column";

    const heading = document.createElement("h3");
    heading.className = "help-heading";
    heading.textContent = title;
    column.appendChild(heading);

    commands.forEach(([name, description]) => {
      addCommand(
        name,
        description,
        name === "/lang it | eng" ? "/lang" : name,
        column
      );
    });

    columns.appendChild(column);
  });

  addOutput(columns);
}

function findArtScreen(name) {
  const piece = Object.entries(artScreenNames)
    .find(([, commandName]) => commandName === name)?.[0];
  return artScreens.find((art) => art.getAttribute("piece") === piece) || null;
}

function showArtScreenCommands() {
  const heading = document.createElement("p");
  heading.className = "section-title artscreen-heading";
  heading.append(document.createTextNode(translations[language].artscreenList));

  const credit = document.createElement("a");
  credit.className = "artscreen-credit";
  credit.href = "https://ascii.rest/";
  credit.target = "_blank";
  credit.rel = "noopener noreferrer";
  credit.textContent = "ascii.rest";
  heading.append(" · ", credit);
  addOutput(heading);

  const commands = document.createElement("div");
  commands.className = "artscreen-commands";
  for (const artwork of artScreens) {
    const piece = artwork.getAttribute("piece");
    const command = `/artscreen ${artScreenNames[piece]}`;
    addCommand(command, "", command, commands);
  }
  addOutput(commands);
}

function showThemeCommands() {
  addSection(translations[language].themeList);
  const commands = document.createElement("div");
  commands.className = "theme-commands";

  translations[language].themes.forEach((name, theme) => {
    const command = `/theme ${theme}`;
    addCommand(command, name, command, commands);
  });

  addOutput(commands);
}

function displayArtScreen(artwork, response) {
  artwork.style.display = "block";
  response.appendChild(artwork);
}

function runCommand(raw) {
  const typedCommand = raw.trim().toLowerCase();
  const command = typedCommand === "help" || typedCommand === "aiuto"
    ? `/${typedCommand}`
    : typedCommand;
  if (!command) return;

  if (initialCommandPending) {
    initialCommandPending = false;
    if (command === "/help" || command === "/aiuto") {
      language = command === "/help" ? "en" : "it";
      initializeText();
    }
  }

  const block = document.createElement("section");
  block.className = "command-block";
  const commandLine = document.createElement("p");
  commandLine.className = "command-line";
  commandLine.textContent = `daniele_ciafrei@portfolio:~$ ${raw}`;
  const response = document.createElement("div");
  response.className = "command-response";
  block.append(commandLine, response);
  output.appendChild(block);
  commandResponse = response;
  keepCommandPromptVisible();

  if (command === "/clear") {
    output.replaceChildren(welcome, hint);
    commandResponse = null;
    return;
  }

  const themeCommand = command.match(/^\/theme(?:\s+([0-3]))?$/);
  if (themeCommand) {
    if (!themeCommand[1]) {
      showThemeCommands();
    } else {
      const theme = themeCommand[1];
      document.documentElement.dataset.theme = theme;
      addLine(
        translations[language].themeSet(theme, translations[language].themes[Number(theme)]),
        "success"
      );
    }
    commandResponse = null;
    return;
  }

  if (command === "/lang" ||
      command === "/lang it" ||
      command === "/lang en" ||
      command === "/lang ita" ||
      command === "/lang eng") {
    if (command === "/lang it" || command === "/lang ita") {
      language = "it";
    } else if (command === "/lang en" || command === "/lang eng") {
      language = "en";
    } else {
      language = language === "it" ? "en" : "it";
    }

    initializeText();
    addLine(translations[language].language, "success");
    commandResponse = null;
    return;
  }

  if (command === "/artscreen") {
    showArtScreenCommands();
    commandResponse = null;
    return;
  }

  if (command.startsWith("/artscreen ")) {
    const name = command.slice("/artscreen".length).trim();
    const artwork = name === "rand"
      ? artScreens[Math.floor(Math.random() * artScreens.length)]
      : findArtScreen(name);
    if (artwork) {
      displayArtScreen(artwork, response);
      commandResponse = null;
      return;
    }
  }

  switch (command) {
    case "/help":
    case "/aiuto":
      showHelp();
      break;

    case "/me":
      addSection(language === "it" ? "CHI SONO" : "ABOUT ME");
      addLine(translations[language].about, "command-result");
      break;

    case "/skills":
    case "/competenze":
      addSection(language === "it" ? "COMPETENZE" : "SKILLS");
      addSkills();
      break;

    case "/work":
    case "/projects":
    case "/progetti":
      addSection(language === "it" ? "PROGETTI" : "PROJECTS");
      addProjects();
      break;

    case "/contact":
    case "/contatti":
      addSection(language === "it" ? "CONTATTI" : "CONTACT");
      addLine(translations[language].contact, "command-result");
      addContactDetails();
      break;

    default:
      addLine(translations[language].unknown, "error");
  }

  commandResponse = null;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  history.push(value);
  historyIndex = history.length;

  runCommand(value);
  input.value = "";
  input.focus();
});

input.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    event.preventDefault();

    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();

    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      input.value = "";
    }
  }

  if (event.key === "Tab") {
    const available = [
      "/help", "/aiuto", "/me",
      "/skills", "/competenze", "/work",
      "/projects", "/progetti", "/contact",
      "/contatti", "/lang", "/lang it",
      "/lang eng", "/clear", "/artscreen",
      "/theme", "/theme 0", "/theme 1", "/theme 2", "/theme 3",
      ...artScreens.map((art) => `/artscreen ${artScreenNames[art.getAttribute("piece")]}`)
    ];

    const typed = input.value.trim().toLowerCase();
    const matches = available.filter((cmd) =>
      cmd.startsWith(typed)
    );

    if (matches.length === 1) {
      event.preventDefault();
      input.value = matches[0];
    }
  }
});

output.addEventListener("click", (event) => {
  const button = event.target.closest("[data-command]");
  if (!button) return;

  runCommand(button.dataset.command);
  input.focus();
});

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = visitorNameInput.value.trim();
  if (!name) {
    visitorNameInput.focus();
    return;
  }

  visitorName = name;
  initialCommandPending = true;
  document.body.classList.add("entered");
  initializeText();
  input.focus();
});

visitorNameInput.addEventListener("input", () => {
  visitorNameInput.closest(".name-field").classList.toggle("has-value", visitorNameInput.value.length > 0);
});

namePlaceholderObserver = new MutationObserver(alignNamePlaceholder);
namePlaceholderObserver.observe(namePlaceholder, { childList: true, characterData: true, subtree: true });

languageToggle.addEventListener("click", () => {
  language = language === "it" ? "en" : "it";
  initializeText();
});

initializeText();
loadGoatCounter();
loadVisitChart();
visitorNameInput.focus();
