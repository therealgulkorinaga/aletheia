#!/bin/bash

echo "🏛️  Aletheia — Starting Local Demo"
echo ""
echo "📦 Installing dependencies..."
npm install --silent

echo ""
echo "🚀 Starting development server..."
echo ""
echo "✓ No Supabase setup required (using mock auth)"
echo "✓ Demo users ready:"
echo "   - operator@demo.com (password: password123)"
echo "   - approver@demo.com (password: password123)"
echo "   - compliance@demo.com (password: password123)"
echo "   - admin@demo.com (password: password123)"
echo ""
echo "🌐 Opening http://localhost:3000 in 5 seconds..."
echo ""

# Start dev server
npm run dev &
DEV_PID=$!

# Wait for server to start
sleep 5

# Open browser
if command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
else
    echo "Please open http://localhost:3000 in your browser"
fi

echo ""
echo "✓ Server running!"
echo "Press Ctrl+C to stop"
echo ""

# Wait for Ctrl+C
wait $DEV_PID
