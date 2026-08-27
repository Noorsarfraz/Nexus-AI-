FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Conflicts ko bypass karne ke liye npm ci ki jagah ye command use karein:
RUN npm install --legacy-peer-deps

COPY . .

# Cloudinary handles real file storage in production, so we don't need to
# persist ./uploads — it's only a scratch dir some local dev flows touch.
RUN mkdir -p uploads

EXPOSE 5001

CMD ["node", "server.js"]
