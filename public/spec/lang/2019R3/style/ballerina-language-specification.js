$(document).ready(function () {

    var logo = '<a class="cLogo" href="/">' +
        ' <img src="https://ballerina.io/img/ballerina-logo.png" alt="Ballerina">' +
        '</a>' ;
        
       
        $('body').prepend(logo);

        var footer = '<div class="cFooter">' +
       
        '</div>' ;

        $('body').append(footer);


       });


        
//Remove frontmatter from dom in spec/lang htmls
$(document).ready(function(e) {
    var str=$('body').html();
    if (str.match(/---([\s\S]*?)---/gmi)) {
        str = str.replace(/---([\s\S]*?)---/gmi, "");
        $('body').html(str);
    }   
});          
    