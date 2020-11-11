FROM node:12-alpine

MAINTAINER PRX <sysadmin@prx.org>
LABEL org.prx.app="yes"

EXPOSE 8061

WORKDIR /iframely

# install git, aws-cli
RUN apk --no-cache add inotify-tools git ca-certificates \
    python py-pip py-setuptools groff less && \
    pip --no-cache-dir install awscli

# install PRX aws-secrets scripts
RUN git clone -o github https://github.com/PRX/aws-secrets
RUN cp ./aws-secrets/bin/* /usr/local/bin

COPY ./package.json /iframely/
COPY ./yarn.lock /iframely/
RUN npm install -g forever && \
    npm install

COPY . /iframely

ENTRYPOINT [ "./bin/application" ]
CMD [ "serve" ]
