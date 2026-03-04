export const TacticalUI = {
    updateProvenance: (dimIndex, value, dimTag, sigma, hash) => {
        const log = document.getElementById('audit-log-container');
        if (!log) return;

        // Mathematical Normalization to Percentage
        const normPercent = ((value / 255) * 100).toFixed(1);
        let status = "EQUILIBRIUM";
        if (value > 200) status = "CRITICAL_ESCALATION";
        else if (value > 140) status = "ELEVATED_FRICTION";
        else if (value < 60) status = "SUPPRESSED";

        log.innerHTML = `
            <div class="audit-entry" style="border-left: 2px solid ${value > 200 ? '#ff4d4d' : '#00ffaa'}; padding-left: 10px; background: rgba(0,0,0,0.4); padding-bottom: 5px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; border-bottom: 1px solid #333; padding-bottom: 3px;">
                    <span style="font-weight: bold; color: #fff;">NODE: V_${dimIndex}</span>
                    <span style="color: ${sigma < 0.5 ? '#ff4d4d' : '#00ffaa'}">σ: ${sigma}</span>
                </div>
                <div style="margin: 4px 0; font-size: 0.9em; color: #aaa;">
                    RESONANCE: <span style="color: #fff; font-weight: bold;">${normPercent}%</span> 
                    <span style="color: ${value > 200 ? '#ff4d4d' : '#00ffaa'}; font-size: 0.8em;">[${status}]</span>
                </div>
                <div style="margin: 6px 0; font-size: 0.85em; color: #00ffaa;">
                    DECODE: ${dimTag}
                </div>
                <div style="font-size: 0.7em; opacity: 0.6; margin-top: 4px;">
                    HASH: <span style="color: #ffaa00;">${hash}</span>
                </div>
            </div>
        `;
    },

    triggerAlert: (dimIndex, delta, tag) => {
        const ledger = document.getElementById('alert-ledger');
        if (!ledger) return;
        const entry = document.createElement('div');
        entry.className = 'alert-entry';
        entry.innerHTML = `<strong>V_${dimIndex} VOLATILITY SPIKE</strong><br>ΔV/dt = +${delta.toFixed(0)}<br><span style="color:#aaa; font-size:0.9em;">${tag}</span>`;
        ledger.prepend(entry);
        if (ledger.children.length > 5) ledger.removeChild(ledger.lastChild);
    }
};

export const TemporalScrubber = {
    init: function(onScrub) {
        const container = document.getElementById('scrubber-container');
        if (!container.querySelector('#temporal-scrub')) {
            const scrubber = document.createElement('input');
            scrubber.type = 'range';
            scrubber.id = 'temporal-scrub';
            scrubber.min = 0; scrubber.max = 999; scrubber.value = 999;
            scrubber.style = "width: 200px; accent-color: #00ffaa; pointer-events: auto;";
            
            scrubber.addEventListener('input', (e) => {
                onScrub(parseInt(e.target.value));
            });
            container.appendChild(scrubber);
        }
    },
    updateTimeDisplay: function(timestamp) {
        const display = document.getElementById('scrubber-time');
        if (display && timestamp) {
            const date = new Date(timestamp);
            display.innerText = `T-${date.toISOString().split('T')[1].split('.')[0]} UTC`;
        } else if (display) {
            display.innerText = "LIVE STREAM";
        }
    }
};
