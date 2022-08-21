// only required for dev
// in prod, foundry loads index.js, which is compiled by vite/rollup
// in dev, foundry loads index.js, this file, which loads investigator.ts

// some of your dependencies might need this
import "./investigator.ts";
