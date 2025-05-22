
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# 确保端口统一
ENV PORT=80 
ENV NODE_ENV=production

EXPOSE 80

CMD ["node", "server.js"]