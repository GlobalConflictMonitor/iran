export const AuditManager = {
    STORAGE_KEY: 'gcm_audit_v5',
    saveEntry(type, intensity, sector) {
        const logs = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        logs.unshift({ timestamp: Date.now(), type, intensity, sector });
        // Maintain 500-entry limit to prevent DOM/Storage bloat
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs.slice(0, 500)));
    },
    getLogs() {
        const cutoff = Date.now() - (24 * 60 * 60 * 1000);
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]')
                   .filter(log => log.timestamp > cutoff);
    }
};
