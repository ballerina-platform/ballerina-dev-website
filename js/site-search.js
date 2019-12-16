$(function () {
    let contentSearch = lunr(function () {
        this.ref('page');
        this.field('content');
        contentIndex.forEach(function (doc) {
            this.add(doc)
        }, this);
    });

    let titleSearch = lunr(function () {
        this.ref('page');
        this.field('content');
        titleIndex.forEach(function (doc) {
            this.add(doc)
        }, this);
    });

    let search = function () {
        $('#searchResult').empty();
        let text = $('#searchText').val();
        let searched = titleSearch.search(text);

        if (searched.length <= 0) {
            searched = contentSearch.search(text);
        }

        searched.forEach(function (searchtxt) {
            $('#searchResult').append('<li><h3><a href="' + searchtxt.ref + '">' + searchtxt.ref + '</a></h3><p>'
                + 'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in'
                + '</p></li>');
        });
    };

    let init = function () {
        let searchText = decodeURI(window.location.search.slice(1));
        $('#searchText').val(searchText);
        search();
    };

    $('#searchButton').on('click', function () {
        search();
    });

    init();
}());