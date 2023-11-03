/*!
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
* Handle opening external links in a new tab
*/

(function() {
    var links = document.links;
    for (var i = 0, linksLength = links.length; i < linksLength; i++) {
        if (links[i].hostname != window.location.hostname) {
            links[i].target = "_blank";
            links[i].setAttribute("rel", "noopener noreferrer");
            links[i].className += " externalLink";
        } else {
            links[i].className += " localLink";
        }
    }
    var jsonTreeInputs = document.getElementsByClassName('jsonTreeInput');
    if(jsonTreeInputs && jsonTreeInputs.length > 0){
        for( var i=0; i < jsonTreeInputs.length; i++){
            try {
                var jsonTreeInput = jsonTreeInputs[i];
                var jsonTreeOutput = jsonTreeInput.previousElementSibling;
                var level = jsonTreeInput.getAttribute('data-level');
                var levelInteger = level ? parseInt(level) : 1;
                var formatter = new JSONFormatter(JSON.parse(jsonTreeInput.innerHTML), levelInteger, { hoverPreviewEnabled: false });
                jsonTreeOutput.innerHTML = '';
                jsonTreeOutput.appendChild(formatter.render());
                jsonTreeInput.style.display = 'none';
            } catch (e) {
                console.error(e);
            } 
        }
        
    }
    
})();

/* 
 * Initialize highlightjs 
 */
hljs.initHighlightingOnLoad();

/*
 * Handle TOC toggle
 */
var tocBtn = document.querySelector('.md-sidebar.md-sidebar--secondary #tocToggleBtn');
var tocClass = document.getElementsByTagName('main')[0];

if (tocBtn) {
    tocBtn.onclick = function () {
        event.preventDefault();
        tocClass.classList.toggle('hide-toc');
        if (tocBtn.innerHTML === "keyboard_arrow_right") {
            tocBtn.innerHTML = "keyboard_arrow_left";
        } else {
            tocBtn.innerHTML = "keyboard_arrow_right";
        }
    };
}

/*
 * TOC position highlight on scroll
 */
var observeeList = document.querySelectorAll(".md-sidebar__inner > .md-nav--secondary .md-nav__link");
var listElems = document.querySelectorAll(".md-sidebar__inner > .md-nav--secondary > ul li");
var config = { attributes: true, childList: true, subtree: true };

var callback = function(mutationsList, observer) {
    for(var mutation of mutationsList) {
        if (mutation.type == 'attributes') {
            mutation.target.parentNode.setAttribute(mutation.attributeName,
                mutation.target.getAttribute(mutation.attributeName));
            scrollerPosition(mutation);
        }
    }
};

var observer = new MutationObserver(callback);

if (listElems.length > 0) {
    listElems[0].classList.add('active');
}

for (var i = 0; i < observeeList.length; i++) {
    var el = observeeList[i];

    observer.observe(el, config);

    el.onclick = function(e) {
        listElems.forEach(function(elm) {
            if (elm.classList) {
                elm.classList.remove('active');
            }
        });

        e.target.parentNode.classList.add('active');
    }
}

function scrollerPosition(mutation) {
    var blurList = document.querySelectorAll(".md-sidebar__inner > .md-nav--secondary > ul li > .md-nav__link[data-md-state='blur']");

    listElems.forEach(function(el) {
        if (el.classList) {
            el.classList.remove('active');
        }
    });

    if (blurList.length > 0) {
        if (mutation.target.getAttribute('data-md-state') === 'blur') {
            if (mutation.target.parentNode.querySelector('ul li')) {
                mutation.target.parentNode.querySelector('ul li').classList.add('active');
            } else {
                setActive(mutation.target.parentNode);
            }
        } else {
            mutation.target.parentNode.classList.add('active');
        }
    } else {
        if (listElems.length > 0) {
            listElems[0].classList.add('active');
        }
    }
}

function setActive(parentNode, i) {
    i = i || 0;
    if (i === 5) {
        return;
    }
    if (parentNode.nextElementSibling) {
        parentNode.nextElementSibling.classList.add('active');
        return;
    }
    setActive(parentNode.parentNode.parentNode.parentNode, ++i);
}


/*
 * Handle edit icon on scroll
 */
var editIcon = document.getElementById('editIcon');

window.addEventListener('scroll', function() {
    var scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition >= 90) {
        editIcon.classList.add('active');
    } else {
        editIcon.classList.remove('active');
    }
});

/*
 * Fixes the issue related to clicking on anchors and landing somewhere below it
 */

window.addEventListener("hashchange", function () {

    window.scrollTo(window.scrollX, window.scrollY - 90, 'smooth');

});
