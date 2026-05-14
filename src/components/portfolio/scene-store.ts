import { create } from "zustand";

interface SceneState {
  intensity: number;
  setIntensity: (n: number) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  intensity: 1,
  setIntensity: (intensity) => set({ intensity }),
}));
