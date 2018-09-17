CONTAINER	:= iframely
HUB_USER	:= ${USER}
IMAGE_NAME	:= ${HUB_USER}/${CONTAINER}
VERSION		:= v1.2.7


build:
	git fetch upstream
	git checkout master
	git merge upstream/master
	git branch -f ${VERSION}
	git checkout ${VERSION}
	docker \
		build \
		--rm --tag=${VERSION}
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
		-v config.local.js.SAMPLE:/iframely/config.local.js \
		$(IMAGE_NAME)

shell:
	docker \
		run \
		--rm \
		--interactive \
		--tty \
		--hostname=${CONTAINER} \
		--name=${CONTAINER} \
		-v config.local.js.SAMPLE:/iframely/config.local.js \
		$(IMAGE_NAME) \
		/bin/bash

exec:
	docker exec \
		--interactive \
		--tty \
		${IMAGE_NAME} \
		- v 
		/bin/bash

stop:
	docker \
		kill ${CONTAINER}

history:
	docker \
		history ${CONTAINER}

clean:
	-docker \
		rm ${CONTAINER}
	-docker \
		rmi ${IMAGE_NAME}
	git checkout master
	git branch -d ${VERSION}

push:
	docker tag ${CONTAINER} ${IMAGE_NAME}:${VERSION} && docker push ${IMAGE_NAME}

restart: stop clean run
