import ballerina/io;
import ballerina/file;
import ballerina/regex;

// command line input: relative path of the folder structure
configurable string inputPath = ?;

// absolute path of the program
string base = check file:getAbsolutePath("./");

type Folder record {|
    string dirName;
    int level;
    int position;
    boolean isDir;
    string url;
    string id;
    Folder[] subDirectories?;
|};

public function generateStructure(string path, int level=0) returns Folder|error {
    boolean isDir = check file:test(path, file:IS_DIR);
    string[] splitted = check file:splitPath(path);
    string dirName = splitted[splitted.length()-1];
    int position = 0;
    string url = path;
    string id = dirName;

    // Sanitize urls & file names
    // if (path.indexOf("get-started") !== () || path.indexOf("guides") !== () ||
    //     path.indexOf("references") !== () || path.indexOf("slides") !== ()) {
    //     url = regex:replaceAll(path, "^((?:[a-zA-Z0-9-]+/){1})([a-zA-Z0-9-]+)/", "/learn/");
    // }

    url = regex:replaceAll(url, ".md", "");
    url = "/" + url;
    id = regex:replaceAll(id, ".md", "");

    if (level===2) {
        // isDir = false;
        if(dirName.indexOf("swan") !== ()){
            isDir=false;
            string fpath=path+"/RELEASE_NOTE.md";
            string[] content = check io:fileReadLines(fpath);
            foreach var t in content {
                regex:Match? result = regex:search(t,"title");
                if (result !== () ) {
                    dirName = regex:replace(t, "^title: ", "");
                    break;
                }
            }
        }
        position = 1;
    }

    if !isDir {

        // Get the correct title of the document from frontmatter
        if(regex:matches(dirName, "^.*md$") || regex:matches(dirName, "^.*html$")) {
            string[] content = check io:fileReadLines(path);
            foreach var t in content {
                regex:Match? result = regex:search(t,"title");
                if (result !== () ) {
                    dirName = regex:replace(t, "^title: ", "");
                    break;
                }
            }
        }


        Folder file = { dirName, level, position, isDir, url, id };
        return file;
    } else {
        dirName = regex:replaceAll(dirName, "-", " ");
    }

    file:MetaData[] subDir = check file:readDir(path);
    Folder[] subDirectories = [];
    foreach file:MetaData dir in subDir {
        string absPath = dir.absPath;
        string relPath = check file:relativePath(base, absPath);
        Folder folder = check generateStructure(relPath, level+1);
        if(level < 2 ){
            subDirectories.push(folder);
        }
    }

    Folder dirStructure = { dirName, level, position, isDir, url, id, subDirectories };
    return dirStructure;
}

public function main() returns error? {
    Folder dirStructure = check generateStructure(inputPath);
    json jsonDirStructure = <json> dirStructure;

    check io:fileWriteJson("./rl.json", jsonDirStructure);
}