FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY collector.mjs .
ENV LISTEN_PORT=8787
EXPOSE 8787
CMD ["node", "collector.mjs"]
