ARG NODE_IMAGE_TAG=26-alpine


FROM node:$NODE_IMAGE_TAG AS builder

WORKDIR /iframely

RUN npm install -g pnpm@12

## Utilize docker layer cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /iframely/
COPY patches/ /iframely/patches/
RUN pnpm install --frozen-lockfile --prod

COPY . /iframely


FROM node:$NODE_IMAGE_TAG

# This will change the config to `config.<VALUE>.js` and the express server to change its behaviour.
# You should overwrite this on the CLI with `-e NODE_ENV=production`.
ENV NODE_ENV=local

# Create new non-root user
RUN addgroup --system iframelygroup && adduser --system iframely -G iframelygroup

COPY --from=builder /iframely /iframely

EXPOSE 8061

USER iframely

WORKDIR /iframely

ENTRYPOINT [ "/iframely/docker/entrypoint.sh" ]
