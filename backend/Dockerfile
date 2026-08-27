FROM node:20-alpine

WORKDIR /app

# Install deps first so this layer is cached unless package*.json changes.
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Cloudinary handles real file storage in production, so we don't need to
# persist ./uploads — it's only a scratch dir some local dev flows touch.
RUN mkdir -p uploads

EXPOSE 5001

CMD ["node", "server.js"]
