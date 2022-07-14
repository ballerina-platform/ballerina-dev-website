#Rearrange files to match the urls
cp -r ./out/learn/get-started/* ./out/learn
cp -r ./out/learn/featured-use-cases/* ./out/learn
cp -r ./out/learn/learn-the-language/* ./out/learn
cp -r ./out/learn/learn-the-platform/* ./out/learn

#Rearrange files inside the sub-folders of learn-the-platform folder
cp -r ./out/learn/ballerina-central/* ./out/learn
cp -r ./out/learn/ballerina-tooling/* ./out/learn
cp -r ./out/learn/configure-observe/* ./out/learn
cp -r ./out/learn/java-interoperability/* ./out/learn
cp -r ./out/learn/test-document-the-code/* ./out/learn
cp -r ./out/learn/source-code-dependencies/* ./out/learn
cp ./out/404/index.html ./out/404.html

#Remove duplicated files
rm -rf ./out/learn/get-started/ ./out/learn/featured-use-cases/ ./out/learn/learn-the-language/ ./out/learn/learn-the-platform/
rm -rf ./out/learn/ballerina-central/ ./out/learn/ballerina-tooling/ ./out/learn/configure-observe/ ./out/learn/java-interoperability/ ./out/learn/test-document-the-code/ ./out/learn/source-code-dependencies/