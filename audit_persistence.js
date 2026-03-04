export const AuditPersistence = {
    db: [],
    push: function(vector, metadata, sigma) {
        // Embed UTC chronological context
        this.db.push({ vector, metadata, sigma, timestamp: Date.now() });
        if (this.db.length > 1000) this.db.shift();
    },
    getSnapshot: function(index) {
        const mappedIndex = Math.floor((index / 999) * (this.db.length - 1));
        return this.db[mappedIndex] || null;
    }
};
