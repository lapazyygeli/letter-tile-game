FROM node:24-slim
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY public ./public
COPY src ./src

# The browser calls the backend container through its published port.
ENV VITE_API_URL=http://localhost:3001
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host"]
