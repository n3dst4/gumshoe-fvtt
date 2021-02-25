export const preloadTemplates = async function () {
  const templatePaths: string[] = [
    // Add paths to "systems/gumshoe/templates"
  ];

  // eslint-disable-next-line no-undef
  return loadTemplates(templatePaths);
};
