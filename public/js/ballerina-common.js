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
            $(option).prop('selected', true);
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
    $("#subscribe_button").click(function(event) {
        event.preventDefault();
        subscribeUserOS();
    });

    $("#tt_subscribe_button").click(function(event) {
        event.preventDefault();
        subscribeTechTalk();
    });

    $("#usecase_submit").click(function(event) {alert("3");
        event.preventDefault();
        submitUsecase();
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


    /** 
     * Privacy policy popup
     * 
    */
    $('.cIUnderstand').click(function () {
        setCookie('cookie_accepted', '1', 180);
    });
    var cookie_policy = is_cookie("cookie_accepted");
    if (cookie_policy != -1) {
        $(".cCookie-Policy").addClass('cHide-Policy');
    }
    

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

//set a cookie in the browser
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

//check the cookie exists
function is_cookie(cookie_name) {
    var cookie_string = document.cookie;
    var cookie_value = "";
    if (cookie_string.length != 0) {
        var cookie_value = cookie_string.indexOf(cookie_name);
    }
    return cookie_value;
}

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

    $('.leftNavToggleBtn').click(function(){
        $(this).toggleClass('active');
        $('.cLeftNavContainer').slideToggle();
    })
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
            if (selectedValue == "swan-lake") {
                newPath = "/learn/" + splitedPath[1];
            }
            else {
                newPath = "/" + selectedValue + "/learn/" + splitedPath[1];
            }
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
        var nloptin = $('#nloptin').is(":checked");
        var ccoptin = $('#ccoptin').is(":checked");
        var emailoptin = $('#optin').is(":checked");

        var type = "";
        if(nloptin){type += "-Newsletters-";}

        if(ccoptin){type += "-Community Calls-";}

        $('#subscribeUserMessage').remove("");
        if (email == "") {
            $("#form-error").text("Please enter your email.");
            $("#form-error").addClass("cShowBlock");
        } else if (!isEmail(email)) {
            $("#form-error").text("Please enter a valid email.");
            $("#form-error").addClass("cShowBlock");
        } //else if(!nloptin && !ccoptin){
            else if(!emailoptin){
            $("#form-error").text("Please select a subscribe option.");
            $("#form-error").addClass("cShowBlock");
        }else {
            $('#subscribeForm').trigger("reset");
            $(".pdframe").html("<iframe src='https://go.pardot.com/l/142131/2017-02-16/3c6zgy?email=" + email + "&type=" + type + "'></iframe>");
            $("#form-status").text("You have subscribed successfully.");
            $("#form-status").addClass("cShowBlock");
            $("#form-error").removeClass("cShowBlock");
            
        }
        return;
    }
    
    //Slack user form
    $("#slackSuccessAlert").hide();
    $("#slackFailAlert").hide();
    $("#slackSubscribeButton").click(function(event) {
        event.preventDefault();
        inviteSlackUser();
    });

    function inviteSlackUser(){
            
        var email = $("#slackEmail").val();
        if (email == "") {
            $("#slackFailAlert").show();
            $("#slackFailAlert").html("Please enter your email.");
        } else if (!isEmail(email)) {
            $("#slackFailAlert").show();
            $("#slackFailAlert").html("Please enter a valid email.");
        } else {
            $("#slackFailAlert").hide();
            $("#slackSuccessAlert").show();
            $("#slackSuccessAlert").html("Processing...");

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
                $("#slackFailAlert").hide();
                if (result.body.ok) {
                    $("#slackSuccessAlert").show(); 
                    $('#slackEmail').val('');
                    $("#slackSuccessAlert").html( "Thank you for your interest in joining the Ballerina Slack Community. Please check your inbox for an invitation to join Slack.");
                } else if(result.body.error == "already_in_team"){
                    $("#slackSuccessAlert").show(); 
                    $("#slackSuccessAlert").html( "This email is already subscribed.");
                }else if(result.body.error == "already_invited"){
                    $("#slackSuccessAlert").show(); 
                    $("#slackSuccessAlert").html("This email is already invited.");
                }else{
                    $("#slackSuccessAlert").hide();
                    $("#slackFailAlert").show();
                    $("#slackFailAlert").html("Something went wrong, please try again.");
                }
            });
        }            
            
    }


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


    //Contribute to Agenda
    $("#agSuccessAlert").hide();
    $("#agendaSubButton").click(function(event) {
        event.preventDefault();
        agendaContribution();
    });

    //Contribute to vlog
    $("#vlSuccessAlert").hide();
    $("#vlogSubButton").click(function(event) {
        event.preventDefault();
        vlogContribution();
    });

    //Contribute to blog
    $("#blSuccessAlert").hide();
    $("#blogSubButton").click(function(event) {
        event.preventDefault();
        blogContribution();
    });

    //reset button
    $(".resetButton").click(function(event) {
        $('form').trigger("reset");
    });

});

