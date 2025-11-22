void (async () => {
  console.clear();

  if (!location.href.includes("store.steampowered.com/search")) {
    console.clear();
    console.group("%cERROR - WRONG URL PATH", "color: magenta; font-weight: bold; font-size: 15px;"); console.groupEnd();
    return;
  }

  const selector = ".title";
  const appIdSelector = "[data-ds-appid]";

  console.group("%c 💻 STEAM TITLE AUTO-FILTER", "color: black; font-weight: bold; font-size: 20px;");
  console.group("");
  console.warn("%c 🔌 PRESS P TO PAUSE SCRIPT", "color: black; font-weight: bold; font-size: 15px;");
  console.warn("%c 🔌 PRESS S TO SAVE RESULTS", "color: black; font-weight: bold; font-size: 15px;");
  console.groupEnd("");
  console.groupEnd("%c 💻 STEAM TITLE AUTO-FILTER", "color: black; font-weight: bold; font-size: 20px;");
  console.log("");
  console.warn("%c ⚙ PRELOAD COMPLETED. STARTING AUTO-FILTER...", "color: black; font-weight: bold; font-size: 15px;");
  console.log("");

  // ===== Language Regexes =====

  // Arabic
  // const langRegex = /[\u0600-\u06FF]/;
  // const languageName = "ARABIC";

  // Chinese (Simplified + Traditional)
  const langRegex = /[\u4E00-\u9FFF]/;
  const languageName = "CHINESE";

  // Japanese (Hiragana + Katakana + Kanji)
  // const langRegex = /[\u3040-\u30FF\u31F0-\u31FF\u4E00-\u9FFF]/;
  // const languageName = "JAPANESE";

  // Korean (Hangul)
  // const langRegex = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/;
  // const languageName = "KOREAN";

  // Russian / Cyrillic
  // const langRegex = /[\u0400-\u04FF]/;
  // const languageName = "RUSSIAN";

  // Hindi / Devanagari
  // const langRegex = /[\u0900-\u097F]/;
  // const languageName = "HINDI";

  // Hebrew
  // const langRegex = /[\u0590-\u05FF]/;
  // const languageName = "HEBREW";

  // Thai
  // const langRegex = /[\u0E00-\u0E7F]/;
  // const languageName = "THAI";

  // Greek
  // const langRegex = /[\u0370-\u03FF]/;
  // const languageName = "GREEK";

  let paused = false;
  const found = new Map();

  // ===== Preload Scrolls =====
  const preloadScrolls = 2;             // ===== number of start auto-scrolls
  const preloadScrollDistance = 1000;   // ===== pixels to scroll per preload
  const preloadDelay = 1000;            // ===== delay (ms) between each preload scroll

  for (let i = 0; i < preloadScrolls; i++) {
    window.scrollBy(0, preloadScrollDistance);
    await new Promise(r => setTimeout(r, preloadDelay));
  }
  window.scrollTo(0, 0);

  function filterTitles() {
    const rows = document.querySelectorAll('.search_result_row');
    const newOnes = [];

    rows.forEach(row => {
      const titleEl = row.querySelector('.title');
      if (!titleEl) return;

      const title = titleEl.textContent.trim();
      const href = row.getAttribute('href') || '';
      const match = href.match(/\/app\/(\d+)/);
      const appid = match ? match[1] : 'unknown';
      const isMatch = langRegex.test(title);

      if (isMatch) {
        row.style.border = "2px solid gold";
        row.style.background = "#222a";

        if (!found.has(appid)) {
          found.set(appid, title);
          newOnes.push({ title, appid });
        }
      } else {
        row.style.display = "none";
      }
    });

    if (newOnes.length > 0) {
      console.log(`%c✅ FOUND ${newOnes.length} NEW ${languageName}-TITLED APP/S`, "color: lime; font-weight: bold; font-size: 15px;");
      console.table(newOnes.map((g, i) => ({ "#": i + 1, Title: g.title, AppID: g.appid })));
      console.log("");
    }
  }

  // ===== Auto-Scroll Loop =====
  const autoScrollDistance = 200;   // ===== pixels to scroll per auto-scroll
  const autoScrollDelay = 3000;     // ===== delay (ms) between each auto-scroll
  let direction = 1;

  async function autoScrollLoop() {
    while (true) {
      if (!paused) {
        window.scrollBy(0, autoScrollDistance * direction);
        direction *= -1;
      }
      await new Promise(r => setTimeout(r, autoScrollDelay));
    }
  }

  // ===== Auto Filter Interval =====
  const scanInterval = 3000;   // ===== filter frequency

  setInterval(() => {
    if (!paused) filterTitles();
  }, scanInterval);

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "p") {
      paused = !paused;
      if (paused) {
        console.log("%c💡 SCRIPT PAUSED", "color: red; font-weight: bold; font-size: 15px;");
      } else {
        console.log("%c💡 SCRIPT RESUMED", "color: lime; font-weight: bold; font-size: 15px;");
      }
    } else if (e.key.toLowerCase() === "s") {
      saveResults();
    }
  });

  function saveResults() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    const entries = Array.from(found.entries());

    let output = "";
    output += "█ Steam App Auto-Filter\n";
    output += `█ D/T: ${formattedDate} ${formattedTime}\n`;
    output += `\n█ Language: ${languageName}\n`;
    output += `█ Results: ${entries.length}\n`;

    entries.forEach(([appid, title], i) => {
      output += `\n${i + 1}.\nAppid - ${appid}\nName - ${title}\n`;
    });

    const blob = new Blob([output], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `SteamAppSmartAutoFilter_${languageName}_${formattedDate.replace(/\//g, "-")}.txt`;
    link.click();

    console.log(`\n%c💾 SAVED ${entries.length} RESULTS TO FILE\n`, "color: gray; font-weight: bold; font-size: 15px;");
  }

  autoScrollLoop();
})();
