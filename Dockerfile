FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Build stage
FROM base AS build
WORKDIR /usr/src

# Copy workspace and project files
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY . .

# Install all dependencies (including dev dependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Development stage for web
FROM base AS web
WORKDIR /usr/src/apps

# Copy web code from the build stage
COPY --from=build /usr/src/apps /usr/src/apps

EXPOSE 3000

CMD ["pnpm", "web:start"]

# Development stage for auth
FROM base AS auth
WORKDIR /usr/src/packages/auth

# Copy auth code from the build stage
COPY --from=build /usr/src/packages/auth /usr/src/packages/auth

EXPOSE 3001

CMD ["pnpm", "auth:start"] 

# Development stage for user
FROM base AS user
WORKDIR /usr/src/packages/user

# Copy user code from the build stage
COPY --from=build /usr/src/packages/user /usr/src/packages/user

EXPOSE 3003

CMD ["pnpm", "user:start"]
