# Use node:18-alpine as a build stage
FROM node:18-alpine AS builder


WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# Build the production image
FROM node:18-alpine 

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm ci --legacy-peer-deps

COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app && chmod -R 755 /app

RUN npm install pm2 -g

COPY ecosystem.config.js .

USER node

EXPOSE 5513

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
