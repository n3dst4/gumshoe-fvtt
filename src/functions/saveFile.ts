/**
 * trigger a pretend file download
 */
export const saveFile = (text: string, filename: string) => {
  const el = document.createElement("a");
  const uriContent =
    "data:application/octet-stream," + encodeURIComponent(text);
  el.setAttribute("href", uriContent);
  el.setAttribute("download", filename);
  document.body.appendChild(el);
  el.dispatchEvent(
    new MouseEvent("click", {
      view: window,
      bubbles: false,
      cancelable: true,
    }),
  );
  el.remove();
};

/**
 * trigger a download of some json
 */
export const saveJson = (data: Record<string, unknown>, basename: string) => {
  const json = JSON.stringify(data, null, 2);
  const filename = `${basename}.json`;
  saveFile(json, filename);
};
