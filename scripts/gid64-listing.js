console.clear(), console.log(
  [...document.querySelectorAll("a.groupMemberStat.linkStandard.steamLink")]
    .map(a => a.getAttribute("href"))
    .filter(h => h && h.includes("OpenGroupChat"))
    .map(h => h.match(/'(\d+)'/)[1])
    .join("\n")
);
