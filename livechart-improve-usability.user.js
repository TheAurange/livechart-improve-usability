// ==UserScript==
// @name    [LiveChart] Improve Usability
// @author  Aurange
// @version 1.3
// @match   https://www.livechart.me/*-*/*
// @match   https://www.livechart.me/tba/*
// ==/UserScript==

"use strict";

let url = window.location.href.split("/");
if(url[4] !== "all") window.location.href = window.location.href.replace(/\/\w+$/, "/all");

window.addEventListener("keyup", function(e){
  if(e.key === "ArrowLeft") document.querySelector("div[title='Previous season'] > a").click();
  else if(e.key === "ArrowRight" && url[3] !== "tba") document.querySelector("div[title='Following season'] > a").click();
}, {
  passive: true
});

document.querySelectorAll("p.editor-note").forEach(e => {
  if(e.innerText === "※ NOTE: Theatrical Premiere") e.parentElement.parentElement.parentElement.parentElement.style.display = "none";
});

new MutationObserver(function(mutationList, observer){
  if(document.querySelector("div.poster-container")){
    observer.disconnect();

    document.querySelectorAll("div.anime-episodes").forEach(e => {
      if(e.parentElement.parentElement.parentElement.parentElement.style.display !== "none" && e.parentElement.parentElement.parentElement.children[2].children[0].innerText.indexOf("EP") !== -1 && e.innerText.split(" eps")[0].indexOf("?") === -1 && e.innerText.split(" eps").length > 1) {
        let eC = e.innerText.split(" eps")[0] - e.parentElement.parentElement.parentElement.children[2].children[0].innerText.split("EP")[1].split(":")[0] + 1,
            info = document.createElement("p");

        if(e.parentElement.parentElement.children[1].innerText.indexOf("Began") === -1){
          let end = new Date(e.parentElement.parentElement.children[1].innerText.replace(" at", ",").replace(/(am|pm)/, " $&"));

          end.setDate(end.getDate() + ((e.innerText.split(" eps")[0] - 1) * 7));
          end.setDate(end.getDate() + ((eC - Math.ceil((end - new Date()) / 604800000)) * 7));

          info.append("This show ends on " + end.toLocaleDateString() + ". (" + eC + " Episodes Left)");
          e.parentElement.parentElement.children[3].prepend(info);
        }
        else{
          let current = new Date(),
              fixer = e.parentElement.parentElement.parentElement.children[2].children[0].innerText.split(": ")[1].split(" ");

          current.setDate(current.getDate() - (e.parentElement.parentElement.parentElement.children[2].children[0].innerText.split("EP")[1].split(":")[0] * 7));
          current.setDate(current.getDate() + ((e.innerText.split(" eps")[0] - 1) * 7));
          current.setDate(current.getDate() + ((eC - Math.ceil((current - new Date()) / 604800000)) * 7));
          current.setTime(current.getTime() - (604800000 - ((fixer[0].slice(0, -1) * 86400000) + (fixer[1].slice(0, -1) * 3600000) + (fixer[2].slice(0, -1) * 60000) + (fixer[3].slice(0, -1) * 1000))));

          info.append("This show ends on " + current.toLocaleDateString() + ". (" + eC + " Episodes Left)");
          e.parentElement.parentElement.children[3].prepend(info);
        }
      }
    });
  }
}).observe(document, {
  childList: true,
  subtree: true
});
