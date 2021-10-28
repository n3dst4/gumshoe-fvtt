export const preloadTemplates = async function () {
  const templatePaths: string[] = [
    // Add paths to "systems/investigator/templates"
  ];

  // eslint-disable-next-line no-undef
  return loadTemplates(templatePaths);
};