function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

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


function agendaContribution() {
    $("#agform-error").html("");
    var email = $('#agendaEmail').val();
    var name = $('#agendaName').val();
    var namesegs = name.split(" ");
    var firstname = namesegs[0];
    var lastname = "";
    if(typeof namesegs[1] !== "undefined"){lastname = namesegs[1];}

    var company = $('#agendaCompany').val();

    var contribution = $('#selectAgendaOption').val();
    
    var submission = "";

if(contribution == "oNewsletter"){
    var nltopic = $('#agendaTopic').val();
    var nlcontent = $('#agendaContent').val();
    submission = "Newsletter: Topic : "+ nltopic +", Content : " + nlcontent;
}else{
    var topic = $('#agendaCallTopic').val();
    var content = $('#agendaCallArticle').val();
    var duration = $('#agendaCallDuration').val();
    submission = "Community Call: Topic : "+ topic +", Content : " + content + "Duration : "+duration;
}
    $('#subscribeUserMessage').remove("");
    if (email == "" || name == "") {
        $("#agform-error").text("Please fill the required details of your contribution.");
        $("#agform-error").addClass("cShowBlock");
    } else if (!isEmail(email)) {
        $("#agform-error").text("Please enter a valid email.");
        $("#agform-error").addClass("cShowBlock");
    } else if (contribution == "oNewsletter" && (nltopic == "" || nlcontent == "")) {
            $("#agform-error").text("Please enter the newsletter details.");
            $("#agform-error").addClass("cShowBlock");
        
    }else if (contribution == "oCommcall" && (topic == "" || content == "" || duration == "")) {
            $("#agform-error").text("Please enter the community call details.");
            $("#agform-error").addClass("cShowBlock");
        
    }else {
        $('#agendaContribute').trigger("reset");
        $(".pdframe").html("<iframe src='https://go.pardot.com/l/142131/2021-08-25/9sy26w?email=" + email + "&first_name=" + firstname + "&last_name=" + lastname + "&company=" + company + "&submission=" + submission + "'></iframe>");
        $("#agSuccessAlert").show();
        $("#agendaContribute").hide();
        //$("#form-status").addClass("cShowBlock");
        $("#agform-error").removeClass("cShowBlock");
        
    }
    return;
}

function vlogContribution() {
    $("#vlform-error").html("");
    var email = $('#vlEmail').val();
    var name = $('#vlName').val();
    var namesegs = name.split(" ");
    var firstname = namesegs[0];
    var lastname = "";
    if(typeof namesegs[1] !== "undefined"){lastname = namesegs[1];}
    var vlogCount = $('#selectOption2').val();

    var submission = "";

    var vLink1 = $('#rsuggested-topic1').val();
    var vLink2 = $('#rsuggested-topic2').val();
    var vLink3 = $('#rsuggested-topic3').val();

    if(vLink1 != ""){
        submission += "Link1 : "+ vLink1 ;
    }
    if(vLink2 != ""){
        submission += ", Link 2 "+ vLink2 ;
    }
    if(vLink3 != ""){
        submission += ", Link3 : "+ vLink3 ;
    }
    

    if (email == "" || name == "") {
        $("#vlform-error").text("Please fill the required details of your contribution.");
        $("#vlform-error").addClass("cShowBlock");
    } else if (!isEmail(email)) {
        $("#vlform-error").text("Please enter a valid email.");
        $("#vlform-error").addClass("cShowBlock");
    } else if (vlogCount == "oneVlog" && (vLink1 == "")) {
            $("#vlform-error").text("Please add the vlog details.");
            $("#vlform-error").addClass("cShowBlock");
        
    }else if (vlogCount == "twoVlogs" && (vLink2 == "")) {
        $("#vlform-error").text("Please add the vlog details.");
        $("#vlform-error").addClass("cShowBlock");
    
    }else if (vlogCount == "threeVlogs" && (vLink3 == "")) {
        $("#vlform-error").text("Please add the vlog details.");
        $("#vlform-error").addClass("cShowBlock");

    }else if ((vlogCount == "oneVlog" && !isUrlValid(vLink1)) || 
    ((vlogCount == "twoVlogs") && (!isUrlValid(vLink1) || !isUrlValid(vLink2))) || 
    (vlogCount == "threeVlogs" && !isUrlValid(vLink1) || !isUrlValid(vLink2) || !isUrlValid(vLink3))) {
        $("#vlform-error").text("Please add a valid vlog link.");
        $("#vlform-error").addClass("cShowBlock");

    }else {
        $('#vlogContribute').trigger("reset");
        $(".pdframe").html("<iframe src='https://go.pardot.com/l/142131/2021-08-25/9sy271?email=" + email + "&first_name=" + firstname + "&last_name=" + lastname + "&submission=" + submission + "'></iframe>");
        $("#vlSuccessAlert").show();
        $('#vlogContribute').hide();
        //$("#form-status").addClass("cShowBlock");
        $("#vlform-error").removeClass("cShowBlock");
        
    }
    return;
}

