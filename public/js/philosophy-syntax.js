/*
 * Extract the file name from the link text &
 * Replace the space with a hyphan and make all text simple case.
 * For example "REST Services" will become "rest-services".
 * Then look for the file e.g. "rest-services.txt" in the samples folder.
 * If the data-run attribute is present in the link
 * then search for a file e.g. "rest-services-run.txt" file as well.
 */

var lineHeight = 18;
var topPadding = 4;
var codeBoxOffset = 2;
var codeOutputBoxOffset = 5;
var editor = null,
    editorRun = null;

/*
 * Method to create fileID using the link inner text
 * @param {string} fileName link inner text
 */
var fileId = function(fileName) {
    return fileName.toLowerCase().replace(/\s/g, "-");
};

/*
 * Method to load sample code by reading .bal, .out files
 * @param {string} fileName code sample name
 */
var loadData = function(fileName) {
    var $shellContainer = $('#' + fileName + "-shell"),
        $codeContainer = $('#' + fileName + "-code > code");

    if ($shellContainer.length > 0) {
        $.ajax({
            url: "../samples/" + fileName + ".out",
            method: "GET",
            success: function(data) {
                $shellContainer.text(data);
            },
            error: function() {
                return;
            }
        });
    }

    if ($codeContainer.length > 0) {
        $.ajax({
            url: "../samples/" + fileName + ".bal",
            method: "GET",
            success: function(data) {
                // Set the code to the container
                var highlightCode = hljs.highlightAuto;

                $codeContainer.text(data);

                // Doing the syntax highlighting
                hljs.highlightBlock($('#' + fileName + "-code > code").get(0));

                addLineNumbers(fileName, data);
                addCodeHighlights(fileName);
            }
        });
    }
};

/*
 * Method to toggle code samples
 * @param {string} name code sample name
 * @param {string} sectionId code group/sample section ID
 */
var toggleCodeBlock = function(name, sectionId) {
    var fileName = fileId(name);

    $('#' + sectionId + ' .code-block-text').hide();
    $('#' + sectionId + ' .code-block').css('display', 'none').removeClass('active');
    $('#' + sectionId + ' .shell-display').hide();

    $('#' + fileName + "-text").show();
    $('#' + fileName + "-code").css('display', 'flex').addClass('active');
    $('#' + fileName + "-shell").show();

    updateCodeDescriptionPosition(fileName);
};

/*
 * Method to position code description boxes to align with highlighting area
 * @param {string} fileName code sample name
 */
var updateCodeDescriptionPosition = function(fileName) {
    $('#' + fileName + '-text ' + '.hTrigger').each(function(i, n) {
        var startLine = $(this).attr('data-startLine');
        var endLine = $(this).attr('data-endLine');
        var overlayStartPosition = topPadding + (startLine - 1) * lineHeight + 30 + codeBoxOffset;
        var overlayHeight = (endLine - (startLine - 1)) * lineHeight;
        var topPosition = overlayStartPosition;
        var hightLighterPosition = topPosition;
        var hightlighterId = (fileName + '-highlighter-' + i);
        var offset = 0;

        if ($(this).prev().length > 0) {
            var prevElemBottom = $(this).prev().height() + parseInt($(this).prev().css('top')) + 20;

            hightLighterPosition = topPosition;

            if ($(this).hasClass('cOutputDesription')) {
                topPosition = (($('#' + fileName + '-code').height() + overlayStartPosition) + codeOutputBoxOffset);
                hightLighterPosition = (overlayStartPosition + codeOutputBoxOffset);
            }

            if (topPosition < prevElemBottom) {
                topPosition = prevElemBottom;
            }
        }

        $(this).css('top', topPosition);

        $('#' + hightlighterId).css({
            'top': ((hightLighterPosition - 30) + offset),
            'left': 0,
            'height': overlayHeight
        });
    });

    var $lastCodeDescriptionBox = $('#' + fileName + '-text ' + '.hTrigger:last-child');
    var codeboxContainerHeight = $lastCodeDescriptionBox.height() + parseInt($lastCodeDescriptionBox.css('top')) + 20;
    $('#' + fileName + '-text').css('height', codeboxContainerHeight);
};

/*
 * Method to add line numbers to code block
 * @param {string} fileName code sample name
 * @param {string} data code sample
 */
