# Docker instructions

# Build a specific docker image and push to [docker hub](https://hub.docker.com) in a forked repo

Get upstream changes

    git fetch upstream

Check if there is new version with git tags: 

    git tag | tail -n 1

Latest I pushed was v1.3.NN (this is an example!)

## If newer:

Update Makefile with the new version

    $EDITOR Makefile

(the makefile will switch to new branch and build it)

    make

Ignore any OSX/Darwin warnings for npm 

    make run

It's now running in the background, lets check the logs:

    docker logs iframely

Go to [iframely on localhost](http://localhost:8061/debug) 
If it looks good, lets tag and push to docker hub:

    make push

Last step is to commit any changes with git cm, and finally

    git checkout master
    git merge tag-<version>
    git tag <version>
    git push (to our repo).
    git push origin <version>

# Ansible

If you want to use Ansible to deploy your iframely container, copy the ansible-docker-iframely directory to 
your ansible roles dir and the playbook to the playbook dir. and run the playbook:

```
ansible-playbook playbooks/iframely.yml 
```

Verify iframely:
Go to [iframely on my host](https://<hostname.example.com>/iframely?uri=https%3A%2F%2Fsoundcloud.com%2Fsysoparna)

# Ansible + Vagrant

You can run tests and setups yourself with the vagrant file in the ansible-docker-iframely directory. Just cd
there and run `vagrant up`.

