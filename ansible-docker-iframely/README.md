# Ansible role for iframely in docker

## Role Variables

It should run out of the box with default config file path in /opt/iframely.

The playbook will create the dir and start the latest iframely docker from the [jolt/iframely](https://cloud.docker.com/u/jolt/repository/docker/jolt/iframely) repo.

If you need to override the default path or version, just put the ones you need in your groups_vars/host_vars or wherever you set vars:

```yml
docker_iframely_dir: /opt/iframely-anotherpath
docker_iframely_version: 1.3.0
```

## Playbook Example

Simple as pie! Save the following into your own playbook, and move this dir to roles/ansible-docker-iframely or something you like.

```yml
---
- hosts: someservers
  roles:
    - role: role/ansible-docker-iframely
```

Then run it: `ansible_playbook playbooks/iframely.yml`.

## Notes

You will need to customize the [templates/config.local.js](templates/config.local.js) config file to your deployment.

## nginx config

If you want to run it behind nginx, here's a snippet for you:

```nginx
	location /iframely {
		proxy_pass http://localhost:8061;

                # HTTP 1.1 support
                proxy_http_version 1.1;
                proxy_buffering off;
                proxy_set_header Host $http_host;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $proxy_connection;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $proxy_x_forwarded_proto;
                proxy_set_header X-Forwarded-Ssl $proxy_x_forwarded_ssl;
                proxy_set_header X-Forwarded-Port $proxy_x_forwarded_port;

                # Mitigate httpoxy attack (see README for details)
                proxy_set_header Proxy "";
	}
```

## Vagrant

Wanna try it now? Run `vagrant up`, then visit [Iframely in vagrant](http://localhost:8061/iframely?uri=https%3A%2F%2Fflattr.com)

Find [Vagrant](https://www.vagrantup.com/intro/index.html) here.

## License

MIT

## Author

Based on work by
Fredrik Lundhag, <fredrik@flattr.com>
