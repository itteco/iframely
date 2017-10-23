#FROM node:5.8
FROM arm64v8/node:6.11.2

EXPOSE 8061

COPY . /iframely

WORKDIR /iframely

RUN DEPS="libkrb5-dev" \
    apt-get update && \
    apt-get install -q -y --no-install-recommends $DEPS && \
    npm install -g forever && \
    npm install && \
    apt-get purge -y --auto-remove $DEPS && \
    apt-get autoremove && \
    apt-get clean

ENTRYPOINT ["/iframely/docker/entrypoint.sh"]
