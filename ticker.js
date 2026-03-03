/**
 * GCM 16D Ticker v4.4.8 (CSP-Compliant)
 * Purpose: Cycle steganographic headlines without using eval/strings.
 */
class ResonanceTicker {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.currentIdx = 0;
        this.timer = null;
    }

    stream(meta) {
        if (!meta || meta.length === 0 || !this.element) return;
        
        // Clear existing interval to prevent memory leaks
        if (this.timer) clearInterval(this.timer);

        // CSP COMPLIANT: Pass a function, not a string
        this.timer = setInterval(() => {
            if (meta[this.currentIdx]) {
                this.element.innerText = "SIGNAL: " + meta[this.currentIdx].toUpperCase();
                this.currentIdx = (this.currentIdx + 1) % meta.length;
            }
        }, 5000);
    }
}
window.GCM_Ticker = new ResonanceTicker('ticker-text');
