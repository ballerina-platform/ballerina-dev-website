$(function () {
    let contentSearch = lunr(function () {
        this.ref('page');
        this.field('content');
        this.field('name');
        contentIndex.forEach(function (doc) {
            doc.page = JSON.stringify({page:doc.page, name: doc.name});
            this.add(doc)
        }, this);
    });

    let titleSearch = lunr(function () {
        this.ref('page');
        this.field('content');
        this.field('name');
        titleIndex.forEach(function (doc) {
            doc.page = JSON.stringify({page:doc.page, name: doc.name});
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
            let refObj = JSON.parse(searchtxt.ref);
            $('#searchResult').append('<li><h3><a href="' + refObj.page + '">' + refObj.name + '</a></h3><p>'
                + '</p></li>');
        });

        if(searched.length <= 0) {
            $('#searchResult').append('<li><h3><a>Oops!</a></h3>' +
                '<p>Looks like we cannot find what you are looking for.</p></li>');
        }
    };

    let init = function () {
        let searchText = decodeURI(window.location.search.slice(1));
        $('#searchText').val(searchText);
        search();
    };

    $('#searchButton').on('click', function () {
        search();
    });

    $( "#searchText" ).keypress(function( event ) {
        if (event.which === 13) {
            event.preventDefault();
            search();
        }
    });

    init();
}());