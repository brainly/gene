#!/bin/bash

cd dist/packages || { echo "dist/packages directory not found"; exit 1; }

# Retrieve the list of packages dynamically
packages=($(ls -d */ | cut -f1 -d'/'))


if [[ "$1" == "--unlink" ]]; then
  echo "Unlinking all projects..."
  for package in "${packages[@]}"; do
    echo "Unlinking $package..."
    cd "$package" || { echo "$package directory not found"; exit 1; }
    yarn unlink
    cd ..
  done
  exit 0
fi

echo "Building project..."
yarn build

for package in "${packages[@]}"; do
  echo "Linking $package..."
  cd "$package" || { echo "$package directory not found"; exit 1; }
  yarn link
  cd ..
done

# Function to link peerDependencies starting with @brainly
link_peer_dependencies() {
  local package=$1
  local package_json_path="$package/package.json"
  echo "$package"
  echo "$package_json_path"
  if [[ -f $package_json_path ]]; then
    peer_deps=$(jq -r '.peerDependencies | keys[] | select(startswith("@brainly"))' "$package_json_path")
    for dep in $peer_deps; do
      echo "Linking $dep for $package..."
      cd "$package" || { echo "$package directory not found"; exit 1; }
      yarn link "$dep"
      cd ..
    done
  fi
}

# Iterate over each package to link peerDependencies
echo "Now linkin peerDependencies..."
for package in "${packages[@]}"; do
  link_peer_dependencies "$package"
done

echo ""
echo "Description:"
echo "  Automates local development environment setup for projects with multiple packages"
echo "  Build and retrieves all packages from the dist/packages directory"
echo "  Links each package for local development"
echo "  Dynamically links peer dependencies starting with @brainly/ from their package.json files"
echo "  Improves development and testing of interdependent packages within the project"
echo "Usage:"
echo "  To build and link packages for local development: ./buildAndLinkGene.sh"
echo "  To unlink all packages: ./buildAndLinkGene.sh --unlink"

