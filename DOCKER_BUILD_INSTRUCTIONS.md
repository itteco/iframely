# This is the instructions I use to build a new docker and push to docker hub

I have forked iframely to my own repo so that I can make changes to it (added my Dockerfile, Makefile etc).

Go to the forked repo, for me it's in ~Sync/source/docker/iframely
`git fetch upstream`
Check if there is new version with git tags: 
`git tag | tail -n 1`
Latest I pushed was v1.3.NN (this is an example!)

## If newer:
Update Makefile with the new version

`$EDITOR Makefile`

(the makefile will switch to new branch and build it)

`make`

Ignore darwin warnings for npm 

`make run`

It's now running, lets check the logs:

`docker logs iframely`

Go to [iframely on localhost](http://localhost:8061/debug) 
If it looks good, lets tag and push to docker hub:

`make push`

Last step is to commit any changes with git cm, and finally
```bash
git checkout master
git merge tag-<version>
git tag <version>
git push (to our repo).
git push origin <version>
```

## These last step are for my deployment, so make up your own deployments here!
When done, run ansible:

```
cd ~/src/ansible

ansible-playbook playbooks/iframely.yml 
```

Verify iframely:
Go to [iframely on my host](https://<hostname.example.com>/iframely?uri=https%3A%2F%2Fsoundcloud.com%2Fsysoparna)


