#!/bin/bash

echo "🚀 Deploying Disney/Astro Bot Math Adventure to Vercel"
echo "=================================================="

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Make sure we have a build
if [ ! -d "dist" ]; then
    echo "🔨 Building app..."
    npm run build
fi

echo "🌐 Deploying to Vercel..."
echo "📝 You'll need to:"
echo "   1. Login/signup when prompted"
echo "   2. Choose 'yes' for new project"
echo "   3. Accept default settings"
echo ""

# Deploy the dist folder
cd dist
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "📱 Now on your iPhone:"
echo "   1. Open Safari browser"
echo "   2. Go to the URL shown above"
echo "   3. Tap Share button → Add to Home Screen"
echo "   4. Your app installs as PWA!"
echo ""
echo "🎉 Enjoy your Disney/Astro Bot Math Adventure!"