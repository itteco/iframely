FROM node:12.13.1-alpine

EXPOSE 8061

COPY . /iframely

WORKDIR /iframely

RUN apk add --no-cache git && \
    npm install -g forever && \
    npm install

ENTRYPOINT [ "/iframely/docker/entrypoint.sh" ]
