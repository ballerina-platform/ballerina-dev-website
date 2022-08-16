---
---
$(document).ready(function() {
    Handlebars.registerHelper('basedownloadurl', function(version, artifact, extension) {
        if (isIdeaPlugin(artifact)) {
            return new Handlebars.SafeString(Handlebars.Utils.escapeExpression("https://plugins.jetbrains.com/plugin/9520-ballerina"))
        } else {
            return new Handlebars.SafeString(Handlebars.Utils.escapeExpression(base_download_url + "/" + version + "/" + artifact + (extension ? extension : "")))
        }
    });
    Handlebars.registerHelper('releasenotesdiv', function(version) {
        return getReleaseNotesDivId(version);
    });
    Handlebars.registerHelper('checksome', function(artifact, checksomeName) {
        var displayVal = checksomeName;
        if (artifact.indexOf(".json") > -1 || isIdeaPlugin(artifact)) {
            displayVal = "";
        }
        return displayVal;
    });

    Handlebars.registerHelper('isjson', function(artifact) {
        var isJsonClass = "";
        if (artifact.indexOf(".json") > -1) {
            isJsonClass = "json_download";
        }
        return isJsonClass;
    });

    Handlebars.registerHelper('settarget', function(artifact) {
        var target = "";
        if (isIdeaPlugin(artifact)) {
            target = "_blank";
        }
        return target;
    });

    Handlebars.registerHelper('downloadimgurl', function(artifact, downArrowImg, rightArrowImg) {
        if (isIdeaPlugin(artifact)) {
            return rightArrowImg;
        } else {
            return downArrowImg;
        }

    });

    Handlebars.registerHelper('formatdate', function(date) {
        return formatDate(date);
    });

    // Get it from Liquid variables. To do so I have added a front-matter at the top
    // of this file.
    var latestVersion = "{{ site.data.stable-latest.metadata.version }}";
    var data = {{ site.data.release_notes_versions | jsonify }};
    // remove latest version
    var ltestIndex = data.findIndex(function(element) {
        return element["version"].replace(/ /g, "-").toLowerCase() == latestVersion.replace(/ /g, "-").toLowerCase();
    });

    if (ltestIndex !== -1) {
        data.splice(ltestIndex, 1);
    }

    data.sort(function(a, b) {
        return new Date(b["release-date"]) - new Date(a["release-date"]);
    });
    updateReleasearchiveTable(data);
});

function updateReleasearchiveTable(allData) {
    $.get('/hbs/archived_list.hbs', function(data) {
        var template = Handlebars.compile(data);
        allData.forEach(function(item) {
            var elements = $('<div class="cInstallers"></div>');
            var allArtifact = [];
            if (item["linux-installer"]) {
                allArtifact.push(item["linux-installer"]);
            }
            if (item["windows-installer"]) {
                allArtifact.push(item["windows-installer"]);
            }
            if (item["macos-installer"]) {
                allArtifact.push(item["macos-installer"]);
            }
            if (item["other-artefacts"] && item["other-artefacts"].length > 0) {
                allArtifact = allArtifact.concat(item["other-artefacts"]);
            }

            // temporary adding idea plugin. This needs to be retrieve from release_notes_versions json
            allArtifact.push("ballerina-intellij-idea-plugin");

            var halfWayThough = Math.ceil(allArtifact.length / 2);
            item["lefttable"] = allArtifact.slice(0, halfWayThough);
            item["righttable"] = allArtifact.slice(halfWayThough, allArtifact.length);
            elements.append(template(item));
            $("#archived-versions").append(elements);
        });

        $('.json_download').click(function() {
            var currentElement = $(this);
            var href = currentElement.attr('href');
            var name = currentElement.attr('name');
            $.ajax({
                url: href,
                dataType: 'json',
                async: false,
                success: function(obj) {
                    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
                    currentElement.attr("href", "data:" + data);
                    currentElement.attr("download", name);
                    currentElement.removeClass("json_download")
                }
            });
        });

        allData.forEach(function(item) {
            var version = item["version"];
            var releaseNoteUrl = getReleaseNoteURL(version);
            if (releaseNoteUrl) {
                $.get(releaseNoteUrl, function(data) {
                    var versionSelector = $.escapeSelector(version);
                    $("#" +(versionSelector)+"notes").prop("href", releaseNoteUrl);
                    hljs.initHighlighting.called = false;
                    hljs.initHighlighting();
                    initCodeLineNumbers();
                });
            }

        }, 'html');

    }, 'html');
}

function getReleaseNotesDivId(version) {
    var suffix = "-notes";
    return (version + suffix).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "");
}

function getReleaseNoteURL(version) {
    return base_releasenote_url + "/" + version + "/";
}

function isIdeaPlugin(artifact) {
    return artifact && artifact === "ballerina-intellij-idea-plugin";
}
