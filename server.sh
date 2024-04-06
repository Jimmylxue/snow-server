# 进入目录
cd snow-program/

# 切换分支
git checkout server-prod

# 清空当前工作区
git checkout .

# 拉取代码
git pull --rebase origin server-prod

# 安装依赖
pnpm install

# 构建
pnpm server:build

# 删除pm2 容器
pm2 delete packages/snow-server/dist/main.js

# pm2 运行
pm2 start packages/snow-server/dist/main.js
