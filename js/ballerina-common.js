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





//matching version selected with the URL
function versionSelectorValue(){
    let pathValue = window.location.pathname;
    $("#versions").reset;
    let options = $("#versions").find("option");
    let status=0;
    $.each(options, function (key, option) {
    
        let optionText = $(option).val();
        //let ver = "v" + optionText.replace(".", "-");
        
        if(pathValue.indexOf(optionText) > -1){
            $(option).attr("selected", "selected");
            status = 1;
        }        
    });
    if(status == 0){
        $("#versions").prop("selectedIndex", 0);
    }
}

$(document).ready(function() {
    // Change version selected in the versions dropdown according to version on the URL.
    versionSelectorValue();

    // $("code").addClass('language-java');
    // $(".ballerina").removeClass('cBasicCode');
    // $(".bash").removeClass('cBasicCode');

    $("pre").removeClass('highlight');
    // $("code").addClass('line-numbers');
    // $("pre").removeClass('line-numbers');
    $("code").removeClass('cBasicCode');
    $(".ballerina").removeClass('cBasicCode');
    $("pre").addClass('basic');
    // $(".ballerina").addClass('language-ballerina');
    $(".bash").removeClass('cBasicCode');
    $(".language-ballerina").addClass('ballerina');

    
$("table").addClass('table-striped');


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
    $('#slackEmail').on('keypress', function(event) {
        if (event.which === 13) {
            event.preventDefault();
            $(this).attr("disabled", "disabled");
            var email = $("#slackEmail").val();
            if (email == "") {
                $('#slackEmail').val('');
                $("#slackEmail").attr("placeholder", "Please enter your email.");
            } else if (!isEmail(email)) {
                $('#slackEmail').val('');
                $("#slackEmail").attr("placeholder", "Please enter a valid email.");
            } else {
                $('#slackEmail').val('');
                $("#slackEmail").attr("placeholder", "Processing...");

                AWS.config.region = 'us-east-1';
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: atob('dXMtZWFzdC0xOjhiMGViNzYzLTUwNWEtNGE0NS04ODA1LTNkY2ZlZGQwNDVhMA=='),
                }); 
                var lambda = new AWS.Lambda();
                var result;
                
                if (email == null || email == '') {
                    input = {};
                } else {
                    input = {
                    email: email
                    };
                }

                lambda.invoke({
                    FunctionName: 'slackService',
                    Payload: JSON.stringify(input)
                }, function(err, data) {
                    if (err) {
                    result = err;
                    } else {
                    result = JSON.parse(data.Payload);
                    }
                    if (result.body.ok) {
                        $('#slackEmail').val('');
                        $("#slackEmail").attr("placeholder", "Your invitation has been sent to "+email);
                    } else if(result.body.error == "already_in_team"){
                        $('#slackEmail').val('');
                        $("#slackEmail").attr("placeholder", "This email is already subscribed");
                    }else if(result.body.error == "already_invited"){
                        $('#slackEmail').val('');
                        $("#slackEmail").attr("placeholder", "This email is already invited");
                    }else{
                        $('#slackEmail').val('');
                        $("#slackEmail").attr("placeholder", "Something went wrong, try again!");
                    }
                });
            }            
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

function validate_redirection(path) {
    $('body').hide();
    let obsolete_paths = ["/v0-990", "/v0-991", "/v1-0", "/v1-1"];
    let redirection = {};
    let status = false;
    $.each(obsolete_paths, function (key, val) {
        if (path.startsWith(val)) {
            redirection = { type: "versioned" };
            status = true;
            return;
        }
    });

    if (!status) {
        //read the json data and redirect
        var dest = redirections[path];
        //check for the destination URL without trailing slash
        if (typeof dest == "undefined") {
            dest = redirections[path.replace(/\/([^\/]*)$/, '$1')];
        }

        if (dest != "" && typeof dest != "undefined") {
            redirection = { type: "path", dest: dest };
        }
    }
    return redirection;
}
