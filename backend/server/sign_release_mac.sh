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

mkdir -p "${REPO_DIR}"
cd "${REPO_DIR}"
tufup init
cd ..

echo -n "Confirm: "
read -r 

pyinstaller --clean --noconfirm server.spec

# --- MACOS ---
if [ -d "${DIST_DIR}/${APP_NAME}.app" ]; then
    echo "Building macOS bundle..."

    echo "Signing macOS metadata..."
    mkdir -p tmp_pkg
    cp -R "${DIST_DIR}/FootballStats.app" "tmp_pkg"
    cd "${REPO_DIR}"
    tufup targets add -r "${VERSION}" "../tmp_pkg" "keystore"
    tufup sign targets "keystore"
    cd ..
    rm -rf tmp_pkg
fi

echo "Successfully updated"