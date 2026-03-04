class ResonanceShare {
    constructor() {
        this.baseUrl = window.location.origin + window.location.pathname;
    }

    // Capture current 16D state and headline
    generateLink(manifold, meta) {
        // We take the top 5 high-energy nodes to keep the URL short
        const state = {
            m: manifold.slice(0, 5).map(v => Array.from(v)),
            t: document.getElementById('ticker-text').innerText,
            ts: Date.now()
        };
        const encoded = btoa(JSON.stringify(state));
        const shareUrl = `${this.baseUrl}?signal=${encoded}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert("SIGNAL CAPTURED: URL COPIED TO CLIPBOARD");
    }

    // Check if the page was loaded from a shared signal
    parseSharedSignal() {
        const params = new URLSearchParams(window.location.search);
        const signal = params.get('signal');
        if (signal) {
            try {
                const decoded = JSON.parse(atob(signal));
                return decoded;
            } catch (e) {
                console.error("Invalid Signal Fragment");
            }
        }
        return null;
    }
}
const shareSystem = new ResonanceShare();
