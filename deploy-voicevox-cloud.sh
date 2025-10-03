#!/bin/bash

# 🚀 VOICEVOX ENGINE 雲端部署腳本
# 將 VOICEVOX ENGINE 部署到 Google Cloud Run

set -e

# 配置變數
PROJECT_ID="japanese-vocab-game"
SERVICE_NAME="voicevox-engine"
REGION="asia-east1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🎌 開始部署 VOICEVOX ENGINE 到 Google Cloud Run..."
echo "📋 專案: $PROJECT_ID"
echo "🌏 地區: $REGION"
echo "🏷️  映像: $IMAGE_NAME"
echo ""

# 檢查是否已登入 Google Cloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ 請先登入 Google Cloud:"
    echo "   gcloud auth login"
    exit 1
fi

# 設定專案
echo "🔧 設定 Google Cloud 專案..."
gcloud config set project $PROJECT_ID

# 啟用必要的 API
echo "📡 啟用必要的 Google Cloud API..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 檢查 Dockerfile 是否存在
if [ ! -f "Dockerfile" ]; then
    echo "❌ 找不到 Dockerfile"
    echo "請確保文件存在於當前目錄中"
    exit 1
fi

# 建置容器映像
echo "🔨 建置 VOICEVOX ENGINE 容器映像..."
echo "⚠️  注意: 這可能需要 10-15 分鐘，因為需要下載大型模型文件"
gcloud builds submit --tag $IMAGE_NAME --timeout=3600s .

# 部署到 Cloud Run
echo "🚀 部署到 Google Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --max-instances 3 \
  --min-instances 0 \
  --port 50021 \
  --timeout 300 \
  --set-env-vars "CORS_ORIGINS=*" \
  --execution-environment gen2

# 獲取服務 URL
echo "📡 獲取服務 URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo "✅ VOICEVOX ENGINE 部署完成！"
echo ""
echo "🌐 服務 URL: $SERVICE_URL"
echo "🔗 API 端點:"
echo "   - 版本檢查: $SERVICE_URL/version"
echo "   - 說話者列表: $SERVICE_URL/speakers"
echo "   - 語音合成: $SERVICE_URL/synthesis"
echo ""
echo "📝 下一步："
echo "1. 測試服務是否正常運行:"
echo "   curl $SERVICE_URL/version"
echo ""
echo "2. 更新環境變數:"
echo "   編輯 .env.production 文件"
echo "   設定 REACT_APP_VOICEVOX_URL=$SERVICE_URL"
echo ""
echo "3. 重新部署 React 應用程式:"
echo "   npm run build"
echo "   firebase deploy"
echo ""

# 自動測試服務
echo "🧪 測試 VOICEVOX ENGINE 服務..."
sleep 10  # 等待服務啟動

if curl -s --max-time 30 "$SERVICE_URL/version" > /dev/null; then
    echo "✅ 服務測試成功！"
else
    echo "⚠️  服務可能還在啟動中，請稍後手動測試"
fi

echo ""
echo "💰 成本估算:"
echo "   - 輕度使用 (< 100 請求/月): ~$0-5 USD"
echo "   - 中度使用 (< 1000 請求/月): ~$5-20 USD"
echo "   - 重度使用 (< 10000 請求/月): ~$20-100 USD"
echo ""
echo "📊 監控和管理:"
echo "   - Cloud Console: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME"
echo "   - 日誌查看: gcloud logs read 'resource.type=cloud_run_revision'"