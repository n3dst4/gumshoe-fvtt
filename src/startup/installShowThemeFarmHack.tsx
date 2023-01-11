import { themeFarmClassInstance } from "../module/ThemeFarmClass";

export function installShowThemeFarmHack() {
  (window as any).showThemeFarm = function showThemefarm() {
    themeFarmClassInstance.render(true);
  };
}
