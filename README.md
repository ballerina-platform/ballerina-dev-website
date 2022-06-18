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
3. If you get the `Could not locate Gemfile` error, you may not be inside the `ballerina-dev-website` repo directory. Navigate to it in the terminal, and then, execute the required command.
4. If you get the `An error occurred while installing eventmachine (1.2.7), and Bundler cannot continue.` error, execute the `bundle config build.eventmachine --with-cppflags=-I/usr/local/opt/openssl/include` command, and then execute the `bundle install` command.
