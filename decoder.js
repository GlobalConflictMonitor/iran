export const PulseDecoder = {
    extractMeta: async function(url) {
        try {
            const response = await fetch(`${url}?t=${Date.now()}`);
            const buffer = await response.arrayBuffer();
            const data = new Uint8Array(buffer);

            if (data.length !== 1708) {
                console.warn(`[!] INTEGRITY_WARNING: Expected 1708 bytes, got ${data.length}`);
            }

            const rawVector = [];
            const sigmaVector = [];
            const N = 1708, k = 31, startOffset = 64;

            // Extract Vector (Red) and Volatility (Green)
            for (let i = 0; i < 16; i++) {
                rawVector.push(data[i * 4]);
                sigmaVector.push(data[i * 4 + 1]);
            }

            let metadata = "";
            for (let i = 0; i < 256; i++) {
                const idx = (startOffset + i * k) % N;
                const byte = data[idx];
                if (byte === 0) break;
                metadata += String.fromCharCode(byte);
            }

            return { rawVector, sigmaVector, metadata };
        } catch (e) { 
            console.error("DECODE_FATAL:", e);
            return null; 
        }
    }
};
