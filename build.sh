# Get version from manifest.json
VERSION=$(cat build/manifest.json | grep '"version":' | sed 's/.*"version": "\(.*\)",/\1/')
echo "Building v$VERSION..."

# Check if release/$VERSION.zip exists
if [ -f "release/$VERSION.zip" ]; then
    echo "Release already exists at release/$VERSION.zip. Aborting. Please bump version in manifest.json."
    exit 1
fi

# Check for TODOs/FIXMEs in .ts files
echo "Checking for TODOs and FIXMEs..."
if grep -r -e TODO -e FIXME ./ts/; then
    echo "TODOs or FIXMEs found. Aborting."
    exit 1
fi

# Set config to use production back end and disable debug mode
echo "Setting config to use production back end..."
sed -i '' 's/USE_DEV_BACK_END = true/USE_DEV_BACK_END = false/g' ts/config.ts
sed -i '' 's/ALLOW_DEBUG_MESSAGES = true/ALLOW_DEBUG_MESSAGES = false/g' ts/config.ts

# Run Webpack build script
echo "Running Webpack build script..."
npx webpack

# Save build/ as release/$VERSION.zip
echo "Saving build/ as release/$VERSION.zip..."
cd build
zip -r ../release/$VERSION.zip *
cd ..

# Reset config to use back end dev server and enable debug mode
echo "Resetting config to use back end dev server..."
sed -i '' 's/USE_DEV_BACK_END = false/USE_DEV_BACK_END = true/g' ts/config.ts
sed -i '' 's/ALLOW_DEBUG_MESSAGES = false/ALLOW_DEBUG_MESSAGES = true/g' ts/config.ts

echo "...done! Saved to release/$VERSION.zip."