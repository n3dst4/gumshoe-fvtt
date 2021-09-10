// document.currentScript polyfill by Adam Miller

// MIT license

(function (document) {
  const currentScript = "currentScript";

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function () {
        // IE 8-10 support script readyState
        // IE 11+ support stack trace
        try {
          throw new Error();
        } catch (err) {
          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          let i = 0;
          const stackDetails = (/.*at [^(]*\((.*):(.+):(.+)\)$/ig).exec(err.stack);
          const scriptLocation = (stackDetails && stackDetails[1]) || false;
          const line = (stackDetails && stackDetails[2]) || false;
          const currentLocation = document.location.href.replace(document.location.hash, "");
          let pageSource;
          let inlineScriptSourceRegExp;
          let inlineScriptSource;
          const scripts = document.getElementsByTagName("script"); // Live NodeList collection

          if (scriptLocation === currentLocation) {
            pageSource = document.documentElement.outerHTML;
            inlineScriptSourceRegExp = new RegExp("(?:[^\\n]+?\\n){0," + (line - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i");
            inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, "$1").trim();
          }

          for (; i < scripts.length; i++) {
            // If ready state is interactive, return the script tag
            if (scripts[i].readyState === "interactive") {
              return scripts[i];
            }

            // If src matches, return the script tag
            if (scripts[i].src === scriptLocation) {
              return scripts[i];
            }

            // If inline source matches, return the script tag
            if (
              scriptLocation === currentLocation &&
              scripts[i].innerHTML &&
              scripts[i].innerHTML.trim() === inlineScriptSource
            ) {
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      },
    });
  }
})(document);
