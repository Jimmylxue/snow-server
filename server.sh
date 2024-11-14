# 切换分支
git checkout app/quick_app

# 清空当前工作区
git checkout .

# 拉取代码
git pull --rebase origin app/quick_app

# 安装依赖
pnpm install

# 构建
pnpm build

# 删除pm2 容器
pm2 delete dist/main.js

# pm2 运行
pm2 start dist/main.js
