import { PulseDecoder } from './decoder.js';
import { AuditManager } from './audit_persistence.js';

export const TacticalUI = {
    async init() {
        console.log("GCM // TACTICAL COMMAND: SECTOR IRAN ONLINE");
        this.startPulseMonitor();
    },
    async startPulseMonitor() {
        setInterval(async () => {
            try {
                // Points to the pulse file in the neighboring engine directory
                const intel = await PulseDecoder.extractMeta('../engine/heartbeat.png');
                if (intel.length > 0) {
                    intel.forEach(msg => {
                        const intensity = (msg.match(/[\d.]+/) || [0.5])[0] * 100;
                        AuditManager.saveEntry("INTEL", intensity.toFixed(1), "IRAN_SECTOR");
                    });
                    this.render();
                }
            } catch (e) {
                console.error("Pulse Sync Lost:", e);
            }
        }, 5000); // 5-second tactical sweep
    },
    render() {
        const container = document.getElementById('audit-log-container');
        if (!container) return;
        container.innerHTML = AuditManager.getLogs().map(log => `
            <div class="audit-entry">
                <span class="timestamp">[${new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span class="data">${log.type}: ${log.intensity}%</span>
            </div>
        `).join('');
    }
};
document.addEventListener('DOMContentLoaded', () => TacticalUI.init());
