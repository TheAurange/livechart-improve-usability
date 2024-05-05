// ==UserScript==
// @name    [LiveChart] Improve Usability
// @author  Aurange
// @version 1.15
// @match   https://www.livechart.me/*-*/*
// @match   https://www.livechart.me/tba/*
// ==/UserScript==
"use strict";

let url = window.location.href.split("/");

if(url[4].split("?")[0] !== "all") window.location.href = window.location.href.replace("tv", "all");

window.addEventListener("keyup", function(e){
  if(e.key === "ArrowLeft") document.querySelector("div[title='Previous season'] > a").click();
  else if(e.key === "ArrowRight" && url[3] !== "tba") document.querySelector("div[title='Following season'] > a").click();
}, {
  passive: true
});

new MutationObserver(function(mutationList, observer){
  if(document.querySelector("div.poster-container")){
    observer.disconnect();

    document.querySelectorAll("article.anime").forEach(e => {
      let eC = e.querySelector("div.anime-episodes").innerText,
          eS = e.querySelector("div.anime-synopsis"),
          cE = e.querySelector("div.release-schedule-info")?.innerText,
          count = e.querySelector("time")?.innerText.split(" ");

      //Begin hide theatrical releases section.
      if((eC.indexOf("×") === -1 && eS.innerText.indexOf("※ NOTE: BD & DVD Release") === -1) || e.querySelector("h3.main-title > a").innerText === "Untitled Studio Colorido Film") e.style.display = "none";
      //  End hide theatrical releases section.

      eC = eC.split(" eps")[0];

      if(e.style.display !== "none" && eC.indexOf("?") === -1 && !!cE && !!count){
        let end,
            eL = eC - cE.split("EP")[1].split(" ")[0] + 1;

        end = new Date(Date.now() + ((count[0].slice(0, -1) * 86400000) + (count[1].slice(0, -1) * 3600000) + (count[2].slice(0, -1) * 60000) + (count[3].slice(0, -1) * 1000)));

        end.setDate(end.getDate() + ((eL - 1) * 7));

        eS.prepend(document.createElement("p").innerText = `This show ends on ${end.toLocaleDateString()}. (${eL} Episode${(eL > 1) ? "s" : ""} Left)`);
      }
    });
  }
}).observe(document, {
  childList: true,
  subtree: true
});
