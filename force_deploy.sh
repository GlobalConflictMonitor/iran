#!/bin/bash
# Project Heartbeat 2026: Force Deployment v4.4

echo "Transducer: Initiating v4.4 Diagnostic Deployment..."

# 1. Stage all v4.4 assets
git add index.html app.js diagnostics.js .gitignore

# 2. Generate unique commit to force build-action
TIMESTAMP=$(date +%s)
git commit -m "sys: force deploy v4.4 (diagnostic HUD) at $TIMESTAMP"

# 3. Push to main
git push origin main --force

echo "Transducer: v4.4 Pushed. Monitoring CDN Propagation..."

# 4. Verification Loop for v4.4
URL="https://globalconflictmonitor.github.io/iran/index.html"
for i in {1..5}
do
    # Check for the diagnostic script reference
    VERIFY=$(curl -s "$URL?t=$TIMESTAMP" | grep "diagnostics.js?v=4.4")
    if [ -n "$VERIFY" ]; then
        echo "SIGNAL LOCKED: v4.4 Diagnostic Suite is Live."
        exit 0
    else
        echo "Attempt $i: v4.3/v4.2 still cached. Retrying in 10s..."
        sleep 10
    fi
done

echo "FAILURE: Propagation timeout."
exit 1
