FROM node:10-alpine

MAINTAINER PRX <sysadmin@prx.org>
LABEL org.prx.app="yes"

EXPOSE 8061

COPY . /iframely

WORKDIR /iframely

RUN apk add --no-cache git && \
    npm install -g forever && \
    npm install

ENTRYPOINT [ "/iframely/docker/entrypoint.sh" ]
