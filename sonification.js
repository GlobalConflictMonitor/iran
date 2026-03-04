export class Sonifier {
    constructor() {
        this.ctx = null;
        this.gainNode = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.ctx.createGain();
            // Global volume limiter to prevent clipping when stacking pulses
            this.gainNode.gain.value = 0.5; 
            this.gainNode.connect(this.ctx.destination);
        }
    }

    playResonance(vector, sigma = 1.0) {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        // Calculate L2 Norm Intensity bounded between 0.0 and 1.0
        const intensity = Math.sqrt(vector.reduce((acc, val) => acc + (val/255) ** 2, 0) / 16);
        this.triggerOsc(100 + (intensity * 350), sigma, 'sawtooth');
    }

    playSolo(value, index, sigma = 1.0) {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        const freq = 100 + (value * 7); 
        // Differentiate Quadrant IV (Macro) with a deeper, hollower triangle wave
        const type = index >= 12 ? 'triangle' : 'sawtooth';
        
        this.triggerOsc(freq, sigma, type);
    }

    triggerOsc(freq, sigma, type) {
        const t = this.ctx.currentTime + 0.05; // 50ms Scheduling Lookahead (Underrun Fix)
        const tail = 4.5; // Extend decay to fill the 5-second polling interval
        
        const osc = this.ctx.createOscillator();
        const localGain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);

        // "Fog of War" Data Fragmentation (FM Synthesis)
        if (sigma < 0.5) {
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            
            lfo.frequency.setValueAtTime(25, t); // 25Hz Grit
            lfoGain.gain.setValueAtTime(15, t);  // +/- 15Hz Pitch distortion
            
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            
            lfo.start(t);
            lfo.stop(t + tail);
        }

        // Smooth Attack and Long Exponential Release (Sonar Heartbeat)
        localGain.gain.setValueAtTime(0.0001, t);
        localGain.gain.linearRampToValueAtTime(0.1, t + 0.1); // 100ms fade-in removes pops
        localGain.gain.exponentialRampToValueAtTime(0.0001, t + tail);

        osc.connect(localGain);
        localGain.connect(this.gainNode);

        osc.start(t);
        osc.stop(t + tail);
    }
}
