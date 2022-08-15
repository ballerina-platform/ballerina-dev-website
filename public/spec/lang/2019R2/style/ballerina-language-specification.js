$(document).ready(function () {

    if ($('.cLogo').length == 0) {
        var logo = '<a class="cLogo" href="/">' +
            ' <img src="https://ballerina.io/img/ballerina-logo.png" alt="Ballerina">' +
            '</a>';



        var str = $('body').html();
        if (str.match(/---\npermalink:([\s\S]*?)---/gmi)) {
            str = str.replace(/---\npermalink:([\s\S]*?)---/gmi, "");
            $('body').html(str);
        }


        $('body').prepend(logo);

        var footer = '<div class="cFooter">' +

            '</div>';

        $('body').append(footer);
    }

});



// Remove frontmatter from dom in spec/lang htmls
$(document).ready(function () {
    var str = $('body').html();
    if (str.match(/---\npermalink:([\s\S]*?)---/gmi)) {
        str = str.replace(/---\npermalink:([\s\S]*?)---/gmi, "");
        $('body').html(str);
    }
});
