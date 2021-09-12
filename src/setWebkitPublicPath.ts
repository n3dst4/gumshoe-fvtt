/* eslint-disable prefer-const, @typescript-eslint/no-unused-vars, camelcase, no-undef */

// see https://webpack.js.org/configuration/output/#outputpublicpath
// this sets the global __webpack_public_path__, which tells webkits dynamic
// loader where to look for dynamic imports. We work this out by asking Foundry
// to resolve "/systems/investigator/" which is the path this module will be
// under.

// we need this so that
// a. we can do dynamic imports if we want, and
// b. modules like file-system-access which are gonna do dynamic imports whether
// we like it or not will work.

declare let __webpack_public_path__: string;

let publicPath = getRoute("/systems/investigator/");
if (!publicPath.endsWith("/")) {
  publicPath += "/";
}
console.log(`setting __webpack_public_path__ to ${publicPath}`);
__webpack_public_path__ = publicPath;
