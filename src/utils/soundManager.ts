// Sound Manager for Math Learning App - React Version
// Handles playing all WAV files using Web Audio API

export const SoundType = {
  CORRECT_ANSWER: 'correct' as const,
  WRONG_ANSWER: 'wrong' as const,
  TRY_AGAIN: 'try-again' as const,
  BUTTON_CLICK: 'button-click' as const,
  CELEBRATION: 'celebration' as const
} as const;

export type SoundTypeValue = typeof SoundType[keyof typeof SoundType];

class SoundManager {
  private static instance: SoundManager;
  private soundEnabled: boolean = true;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private letterSounds: Map<string, AudioBuffer> = new Map();

  // User's custom success sounds for variety
  private successSounds = ['aluf.wav', 'Hitlahta.wav', 'you_made_it.wav'];
  private wrongSounds = ['close.wav', 'no.wav'];

  private constructor() {
    this.initializeAudioContext();
    this.loadAllSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async loadAudioFile(path: string): Promise<AudioBuffer | null> {
    try {
      if (!this.audioContext) return null;

      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Could not load audio file: ${path}`, error);
      return null;
    }
  }

  private async loadAllSounds() {
    console.log('🎵 Loading user custom sound files...');

    // Load math feedback sounds
    const soundPromises = [
      // Success sounds (user's custom files)
      ...this.successSounds.map(file => this.loadAudioFile(`/sounds/${file}`)),
      // Wrong answer sounds
      ...this.wrongSounds.map(file => this.loadAudioFile(`/sounds/${file}`)),
      // Other sounds
      this.loadAudioFile('/sounds/try_again.wav'),
      this.loadAudioFile('/sounds/button-click.wav'),
      this.loadAudioFile('/sounds/celebration.wav')
    ];

    const [
      aluf, hitlahta, youMadeIt,
      close, no,
      tryAgain, buttonClick, celebration
    ] = await Promise.all(soundPromises);

    // Store success sounds
    if (aluf) this.sounds.set('success-aluf', aluf);
    if (hitlahta) this.sounds.set('success-hitlahta', hitlahta);
    if (youMadeIt) this.sounds.set('success-youmadeit', youMadeIt);

    // Store wrong sounds
    if (close) this.sounds.set('wrong-close', close);
    if (no) this.sounds.set('wrong-no', no);

    // Store other sounds
    if (tryAgain) this.sounds.set('try-again', tryAgain);
    if (buttonClick) this.sounds.set('button-click', buttonClick);
    if (celebration) this.sounds.set('celebration', celebration);

    console.log('✅ Success sounds:', this.successSounds);
    console.log('❌ Wrong sounds:', this.wrongSounds);
    console.log('🔄 Try again sound loaded');

    // Load letter sounds for English game
    await this.loadLetterSounds();
  }

  private async loadLetterSounds() {
    console.log('🔤 Loading letter sounds...');

    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                    'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z'];

    const letterPromises = letters.map(async letter => {
      const audioBuffer = await this.loadAudioFile(`/sounds/end_letters/${letter}.wav`);
      if (audioBuffer) {
        this.letterSounds.set(letter, audioBuffer);
      }
      return { letter, loaded: !!audioBuffer };
    });

    const results = await Promise.all(letterPromises);
    const loadedCount = results.filter(r => r.loaded).length;

    console.log(`📚 Loaded ${loadedCount}/${letters.length} letter sounds`);
  }

  private playAudioBuffer(audioBuffer: AudioBuffer, volume: number = 0.7) {
    if (!this.audioContext || !audioBuffer) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = audioBuffer;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start(0);
    } catch (error) {
      console.warn('Error playing audio:', error);
    }
  }

  public async playSound(soundType: SoundTypeValue) {
    if (!this.soundEnabled) return;

    // Resume audio context if needed (browser autoplay policy)
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }

    switch (soundType) {
      case SoundType.CORRECT_ANSWER:
        this.playRandomSuccessSound();
        break;

      case SoundType.WRONG_ANSWER:
        this.playRandomWrongSound();
        break;

      case SoundType.TRY_AGAIN: {
        const tryAgainSound = this.sounds.get('try-again');
        if (tryAgainSound) {
          this.playAudioBuffer(tryAgainSound, 0.6);
        }
        break;
      }

      case SoundType.BUTTON_CLICK: {
        const buttonSound = this.sounds.get('button-click');
        if (buttonSound) {
          this.playAudioBuffer(buttonSound, 0.3);
        }
        break;
      }

      case SoundType.CELEBRATION: {
        const celebrationSound = this.sounds.get('celebration');
        if (celebrationSound) {
          this.playAudioBuffer(celebrationSound, 0.7);
        }
        break;
      }
    }
  }

  private playRandomSuccessSound() {
    const successKeys = Array.from(this.sounds.keys()).filter(key => key.startsWith('success-'));
    if (successKeys.length > 0) {
      const randomKey = successKeys[Math.floor(Math.random() * successKeys.length)];
      const sound = this.sounds.get(randomKey);
      if (sound) {
        this.playAudioBuffer(sound, 0.7);
        console.log(`🎉 Playing success sound: ${randomKey}`);
      }
    }
  }

  private playRandomWrongSound() {
    const wrongKeys = Array.from(this.sounds.keys()).filter(key => key.startsWith('wrong-'));
    if (wrongKeys.length > 0) {
      const randomKey = wrongKeys[Math.floor(Math.random() * wrongKeys.length)];
      const sound = this.sounds.get(randomKey);
      if (sound) {
        this.playAudioBuffer(sound, 0.5);
        console.log(`❌ Playing wrong sound: ${randomKey}`);
      }
    }
  }

  public playLetterSound(letter: string) {
    if (!this.soundEnabled) return;

    const upperLetter = letter.toUpperCase();
    const letterSound = this.letterSounds.get(upperLetter);

    if (letterSound) {
      this.playAudioBuffer(letterSound, 0.7);
      console.log(`🔊 Playing letter sound: ${upperLetter}`);
    } else {
      console.warn(`No sound available for letter: ${upperLetter}`);
    }
  }

  public getAvailableLetters(): string[] {
    return Array.from(this.letterSounds.keys()).sort();
  }

  public getRandomLetter(): string {
    const letters = this.getAvailableLetters();
    return letters[Math.floor(Math.random() * letters.length)];
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    console.log(`🔊 Sound ${enabled ? 'enabled' : 'disabled'}`);
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    console.log(`🔊 Sound toggled: ${this.soundEnabled ? 'ON' : 'OFF'}`);
    return this.soundEnabled;
  }
}

export default SoundManager;