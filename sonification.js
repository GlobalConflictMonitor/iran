export class Sonifier {
    constructor() {
        this.ctx = null;
        this.gainNode = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.ctx.createGain();
            this.gainNode.connect(this.ctx.destination);
        }
    }

    playResonance(vector, sigma = 1.0) {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const intensity = Math.sqrt(vector.reduce((acc, val) => acc + (val/255) ** 2, 0));
        this.triggerOsc(100 + (intensity * 350), sigma, 'sawtooth');
    }

    playSolo(value, index, sigma = 1.0) {
        this.init();
        // Critical: Added resume check for Solo Mode to bypass auto-play block
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        const freq = 100 + (value * 7); 
        const type = index >= 12 ? 'triangle' : 'sawtooth';
        
        this.triggerOsc(freq, sigma, type);
    }

    triggerOsc(freq, sigma, type) {
        const osc = this.ctx.createOscillator();
        const localGain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        if (sigma < 0.5) {
            const lfo = this.ctx.createOscillator();
            lfo.frequency.setValueAtTime(20, this.ctx.currentTime);
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(10, this.ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            lfo.stop(this.ctx.currentTime + 0.5);
        }

        localGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        localGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);

        osc.connect(localGain);
        localGain.connect(this.gainNode);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }
}
