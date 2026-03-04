/**
 * GCM 16D Spectral Monitor v4.4.3
 * Purpose: Visual FFT mapping of raw frequency and amplitude.
 */
class SpectralAnalyzer {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
            document.body.appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');
        this.setupStyles();
    }

    setupStyles() {
        this.canvas.width = 300;
        this.canvas.height = 150;
        this.canvas.style.position = 'absolute';
        this.canvas.style.bottom = '80px';
        this.canvas.style.left = '20px';
        this.canvas.style.border = '1px solid #00ffcc';
        this.canvas.style.background = 'rgba(0,0,0,0.8)';
        this.canvas.style.zIndex = '1000';
    }

    render(buffer) {
        const manifold = new Float32Array(buffer);
        this.draw(manifold);
    }

    draw(manifold) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const barWidth = this.canvas.width / 50; 
        
        for (let i = 0; i < 100; i += 2) {
            const freqH = manifold[i] * this.canvas.height;
            const ampH = manifold[i+1] * (this.canvas.height / 3);
            const x = (i / 2) * barWidth;

            this.ctx.fillStyle = 'rgba(0, 255, 204, 0.3)';
            this.ctx.fillRect(x, this.canvas.height - freqH, barWidth - 1, freqH);
            
            this.ctx.strokeStyle = '#00ffcc';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.canvas.height);
            this.ctx.lineTo(x, this.canvas.height - ampH - 20);
            this.ctx.stroke();
        }
    }
}
window.GCM_Spectrum = new SpectralAnalyzer('spectrum-canvas');
