(function steamGroupChecker() {
  console.clear();
  const path = window.location.pathname;
  const match = path.match(/^\/(id|profiles)\/([^/]+)\/groups\/?$/);

  if (!match) {
    console.group("%cRROR - WRONG URL PATH", "color:red;font-weight:bold;font-size:20px;"); console.groupEnd();
    return;
  }

  console.group("%c 💻 STEAM BROKEN GROUPS TRACKER", "color: black; font-weight: bold; font-size: 20px;");

  const groups = Array.from(document.querySelectorAll(".group_block.invite_row"));

  console.group(`%c    TOTAL OF ${groups.length} GROUPS SCANNED`, "color: lime; font-weight: bold; font-size: 17px;");
  console.groupEnd(); console.groupEnd();

  const broken = [];
  const abnormal = [];

  const sRed = "color: red; font-weight: bold; font-size: 15px;";
  const sYellow = "color: yellow; font-weight: bold; font-size: 15px;";
  const sLime = "color: lime; font-weight: bold; font-size: 15px;";

  function getImageSize(url) {
    return new Promise((resolve) => {
      if (!url) return resolve({ width: 16, height: 16 });
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => resolve({ width: 16, height: 16 });
      img.src = url;
    });
  }

  (async () => {
    for (const group of groups) {
      const img = group.querySelector("img");
      if (!img) continue;

      const { width, height } = await getImageSize(img.src);

      const name = group.querySelector(".linkTitle")?.innerText.trim() || "(unknown)";
      const vanityMatch = group.querySelector("a.linkTitle")?.href.match(/\/groups\/([^/]+)/i);
      const vanity = vanityMatch ? vanityMatch[1] : "(unknown)";

      const gidMatch = group.innerHTML.match(/OpenGroupChat\(\s*'(\d+)'/);
      const gid = gidMatch ? gidMatch[1] : "(unknown)";

      // ===== classify
      if (width === 16 && height === 16) {
        group.style.outline = "3px solid #FF0000";
        broken.push({ Name: name, CustomURL: vanity, GID: gid });
      } else if (width !== 64 || height !== 64) {
        group.style.outline = "3px solid #FFFF00";
        abnormal.push({ Name: name, CustomURL: vanity, GID: gid, Width: width, Height: height });
      } else {
        group.remove();   // ===== clean look, only detected groups shown
      }
    }

    if (broken.length) {
      console.log("");
      console.log("%c🟥 BROKEN (404) GROUPS", sRed);
      console.table(broken);
    } else console.log("%c🟥 NO BROKEN (404) GROUPS FOUND", sRed);

    if (abnormal.length) {
      console.log("");
      console.log("%c🟨 ABNORMAL (BROKEN SCALING) GROUPS", sYellow);
      console.table(abnormal);
    } else console.log("%c🟨 NO ABNORMAL (BROKEN SCALING) GROUPS FOUND", sYellow);

    console.log("");
    console.log("%c✅ SCAN COMPLETED", sLime);

    const totalFound = broken.length + abnormal.length;
    console.log(`%c✅ TOTAL OF ${totalFound} BROKEN GROUP${totalFound !== 1 ? "S" : ""} DETECTED`, sLime);
  })();

})();
