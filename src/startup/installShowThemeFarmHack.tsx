import { themeFarmClassInstance } from "../module/ThemeFarmClass";

export function installShowThemeFarmHack(): void {
  (window as any).showThemeFarm = function showThemefarm() {
    themeFarmClassInstance.render(true);
  };
}
