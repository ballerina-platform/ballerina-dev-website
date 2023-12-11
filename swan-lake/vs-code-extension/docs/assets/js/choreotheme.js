/**
 * Copyright (c) 2023, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
window.addEventListener("DOMContentLoaded", function() {
    hljs.initHighlightingOnLoad();
});
(function() {
    if(document.querySelector('.tab-selector')){
        document.querySelector('.tab-selector').addEventListener('click', function(e) {
            // Show hide tab content next to the clicked tab
            var tabContentToShow = e.target.nextElementSibling;
            if(tabContentToShow.style.display === 'none') {
                tabContentToShow.style.display = 'block';
            } else {
                tabContentToShow.style.display = 'none';
            }
        });
    }
})();