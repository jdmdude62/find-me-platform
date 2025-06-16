#!/bin/bash
echo "🚀 Deploying Find.Me platform..."
git add .
git commit -m "Update platform - $(date '+%Y-%m-%d %H:%M:%S')"
git push
echo "✅ Pushed to GitHub - Vercel will auto-deploy in 1-2 minutes"
echo "🌐 Live site: https://find-me-platform.vercel.app/"
