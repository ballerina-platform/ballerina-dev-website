# ballerina-platform.github.io

ballerina-platform.github.io - Github pages based ballerina.io website

## Run website locally with docker

Execute following command to build the docker image

```shell
docker build -t ballerina-web . 
```

Execute following command to run the container.

```shell
docker run -p 4000:4000 ballerina-web
```

Access website using <http://localhost:4000/>

## Run website locally with Jekyll and bundler gems

Execute following command to install Jekyll

```shell
gem install jekyll bundler
```

Execute following command to install required gems

Run `bundle install` within project directory to install required gems.

Build the site and make it available on a local server

```shell
bundle exec jekyll serve
```

**Troubleshooting Tips:** 
1. For more information on the installation instructions, see the [Jekyll Installation Documentation](https://jekyllrb.com/docs/installation/).
2. If you get the `cannot load such file -- webrick` error, execute the `bundle add webrick` command.