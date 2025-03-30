#!/bin/bash

# Build the main package first
echo "Building main package..."
cd ..
npm run build

# Install dependencies for the example
echo "Installing example dependencies..."
cd example
npm install

echo "Setup complete! Run 'npm start' to run the example."
