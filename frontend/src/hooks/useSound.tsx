import { useEffect, useRef } from "react";

export function useSound(audioFile: string, { loop = false } = {}) {
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioFile);
    audio.loop = loop; // enable looping if needed
    soundRef.current = audio;

    return () => {
      // cleanup on unmount
      audio.pause();
      audio.src = "";
    };
  }, [audioFile, loop]);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0; // restart from beginning
      soundRef.current.play();
    }
  };

  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    }
  };

  return { playSound, stopSound };
}
