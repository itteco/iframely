FROM node:22-alpine

EXPOSE 8061

WORKDIR /iframely

# Create new non-root user
RUN addgroup --system iframelygroup && adduser --system iframely -G iframelygroup
RUN apk add g++ make python3

# This will change the config to `config.<VALUE>.js` and the express server to change its behaviour.
# You should overwrite this on the CLI with `-e NODE_ENV=production`.
ENV NODE_ENV=local

## Utilize docker layer cache
COPY package.json yarn.lock /iframely/
RUN yarn install --pure-lockfile --production

COPY . /iframely

RUN chown -R iframely /iframely/config.local.js

USER iframely

ENTRYPOINT [ "/iframely/docker/entrypoint.sh" ]
