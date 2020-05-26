(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:865786,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

function subscribeUser(email) {
    $('#subscribeUserMessage').remove("");
    if (email == "") {
        $("#emailUser").attr("placeholder", "Please enter your email.");
    } else if (!isEmail(email)) {
        $("#emailUser").val("");
        $("#emailUser").attr("placeholder", "Please enter a valid email.");

    } else {
        $(".pdframe").html("<iframe src='https://go.pardot.com/l/142131/2017-02-16/3c6zgy?email=" + email + "'></iframe>");
        $("#emailUser").val("");
        $("#emailUser").attr("placeholder", "Your email address has been added.");
    }
    return;
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function formatDate(date, format) {
    if (!format) {
        return moment(date, "YYYY-MM-DD").format('MMM DD, Y');
    } else {
        return moment(date, "YYYY-MM-DD").format(format);
    }
}

function getUrlVars(url) {
    var vars = {};
    var hashes = url.split("?")[1];
    var hash = hashes.split('&');

    for (var i = 0; i < hash.length; i++) {
        params = hash[i].split("=");
        vars[params[0]] = params[1];
    }
    return vars;
}

/*
 * Following script is adding line numbers to the ballerina code blocks in the gneerated documentation
 */
function initCodeLineNumbers() {
    $('pre > code.ballerina, pre > code.language-ballerina').each(function() {

        if ($(this).parent().find('.line-numbers-wrap').length === 0) {
            //cont the number of rows
            //Remove the new line from the end of the text
            var numberOfLines = $(this).text().replace(/\n$/, "").split(/\r\n|\r|\n/).length;
            var lines = '<div class="line-numbers-wrap">';

            //Iterate all the lines and create div elements with line number
            for (var i = 1; i <= numberOfLines; i++) {
                lines = lines + '<div class="line-number">' + i + '</div>';
            }
            lines = lines + '</div>';
            //calculate <pre> height and set it to the container
            var preHeight = numberOfLines * 18 + 20;

            $(this).parent()
                .addClass('ballerina-pre-wrapper')
                .prepend($(lines));
        }

    });
}

/*
 * Register ballerina language for highlightJS
 * Grammer: https://github.com/ballerina-platform/ballerina-lang/blob/master/compiler/ballerina-lang/src/main/resources/grammar/BallerinaLexer.g4
 */
if (typeof hljs === 'object') {
    hljs.configure({ languages: [] });
    hljs.registerLanguage('ballerina', function() {
        return {
            "k": "if else iterator try catch finally fork join all some while foreach in throw return " +
                "returns break timeout transaction aborted abort committed failed retries next bind with " +
                "lengthof typeof enum import version public private attach as native documentation lock " +
                "from on select group by having order where followed insert into update delete set for " +
                "window query annotation package type typedesc connector function resource service action " +
                "worker struct transformer endpoint object const true false reply create parameter match but",
            "i": {},
            "c": [{
                "cN": "ballerinadoc",
                "b": "/\\*\\*",
                "e": "\\*/",
                "r": 0,
                "c": [{
                    "cN": "ballerinadoctag",
                    "b": "(^|\\s)@[A-Za-z]+"
                }]
            }, {
                "cN": "comment",
                "b": "//",
                "e": "$",
                "c": [{
                    "b": {}
                }, {
                    "cN": "label",
                    "b": "XXX",
                    "e": "$",
                    "eW": true,
                    "r": 0
                }]
            }, {
                "cN": "comment",
                "b": "/\\*",
                "e": "\\*/",
                "c": [{
                    "b": {}
                }, {
                    "cN": "label",
                    "b": "XXX",
                    "e": "$",
                    "eW": true,
                    "r": 0
                }, "self"]
            }, {
                "cN": "string",
                "b": "\"",
                "e": "\"",
                "i": "\\n",
                "c": [{
                    "b": "\\\\[\\s\\S]",
                    "r": 0
                }, {
                    "cN": "constant",
                    "b": "\\\\[abfnrtv]\\|\\\\x[0-9a-fA-F]*\\\\\\|%[-+# *.0-9]*[dioxXucsfeEgGp]",
                    "r": 0
                }]
            }, {
                "cN": "number",
                "b": "(\\b(0b[01_]+)|\\b0[xX][a-fA-F0-9_]+|(\\b[\\d_]+(\\.[\\d_]*)?|\\.[\\d_]+)([eE][-+]?\\d+)?)[lLfF]?",
                "r": 0
            }, {
                "cN": "annotation",
                "b": "@[A-Za-z]+"
            }, {
                "cN": "type",
                "b": "\\b(boolean|int|float|string|var|any|datatable|table|blob|map|exception|json|xml|xmlns|error|stream|streamlet|aggregation)\\b",
                "r": 0
            }]
        };
    });
}

//matching version selected with the URL
function versionSelectorValue(){
    let pathValue = window.location.pathname;
    let options = $("#versions").find("option");
    $.each(options, function (key, option) {
        let optionText = $(option).text().replace("v","");
        //let ver = "v" + optionText.replace(".", "-");
        if(pathValue.indexOf(optionText) > -1){
            $(option).attr("selected", "selected");
        }
    });
}

$(document).ready(function() {
    // Change version selected in the versions dropdown according to version on the URL.
    versionSelectorValue();

    $("code").addClass('cBasicCode');
    $(".ballerina").removeClass('cBasicCode');
    $(".bash").removeClass('cBasicCode');

    $(".cRuntimeContent").addClass('cShow');

    $(".cSEQUENCE").addClass('active');
    $(".cRUNTIME").addClass('active');

    $(".cRUNTIME").click(function() {
        $(".cRuntimeContent").addClass('cShow');
        $(".cDeploymentContent").removeClass('cShow');
        $(".cSECUREBYDEFAULTContent").removeClass('cShow');
        $(".cLifecycleContent").removeClass('cShow');
    });

    $(".cDEPLOYMENT").click(function() {
        $(".cRuntimeContent").removeClass('cShow');
        $(".cDeploymentContent").addClass('cShow');
        $(".cSECUREBYDEFAULTContent").removeClass('cShow');
        $(".cLifecycleContent").removeClass('cShow');

    });

    $(".cLIFECYCLE").click(function() {
        $(".cRuntimeContent").removeClass('cShow');
        $(".cDeploymentContent").removeClass('cShow');
        $(".cSECUREBYDEFAULTContent").removeClass('cShow');
        $(".cLifecycleContent").addClass('cShow');
    });

    $(".cSEQUENCEContent").addClass('cShow');

    $(".cSEQUENCE").click(function() {
        $(".cSEQUENCEContent").addClass('cShow');
        $(".cCONCURRENCYContent").removeClass('cShow');
        $(".cTYPEContent").removeClass('cShow');
        $(".cSECUREBYDEFAULTContent").removeClass('cShow');
        $(".cNETWORKAWAREContent").removeClass('cShow');
        $(".cCLOUDNATIVEContent").removeClass('cShow');
        $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
        $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
    });

    $(".cCONCURRENCY").click(function() {
        $(".cSEQUENCEContent").removeClass('cShow');
        $(".cCONCURRENCYContent").addClass('cShow');
        $(".cTYPEContent").removeClass('cShow');
        $(".cSECUREBYDEFAULTContent").removeClass('cShow');
        $(".cNETWORKAWAREContent").removeClass('cShow');
        $(".cCLOUDNATIVEContent").removeClass('cShow');
        $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
        $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
    });

    $(".cTYPE").click(function() {
        $(".cSEQUENCEContent").removeClass('cShow');
        $(".cCONCURRENCYContent").removeClass('cShow');
        $(".cTYPEContent").addClass('cShow');
        $(".cSECUREBYDEFAULTContent").removeClass('cShow');
        $(".cNETWORKAWAREContent").removeClass('cShow');
        $(".cCLOUDNATIVEContent").removeClass('cShow');
        $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
        $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
    });

    $(".cSECUREBYDEFAULT").click(function() {
        $(".cSEQUENCEContent").removeClass('cShow');
        $(".cCONCURRENCYContent").removeClass('cShow');
        $(".cTYPEContent").removeClass('cShow');
        $(".cSECUREBYDEFAULTContent").addClass('cShow');
        $(".cNETWORKAWAREContent").removeClass('cShow');
        $(".cCLOUDNATIVEContent").removeClass('cShow');
        $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
        $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
    });

    $(".cSECUREBYDEFAULT").click(function() {
        $(".cSEQUENCEContent").removeClass('cShow');
        $(".cCONCURRENCYContent").removeClass('cShow');
        $(".cTYPEContent").removeClass('cShow');
        $(".cSECUREBYDEFAULTContent").addClass('cShow');
        $(".cNETWORKAWAREContent").removeClass('cShow');
        $(".cCLOUDNATIVEContent").removeClass('cShow');
        $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
        $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
    });

    $(".cNETWORKAWARE").click(function() {
        $(".cSEQUENCEContent").removeClass('cShow');
        $(".cCONCURRENCYContent").removeClass('cShow');
        $(".cTYPEContent").removeClass('cShow');
        $(".cSECUREBYDEFAULTContent").removeClass('cShow');
        $(".cNETWORKAWAREContent").addClass('cShow');
        $(".cCLOUDNATIVEContent").removeClass('cShow');
        $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
        $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
    });

    $(".cCLOUDNATIVE").click(function() {
        $(".cSEQUENCEContent").removeClass('cShow');
        $(".cCONCURRENCYContent").removeClass('cShow');
        $(".cTYPEContent").removeClass('cShow');
        $(".cSECUREBYDEFAULTContent").removeClass('cShow');
        $(".cNETWORKAWAREContent").removeClass('cShow');
        $(".cCLOUDNATIVEContent").addClass('cShow');
        $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
        $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
    });

    $(".cBESTPRACTICESENFORCED").click(function() {
        $(".cSEQUENCEContent").removeClass('cShow');
        $(".cCONCURRENCYContent").removeClass('cShow');
        $(".cTYPEContent").removeClass('cShow');
        $(".cSECUREBYDEFAULTContent").removeClass('cShow');
        $(".cNETWORKAWAREContent").removeClass('cShow');
        $(".cCLOUDNATIVEContent").removeClass('cShow');
        $(".cBESTPRACTICESENFORCEDContent").addClass('cShow');
        $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
       });

    $(".cBEYONDTHELANGUAGE").click(function() {
        $(".cSEQUENCEContent").removeClass('cShow');
        $(".cCONCURRENCYContent").removeClass('cShow');
        $(".cTYPEContent").removeClass('cShow');
        $(".cSECUREBYDEFAULTContent").removeClass('cShow');
        $(".cNETWORKAWAREContent").removeClass('cShow');
        $(".cCLOUDNATIVEContent").removeClass('cShow');
        $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
        $(".cBEYONDTHELANGUAGEContent").addClass('cShow');
     });

    /*
     * Search window toggle function
     */
    var $menuDropWindow = $(".cSearchBoxTopMenu"),
        $searchInput = $('#mkdocs-search-query');

    $(".cSerachIcon").click(function() {
        $menuDropWindow.toggleClass('cShowcSearchTopMenu');
        if ($menuDropWindow.hasClass('cShowcSearchTopMenu')) {
            $searchInput.focus();
        }
    });

    $(document).mouseup(function(e) {
        if ((!$menuDropWindow.is(e.target)) &&
            ($menuDropWindow.has(e.target).length === 0)) {
            $menuDropWindow.removeClass('cShowcSearchTopMenu');
            $searchInput.val('');
            $('#mkdocs-search-results').html('');
        }
    });

    /*
     * subscribe form
     */
    $("#subscribeUserButton").click(function(event) {
        event.preventDefault();
        subscribeUser($(this).val());
    });

    $('#emailUser').on('keypress', function(event) {
        if (event.which === 13) {
            event.preventDefault();
            $(this).attr("disabled", "disabled");
            subscribeUser($(this).val());
            $(this).removeAttr("disabled");
        }
    });

    $(".cBallerina-io-packages").click(function() {
//        $(".cCollaps-Menu").toggleClass('cOpenMenu');
//        $(".cBallerina-io-packages").toggleClass('cOpenMenu');
//        $(".cCollaps-Menu-first").removeClass('cOpenMenu');
//        $(".cBallerina-io-primitive-types").removeClass('cOpenMenu');
//        $(".cCollaps-Menu-second").removeClass('cOpenMenu');
//        $(".cBallerina-io-x").removeClass('cOpenMenu');
    });

    $(".cBallerina-io-primitive-types").click(function() {
        $(".cCollaps-Menu-first").toggleClass('cOpenMenu');
        $(".cBallerina-io-primitive-types").toggleClass('cOpenMenu');
//        $(".cCollaps-Menu").removeClass('cOpenMenu');
//        $(".cBallerina-io-packages").removeClass('cOpenMenu');
//        $(".cCollaps-Menu-second").removeClass('cOpenMenu');
//        $(".cBallerina-io-x").removeClass('cOpenMenu');
    });

    $(".cBallerina-io-x").click(function() {
//        $(".cCollaps-Menu-second").toggleClass('cOpenMenu');
//        $(".cBallerina-io-x").toggleClass('cOpenMenu');
//        $(".cCollaps-Menu").removeClass('cOpenMenu');
//        $(".cBallerina-io-packages").removeClass('cOpenMenu');
//        $(".cCollaps-Menu-first").removeClass('cOpenMenu');
//        $(".cBallerina-io-primitive-types").removeClass('cOpenMenu');
    });

    initCodeLineNumbers();

    $('.cBBE-body').each(function() {
        var lineCount = 0,
            olCount = 1;

        $('.cTR', this).each(function(i, n) {
            var $codeElem = $(n).find('td.code').get(0);
            var lines = $('> td.code', n).text().replace(/\n$/, "").trim().split(/\r\n|\r|\n/);
            var numbers = [];

            $.each(lines, function(i) {
                lineCount += 1;
                numbers.push('<span class="line-number">' + lineCount + '</span>');
            });

            $("<div/>", {
                "class": "bbe-code-line-numbers",
                html: numbers.join("")
            }).prependTo($codeElem);


            if ($('.cCodeDesription > div > ol', this).length > 0) {
                var $elem = $('.cCodeDesription > div > ol', this);
                $($elem).parent().prepend('<span class="ol-number">' + olCount + '.</span>');
                olCount++;
            } else {
                olCount = 1;
            }
        });
    });

    //disable enter key in searchbox
    $('.form-control').on('keypress', function(event) {
        if (event.which === 13) {
            event.preventDefault();
        }
    });



    $('a[href^="http://www.youtube.com/watch?"]').each(function(i, elem) {
        /*
         * Use below example code block in markdown files and replace <your-video-id> with video ID
         * which on youtube URL & <alt-text> with some alternative text for the video
         *
         * <a href="http://www.youtube.com/watch?feature=player_embedded&v=<your-video-id>" target="_blank">
         *     <img src="http://img.youtube.com/vi/<your-video-id>/0.jpg" alt="<alt-text>" width="480" height="360" border="10" />
         * </a>
         */
        var $iframe = $('<iframe width="' + $('img', elem).attr('width') + '" ' +
            'height="' + $('img', elem).attr('height') + '" ' +
            'src="https://www.youtube.com/embed/' + getUrlVars($(elem).attr('href')).v + '" ' +
            'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
        $(elem).replaceWith($iframe);
    });

});

$(function() {
    var pathname = window.location.pathname;

    if (pathname.indexOf("learn") != -1) {
        $("#learnli").addClass("cActive");
    } else if (pathname.indexOf("blog") != -1) {
        $("#blogli").addClass("cActive");
    } else if (pathname.indexOf("philosophy") != -1) {
        $("#philosophyli").addClass("cActive");
    } else if (pathname.indexOf("open-source") != -1) {
        $("#openli").addClass("cActive");
    } else if (pathname.indexOf("help") != -1) {
        $("#helpli").addClass("cActive");
    } else if (pathname.indexOf("lean/events") != -1) {
    $("#eventsli").addClass("cActive");
}
});


$(document).ready(function() {
    let urlmenu = document.getElementById( 'versions' );
    urlmenu.onchange = function() {
        let pathname = window.location.pathname;
        let splitedPath = pathname.split("/learn/");
        let selectedOption = this.options[ this.selectedIndex ];
        let isLatest = selectedOption.getAttribute("data-value") === "latest";
        let newPath = "";
        if(isLatest) {
            newPath =  "/learn/" + splitedPath[1];
        } else {
            let selectedValue = selectedOption.value;
            newPath = "/" + selectedValue + "/learn/" + splitedPath[1];
        }
        window.open( newPath , "_self" );
    };

    //subscribe form
    $("#subscribeUserButton").click(function(event) {
        event.preventDefault();
        subscribeUserOS();
    });

    $('#emailUserOS').on('keypress', function(event) {
        if (event.which === 13) {
            event.preventDefault();
            $(this).attr("disabled", "disabled");
            subscribeUserOS();
            $(this).removeAttr("disabled");
        }
    });

    function subscribeUserOS() {
        $("#form-error").html("");
        var email = $('#userEmail').val();
        var optin = $('#optin').is(":checked");
        $('#subscribeUserMessage').remove("");
        if (email == "") {
            $("#form-error").text("Please enter your email.");
            $("#form-error").addClass("cShowBlock");
        } else if (!isEmail(email)) {
            $("#form-error").text("Please enter a valid email.");
            $("#form-error").addClass("cShowBlock");
        } else if(!optin){
            $("#form-error").text("Please confirm email subscription");
            $("#form-error").addClass("cShowBlock");
        }else {
            $('#subscribeForm').trigger("reset");
            $(".pdframe").html("<iframe src='https://go.pardot.com/l/142131/2017-02-16/3c6zgy?email=" + email + "'></iframe>");
            $("#form-status").text("You have successfully subscribed to the newsletter.");
            $("#form-status").addClass("cShowBlock");
            $("#form-error").removeClass("cShowBlock");
            
        }
        return;
    }
    
    //Slack user form
    $("#slackSubscribeButton").click(function(event) {
        event.preventDefault();
        inviteSlackUser();
    });
    $('#email').on('keypress', function(event) {
        if (event.which === 13) {
            event.preventDefault();
            $(this).attr("disabled", "disabled");
            var email = $("#email").val();
            inviteSlackUserService(email);
            $(this).removeAttr("disabled");
        }
    });

    //Lunr Search field
    $('#searchBtn').click(function () {
        let searchText = $('#searchTxt').val();
        window.location.assign("/search?" + searchText);
    });
    $( "#searchTxt" ).keypress(function (event) {
        if (event.which === 13) {
            event.preventDefault();
            let searchText = $('#searchTxt').val();
            window.location.assign("/search?" + searchText);
        }
    });
});


