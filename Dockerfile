FROM node:12.18-alpine3.12

MAINTAINER PRX <sysadmin@prx.org>
LABEL org.prx.app="yes"

WORKDIR /iframely

# install git, aws-cli
RUN apk --no-cache add inotify-tools git ca-certificates \
    python2 py-pip py-setuptools groff less && \
    pip --no-cache-dir install awscli

# Create new non-root user
RUN addgroup -S iframelygroup && adduser -S iframely -G iframelygroup

# This will change the config to `config.<VALUE>.js` and the express server to change its behaviour.
# You should overwrite this on the CLI with `-e NODE_ENV=production`.
ENV NODE_ENV=local

## Utilize docker layer cache
COPY package.json yarn.lock /iframely/
RUN yarn install --pure-lockfile --production

COPY . /iframely

USER iframely

COPY . /iframely

ENTRYPOINT [ "./bin/application" ]
CMD [ "serve" ]
