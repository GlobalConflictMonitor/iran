/**
 * GCM 16D Heatmap System v4.4.3
 * Purpose: Track cumulative kinetic energy across the manifold.
 */
class ResonanceHeatmap {
    constructor(nodeCount = 100) {
        this.accumulation = new Float32Array(nodeCount);
        this.maxEnergy = 0.1;
    }

    update(buffer) {
        const manifold = new Float32Array(buffer);
        this.processFrame(manifold);
    }

    processFrame(manifold) {
        manifold.forEach((v, i) => {
            if (i >= this.accumulation.length) return;
            this.accumulation[i] += v;
            if (this.accumulation[i] > this.maxEnergy) {
                this.maxEnergy = this.accumulation[i];
            }
        });
    }

    getNodeColor(index) {
        const intensity = this.accumulation[index] / this.maxEnergy;
        if (intensity > 0.8) return "#ff0000"; // High Kinetic Zone
        if (intensity > 0.4) return "#ffff00"; // Medium Activity
        return "#00ffcc"; // Baseline Resonance
    }
}
window.GCM_Heatmap = new ResonanceHeatmap();
