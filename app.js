import { PulseDecoder } from './decoder.js';
import { AuditManager } from './audit_persistence.js';
import { Sonifier } from './sonification.js';

const GCM_OS = {
    init: async function() {
        try {
            // Updated relative path: ./engine/heartbeat.png
            const intel = await PulseDecoder.extractMeta('./engine/heartbeat.png');
            if (intel && intel.rawVector) {
                this.sync(intel.rawVector, intel);
            }
        } catch (e) {
            console.warn("GCM // PULSE_SYNC_ERROR");
        }
    },
    sync: function(vector, intel) {
        try {
            // Fail-safe constructor check
            const resonance = (typeof Sonifier === 'function') ? new Sonifier() : Sonifier;
            if (resonance && resonance.playResonance) {
                resonance.playResonance(vector);
            }
        } catch (e) { console.warn("AUDIO_CONTEXT_BLOCKED"); }

        if (window.GCM_Heatmap) window.GCM_Heatmap.update([vector]);
        if (window.GCM_Ticker) window.GCM_Ticker.stream(intel);
        
        this.updateUI(intel);
    },
    updateUI: function(intel) {
        const container = document.getElementById('audit-log-container');
        if (container) {
            container.innerHTML = intel.map(msg => `
                <div class="audit-entry">${msg}</div>
            `).join('');
        }
    }
};

window.addEventListener('load', () => {
    setInterval(() => GCM_OS.init(), 5000);
});
