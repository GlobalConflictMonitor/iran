export const PulseDecoder = {
    TARGET_BYTES: 1708,
    PRIME_STEP: 31,
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
                for (let i = 0; i < 16; i++) { vector[i] = data[i * 4] / 255.0; }
                let meta = "";
                for (let i = 0; i < 200; i++) {
                    const idx = (64 + (i * this.PRIME_STEP)) % this.TARGET_BYTES;
                    if (data[idx] === 0) break;
                    meta += String.fromCharCode(data[idx]);
                }
                resolve({ rawVector: vector, telemetry: meta, legacyLog: vector.map((v, i) => `DIM_${i}: ${v.toFixed(2)}`) });
            };
            img.onerror = () => resolve(null);
        });
    }
};
