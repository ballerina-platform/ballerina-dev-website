$(function () {

    let contentSearch = lunr(function () {
        this.ref('page');
        this.field('content');
        this.field('name');
        this.field('summary');
        contentIndex.forEach(function (doc) {
            doc.page = JSON.stringify({ page: doc.page, name: doc.name, content: doc.content, summary: doc.summary });
            this.add(doc)
        }, this);
    });

    let search = function () {
        $('#searchResult').empty();
        $('h2').html("");
        
        let text = $('#searchText').val();
        let searchVersion = $('#searchVersion').val();
        let previousVersion = "/1.2";
        
        if (text != null && text != "" && searchVersion != null && searchVersion != "") {

            let resultSet = 0;
            searched = contentSearch.search(text);
            let isLatest = $("#searchVersion option:selected").attr("data-value") === "latest";

            searched.forEach(function (searchtxt) {
    
                let refObj = JSON.parse(searchtxt.ref);
                let searchDescFull = refObj.summary;
                let searchDesc = searchDescFull;
                let pagePath = refObj.page;
                
                if(isLatest){
                    if(!pagePath.startsWith(previousVersion)){
                        resultSet = 1;
        
                        $('.searchStatus').html("");
                        $('h2').html("Search Results");
                        $('#searchResult').append('<li><h3><a href="' + refObj.page + '">' + refObj.name + '</a></h3>' +
                            '<p><a href="' + refObj.page + '"> https://ballerina.io' + refObj.page + '</a></p>'
                            + '<p>' + searchDesc +
                            '</p></li>');
                    }
                }else if(pagePath.startsWith(previousVersion)){
                    resultSet = 1;
    
                    $('.searchStatus').html("");
                    $('h2').html("Search Results");
                    $('#searchResult').append('<li><h3><a href="' + refObj.page + '">' + refObj.name + '</a></h3>' +
                        '<p><a href="' + refObj.page + '"> https://ballerina.io' + refObj.page + '</a></p>'
                        + '<p>' + searchDesc +
                        '</p></li>');
                }
    
            });
    
            if (searched.length <= 0 || resultSet != 1) {
                $('.searchStatus').html("");
                $('h2').html("");
                $('#searchResult').append('<li><h3><a>Oops!</a></h3>' +
                    '<p>Looks like we cannot find what you are looking for.</p></li>');
            }
        }
    };

    let init = function () {
        let searchText = decodeURI(window.location.search.slice(1));
        $('#searchText').val(searchText);
        if(searchText.length == 0){
            $('.searchStatus').hide();
        }
        search();
    };

    $('#searchButton').on('click', function () {
        search();
    });

    $("#searchText").keypress(function (event) {
        if (event.which === 13) {
            event.preventDefault();
            search();
        }
    });

    init();
}());