#!/bin/bash

# Amplify post-build script to ensure all necessary files are properly deployed

set -e

echo "Running post-build script for AWS Amplify deployment..."

# Ensure public directory is included in the build output
if [ -d "public" ]; then
  echo "Copying public directory to build output..."
  mkdir -p .next/standalone/public
  cp -R public/* .next/standalone/public/
  
  # Ensure customHttp.yml is included
  if [ -f "public/customHttp.yml" ]; then
    echo "Ensuring customHttp.yml is properly included..."
    cp public/customHttp.yml .next/
  fi
fi

# Ensure static files are properly included
if [ -d ".next/static" ]; then
  echo "Ensuring static files are properly linked..."
  mkdir -p .next/standalone/.next
  cp -R .next/static .next/standalone/.next/
fi

echo "Post-build script completed successfully!" 