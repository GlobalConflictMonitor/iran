#!/bin/bash
# GCM TACTICAL COMMAND - ENFORCED SCOPE
if [[ "${PWD##*/}" != "Iran" ]]; then
    echo "ERROR: update_iran.sh must be run from the /Iran directory."
    exit 1
fi

TIMESTAMP=$(date +%s)
echo "[$TIMESTAMP] Syncing Public Transducer Modules..."

# Synchronize 1708-byte pulse from engine before deployment
if [ -f "../engine/heartbeat.png" ]; then
    cp ../engine/heartbeat.png ./heartbeat.png
    echo "PULSE SYNC: Heartbeat updated from engine."
fi

echo "v4.4-$TIMESTAMP" > version.txt
./shatter_cache.sh

git add .
git commit -m "sys: force deploy v4.4 (tactical module linkage) at $TIMESTAMP"
git push origin main