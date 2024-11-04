#!/bin/bash

set -e

# Step 0: Define the release type
RELEASE_TYPE=$1

if [ -z "$RELEASE_TYPE" ]; then
  echo "Release type (major, minor, patch) must be specified."
  exit 1
fi

CURRENT_VERSION=$(node -p "require('./package.json').version")


# Use regex to guard for version name correctness (format x.y.z)
if [[ $CURRENT_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Version format is correct."
else
    echo "Error: Version format is incorrect. Please check the version in package.json. It should be in the format x.y.z."
    exit 1
fi

# Run standard-version on the root package.json to update version and generate changelog
npx standard-version --release-as $RELEASE_TYPE

NEW_VERSION=$(node -p "require('./package.json').version")

echo "New version: $NEW_VERSION"

# Update version in each package.json for packages marked as type:public
PACKAGES_DIR="./packages"
for PACKAGE in $PACKAGES_DIR/*; do
  if [ -d "$PACKAGE" ]; then
    PROJECT_JSON="$PACKAGE/project.json"
    PACKAGE_JSON="$PACKAGE/package.json"
    if [ -f "$PROJECT_JSON" ] && grep -q '"type:public"' "$PROJECT_JSON"; then
      if [ -f "$PACKAGE_JSON" ]; then
        # Use Node.js to update the version in package.json
        node -e "let fs=require('fs'); let pkgPath='${PACKAGE_JSON}'; let pkg=JSON.parse(fs.readFileSync(pkgPath, 'utf8')); pkg.version='${NEW_VERSION}'; fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));"
        echo "Updated version for $PACKAGE to $NEW_VERSION"
        # Commit the updated package.json
        git add $PACKAGE_JSON
        git commit -m "chore(release): $PACKAGE $NEW_VERSION"
      fi
    fi
  fi
done

echo "All public package versions updated."

# Determine if the current branch has been published
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
REMOTE_EXISTS=$(git ls-remote --heads origin "$BRANCH_NAME")

if [ -z "$REMOTE_EXISTS" ]; then
  # If the branch is not published, push and set the upstream
  git push --set-upstream origin "$BRANCH_NAME"
else
  # If the branch is already published, just push the changes
  git push
fi

# Push the tags
git push --tags