export const preloadTemplates = async function () {
  const templatePaths: string[] = [
    // Add paths to "systems/trail-of-cthulhu-unsanctioned/templates"
  ];

  // eslint-disable-next-line no-undef
  return loadTemplates(templatePaths);
};
