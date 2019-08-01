CONTAINER	:= iframely
HUB_USER	:= ${USER}
IMAGE_NAME	:= ${HUB_USER}/${CONTAINER}
VERSION		:= v1.3.1
EXPOSEPORT	:= 8061
PUBLISHPORT := ${EXPOSEPORT}

build:
	git fetch upstream
	git checkout master
	git merge upstream/master
	git branch -f tag-${VERSION}
	git checkout tag-${VERSION}
	docker \
		build \
		--rm --tag=${CONTAINER} .
	@echo Image tag: ${VERSION}

start: run

run:
	docker \
		run \
		--detach \
		--interactive \
		--tty \
		--hostname=${CONTAINER} \
		--name=${CONTAINER} \
		-p ${PUBLISHPORT}:${EXPOSEPORT} \
		-v $(PWD)/config.local.js.SAMPLE:/iframely/config.local.js \
		$(CONTAINER)

shell:
	docker \
		run \
		--rm \
		--interactive \
		--tty \
		--hostname=${CONTAINER} \
		--name=${CONTAINER} \
		-p ${PUBLISHPORT}:${EXPOSEPORT} \
		--entrypoint "/bin/ash" \
		-v $(PWD)/config.local.js.SAMPLE:/iframely/config.local.js \
		$(CONTAINER) 

exec:
	docker exec \
		--interactive \
		--tty \
		${CONTAINER} \
		/bin/ash

stop:
	-docker kill ${CONTAINER}
	-docker rm ${CONTAINER}

rm:
	docker \
		rm ${CONTAINER}

history:
	docker \
		history ${CONTAINER}

clean:
	-docker \
		rm ${CONTAINER}
	-docker \
		rmi ${CONTAINER}
	git checkout master
	git branch -d ${VERSION}

push:
	docker tag ${CONTAINER} ${IMAGE_NAME}:${VERSION} && docker push ${IMAGE_NAME}

restart: stop clean run
