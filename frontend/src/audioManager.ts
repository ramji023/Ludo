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

  play(url: string, duration = 100) {
    // if not preloaded yet, preload now
    if (!this.audios.has(url)) {
      this.preload(url);
    }

    // stop this audio if already playing
    this.stop(url);

    const audio = this.audios.get(url);
    if (!audio) return;

    audio.currentTime = 0;

    audio
      .play()
      .then(() => {
        const timer = setTimeout(() => {
          this.stop(url);
        }, duration);

        this.timers.set(url, timer);
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

    this.timers.delete(url);
  }
}
