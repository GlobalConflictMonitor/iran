/**
 * GCM TACTICAL COMMAND - SONIFICATION MODULE (v5.1.0)
 * Refactored for Class persistence and 16D Vector Mapping.
 */
export class Sonifier {
    constructor() {
        this.ctx = null;
        this.gainNode = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            // Global limiter to prevent clipping during high-intensity 16D resonance
            this.gainNode = this.ctx.createGain();
            this.gainNode.connect(this.ctx.destination);
        }
    }

    /**
     * @param {Float32Array} vector - 16D Signal Stride
     */
    playResonance(vector) {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        // Calculate Intensity (L2 Norm / Magnitude of the 16D Vector)
        // Intensity I = sqrt(sum(v_i^2))
        const intensity = Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0));

        const osc = this.ctx.createOscillator();
        const localGain = this.ctx.createGain();

        // Tactical Mapping: 16D Manifold to Audio Grit
        osc.type = 'sawtooth'; 
        
        // Frequency f(I) = 100 + (I * 7)
        const freq = 100 + (intensity * 7);
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        localGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        localGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);

        osc.connect(localGain);
        localGain.connect(this.gainNode);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }
}