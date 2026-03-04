export const Ticker = {
    update: (text) => {
        const header = document.querySelector('.brand');
        if (header) {
            header.innerText = `GCM // ${text}`;
        }
    }
};
