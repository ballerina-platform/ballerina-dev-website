---
---
$(document).ready(function() {
    $("#iGitEdit").hide();
    Handlebars.registerHelper('releasenotesdiv', function(version) {
        return getReleaseNotesDivId(version);
    });
    Handlebars.registerHelper('formatdate', function(date) {
        return formatDate(date);
    });

    // Get it from Liquid variables. To do so I have added a front-matter at the top
    // of this file.
    var data = {{ site.data.swanlake_release_notes_versions | jsonify }};
    data.sort(function(a, b) {
        return new Date(b["release-date"]) - new Date(a["release-date"]);
    });
    updateReleaseTable(data);
});

function updateReleaseTable(allData) {
    $.get('/hbs/all_release_notes.hbs', function(data) {
        var template = Handlebars.compile(data);
        var elements = $('<div class="cAllReleaseNotes"></div>');
        allData.forEach(function(item) {
            elements.append(template(item));
            var version = item["version"]
            $("#toc_list").append(
                '<li class="toctree-l3"><a href="#' + getReleaseNotesDivId(version) + '">' + version + '</a></li>'
            );
        });
        $("#swan-lake-release-notes").after(elements);
        allData.forEach(function(item) {
            var version = item["version"];
            var releaseNoteUrl = getReleaseNoteURL(version);
            if (releaseNoteUrl) {
                $.get(releaseNoteUrl, function(data) {
                    $("#" + getReleaseNotesDivId(version) + "_note").html(data);
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
    return base_swanlake_releasenote_url + "/" + version + "/" + releaseNoteFilename;
}
