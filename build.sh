#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Building React Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Installing Backend Python Dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "Build Completed Successfully!"
