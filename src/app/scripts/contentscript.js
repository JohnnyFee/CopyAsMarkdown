/*
 * Created with Sublime Text 2.
 * User: song.chen
 * Date: 2014-01-29
 * Time: 23:41:10
 * Contact: song.chen@qunar.com
 */

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

(function () {
    'use strict';
    /**
     * [adjustRange description]
     * @param  {[type]} range
     * @return {[type]}
     */
    var adjustRange = function (range) {
        range = range.cloneRange();

        // Expand range to encompass complete element if element's text
        // is completely selected by the range
        var container = range.commonAncestorContainer;

        // 元素类型	节点类型
        // 元素element	1
        // 属性attr	2
        // 文本text	3
        // 注释comments	8
        // 文档document	9
        var parentElement = container.nodeType == 3 ?
            container.parentNode : container;

        if (parentElement.textContent == range.toString()) {
            range.selectNode(parentElement);
        }

        return range;
    };

    /**
     * Simplify the url.
     *
     * @param  {[type]} url
     * @return {[type]}
     */
    var simplifyUrl = function (url) {
        if (!url) {
            return;
        }

        url = url.replace(/&?utm_\w+(=[^&]+)/g, '');
        if (url.endsWith('/?')) {
            url = url.substring(0, url.length - 2);
        }else if (url.endsWith('?')) {
            url = url.substring(0, url.length - 1);
        }
        return url;
    };

    var simplifyTitle = function (title) {
        if (!title) {
            return;
        }

        return title.replace(/\s*\|.*/g, "");
    };

    /**
     * 获得选择的HTML。
     * <p> 支持多选。
     * @return {string} 选择的字符串。
     */
    var getSelectionHtml = function () {
        var html = "",
            sel, range;
        if (typeof window.getSelection != "undefined") {
            sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    range = adjustRange(sel.getRangeAt(i));
                    container.appendChild(range.cloneContents());
                }

                // travel link to modify the relative url to absolute url.
                var links = container.querySelectorAll("a");
                for (var i = 0; i < links.length; i++) {
                    links[i].setAttribute("href", links[i].href);
                }

                // travel img to modify the relative url to absolute url.
                var imgs = container.querySelectorAll("img");
                for (var i = 0; i < imgs.length; i++) {
                    imgs[i].setAttribute("src", imgs[i].src);
                }

                html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                html = document.selection.createRange().htmlText;
            }
        }
        return html;
    };

    var reMarker = new reMarked();

// Listen for the content script to send a message to the background page.
    chrome.runtime.onMessage.addListener(function onMessage(request, sender, sendResponse) {
        if (request.action !== 'html2markdown') {
            return;
        }

        // Get selected html.
        var html = getSelectionHtml();


        var markdown = reMarker.render(html);

        // no selection
        if (!html) {
            markdown = '[' + simplifyTitle(document.title) + '](' + simplifyUrl(location.href) + ')';
        }

        if (markdown) {
            // ask backgroud to write the markdown content to clipboard.
            chrome.runtime.sendMessage({
                action: "copytoclipboard",
                content: markdown
            }, function (response) {
                // Return nothing to let the connection be cleaned up.
                if (response.success) {
                    sendResponse({
                        sucess: true
                    });
                    return;
                }
            });
        } else {
            sendResponse({
                sucess: true
            });
        }

        sendResponse({
            sucess: false
        });
    });
}());
