export function installFathom () {
  const scriptEl = document.createElement("script");
  scriptEl.setAttribute("src", "https://cdn.usefathom.com/script.js");
  scriptEl.setAttribute("data-site", "HXDZGAVA");
  scriptEl.setAttribute("defer", "true");
  document.body.appendChild(scriptEl);
}
