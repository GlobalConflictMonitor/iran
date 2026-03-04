export const TacticalUI = {
    updateProvenance: async (dimIndex, value, dimTag, sigma, hash) => {
        const log = document.getElementById('audit-log-container');
        if (!log) return;

        const normPercent = ((value / 255) * 100).toFixed(1);
        let status = "EQUILIBRIUM";
        if (value > 200) status = "CRITICAL_ESCALATION";
        else if (value > 140) status = "ELEVATED_FRICTION";
        else if (value < 60) status = "SUPPRESSED";

        const colorMain = value > 200 ? '#ff4d4d' : '#00ffaa';
        const colorSigma = sigma < 0.5 ? '#ff4d4d' : '#00ffaa';

        const container = document.createElement('div');

        // --- Secured Audit Entry ---
        const entry = document.createElement('div');
        entry.className = 'audit-entry';
        entry.style.cssText = `border-left: 2px solid ${colorMain}; padding: 10px; background: rgba(0,20,15,0.9); margin-bottom: 10px;`;
        
        const header = document.createElement('div');
        header.style.cssText = 'display:flex; justify-content:space-between; border-bottom:1px solid #333; margin-bottom:5px;';
        
        const nodeSpan = document.createElement('span');
        nodeSpan.style.fontWeight = 'bold';
        nodeSpan.textContent = `NODE: V_${dimIndex}`;
        
        const sigmaSpan = document.createElement('span');
        sigmaSpan.style.color = colorSigma;
        sigmaSpan.textContent = `σ: ${sigma}`;
        
        header.append(nodeSpan, sigmaSpan);

        const resDiv = document.createElement('div');
        resDiv.style.cssText = 'font-size:0.9em; margin:5px 0;';
        resDiv.innerHTML = `RESONANCE: <span style="color:#fff;">${normPercent}%</span> [${status}]`;

        const decodeDiv = document.createElement('div');
        decodeDiv.style.cssText = 'font-size:0.8em; color:#00ffaa;';
        decodeDiv.textContent = `DECODE: ${dimTag}`;

        const hashDiv = document.createElement('div');
        hashDiv.style.cssText = 'font-size:0.7em; color:#ffaa00; opacity:0.6;';
        hashDiv.textContent = `HASH: ${hash}`;

        entry.append(header, resDiv, decodeDiv, hashDiv);

        // --- Intelligence Feed Section ---
        const newsTitle = document.createElement('h5');
        newsTitle.style.cssText = 'margin: 15px 0 5px 0; border-bottom: 1px solid #00ffaa; font-size: 0.8em;';
        newsTitle.textContent = "TOP 5 SECTOR INTELLIGENCE";

        const newsFeed = document.createElement('div');
        newsFeed.id = 'news-feed-target';
        newsFeed.style.cssText = 'font-size: 0.75em; max-height: 400px; overflow-y: auto;';
        newsFeed.textContent = "QUERYING GDELT 2.0 CLOUD...";

        container.append(entry, newsTitle, newsFeed);
        log.innerHTML = ''; 
        log.appendChild(container);

        // Trigger asynchronous news fetch
        TacticalUI.fetchNews(dimIndex, newsFeed);
    },

    fetchNews: async (dimIndex, targetElement) => {
        // Research-mapped query strings per 16D Framework
        const queryMap = {
            0: "(iran OR israel) (strike OR missile)",
            1: "(iran OR israel OR yemen) (vessel OR shipping OR red sea)",
            2: "(israel OR lebanon) (border OR artillery)",
            3: "(iran) (sabotage OR explosion OR facility)",
            4: "(iran OR israel) (cyberattack OR hacker OR blackout)",
            8: "(lebanon OR hezbollah) (clash OR strike)",
            9: "(yemen OR houthi) (drone OR strike)",
            12: "brent crude oil price volatility",
            13: "(iranian rial OR israeli shekel) currency stress"
        };

        const query = queryMap[dimIndex] || "(iran OR israel) conflict";
        const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=5&format=json&sort=DateDesc`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            
            if (!data.articles || data.articles.length === 0) {
                targetElement.textContent = "NO RECENT SECTOR EVENTS DETECTED.";
                return;
            }

            targetElement.innerHTML = '';
            data.articles.forEach(art => {
                const link = document.createElement('a');
                link.href = art.url;
                link.target = "_blank";
                link.className = 'news-link';
                link.style.cssText = "display:block; color:#fff; text-decoration:none; margin-bottom:8px; border-bottom:1px solid #222; padding-bottom:4px;";
                
                const dateDiv = document.createElement('div');
                dateDiv.style.cssText = "color:#00ffaa; font-size:0.8em;";
                dateDiv.textContent = `[${art.seendate.split('T')[0]}]`;
                
                const titleDiv = document.createElement('div');
                titleDiv.textContent = art.title;

                link.append(dateDiv, titleDiv);
                targetElement.appendChild(link);
            });
        } catch (e) {
            targetElement.textContent = "INTELLIGENCE TIMEOUT: GDELT OFFLINE.";
        }
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
            scrubber.addEventListener('input', (e) => onScrub(parseInt(e.target.value)));
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
