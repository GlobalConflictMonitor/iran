export const PulseDecoder = {
    TARGET_BYTES: 1708,
    async extractMeta(imageSrc) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imageSrc + '?t=' + Date.now();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width; canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const data = ctx.getImageData(0, 0, img.width, img.height).data;
                
                const vector = new Array(16);
                // pulse_gen.py uses RGBA (4 bytes per pixel)
                // We map one dimension per pixel (using the Red channel)
                for (let i = 0; i < 16; i++) {
                    vector[i] = data[i * 4] / 255.0; 
                }
                
                // Legacy support for tactical_ui text
                const intel = vector.map((v, i) => `DIM_${i}: ${v.toFixed(2)}`);
                intel.rawVector = vector;
                resolve(intel);
            };
            img.onerror = () => resolve([]);
        });
    }
};
