class SoundManager {
  constructor() {
    this.sounds = {};
    this.initializeSounds();
  }

  initializeSounds() {
    // Create simple beep sounds using Web Audio API
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  play(soundName) {
    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;
      
      switch(soundName) {
        case 'slash':
          this.playTone(400, 0.1, 0.05);
          break;
        case 'powerAttack':
          this.playTone(300, 0.2, 0.1);
          this.playTone(400, 0.15, 0.1);
          break;
        case 'dash':
          this.playTone(600, 0.08, 0.05);
          break;
        case 'heal':
          this.playTone(800, 0.1, 0.1);
          this.playTone(900, 0.1, 0.1);
          break;
        case 'hit':
          this.playTone(250, 0.05, 0.02);
          break;
        case 'kill':
          this.playTone(600, 0.15, 0.1);
          this.playTone(800, 0.15, 0.1);
          break;
        case 'levelUp':
          this.playTone(700, 0.1, 0.1);
          this.playTone(850, 0.1, 0.1);
          this.playTone(1000, 0.15, 0.15);
          break;
        case 'bossAppear':
          this.playTone(150, 0.2, 0.2);
          this.playTone(200, 0.15, 0.2);
          break;
        case 'bossDefeat':
          this.playTone(1000, 0.2, 0.1);
          this.playTone(900, 0.2, 0.1);
          this.playTone(800, 0.2, 0.1);
          break;
      }
    } catch (e) {
      // Audio API not available
    }
  }

  playTone(frequency, duration, delay) {
    try {
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.frequency.value = frequency;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch (e) {
      // Ignore audio errors
    }
  }
}

export default SoundManager;
