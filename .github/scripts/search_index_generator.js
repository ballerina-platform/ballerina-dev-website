var cheerio = require("cheerio");
var fs = require('fs');
var path = require('path');


walk("_site/learn/", function (err, results) {
    if (err) throw err;

});

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = path.join(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                            results = results.concat(res);
                        next();
                    });
                } else {

                    if (file.toString().includes(".html")) {
                        results.push(file);
                        console.log("--Indexing the file - "+file);

                        fs.readFile(file, 'utf8', function (err, contents) {

                            var $ = cheerio.load(contents);

                            //Removing navigation content, scripts and styles
                            $('#iMainNavigation').remove();
                            $('#iBallerinaFooter').remove();
                            $('.cLeftNavContainer').remove();
                            $('.navi-wrapper').remove();
                            $('a').remove();
                            $('script').remove();
                            $('style').remove();
                            
                            var summary = $("p").text().toString();

                            if (summary != "") {
                                summary = truncate(summary, 50) + " ...";
                                
                                var description = $("body").text().replace(/(\r\n|\n|\s\s+)/g, ' ');
                                var h1 = $("h1").text().replace(/\n/g, '');
                                var h2 = $("h2").text().replace(/\n/g, '');
                                if (h1 != "") { var name = h1; } else if (h2 != "") { var name = h2; } else { var name = "Ballerina"; }

                                documents = readJson('./searchIndex.js');

                                var searchObj = {
                                    page: file.replace("index.html",""),
                                    name: name.replace(/\s+/g, ' '),
                                    summary: trim(summary),
                                    content: trim(description)
                                }
                                documents.push(searchObj);
                                writeIntoJson('searchIndex.js', documents);
                            }
                        });
                    }

                    next();
                }
            });
        })();
    });
};


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
    var trimContent;
    if (str != null) {
        trimContent = str.trim();
    }
    return trimContent;
}

function truncate(str, limit) {
    return str.split(" ").splice(0, limit).join(" ");
}