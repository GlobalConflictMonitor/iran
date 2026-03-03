#!/bin/zsh
# GCM Cache Shatter Relay v5.0.3 (CDN Force-Sync)
echo "[$(date)] FORCING 1708B PULSE TO CDN..."

# 1. Ensure local signal is locked at 1708B
python3 ../engine/engine.py

# 2. Stage and Force-Sync the pulse
git add ../engine/heartbeat.png ../engine/resonance_trend.png
git add audit_persistence.js decoder.js sonification.js app.js

# 3. Commit with a high-kinetic timestamp to break CDN cache
git commit -m "CDN_SHATTER_FORCE: $(date +%s) [1708B_LOCK]"

# 4. Push and force remote alignment
git push origin main --force

echo "SUCCESS: 1708B Signal Synchronized. Re-run ./deploy_check.sh in 60s."
