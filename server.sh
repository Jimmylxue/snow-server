git status

# 切换分支
git checkout app/quick_app_v2

# 清空当前工作区
git checkout .

# 拉取代码
git pull --rebase origin app/quick_app_v2

# 安装依赖
pnpm install

# 构建
pnpm build

# 删除pm2 容器
pm2 delete dist/main.js

export OTEL_TRACES_EXPORTER="otlp" 
export OTEL_RESOURCE_ATTRIBUTES='token=ODCeIORbtRSemFQlFQTI,host.name=172.16.0.3' 
export OTEL_EXPORTER_OTLP_PROTOCOL='grpc' 
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="http://ap-guangzhou.apm.tencentcs.com:4317" 
export OTEL_SERVICE_NAME="quickApp"  
export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register" 

# pm2 运行
pm2 start dist/main.js
