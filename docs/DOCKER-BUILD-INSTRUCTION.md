# Docker instructions

# Build a specific docker image and push to [docker hub](https://hub.docker.com) in a forked repo

Get upstream changes

    git fetch upstream

Check if there is new version with git tags:

    git tag | tail -n 1

Check if the tag/version is higher then what you are already running.

## Build new version

Export the VERSION shell variable

    export VERSION=$(git tag | tail -n 1)
    echo $VERSION

Run `make` and the Makefile uses the $VERSION variable to checkout the new version and build it.

    make

Ignore any OSX/Darwin warnings for npm, feel free to contribute by fixing the dependencies if you are able to.

    make run

It's now running in the background, lets check the logs:

    docker logs iframely

Go to [iframely on localhost](http://localhost:8061/debug)
If it looks good, lets tag and push to docker hub:

    make push

Last step is to commit any changes with git cm, and finally

    git checkout master
    git merge tag-$VERSION

Push to our repo (code + tags)

    git push
    git push origin $VERSION

# Ansible

If you want to use Ansible to deploy your iframely container, copy the ansible-docker-iframely directory to your ansible roles dir and the playbook to the playbook dir. and run the playbook:

```
ansible-playbook playbooks/iframely.yml
```

Verify iframely:
Go to [iframely on my host](https://<hostname.example.com>/iframely?uri=https%3A%2F%2Fsoundcloud.com%2Fsysoparna)

# Ansible + Vagrant

You can run tests and setups yourself with the vagrant file in the ansible-docker-iframely directory. Just cd
there and run `vagrant up`.
