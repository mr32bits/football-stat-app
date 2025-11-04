#!/usr/bin/env bash
set -euo pipefail
NC="\033[0;0m"
BOLD="\033[1m"
CYAN="\033[0;36m"

APP_NAME="FootballStats"
REPO_DIR="repo-mac"
DIST_DIR="dist"

VERSION_FILE="updater.py"
VERSION=$(grep -E -m 1 '__version__' "$VERSION_FILE" | cut -d'"' -f2)

echo "Releasing version: ${VERSION}"

if [[ ! -n $VERSION ]]; then
    echo "No Version in script: '$VERSION_FILE' found!" exit 1
elif [[ "$VERSION" =~ '^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}[a-z]*$' ]]; then
    echo "Not a valid Version Format!" exit 1
else
    echo -e "${BOLD}Building version: ${CYAN}$VERSION${NC}"
fi

cp "${REPO_DIR}/metadata/root.json" "tufup_root/root.json"

echo -n "Confirm: "
read -r 

pyinstaller --clean --noconfirm server.spec

# --- MACOS ---
if [ -d "${DIST_DIR}/${APP_NAME}.app" ]; then
  echo "Building macOS bundle..."
  tar -C "${DIST_DIR}" -czf "${DIST_DIR}/${APP_NAME}-mac-${VERSION}.tar.gz" "${APP_NAME}.app"

  echo "Signing macOS metadata..."
  cd "${REPO_DIR}"
  tufup targets add "${VERSION}" "../${DIST_DIR}/${APP_NAME}-mac-${VERSION}.tar.gz" "keystore"
  tufup sign targets "keystore"
fi

echo "Successfully updated"