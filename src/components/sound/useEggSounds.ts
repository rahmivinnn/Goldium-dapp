import { useRef } from "react";
import { Howl } from "howler";

const sounds = {
  play: "/sounds/egg-pop.mp3",
  attack: "/sounds/egg-attack.mp3",
  win: "/sounds/egg-win.mp3",
  lose: "/sounds/egg-lose.mp3",
  click: "/sounds/egg-click.mp3",
};

export function useEggSounds() {
  const soundRefs = useRef<{ [key: string]: Howl }>({});

  function play(sound: keyof typeof sounds) {
    if (!soundRefs.current[sound]) {
      soundRefs.current[sound] = new Howl({ src: [sounds[sound]], volume: 0.6 });
    }
    soundRefs.current[sound].play();
  }

  return { play };
}
