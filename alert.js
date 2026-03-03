class ResonanceAlert {
    constructor(threshold = 0.9) {
        this.threshold = threshold;
        this.lastAlert = 0;
    }

    trigger(manifold, meta) {
        if (!manifold) return;
        manifold.forEach((v, i) => {
            if (v[1] > this.threshold && Date.now() - this.lastAlert > 30000) {
                this.execute(meta[i] || "KINETIC RESONANCE DETECTED");
                this.lastAlert = Date.now();
            }
        });
    }

    execute(msg) {
        document.body.style.border = "5px solid #ff3131";
        setTimeout(() => document.body.style.border = "none", 2000);
        console.warn(`[GCM ALERT] ${msg}`);
    }
}
// Explicit Global Export for SES/Simulation compatibility
window.GCM_Alert = new ResonanceAlert(0.9);
