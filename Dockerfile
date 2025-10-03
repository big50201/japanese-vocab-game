FROM ubuntu:22.04

# 避免交互式提示
ENV DEBIAN_FRONTEND=noninteractive

# 安裝依賴
RUN apt-get update && apt-get install -y \
    wget \
    p7zip-full \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 創建工作目錄
WORKDIR /app

# 下載並安裝 VOICEVOX ENGINE (Linux CPU x64版本)
# 使用更穩定的下載方式
RUN wget --retry-connrefused --waitretry=1 --read-timeout=20 --timeout=15 -t 3 \
    https://github.com/VOICEVOX/voicevox_engine/releases/download/0.24.1/voicevox_engine-linux-cpu-x64-0.24.1.7z.001

# 解壓縮
RUN 7z x voicevox_engine-linux-cpu-x64-0.24.1.7z.001

# 檢查解壓縮後的目錄結構並重命名
RUN ls -la && \
    if [ -d "voicevox_engine-linux-cpu-x64-0.24.1" ]; then \
        mv voicevox_engine-linux-cpu-x64-0.24.1 voicevox_engine; \
    elif [ -d "voicevox_engine" ]; then \
        echo "Directory already exists as voicevox_engine"; \
    elif [ -d "linux-cpu-x64" ]; then \
        mv linux-cpu-x64 voicevox_engine; \
    else \
        echo "Finding actual directory name:" && \
        ls -la && \
        DIR_NAME=$(ls -d */ | head -1 | sed 's/\///') && \
        mv "$DIR_NAME" voicevox_engine; \
    fi

# 清理下載文件 - 使用通配符以防檔名不同
RUN rm -f voicevox_engine-linux-cpu-x64-0.24.1.7z.* || rm -f *.7z.* || true

# 設定執行權限
RUN chmod +x voicevox_engine/run

# 創建啟動腳本以處理 CORS
RUN echo '#!/bin/bash\n\
# 啟動 VOICEVOX ENGINE 並配置 CORS\n\
cd /app/voicevox_engine\n\
./run --host 0.0.0.0 --port 50021 --cors_policy_mode all' > /app/start.sh

RUN chmod +x /app/start.sh

# 設定環境變數
ENV PORT=50021

# 暴露端口
EXPOSE 50021

# 健康檢查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:50021/version || exit 1

# 啟動服務
CMD ["/app/start.sh"]