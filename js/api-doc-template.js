$(document).ready(function () {
    let menu = '<div class="container">\n' +
        '        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\n' +
        '            <nav class="navbar">\n' +
        '                <div>\n' +
        '                    <div class="navbar-header">\n' +
        '                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"\n' +
        '                                data-target="#navbar" aria-expanded="false" aria-controls="navbar">\n' +
        '                            <span class="sr-only">&#9776</span>\n' +
        '                            <span class="icon-bar"></span>\n' +
        '                            <span class="icon-bar"></span>\n' +
        '                            <span class="icon-bar"></span>\n' +
        '                        </button>\n' +
        '                        <a class="cMobileLogo" href="/"><img src="/img/ballerina-logo.svg" alt="Ballerina"/></a>\n' +
        '                    </div>\n' +
        '                    <div id="navbar" class="collapse navbar-collapse">\n' +
        '                        <ul class="nav navbar-nav cTopNav">\n' +
        '                            <li class="active toctree-l1" id="learnli"><a class="cBioTopLink" href="/learn">Learn</a>\n' +
        '                            </li>\n' +
        '                            <li class="active toctree-l1" id="Eventsli"><a class="cBioTopLink" href="/learn/events">Events</a>\n' +
        '                            </li>\n' +
        '                            <li class="toctree-l1"><a class="cBioTopLink" href="https://central.ballerina.io/"\n' +
        '                                                      target="_blank">Central</a></li>\n' +
        '                            <li class="toctree-l1" id="openli"><a class="cBioTopLink" href="/community">Community</a>\n' +
        '                            </li>\n' +
        '                            <li class="toctree-l1" id="helpli"><a class="cBioTopLink" href="https://blog.ballerina.io">Blog</a>\n' +
        '                            </li>\n' +
        '                            <li class="cVersionItem">\n' +
        '                                <div class="cVersionContainer">\n' +
        '                                    <select name="versions" id="versions" class="select-css">\n' +
        '                                        <option value="1.2" data-value="latest">v1.2</option>\n' +
        '                                        <option value="swan-lake">Swan Lake</option>\n' +        
        '                                        <option value="1.1">v1.1</option>\n' +
        '                                        <option value="1.0">v1.0</option>\n' +
        '                                     </select>\n' +
        '                                </div>\n' +
        '                            </li>\n' +
        '                           <li class="cSearchMenu"><form class="cSearch-form-inline"><input id="searchTxt" class="form-control-field" type="search" placeholder="Search" aria-label="Search"><a id="searchBtn" href="#" class="cSearchButton"><img src="/img/search.svg"/></a></form></li>\n' +
        '                            </li>\n' +
        '                        </ul>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </nav>\n' +
        '        </div>\n' +
        '    </div>';
    let footer = '<div class="container">\n' +
        '    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 cBallerina-io-left-col cBallerinaFooterLinks">\n' +
        '        <ul>\n' +
        '            <li><a class="cBioFooterLink" href="/downloads">Download</a></li>\n' +
        '            <li><a class="cBioFooterLink" href="https://github.com/ballerina-lang/ballerina/blob/master/LICENSE">Code License</a></li>\n' +
        '            <li><a class="cBioFooterLink" href="/license-of-site">Site License</a></li>\n' +
        '            <li><a class="cBioFooterLink" href="/terms-of-service">TERMS OF SERVICE</a></li>\n' +
        '            <li><a class="cBioFooterLink" href="/privacy-policy">PRIVACY POLICY</a></li>\n' +
        '            </ul>\n' +
        '        </div>\n' +
        '    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 cBallerina-io-middle-col cBallerinaFooterSignUp">\n' +
        '        <div class="cSocialmedia">\n' +
        '            <ul>\n' +
        '                <li>\n' +
        '                    <a class="cBioFooterLink" href="https://github.com/ballerina-platform" target="_blank"><img src="/img/github.svg"/></a>\n' +
        '                    </li>\n' +
        '                <li><a class="cBioFooterLink" href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank"><img src="/img/stackoverflow.svg"/></a></li>\n' +
        '                <li><a class="cBioFooterLink" href="https://twitter.com/ballerinalang" target="_blank"><img src="/img/twitter.svg"/></a></li>\n' +
        '                <li><a class="cBioFooterLink" href="/community/slack/"><img src="/img/slack.svg"/></a></li>\n' +
        '                </ul>\n' +
        '            <div class="pdframe"></div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    <div class="col-xs-12 col-sm-10 col-md-6 col-lg-6 cBallerina-io-right-col">\n' +
        '        <p>In the creation of Ballerina, we were inspired by so many technologies. Thank you to all that have come before us (and forgive us if we missed one): Java, Go, C, C++, D, Rust, Haskell, Kotlin, Dart, TypeScript, JavaScript, Python, Perl, Flow, Swift, Elm, RelaxNG, NPM, Crates, Maven, Gradle, Kubernetes, Docker, Envoy, Markdown, GitHub and WSO2.</p></div>\n' +
        '    </div>';

    $('#iMainNavigation').append(menu);
    $('#iBallerinaFooter').append(footer);

 
});


$(window).scroll(function () {
    var bodyclass = document.body;

    if ($(this).scrollTop() > 100) {
        $('.cLeftNavContainer').addClass('cFixNav');
        $('.cLeftNavWrapper').addClass('cFixNav');

 
     
    } else {
        $('.cLeftNavContainer').removeClass('cFixNav');
        $('.cLeftNavWrapper').removeClass('cFixNav');
    
    }

 

});


// $(window).scroll(function() {
//     $(".cLeftNavContainer").removeClass("test");
//     if($(window).scrollTop() + $(window).height() == $(document).height()) {
//         //you are at bottom
//         $(".cLeftNavContainer").addClass("test");
//     }
//  });