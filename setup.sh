#!/bin/bash

# 🚀 Broker Tool Setup Script
# Run this script on a new computer to set up the project

echo "🎯 Setting up Broker Recommendation Tool..."
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Facebook Pixel (optional)
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id_here

# Add other environment variables as needed
EOF
    echo "✅ Created .env.local file"
else
    echo "ℹ️  .env.local already exists"
fi

echo ""
echo "🎉 Setup complete! You can now run:"
echo ""
echo "  npm run dev     # Start development server"
echo "  npm run build   # Build for production"
echo "  npm run start   # Start production server"
echo ""
echo "🌐 Development server will be available at:"
echo "   http://localhost:3000"
echo ""
echo "🧪 Test page available at:"
echo "   http://localhost:3000/test"
echo ""
echo "📖 Check PROJECT_REFERENCE.md for detailed documentation"
echo ""
echo "Happy coding! 🚀"