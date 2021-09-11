const resolvedRoute = getRoute("/systems/investigator/");
console.log(`setting __webpack_public_path__ to ${resolvedRoute}`);
window.__webpack_public_path__ = resolvedRoute;
