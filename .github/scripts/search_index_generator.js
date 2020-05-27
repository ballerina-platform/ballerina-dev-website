const cheerio = require("cheerio");
const fs = require('fs');
const path = require('path');

//Directories to skip from indexing without trailing slash, start from _site
const nofollow = ["_site/0.990", "_site/0.991", 
                "_site/1.0", "_site/1.1", "_site/img", "_site/assets",
                "_site/downloads/release-notes", "_site/hbs", "_site/js", "_site/learn/faqs", "_site/404.html",
                "_site/learn/faqs.html","_site/why","_site/learn/api-docs/ballerinax/index,html","_site/jekyll","_site/spec",
                "_site/v1-1", "_site/v1-0", "_site/v0-991", "_site/v0-990"];

walk("_site/", function (err, results) {
    if (err) throw err;
    generateIndexFile();
    console.log("-- Search index generated! --")
});

function walk(dir, done) {
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file) return done(null, results);
            file = path.join(dir, file);

            let nofollowIndex = nofollow.indexOf(dir);
            if (nofollowIndex != -1) {
                if (dir.includes(nofollow[nofollowIndex])) {
                    next();
                }
            } else if(nofollow.indexOf(file) != -1){
                next();
            }else {
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function (err, res) {
                            results = results.concat(res);
                            next();
                        });
                    } else {

                        if (file.toString().includes(".html")) {
                            results.push(file);
                            console.log("--Indexing the file - " + file);

                            fs.readFile(file, 'utf8', function (err, contents) {

                                let $ = cheerio.load(contents);

                                //Removing navigation content, scripts and styles
                                $('#iMainNavigation').remove();
                                $('#iBallerinaFooter').remove();
                                $('.cLeftNavContainer').remove();
                                $('.navi-wrapper').remove();
                                $('a').remove();
                                $('script').remove();
                                $('style').remove();

                                let summary = $("p").text().toString();

                                if (summary != "") {
                                    summary = truncate(summary, 50) + " ...";
                                    let name = "";
                                    let description = $("body").text().replace(/(\r\n|\n|\s\s+)/g, ' ');
                                    let h1 = $("h1").text().replace(/\n/g, '').replace(/\s+/g, ' ');
                                    let h2 = $("h2").text().replace(/\n/g, '').replace(/\s+/g, ' ');

                                    if (h1 != "") { name = h1; } else if (h2 != "") { name = h2; } else { name = "Ballerina"; }

                                    let page = file.replace("_site","").replace("index.html", ""),

                                    documents = readJson('./searchIndex.json');

                                    let searchObj = {
                                        page: trim(page),
                                        name: trim(name),
                                        summary: trim(summary),
                                        content: trim(description)
                                    }
                                    documents.push(searchObj);
                                    writeIntoJson('searchIndex.json', documents);
                                }
                            });
                        }

                        next();
                    }
                });
            }
        })();
    });
};

function generateIndexFile(){
    try {
        let jsonContent = "let contentIndex="+fs.readFileSync("searchIndex.json")+";";        
        fs.writeFile('searchIndex.js', jsonContent, function (err) {
            if (err) return console.log(err);
          });
    } catch (err) {
        return [];
    }

}

function readJson(file) {
    try {
        const jsonString = fs.readFileSync(file);
        return JSON.parse(jsonString);
    } catch (err) {
        return [];
    }
}

function writeIntoJson(file, json) {
    fs.writeFileSync(file, JSON.stringify(json));
}

function trim(str) {
    let trimContent;
    if (str != null) {
        trimContent = str.trim();
    }
    return trimContent;
}

function truncate(str, limit) {
    return str.split(" ").splice(0, limit).join(" ");
}