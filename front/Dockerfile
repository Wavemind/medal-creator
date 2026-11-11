# Image de production du front (Next.js en mode standalone).
# Les variables NEXT_PUBLIC_* sont figées dans le code au build : les passer en --build-arg.
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json yarn.lock ./
COPY patches ./patches
RUN yarn install --frozen-lockfile --network-timeout 600000

FROM node:20-slim AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_WS_URL
ARG NEXT_PUBLIC_FRONT_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_TELEMETRY_DISABLED=1
# sentry-cli envoie les source maps à Sentry pendant le build : il lui faut les certificats racine et le jeton,
# passé en secret pour qu'il ne reste pas dans l'image (--secret id=sentry_token,src=...).
RUN apt-get update -qq && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=sentry_token \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_token)" yarn build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3001 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
# next-i18next relit sa configuration et les traductions au démarrage, depuis le dossier courant.
COPY --from=build --chown=node:node /app/next-i18next.config.js ./
USER node
EXPOSE 3001
CMD ["node", "server.js"]
