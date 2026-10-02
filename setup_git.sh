#!/usr/bin/env bash
# PocketSmart AI - Git Repository Setup Helper (macOS & Linux)

echo "========================================================"
echo "PocketSmart AI - Git Repository Setup Helper"
echo "========================================================"
echo ""

if ! command -v git &> /dev/null; then
    echo "[!] Git command not found in current PATH."
    echo "[!] Please install Git: brew install git"
    exit 1
fi

echo "[+] Initializing Git repository..."
git init -b main 2>/dev/null || git init

echo "[+] Staging files..."
git add .

echo "[+] Creating initial commit..."
git commit -m "Initial commit: PocketSmart AI full-stack application"

echo ""
echo "[✓] Git repository initialized successfully!"
echo ""
echo "========================================================"
echo "NEXT STEPS TO HOST ON GITHUB & DEPLOY:"
echo "========================================================"
echo "1. Go to https://github.com/new and create a new repository (e.g. pocketsmart-ai)"
echo "2. Link your local repo to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/pocketsmart-ai.git"
echo "3. Push your code to GitHub:"
echo "   git push -u origin main"
echo ""
echo "4. Free Cloud Hosting via GitHub:"
echo "   - Go to https://render.com"
echo "   - Sign up / Log in with your GitHub account"
echo "   - Click 'New +' -> 'Web Service'"
echo "   - Select your 'pocketsmart-ai' repository"
echo "   - Render will automatically use render.yaml and deploy your app for FREE!"
echo "========================================================"
