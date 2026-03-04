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

        const isCritical = value > 200;
        const colorMain = isCritical ? '#ff4d4d' : '#00ffaa';
        const colorSigma = sigma < 0.5 ? '#ff4d4d' : '#00ffaa';

        // Strict DOM Node Generation (XSS Mitigation)
        const entry = document.createElement('div');
        entry.className = 'audit-entry';
        entry.style.cssText = `border-left: 2px solid ${colorMain}; padding-left: 10px; background: rgba(0,0,0,0.4); padding-bottom: 5px;`;

        const headerRow = document.createElement('div');
        headerRow.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 4px; border-bottom: 1px solid #333; padding-bottom: 3px;';
        
        const nodeSpan = document.createElement('span');
        nodeSpan.style.cssText = 'font-weight: bold; color: #fff;';
        nodeSpan.textContent = `NODE: V_${dimIndex}`;
        
        const sigmaSpan = document.createElement('span');
        sigmaSpan.style.color = colorSigma;
        sigmaSpan.textContent = `σ: ${sigma}`;
        
        headerRow.appendChild(nodeSpan);
        headerRow.appendChild(sigmaSpan);

        const resRow = document.createElement('div');
        resRow.style.cssText = 'margin: 4px 0; font-size: 0.9em; color: #aaa;';
        resRow.innerHTML = `RESONANCE: <span style="color: #fff; font-weight: bold;">${normPercent}%</span> <span style="color: ${colorMain}; font-size: 0.8em;">[${status}]</span>`;

        const decodeRow = document.createElement('div');
        decodeRow.style.cssText = 'margin: 6px 0; font-size: 0.85em; color: #00ffaa;';
        decodeRow.textContent = `DECODE: ${dimTag}`; // XSS Neutralized

        const hashRow = document.createElement('div');
        hashRow.style.cssText = 'font-size: 0.7em; opacity: 0.6; margin-top: 4px;';
        hashRow.textContent = `HASH: ${hash}`; // XSS Neutralized
        hashRow.style.color = '#ffaa00';

        entry.appendChild(headerRow);
        entry.appendChild(resRow);
        entry.appendChild(decodeRow);
        entry.appendChild(hashRow);

        log.innerHTML = ''; // Clear previous securely
        log.appendChild(entry);
    },

    triggerAlert: (dimIndex, delta, tag) => {
        const ledger = document.getElementById('alert-ledger');
        if (!ledger) return;
        
        const entry = document.createElement('div');
        entry.className = 'alert-entry';
        
        const title = document.createElement('strong');
        title.textContent = `V_${dimIndex} VOLATILITY SPIKE`;
        
        const metric = document.createElement('div');
        metric.textContent = `ΔV/dt = +${delta.toFixed(0)}`;
        
        const tagSpan = document.createElement('span');
        tagSpan.style.cssText = 'color:#aaa; font-size:0.9em;';
        tagSpan.textContent = tag; // XSS Neutralized
        
        entry.appendChild(title);
        entry.appendChild(document.createElement('br'));
        entry.appendChild(metric);
        entry.appendChild(tagSpan);
        
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
