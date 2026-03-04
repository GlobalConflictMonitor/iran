# GCM // TACTICAL COMMAND 2026

### **Tactical Monitoring**
* **Live Dashboard**: [globalconflictmonitor.github.io/iran/](https://globalconflictmonitor.github.io/iran/)
* **Mobile Health Endpoint**: [status.json](https://globalconflictmonitor.github.io/iran/status.json)

### **System Health**
- **Pulse Signature**: 1708-byte Spectral Manifold
- **Sync Frequency**: 300s (5-minute stride)
- **Automation Status**: Active via GitHub Actions (Lid-Closed Mode)

### **Diagnostic Command**
To verify pulse integrity from any terminal:
\`\`\`bash
curl -s https://globalconflictmonitor.github.io/iran/status.json | grep "vector_sample"
\`\`\`
