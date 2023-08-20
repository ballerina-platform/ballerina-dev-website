#!/bin/bash

#Rearrange files to match the urls
cp -r ./out/learn/featured-scenarios/* ./out/learn
cp -r ./out/learn/learn-the-language/* ./out/learn
cp -r ./out/learn/learn-the-platform/* ./out/learn
cp -r ./out/policies/* ./out/

#Rearrange files inside the sub-folders of learn-the-platform folder
cp -r ./out/learn/build-a-graalvm-executable/* ./out/learn
cp -r ./out/learn/ballerina-central/* ./out/learn
cp -r ./out/learn/ballerina-tooling/* ./out/learn
cp -r ./out/learn/configure-observe/* ./out/learn
cp -r ./out/learn/java-interoperability/* ./out/learn
cp -r ./out/learn/test-document-the-code/* ./out/learn
cp -r ./out/learn/source-code-dependencies/* ./out/learn
cp -r ./out/learn/ballerina-persist/* ./out/learn
cp ./out/404/index.html ./out/404.html

#Remove duplicated files
rm -rf ./out/learn/featured-scenarios/ ./out/learn/learn-the-language/ ./out/learn/learn-the-platform/ ./out/policies/
rm -rf ./out/learn/build-a-graalvm-executable ./out/learn/ballerina-central/ ./out/learn/ballerina-tooling/ ./out/learn/configure-observe/ ./out/learn/java-interoperability/ ./out/learn/test-document-the-code/ ./out/learn/source-code-dependencies/ ./out/learn/ballerina-persist/


#Edit the sitemap
sed -i '' 's/featured-scenarios\///g' ./out/sitemap.xml
sed -i '' 's/learn-the-language\///g' ./out/sitemap.xml
sed -i '' 's/learn-the-platform\///g' ./out/sitemap.xml
sed -i '' 's/policies\///g' ./out/sitemap.xml

sed -i '' 's/build-a-graalvm-executable\///g' ./out/sitemap.xml
sed -i '' 's/ballerina-central\///g' ./out/sitemap.xml
sed -i '' 's/ballerina-tooling\///g' ./out/sitemap.xml
sed -i '' 's/ballerina-persist\///g' ./out/sitemap.xml
sed -i '' 's/configure-observe\///g' ./out/sitemap.xml
sed -i '' 's/java-interoperability\///g' ./out/sitemap.xml
sed -i '' 's/test-document-the-code\///g' ./out/sitemap.xml
sed -i '' 's/source-code-dependencies\///g' ./out/sitemap.xml