var addLineNumbers = function(fileName, data) {
    // Remove any existing line numbers
    $('#' + fileName + '-code .line-numbers-wrap').remove();

    // Count the number of rows
    // Remove the new line from the end of the text
    var numberOfLines = data.split(/\r\n|\r|\n/).length;
    var lines = '<div class="line-numbers-wrap">';

    // Iterate all the lines and create div elements with line number
    for (var i = 1; i <= numberOfLines; i++) {
        lines = lines + '<div class="line-number">' + i + '</div>';
    }
    lines = lines + '</div>';

    var preHeight = numberOfLines * 18 + 20;
    $('#' + fileName + "-code")
        .addClass('ballerina-pre-wrapper')
        .prepend($(lines));
};

/*
 * Method to add code segement highlighters
 * @param {string} fileName code sample name
 */
var addCodeHighlights = function(fileName) {
    $('#' + fileName + '-text ' + '.hTrigger').each(function(i, n) {
        var hightlighterId = (fileName + '-highlighter-' + i);

        if ($(this).hasClass('cOutputDesription')) {
            $('#' + fileName + '-shell')
                .prepend('<div id="' + hightlighterId + '" class="overlay-highlight"></div>');
        } else {
            $('#' + fileName + '-code')
                .prepend('<div id="' + hightlighterId + '" class="overlay-highlight"></div>');
        }

        $(this).attr('data-toggle-highlight', hightlighterId);
    });

    updateCodeDescriptionPosition(fileName);
};

function setTooltip(btn, message) {
    $(btn).attr('data-original-title', message)
        .tooltip('show');
}

function hideTooltip(btn) {
    setTimeout(function() {
        $(btn).tooltip('hide').removeAttr('data-original-title');
    }, 1000);
}

$(document).ready(function() {

    /*
     * Load sample codes on page load
     */
    $('li.links').each(function(i, elem) {
        var fileName = fileId($(elem).text());
        var sectionId = $(elem).closest('.codeSampleBoxes').attr('id');

        loadData(fileName, sectionId);
    });

    /*
     * Toggle code samples on links click
     */
    $('li.links').click(function() {
        var fileName = fileId($(this).text());
        var sectionId = $(this).closest('.codeSampleBoxes').attr('id');

        toggleCodeBlock(fileName, sectionId);

        $(this).closest('.codeSampleBoxes').find('li.links').removeClass('cActive');
        $(this).addClass('cActive');
    });

    /*
     * Toggle first sample code on page load
     */
    toggleCodeBlock($('#nativeLanguage li.first').text(), 'nativeLanguage');
    toggleCodeBlock($('#integration li.first').text(), 'integration');

    /*
     * On code descriptions hover toggle relative code segment highlighter
     */
    $('.codeSampleBoxes .hTrigger').hover(function(e) {
            $('#' + $(this).data('toggle-highlight')).css('opacity', 0.2);
        },
        function() {
            $('.overlay-highlight').css('opacity', 0);
        }
    );

    /*
     * Code hints hightlighting method
     */
    var $codeWrapper = $('.code-wrapper');

    $codeWrapper.on('mouseenter', '.overlay-highlight', function(e) {
        $('#' + $(e.currentTarget).data('toggle-highlight')).css('opacity', 0.2);
        $('[data-toggle-highlight="' + $(this).attr('id') + '"]')
            .addClass('active');
    });

    $codeWrapper.on('mouseout', '.overlay-highlight', function(e) {
        $('#' + $(e.currentTarget).data('toggle-highlight')).css('opacity', 0);
        $('[data-toggle-highlight="' + $(this).attr('id') + '"]')
            .removeClass('active');
    });

    $codeWrapper.on('mousedown contextmenu', function(e) {
        $('.overlay-highlight', e.currentTarget).css('z-index', -1);
    });

    $codeWrapper.on('mouseup mouseleave', function(e) {
        $('.overlay-highlight', e.currentTarget).css('z-index', 3);
    });

    /*
     * Register "copy to clipboard" event to elements with "copy" class
     */
    var clipboard = new ClipboardJS('.copy', {
        text: function(trigger) {
            return $(trigger).closest('.cPhilosophyWidget').find('.code-wrapper pre.code-block.active code').text();
        }
    });

    // Register events show hide tooltip on click event
    clipboard.on('success', function(e) {
        setTooltip(e.trigger, 'Copied!');
        hideTooltip(e.trigger);
    });

    clipboard.on('error', function(e) {
        setTooltip(e.trigger, 'Failed!');
        hideTooltip(e.trigger);
    });

    $('.copy').tooltip({
        trigger: 'click',
        placement: 'bottom'
    });

    $("a.copy").unbind("click");
});