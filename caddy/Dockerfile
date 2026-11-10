# syntax=docker/dockerfile:1.7

FROM caddy:2-builder AS builder

RUN --mount=type=cache,target=/root/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    xcaddy build \
        --with github.com/mholt/caddy-ratelimit

FROM caddy:2-alpine

COPY --from=builder /usr/bin/caddy /usr/bin/caddy

RUN --mount=type=cache,target=/var/cache/apt \
    apk update && \
    apk add git

RUN git clone --depth=1 https://github.com/bearddaniel80-netizen/web-template.git

RUN cp web-template/caddy/Caddyfile /etc/caddy/Caddyfile