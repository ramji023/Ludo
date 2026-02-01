export default class AudioManager {
  private audios: Map<string, HTMLAudioElement> = new Map();
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  preload(url: string) {
    if (this.audios.has(url)) return;

    const audio = new Audio(url);
    audio.preload = "auto";
    audio.load();

    this.audios.set(url, audio);
  }

  play(url: string, duration?: number) {
    // Stop all currently playing audios
    this.stopAll();

    // if not preloaded yet, preload now
    if (!this.audios.has(url)) {
      this.preload(url);
    }

    const audio = this.audios.get(url);
    if (!audio) return;

    audio.currentTime = 0;

    // set loop based on whether duration is given
    if (duration === undefined) {
      audio.loop = true; // loop continuously
    } else {
      audio.loop = false; // dont loop if duration defined
    }

    audio
      .play()
      .then(() => {
        // only set timer if duration is provided
        if (duration !== undefined) {
          const timer = setTimeout(() => {
            this.stop(url);
          }, duration);

          this.timers.set(url, timer);
        }
      })
      .catch(console.warn);
  }

  stop(url: string) {
    const audio = this.audios.get(url);
    if (!audio) return;

    const timer = this.timers.get(url);
    if (timer) clearTimeout(timer);

    audio.pause();
    audio.currentTime = 0;
    audio.loop = false; // Reset loop when stopping

    this.timers.delete(url);
  }

  stopAll() {
    // Stop all audios
    this.audios.forEach((audio, url) => {
      this.stop(url);
    });
  }
}