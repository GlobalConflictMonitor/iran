/**
 * GCM Heatmap Overlay v5.0.1
 * Purpose: Spatial 3D Mapping of 16D Manifold Resonance.
 */
window.GCM_Heatmap = {
    canvas: document.getElementById('world-canvas'),
    ctx: document.getElementById('world-canvas').getContext('2d'),
    
    init: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    },

    update: function(manifold) {
        if (!manifold || !manifold[0]) return;
        const data = manifold[0];
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);
        
        // 4x4 Grid Mapping for 16 Dimensions
        for (let i = 0; i < 16; i++) {
            const intensity = data[i]; // Value 0.0 to 1.0
            const row = Math.floor(i / 4);
            const col = i % 4;
            
            // Calculate screen coordinates
            const x = (w / 5) * (col + 1);
            const y = (h / 5) * (row + 1);
            const radius = intensity * 150;

            // Draw Resonance Well (Radial Gradient)
            const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
            const color = intensity > 0.9 ? '255, 49, 49' : '0, 255, 204';
            
            grad.addColorStop(0, `rgba(${color}, ${intensity * 0.6})`);
            grad.addColorStop(1, `rgba(${color}, 0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

            // Tactical Label Overlay
            if (intensity > 0.5) {
                ctx.fillStyle = `rgba(${color}, 0.8)`;
                ctx.font = '10px Courier New';
                ctx.fillText(`WELL_${i}:${(intensity*100).toFixed(0)}%`, x - 20, y + radius + 15);
            }
        }
    }
};
window.GCM_Heatmap.init();
