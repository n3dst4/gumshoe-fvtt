import { registerSettings } from "./module/settings";
import { preloadTemplates } from "./module/preloadTemplates";
import { GumshoeActor } from "./module/GumshoeActor";
import { GumshoeItem } from "./module/GumshoeItem";
import { GumshoeActorSheet } from "./module/GumshoeActorSheet";

// Initialize system
Hooks.once("init", async function () {
  console.log("gumshoe | Initializing gumshoe");
  // Assign custom classes and constants here

  // Register custom system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  CONFIG.Actor.entityClass = GumshoeActor;
  CONFIG.Item.entityClass = GumshoeItem;

  // Register custom sheets (if any)
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("gumshoe", GumshoeActorSheet, { makeDefault: true });

  // console.log("lol");
});

// Setup system
Hooks.once("setup", function () {
  // Do anything after initialization but before
  // ready
});

// When ready
Hooks.once("ready", function () {
  // Do anything once the system is ready
});

// Add any additional hooks if necessary
