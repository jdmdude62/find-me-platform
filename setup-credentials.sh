#!/bin/bash
echo "🔐 Setting up Git credentials..."
git config credential.helper store
read -s -p "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
echo
echo "https://jdmdude62:$GITHUB_TOKEN@github.com" > ~/.git-credentials
git config user.name "jdmdude62"
echo "✅ Credentials stored! Now you can use quick-deploy.sh without prompts"
