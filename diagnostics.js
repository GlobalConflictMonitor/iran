/**
 * GCM 16D Diagnostics v4.4.6 (SES-Hardened)
 * Purpose: Validate 1708-byte pulse using TypedArrays only.
 */
const GCM_Diagnostics = {
    target: 1708,
    verify: async function() {
        try {
            const response = await fetch(`heartbeat.png?v=${Date.now()}`);
            const buffer = await response.arrayBuffer();
            const size = buffer.byteLength;

            const hud = document.getElementById('diagnostic-hud');
            if (!hud) return;

            // USE TYPED ARRAYS ONLY: Avoid strings/JSON to satisfy SES
            if (size === this.target) {
                hud.style.color = '#00ffcc';
                hud.innerText = "LOCKED: 1708B [16D SYNC]";
            } else {
                hud.style.color = '#ff3131';
                hud.innerText = `DRIFT: ${size}B [RE-SYNC]`;
            }
        } catch (e) {
            console.error("[GCM] SES-Safe Diagnostic failure.");
        }
    }
};
GCM_Diagnostics.verify();
