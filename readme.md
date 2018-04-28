[![Build Status](https://travis-ci.org/vdegenne/lasso.svg?branch=master)](https://travis-ci.org/vdegenne/lasso)
[![npm](https://img.shields.io/npm/v/beautiful-lasso.svg)](https://www.npmjs.com/package/beautiful-lasso)

<h2 align="center"><img src="https://vignette.wikia.nocookie.net/farmville2/images/e/ea/Lasso.png/revision/latest?cb=20151028043921" height=123><br>Lasso</h2>
<p align="center"><strong>A tiny application to expose a file-system branch to the world.</strong></p>

## Installation

```bash
sudo yarn global add beautiful-lasso
# or
sudo npm i -g beautiful-lasso
```
(*the reason why it's `beautiful-lasso` and not `lasso` is because the name was already taken on npm*)

### Docker

If you don't have node but docker installed on your machine you can pull a docker image and run the application in a container. The advantage of this method is that you don't have to configure and install node on your machine, you just pull the container and run the application :

```bash
docker run --rm -it \
           --name <container_name> \
           -p <host_port>:3000 \
           -e RANCH=/ranch \
           -v <path_of_the_directory_to_expose>:/ranch \
           vdegenne/lasso
```

Replace the parts with your own values. You can also add `-d` to run the application in detached mode.

## Usage

```bash
RANCH=exposed_directory lasso [--port 8000]
# exposed_directory is relative to where the command is invoked
```

This will expose `exposed_directory` (also called the **ranch** ) to the world on port 8000 (default to 3000, the `--port` is optional). Of course this will not really expose the directory to the world unless you are running this command on a public machine and configure the firewall to accept entrances on the given port.

## Configuration

By default, the files in the ranch are secured with http basic authentication. You'll need to create a `.lasso.passwd` into the ranch so you can register users. Here's an example of `.lasso.passwd` :

```text
bob:bob_password
```

Now bob can request a file in the ranch :

```bash
curl http://alice.com:8000/database_backup.sql -u bob:bob_password
# you can run
curl http://alice.com:8000/database_backup.sql -u bob
# to prompt for the password so it's not written in bash history
```

## .lasso.public

It's also possible to make some files available publicly without basic authentication required. Just create `.lasso.public` in the ranch :

```text
public-file.txt
public-file2.txt
```

Now bob and whoever can request :

```bash
curl http://alice.com:8000/public-file.txt
# without the need of authentication
```

(*wildcards are not supported at this moment*)

You can also make a directory publicly. In `.lasso.public` :

```text
public-file.txt
public-directory
```

Every file in `public-directory` are exposed,

```bash
curl http://alice.com:8000/public-directory/file1.txt
```

(*note that making a directory public is not making its subdirectories public too, you have to explicitily write every directory you want to make public into `.lasso.public`*)

This is Lasso philosophy, you just use your lasso to quickly grab some files, with a very basic layer of security.


## Commands

You can also use command keywords, for example :

```bash
curl http://alice.com:8000/public-directory/latest -u bob
# This will fetch the last modified file inside public-directory
```