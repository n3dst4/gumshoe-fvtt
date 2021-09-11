/* eslint-disable prefer-const, @typescript-eslint/no-unused-vars, camelcase, no-undef */
declare let __webpack_public_path__: string;

let publicPath = getRoute("/systems/investigator/");
if (!publicPath.endsWith("/")) {
  publicPath += "/";
}
console.log(`setting __webpack_public_path__ to ${publicPath}`);
__webpack_public_path__ = publicPath;