function blogContribution() {
    $("#blform-error").html("");
    var email = $('#blEmail').val();
    var name = $('#blName').val();
    var namesegs = name.split(" ");
    var firstname = namesegs[0];
    var lastname = "";
    if(typeof namesegs[1] !== "undefined"){lastname = namesegs[1];}
    var blogCount = $('#selectOption1').val();

    var submission = "";

    var bLink1 = $('#blsuggested-topic1').val();
    var bLink2 = $('#blsuggested-topic2').val();
    var bLink3 = $('#blsuggested-topic3').val();

    if(bLink1 != ""){
        submission += "Link1 : "+ bLink1 ;
    }
    if(bLink2 != ""){
        submission += ", Link 2 : "+ bLink2 ;
    }
    if(bLink3 != ""){
        submission += ", Link3 : "+ bLink3 ;
    }
    

    if (email == "" || name == "") {
        $("#blform-error").text("Please fill the required details of your contribution.");
        $("#blform-error").addClass("cShowBlock");
    } else if (!isEmail(email)) {
        $("#blform-error").text("Please enter a valid email.");
        $("#blform-error").addClass("cShowBlock");
    } else if (blogCount == "oneBlog" && (bLink1 == "")) {
            $("#blform-error").text("Please add the blog details.");
            $("#blform-error").addClass("cShowBlock");
        
    }else if (blogCount == "twoBlogs" && (bLink2 == "")) {
        $("#blform-error").text("Please add the blog details.");
        $("#blform-error").addClass("cShowBlock");
    
    }else if (blogCount == "threeBlogs" && (bLink3 == "")) {
        $("#blform-error").text("Please add the blog details.");
        $("#blform-error").addClass("cShowBlock");

    }else if ((blogCount == "oneBlog" && !isUrlValid(bLink1)) || 
    ((blogCount == "twoBlogs") && (!isUrlValid(bLink1) || !isUrlValid(bLink2))) || 
    (blogCount == "threeBlogs" && !isUrlValid(bLink1) || !isUrlValid(bLink2) || !isUrlValid(bLink3))) {
    $("#blform-error").text("Please add a valid blog link.");
        $("#blform-error").addClass("cShowBlock");

    }else {
        $('#blogContribute').trigger("reset");
        $(".pdframe").html("<iframe src='https://go.pardot.com/l/142131/2021-08-25/9sy26y?email=" + email + "&first_name=" + firstname + "&last_name=" + lastname + "&submission=" + submission + "'></iframe>");
        $("#blSuccessAlert").show();
        $('#blogContribute').hide();
        //$("#form-status").addClass("cShowBlock");
        $("#blform-error").removeClass("cShowBlock");
        
    }
    return;
}

$(function() {
    // var pathname = window.location.href;
    var hash = window.location.hash;
    
    if (hash == '#consuming-services' ||
        hash == '#working-with-data' ||
        hash == '#restful-api' ||
        hash == '#grpc-api' || 
        hash == '#graphql-api' ||
        hash == '#kafka-consumer' ||
        hash == '#working-with-databases') {
        
                
            $(".tab-pane").removeClass("active in");
            $(".cSamplesList > li").removeClass('active');
            $('a').filter("[href='"+hash+"']").parent().addClass('active')
            $(hash).addClass("active in");
            $("#ballerina-in-action")[0].scrollIntoView();       
    
    }

});


//Remove frontmatter from dom
$(document).ready(function(e) {
    var str=$('.cBallerina-io').html();
    if (str.match(/---\nredirect_from:([\s\S]*?)---/gmi)) {
        str = str.replace(/---\nredirect_from:([\s\S]*?)---/gmi, "");
        $('.cBallerina-io').html(str);
    }   
});