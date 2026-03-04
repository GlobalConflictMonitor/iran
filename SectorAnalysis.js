export const SectorAnalysis = {
    calculateCorrelation: (v1_history, v2_history) => {
        const n = v1_history.length;
        if (n < 2) return 0;
        const mu1 = v1_history.reduce((a, b) => a + b, 0) / n;
        const mu2 = v2_history.reduce((a, b) => a + b, 0) / n;
        const num = v1_history.reduce((acc, _, i) => acc + (v1_history[i] - mu1) * (v2_history[i] - mu2), 0);
        const den = Math.sqrt(v1_history.reduce((acc, v) => acc + (v - mu1)**2, 0) * v2_history.reduce((acc, v) => acc + (v - mu2)**2, 0));
        return den === 0 ? 0 : num / den;
    }
};
