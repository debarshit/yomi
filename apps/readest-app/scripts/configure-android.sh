#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OVERRIDES_DIR="$APP_DIR/android-overrides"
GEN_ANDROID_DIR="$APP_DIR/src-tauri/gen/android"

if [ ! -d "$GEN_ANDROID_DIR" ]; then
  echo "Android project not found at $GEN_ANDROID_DIR; skipping configuration."
  exit 0
fi

echo "==> Configuring Android native harness from android-overrides"

TARGET_JAVA_DIR="$GEN_ANDROID_DIR/app/src/main/java/com/biblophile/yomi"
mkdir -p "$TARGET_JAVA_DIR"
cp "$OVERRIDES_DIR/MainActivity.kt" "$TARGET_JAVA_DIR/MainActivity.kt"
echo "    Installed MainActivity.kt -> $TARGET_JAVA_DIR/MainActivity.kt"

# If an old template MainActivity.kt was generated in com/bilingify/readest, remove it to prevent duplicate class conflicts
if [ -d "$GEN_ANDROID_DIR/app/src/main/java/com/bilingify/readest" ]; then
  rm -rf "$GEN_ANDROID_DIR/app/src/main/java/com/bilingify/readest"
fi

cp "$OVERRIDES_DIR/AndroidManifest.xml" "$GEN_ANDROID_DIR/app/src/main/AndroidManifest.xml"
echo "    Installed AndroidManifest.xml"

cp "$OVERRIDES_DIR/build.gradle.kts" "$GEN_ANDROID_DIR/app/build.gradle.kts"
echo "    Installed build.gradle.kts"

mkdir -p "$GEN_ANDROID_DIR/app/src/main/res/values"
cp "$OVERRIDES_DIR/themes.xml" "$GEN_ANDROID_DIR/app/src/main/res/values/themes.xml"
echo "    Installed themes.xml"

mkdir -p "$GEN_ANDROID_DIR/app/src/main/res/drawable"
cp "$OVERRIDES_DIR/splash_background.xml" "$GEN_ANDROID_DIR/app/src/main/res/drawable/splash_background.xml"

mkdir -p "$GEN_ANDROID_DIR/app/src/main/res/xml"
cp "$OVERRIDES_DIR/automotive_app_desc.xml" "$GEN_ANDROID_DIR/app/src/main/res/xml/automotive_app_desc.xml"

echo "==> Android native configuration complete."