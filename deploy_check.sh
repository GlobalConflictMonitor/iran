#!/bin/zsh
# GCM // TACTICAL AUDIT v5.0.3 (Sector: Iran)
echo "--- GCM SIGNAL INTEGRITY REPORT ---"

# 1. Check Local Pulse Size (Looking up to the engine directory)
PULSE_PATH="../engine/heartbeat.png"

if [ -f "$PULSE_PATH" ]; then
    PULSE_SIZE=$(wc -c < "$PULSE_PATH" | xargs)
    if [ "$PULSE_SIZE" -eq 1708 ]; then
        echo "[OK] Local Pulse: 1708B (Lock Verified)"
    else
        echo "[FAIL] Local Pulse: ${PULSE_SIZE}B (Drift Detected)"
    fi
else
    echo "[FAIL] engine/heartbeat.png not found at $PULSE_PATH"
fi

# 2. Check Module Existence in Current Sector (Iran)
# Renamed variable to avoid zsh 'read-only' conflict
gcm_manifest=("audit_persistence.js" "decoder.js" "sonification.js" "app.js")

for mod in "${gcm_manifest[@]}"; do
    if [ -f "$mod" ]; then
        echo "[OK] Module Found: $mod"
    else
        echo "[MISSING] Module Not Found: $mod"
    fi
done

# 3. Check Remote CDN Sync
REMOTE_SIZE=$(curl -sI https://globalconflictmonitor.github.io/iran/engine/heartbeat.png | grep -i Content-Length | awk '{print $2}' | tr -d '\r')

if [ "$REMOTE_SIZE" = "1708" ]; then
    echo "[OK] Remote CDN: 1708B (Handshake Live)"
else
    # Handle cases where curl might return empty or error
    echo "[WAIT] Remote CDN: ${REMOTE_SIZE:-'No Signal'} (Sync Pending)"
fi

echo "-----------------------------------"
