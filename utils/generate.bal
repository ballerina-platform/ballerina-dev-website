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
    string url = "";
    string id = dirName;

    // io:println(path);

    // set the order of the directory
    if (isDir && (dirName === "get-started")) {
        position = 1;
    }
    else if (isDir && (dirName === "guides")) {
        position = 2;
    }
    else if (isDir && (dirName === "references")) {
        position = 3;
    }
    else if (isDir && (dirName === "slides")) {
        position = 4;
    }

    // Sanitize urls & file names
    if (path.indexOf("get-started") !== () || path.indexOf("guides") !== () ||
        path.indexOf("references") !== () || path.indexOf("slides") !== ()) {
        url = regex:replaceAll(path, "^((?:[a-zA-Z0-9-]+/){1})([a-zA-Z0-9-]+)/", "/learn/");
    } else if (path.indexOf("why-ballerina") !== ()) {
        url = regex:replaceAll(path, "^((?:[a-zA-Z0-9-]+/){1})([a-zA-Z0-9-]+)/", "/why-ballerina/");
    }
    // dirName = regex:replaceAll(dirName, ".md", "");
    // dirName = regex:replaceAll(dirName, "-", " ");
    url = regex:replaceAll(url, ".md", "");
    id = regex:replaceAll(id, ".md", "");

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
        subDirectories.push(folder);
    }

    Folder dirStructure = { dirName, level, position, isDir, url, id, subDirectories };
    return dirStructure;
}

public function main() returns error? {
    Folder dirStructure = check generateStructure(inputPath);
    json jsonDirStructure = <json> dirStructure;

    check io:fileWriteJson("./files2.json", jsonDirStructure);
}