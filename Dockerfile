FROM jekyll/jekyll:latest

COPY . /home/user/ballerina2/
RUN chmod -R 777 /home/user/ballerina2/

ENTRYPOINT jekyll serve --host 0.0.0.0

EXPOSE 4000

WORKDIR /home/user/ballerina2/