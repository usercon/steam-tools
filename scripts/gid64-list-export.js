console.clear();
(() => {
  const path = window.location.pathname;
  const match = path.match(/^\/(id|profiles)\/([^/]+)\/groups\/?$/);
  if (!match) {
    console.group("%cRROR - WRONG URL PATH", "color:red;font-weight:bold;font-size:20px;"); console.groupEnd();
    return;
  }

  const type = match[1];
  const idPart = match[2];

  const gids = [...document.querySelectorAll("a.groupMemberStat.linkStandard.steamLink")]
    .map(a => a.getAttribute("href"))
    .filter(h => h && h.includes("OpenGroupChat"))
    .map(h => h.match(/'(\d+)'/)[1]);

  if (gids.length === 0) {
    console.group("%cERROR: NO GROUPS FOUND", "color:red;font-weight:bold;font-size:20px;"); console.groupEnd();
    return;
  }
 
  console.log(gids.join("\n"));

  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  let steam64 = "Unknown";
  if(type === "profiles") {
    steam64 = idPart;
  } else if(type === "id") {
    const profileLink = document.querySelector('a[href*="/profiles/"]');
    if(profileLink) {
      const m = profileLink.href.match(/\/profiles\/(\d+)/);
      if(m) steam64 = m[1];
    }
  }

  const steamCID = type === "id" ? idPart : "None";

  let text = `Date: ${dateStr}\nTime: ${timeStr}\n\n`;
  text += `Steam CID: ${steamCID}\n`;
  text += `Steam64 ID: ${steam64}\n\n`;
  text += `Groups: ${gids.length}\n\n`;
  text += gids.join("\n");

  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `steam-groups-list-${dateStr}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a);

  console.log("%c\n✅ DETAILED .TXT REPORT IS SAVED IN YOUR DOWNLOADS FOLDER\n", "color: lime; font-weight: bold; font-size: 15px;");
})();
