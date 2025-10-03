#!/bin/bash

# 🚀 VOICEVOX 完整部署和測試腳本
# 一鍵部署並測試 VOICEVOX ENGINE 到 Google Cloud Run

set -e

echo "🎌 VOICEVOX Cloud Run 完整部署流程"
echo "=================================="
echo ""

# 檢查必要工具
echo "🔍 檢查必要工具..."

if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI 未安裝"
    echo "請先安裝 Google Cloud CLI："
    echo "https://cloud.google.com/sdk/docs/install-sdk"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安裝"
    echo "請先安裝 Docker Desktop for Mac"
    exit 1
fi

echo "✅ 工具檢查完成"
echo ""

# 詢問是否繼續
read -p "🚀 是否開始部署？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "部署已取消"
    exit 0
fi

# 執行部署
echo "🚀 開始部署..."
./deploy-voicevox-cloud.sh

# 等待服務穩定
echo ""
echo "⏳ 等待服務穩定..."
sleep 30

# 執行測試
echo ""
echo "🧪 開始測試服務..."
./test-voicevox-service.sh

echo ""
echo "🎉 部署完成！"
echo ""
echo "📋 後續步驟："
echo "1. 複製上方顯示的 VOICEVOX URL"
echo "2. 更新你的 React 應用程式環境變數"
echo "3. 重新建置並部署你的前端應用程式"