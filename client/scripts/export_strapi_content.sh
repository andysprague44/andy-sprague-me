#!/bin/bash
set -e

# CONFIGURATION
set -o allexport
source "$(dirname "$0")/../.env"
set +o allexport

STRAPI_API_URL="${VITE_STRAPI_URL}/api/articles?populate=*"
STRAPI_API_TOKEN="${VITE_STRAPI_API_TOKEN}"
echo "[INFO] Using API token for authentication $STRAPI_API_TOKEN"
SRC_UPLOADS_DIR="$(dirname "$0")/../../server/public/uploads"
DEST_UPLOADS_DIR="$(dirname "$0")/../../client/public/uploads"
DEST_JSON="$(dirname "$0")/../../client/src/strapi.json"

# Export Strapi data as JSON
echo "[INFO] Using API token for authentication."
curl -s -H "Authorization: Bearer $STRAPI_API_TOKEN" "$STRAPI_API_URL" -o "$DEST_JSON"
jq . "$DEST_JSON" > "$DEST_JSON".tmp && mv "$DEST_JSON".tmp "$DEST_JSON"
echo "[SUCCESS] Exported Strapi articles to $DEST_JSON"

# Copy uploads folder (replace existing)
if [ -d "$SRC_UPLOADS_DIR" ]; then
  rm -rf "$DEST_UPLOADS_DIR"
  cp -r "$SRC_UPLOADS_DIR" "$DEST_UPLOADS_DIR"
  echo "[SUCCESS] Copied uploads to $DEST_UPLOADS_DIR"
else
  echo "[WARNING] Source uploads directory not found: $SRC_UPLOADS_DIR"
fi

echo "[DONE] Strapi export and uploads sync complete."
