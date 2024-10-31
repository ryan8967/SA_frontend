# 使用 Node.js 作為基礎映像來構建和運行 Vue.js 應用
FROM node:18.14.2

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 以安裝依賴
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有項目文件
COPY . .

# 構建 Vue.js 應用
RUN npm run build

# 設置環境變量以告知應用在生產模式下運行
ENV NODE_ENV=production

# 設置應用運行的端口
ENV PORT=3000

# 開放端口
EXPOSE 3000

# 使用 serve 工具提供構建的靜態文件
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
