# Image du site pour le VPS : construction VitePress, puis nginx qui sert les fichiers statiques.
# Publiée sur GHCR par .github/workflows/deployer.yml, mise en ligne par deployer-virtum-site (dépôt vps-infra).

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY site ./site
RUN npm run build

FROM nginx:1.29-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/site/.vitepress/dist /usr/share/nginx/html
EXPOSE 80
