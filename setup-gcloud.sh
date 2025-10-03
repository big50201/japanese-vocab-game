#!/bin/bash

# Google Cloud 設定驗證腳本

echo "🔧 Google Cloud 設定驗證"
echo "========================="

# 1. 檢查 gcloud CLI
echo "1. 檢查 Google Cloud CLI..."
if command -v gcloud &> /dev/null; then
    echo "✅ Google Cloud CLI 已安裝: $(gcloud version --format='value(core.version)')"
else
    echo "❌ Google Cloud CLI 未安裝"
    exit 1
fi

# 2. 檢查認證狀態
echo "2. 檢查認證狀態..."
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
    echo "✅ 已登入: $ACTIVE_ACCOUNT"
else
    echo "❌ 未登入，請執行: gcloud auth login"
    exit 1
fi

# 3. 檢查專案設定
echo "3. 檢查專案設定..."
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ "$CURRENT_PROJECT" = "japanese-vocab-game" ]; then
    echo "✅ 專案已設定: $CURRENT_PROJECT"
else
    echo "🔧 設定專案..."
    gcloud config set project japanese-vocab-game
fi

# 4. 確保必要的 API 已啟用
echo "4. 確保必要的 API 已啟用..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com --quiet

# 5. 檢查 Docker
echo "5. 檢查 Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker 已安裝: $(docker --version)"
else
    echo "❌ Docker 未安裝，請先安裝 Docker Desktop"
    echo "執行: ./install-docker-guide.sh"
    exit 1
fi

# 6. 最終檢查
echo "6. 最終設定檢查..."
echo "   專案: $(gcloud config get-value project)"
echo "   帳號: $(gcloud config get-value account)"
echo "   地區: asia-east1"

echo ""
echo "✅ Google Cloud 設定完成！"
echo "現在可以執行: ./deploy-voicevox-cloud.sh"